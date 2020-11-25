import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TopNav from './components/TopNav';
import FolderTree from './components/tree/FolderTree';
import FolderContent from './components/content/folder/FolderContent';
import Toolbar from '@material-ui/core/Toolbar';
import { IFolder } from './models/IFolder';
import { IDocument } from './models/IDocument';
import { FolderType } from './enums/FolderType';
import TrashCanContent from './components/content/trashcan/TrashCanContent';
import FavoriteContent from './components/content/favorites/FavoriteContent';

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
    }
}));

const driveRoot: IFolder = {
    id: 1,
    key: "folder_1",
    parentId: null,
    name: "User",
    isDeleted: false,
    isFavorite: false,
    type: FolderType.DriveRoot
}

const trashCan: IFolder = {
    id: 2,
    key: "folder_2",
    parentId: null,
    name: "Trash can",
    isDeleted: false,
    isFavorite: false,
    type: FolderType.TrashCan
}

const favorites: IFolder = {
    id: 3,
    key: "folder_3",
    parentId: null,
    name: "Favorites",
    isDeleted: false,
    isFavorite: false,
    type: FolderType.Favorites
}

const partitions = [driveRoot, trashCan, favorites];

const App: React.FC<{}> = props => {
    
    const classes = useStyles();
    
    const [selectedFolder, setSelectedFolder] = useState<IFolder>(driveRoot);
    
    const [folders, setFolders] = useState<IFolder[]>(partitions);
    
    const [documents, setDocuments] = useState<IDocument[]>([]);

    const [expandedFolderIds, setExpandedFolderIds] = React.useState<number[]>([]);
    
    const expandFolder = (folder: IFolder) => {
        setExpandedFolderIds(expandedFolderIds => [...expandedFolderIds.filter(_ => _ !== folder.id), folder.id]);
        const parent = folders.find(_ => _.id === folder.parentId);
        if(parent) expandFolder(parent);
    }

    const handleToggleExpandFolder = (folder: IFolder) => {
        expandedFolderIds.find(id => id === folder.id) ?
        setExpandedFolderIds(expandedFolderIds => expandedFolderIds.filter(_ => _ !== folder.id)) :
        expandFolder(folder);
    }

    const handleOpenFolder = (folder: IFolder) => {
        setSelectedFolder(folder);
        const parent = folders.find(_ => _.id === folder.parentId);
        if(parent) expandFolder(parent);
    } 

    const handleUpdateFolder = (folder: IFolder) => {
        setFolders([...folders.filter(_ => _.id !== folder.id), folder]);
    }

    const handleUpdateDocument = (document: IDocument) => {
        setDocuments([...documents.filter(_ => _.id !== document.id), document]);
    }

    const handleRenameFolder = (folder: IFolder) => {
        if(!folder.id) {
            const id = Math.random();
            const key = "folder_" + id;
            setFolders([...folders.filter(_ => _.id), {...folder, id, key}])
        } else {
            setFolders([...folders.filter(_ => _.id !== folder.id), folder]);
        }        
    }

    const handleRenameDocument = (document: IDocument) => {
        if(!document.id) {
            const id = Math.random();
            const key = "document_" + id;
            setDocuments([...documents.filter(_ => _.id), {...document, id, key}])
        } else {
            setDocuments([...documents.filter(_ => _.id !== document.id), document]);
        } 
    }

    const toggleFolderDeleted = (folder: IFolder, isDeleted: boolean) => {
        setFolders(folders => [...folders.filter(_ => _.id !== folder.id), {...folder, isDeleted}]);
        
        const deletedDocuments = documents
            .filter(_ => _.folderId === folder.id)
            .map(document => { return {...document, isDeleted } });
        setDocuments(documents => [...documents.filter(_ => _.folderId !== folder.id), ...deletedDocuments]);
        
        const children = folders.filter(_ => _.parentId === folder.id);
        children.forEach(child => toggleFolderDeleted(child, isDeleted));
    }

    const deleteFolderPermanently = (folder: IFolder) => {
        setFolders(folders => [...folders.filter(_ => _.id !== folder.id)]);
        setDocuments(documents => [...documents.filter(_ => _.folderId !== folder.id)]);
        
        const children = folders.filter(_ => _.parentId === folder.id);
        children.forEach(child => deleteFolderPermanently(child));
    }

    const handleDeleteFolder = (folder: IFolder) => {
        toggleFolderDeleted(folder, true);
    }

    const handleDeleteDocument = (document: IDocument) => {
        setDocuments([...documents.filter(_ => _.id !== document.id), {...document, isDeleted: true}]);
    }

    const handleRestoreFolder = (folder: IFolder) => {
        toggleFolderDeleted(folder, false);
    }

    const handleRestoreDocument = (document: IDocument) => {
        setDocuments([...documents.filter(_ => _.id !== document.id), {...document, isDeleted: false}]);
    }

    const handleDeletePermanentlyFolder = (folder: IFolder) => {
        deleteFolderPermanently(folder);
    }

    const handleDeletePermanentlyDocument = (document: IDocument) => {
        setDocuments(documents => [...documents.filter(_ => _.id !== document.id)]);
    }

    const handleEmptyTrashCan = () => {
        setFolders(folders => [...folders.filter(_ => !_.isDeleted)]);
        setDocuments(documents => [...documents.filter(_ => !_.isDeleted)]);
    }

    return (       
        <>
            <CssBaseline />
            <TopNav />
            <Toolbar />
            <div className={classes.container}>
                <FolderTree
                    data={folders}
                    expandedFolderIds={expandedFolderIds}
                    selectedFolder={selectedFolder}
                    onFolderExpandToggle={handleToggleExpandFolder}
                    onFolderSelect={setSelectedFolder}
                />
                {(selectedFolder?.type === FolderType.DriveRoot || selectedFolder?.type === FolderType.Folder) &&
                 <FolderContent 
                    folder={selectedFolder}
                    childFolders={folders.filter(_ => _.parentId && _.parentId === selectedFolder?.id && !_.isDeleted)} 
                    documents={documents.filter(_ => _.folderId === selectedFolder?.id && !_.isDeleted)}
                    onOpenFolder={handleOpenFolder}
                    onAddFolder={handleUpdateFolder}
                    onAddDocument={handleUpdateDocument} 
                    onRenameFolder={handleRenameFolder}
                    onRenameDocument={handleRenameDocument}
                    onDeleteFolder={handleDeleteFolder}
                    onDeleteDocument={handleDeleteDocument}
                    onToggleFavoriteFolder={handleUpdateFolder}
                    onToggleFavoriteDocument={handleUpdateDocument}
                    onDropFolder={handleUpdateFolder}
                    onDropDocument={handleUpdateDocument}
                />}
                {selectedFolder?.type === FolderType.TrashCan &&
                 <TrashCanContent 
                    deletedFolders={folders.filter(_ => _.isDeleted && !folders.find(__ => __.id === _.parentId).isDeleted)} 
                    deletedDocuments={documents.filter(_ => _.isDeleted && !folders.find(__ => __.id === _.folderId).isDeleted)}
                    onRestoreFolder={handleRestoreFolder}
                    onRestoreDocument={handleRestoreDocument}
                    onDeletePermanentlyFolder={handleDeletePermanentlyFolder}
                    onDeletePermanentlyDocument={handleDeletePermanentlyDocument}
                    onEmptyTrashCan={handleEmptyTrashCan} 
                />}
                {selectedFolder?.type === FolderType.Favorites &&
                 <FavoriteContent
                    favoriteFolders={folders.filter(_ => _.isFavorite && !_.isDeleted)}
                    favoriteDocuments={documents.filter(_ => _.isFavorite && !_.isDeleted)}
                    onOpenFolder={handleOpenFolder}
                    onToggleFavoriteFolder={handleUpdateFolder}
                    onToggleFavoriteDocument={handleUpdateDocument}
                 />}
            </div>
        </>
    );
}

export default App;