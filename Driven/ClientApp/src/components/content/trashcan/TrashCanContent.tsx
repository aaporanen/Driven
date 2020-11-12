import React from 'react';
import { Grid, makeStyles, Menu, MenuItem } from '@material-ui/core';
import { IFolder } from '../../../models/IFolder';
import { IDocument } from '../../../models/IDocument';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import TrashCanItem from './TrashCanItem';

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

const TrashCanContent: React.FC<{
    deletedFolders: IFolder[],
    deletedDocuments: IDocument[],
    onRestoreFolder: (item: IFolder) => void,
    onRestoreDocument: (item: IDocument) => void,
    onDeletePermanentlyFolder: (item: IFolder) => void,
    onDeletePermanentlyDocument: (item: IDocument) => void,
    onEmptyTrashCan: () => void
}> = ({ 
    deletedFolders, 
    deletedDocuments,
    onRestoreFolder,
    onRestoreDocument,
    onDeletePermanentlyFolder,
    onDeletePermanentlyDocument,
    onEmptyTrashCan
 }) => {

    const [ctxMenuState, setCtxMenuState] = React.useState(ctxMenuInitialState);
    const [selectedItem, setSelectedItem] = React.useState<{ item: IFolder | IDocument, isFolder: boolean }>(null);
    const classes = useStyles();
    const handleCtxMenuOpen = (event: React.MouseEvent) => {
        event.preventDefault();
        setCtxMenuState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
        });
    };

    const handleCtxMenuClose = () => {
        setCtxMenuState(ctxMenuInitialState);
    };

    const handleRestore = (item: IFolder | IDocument, isFolder: boolean) => {
        isFolder
        ? onRestoreFolder(item as IFolder)
        : onRestoreDocument(item as IDocument);
    };
    const handleDeletePermanently = (item: IFolder | IDocument, isFolder: boolean) => {
        isFolder
        ? onDeletePermanentlyFolder(item as IFolder)
        : onDeletePermanentlyDocument(item as IDocument);
    };
    const handleEmpty = () => {
        onEmptyTrashCan();
    };

    const folders = deletedFolders.map(folder => 
        <TrashCanItem
            key={"folder-"+folder.id} 
            item={folder}
            isSelected={selectedItem?.item.key === folder.key} 
            isFolder
            onSelect={(item, isFolder) => setSelectedItem({ item, isFolder })}
            onRestore={handleRestore}
            onDeletePermanently={handleDeletePermanently}
        />
);

    const docs = deletedDocuments.map(doc => 
        <TrashCanItem
            key={"doc-"+doc.id} 
            item={doc}
            isSelected={selectedItem?.item.key === doc.key} 
            onSelect={(item, isFolder) => setSelectedItem({ item, isFolder })}
            onRestore={handleRestore}
            onDeletePermanently={handleDeletePermanently}
        />
    );

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
            <MenuItem onClick={handleEmpty}><FontAwesomeIcon fixedWidth icon={faTrash} /> Empty</MenuItem>
        </Menu>
        </div>
    );
}

export default TrashCanContent;