import React from 'react';
import { Grid, makeStyles, Menu, MenuItem } from '@material-ui/core';
import { IFolder } from '../../../models/IFolder';
import { IDocument } from '../../../models/IDocument';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import TrashCanItem from './TrashCanItem';
import useContextMenu from '../../../hooks/useContextMenu';

const useStyles = makeStyles((theme) => ({
    content: {
        padding: theme.spacing(3),
        height: "calc(100vh - 64px)",
        width: "100%"
    },
}));

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

    const ctxMenu = useContextMenu();
    const [selectedItem, setSelectedItem] = React.useState<{ item: IFolder | IDocument, isFolder: boolean }>(null);
    const classes = useStyles();

    const handleCtxMenuOpen = (event: React.MouseEvent) => {
        ctxMenu.open(event);
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
        ctxMenu.close();
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
                open={ctxMenu.isOpen}
                onClose={ctxMenu.close}
                anchorReference="anchorPosition"
                anchorPosition={ctxMenu.position}
            >
            <MenuItem onClick={handleEmpty}><FontAwesomeIcon fixedWidth icon={faTrash} /> Empty</MenuItem>
        </Menu>
        </div>
    );
}

export default TrashCanContent;