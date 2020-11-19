import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IFolder } from '../../../models/IFolder';
import { IDocument } from '../../../models/IDocument';
import { Grid, Menu, MenuItem } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import FolderItem from './FolderItem';
import DocumentContent from '../document/DocumentContent';
import { FolderType } from '../../../enums/FolderType';

const useStyles = makeStyles((theme) => ({
    content: {
        padding: theme.spacing(3),
        height: "calc(100vh - 64px)",
        width: "100%"
    },
}));

const ctxMenuInitialState = {
    mouseX: null,
    mouseY: null,
};

const FolderContent: React.FC<{
    folder: IFolder,
    childFolders: IFolder[],
    documents: IDocument[],
    onAddFolder: (folder: IFolder) => void,
    onAddDocument: (document: IDocument) => void,
    onOpenFolder: (folder: IFolder) => void,
    onRenameFolder: (folder: IFolder) => void,
    onRenameDocument: (document: IDocument) => void,
    onDeleteFolder: (folder: IFolder) => void,
    onDeleteDocument: (document: IDocument) => void,
    onToggleFavoriteFolder: (folder: IFolder) => void,
    onToggleFavoriteDocument: (document: IDocument) => void,
    onDropFolder: (folder: IFolder) => void,
    onDropDocument: (document: IDocument) => void,
}> = ({ 
    folder, 
    childFolders, 
    documents, 
    onAddFolder, 
    onAddDocument, 
    onOpenFolder, 
    onRenameFolder,
    onRenameDocument,
    onDeleteFolder,
    onDeleteDocument,
    onToggleFavoriteFolder,
    onToggleFavoriteDocument,
    onDropFolder,
    onDropDocument,
 }) => {
    const classes = useStyles();
    const [ctxMenuState, setCtxMenuState] = React.useState(ctxMenuInitialState);
    const [openDocument, setOpenDocument] = React.useState<IDocument>(null);
    const [selectedItem, setSelectedItem] = React.useState<{ item: IFolder | IDocument, isFolder: boolean }>(null);
    const [dropTarget, setDropTarget] = React.useState<{ item: IFolder | IDocument, isFolder: boolean }>(null);

    const handleCtxMenuOpen = (event: React.MouseEvent) => {
        if(openDocument) {
            return;
        }
        event.preventDefault();
        setCtxMenuState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
        });
    };

    const handleCtxMenuClose = () => {
        setCtxMenuState(ctxMenuInitialState);
    };

    const handleOpen = (item: IFolder | IDocument, isFolder: boolean) => {
        isFolder
        ? onOpenFolder(item as IFolder)
        : setOpenDocument(item as IDocument);      
    }

    const handleRename = (item: IFolder | IDocument, isFolder: boolean) => {
        isFolder
        ? onRenameFolder(item as IFolder)
        : onRenameDocument(item as IDocument);       
    }

    const handleDelete = (item: IFolder | IDocument, isFolder: boolean) => {
        isFolder
        ? onDeleteFolder(item as IFolder)
        : onDeleteDocument(item as IDocument);       
    }

    const handleToggleFavorite = (item: IFolder | IDocument, isFolder: boolean) => {
        isFolder
        ? onToggleFavoriteFolder(item as IFolder)
        : onToggleFavoriteDocument(item as IDocument);       
    }

    const handleSaveDocumentContent = (document: IDocument) => {
        onAddDocument(document);
        setOpenDocument(null);
    }

    const handleAddDocument = () => {
        const newDocument: IDocument = {
            id: 0,
            key: "document_" + 0,
            folderId: folder.id,
            name: documents?.filter(_ => _.name.startsWith("New document")).length > 0 ? `New document ${documents.filter(_ => _.name.startsWith("New document")).length + 1}` : "New document",
            isDeleted: false,
            isFavorite: false
        }
        onAddDocument(newDocument);
        handleCtxMenuClose();
    }

    const handleAddFolder = () => {
        const newFolder: IFolder = {
            id: 0,
            key: "folder_" + 0,
            parentId: folder.id,
            name: childFolders?.filter(_ => _.name.startsWith("New folder")).length > 0 ? `New folder ${childFolders.filter(_ => _.name.startsWith("New folder")).length + 1}` : "New folder",
            isDeleted: false,
            isFavorite: false,
            type: FolderType.Folder
        }
        onAddFolder(newFolder);
        handleCtxMenuClose();
    }

    const handleDragStart = (item: IFolder | IDocument, isFolder: boolean) => {
        setDropTarget(null);
        setSelectedItem({item, isFolder});
    }

    const handleDragOver = (item: IFolder | IDocument, isFolder: boolean) => {
        if(item.id !== dropTarget?.item.id && item.id !== selectedItem?.item.id) {
            setDropTarget({item, isFolder});
        }
    }

    const handleDrop = () => {
        if(!dropTarget.isFolder) return; //can't drop on documents.

        if(selectedItem.isFolder) {
            const movedFolder = {...selectedItem.item, parentId: dropTarget.item.id} as IFolder;
            onDropFolder(movedFolder);       
        } else {
            const movedDocument = {...selectedItem.item, folderId: dropTarget.item.id} as IDocument;
            onDropDocument(movedDocument);
        }
        setSelectedItem(null);
    }

    const folders = childFolders.map(folder => 
            <FolderItem
                key={"folder-"+folder.id} 
                item={folder}
                isSelected={selectedItem?.item.key === folder.key} 
                isFolder
                onSelect={(item, isFolder) => setSelectedItem({ item, isFolder })}
                onOpen={handleOpen}
                onRename={handleRename}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            />
    );

    const docs = documents.map(doc => 
            <FolderItem
                key={"doc-"+doc.id} 
                item={doc}
                isSelected={selectedItem?.item.key === doc.key} 
                onSelect={(item, isFolder) => setSelectedItem({ item, isFolder })}
                onOpen={handleOpen}
                onRename={handleRename}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            />
    );

    React.useEffect(() => console.log(dropTarget), [dropTarget]);

    return (
        <div 
            className={classes.content} 
            onContextMenu={handleCtxMenuOpen} 
            style={{ cursor: 'context-menu' }}
        >
            <Grid container>
                {folders}
                {docs}
            </Grid>

            <Menu
                keepMounted
                open={ctxMenuState.mouseY !== null}
                onClose={handleCtxMenuClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    ctxMenuState.mouseY !== null && ctxMenuState.mouseX !== null
                    ? { top: ctxMenuState.mouseY, left: ctxMenuState.mouseX }
                    : undefined
                }
            >
            <MenuItem onClick={handleAddFolder}><FontAwesomeIcon fixedWidth icon={faFolder} /> New folder</MenuItem>
            <MenuItem onClick={handleAddDocument}><FontAwesomeIcon fixedWidth icon={faFileAlt} /> New document</MenuItem>
        </Menu>
        {openDocument && <DocumentContent 
            document={openDocument}
            onSave={editedDocument => handleSaveDocumentContent(editedDocument)}
            onCancel={() => setOpenDocument(null)}
        />}
        </div>
    );
}

export default FolderContent;