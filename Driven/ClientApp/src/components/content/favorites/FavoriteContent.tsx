import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IFolder } from '../../../models/IFolder';
import { IDocument } from '../../../models/IDocument';
import { Grid } from '@material-ui/core';
import FavoriteItem from './FavoriteItem';

const useStyles = makeStyles((theme) => ({
    content: {
        padding: theme.spacing(3),
        height: "calc(100vh - 64px)",
        width: "100%"
    },
}));

const FavoriteContent: React.FC<{
    favoriteFolders: IFolder[],
    favoriteDocuments: IDocument[],
    onOpenFolder: (folder: IFolder) => void,
    onToggleFavoriteFolder: (folder: IFolder) => void,
    onToggleFavoriteDocument: (document: IDocument) => void,
}> = ({ 
    favoriteFolders, 
    favoriteDocuments, 
    onOpenFolder,
    onToggleFavoriteFolder,
    onToggleFavoriteDocument
 }) => {
    const classes = useStyles();
    const [selectedItem, setSelectedItem] = React.useState<{ item: IFolder | IDocument, isFolder: boolean }>(null);

    const handleToggleFavorite = (item: IFolder | IDocument, isFolder: boolean) => {
        isFolder
        ? onToggleFavoriteFolder(item as IFolder)
        : onToggleFavoriteDocument(item as IDocument);       
    }

    const handleOpen = (item: IFolder | IDocument, isFolder: boolean) => {
        isFolder
        ? onOpenFolder(item as IFolder)
        : console.log("todo");       
    }

    const folders = favoriteFolders.map(folder => 
            <FavoriteItem
                key={"folder-"+folder.id} 
                item={folder}
                isSelected={selectedItem?.item.key === folder.key} 
                isFolder
                onSelect={(item, isFolder) => setSelectedItem({ item, isFolder })}
                onOpen={handleOpen}
                onToggleFavorite={handleToggleFavorite}
            />
    );

    const docs = favoriteDocuments.map(doc => 
            <FavoriteItem
                key={"doc-"+doc.id} 
                item={doc}
                isSelected={selectedItem?.item.key === doc.key} 
                onSelect={(item, isFolder) => setSelectedItem({ item, isFolder })}
                onOpen={handleOpen}
                onToggleFavorite={handleToggleFavorite}
            />
    );

    return (
        <div className={classes.content}>
            <Grid container>
                {folders}
                {docs}
            </Grid>
        </div>
    );
}

export default FavoriteContent;