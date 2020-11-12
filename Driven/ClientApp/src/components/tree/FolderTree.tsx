import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import { IFolder } from '../../models/IFolder';
import { List } from '@material-ui/core';
import FolderTreeBranch from './FolderTreeBranch';
import { FolderType } from '../../enums/FolderType';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
    },
    drawerPaper: {
        width: drawerWidth,
        padding: theme.spacing(3),
        zIndex: 1000
    },
    icon: {
        marginTop: 3,
        padding: 5
    }
}));

const FolderTree: React.FC<{
    data: IFolder[],
    expandedFolderIds: number[],
    selectedFolder: IFolder,
    onFolderExpandToggle: (folder: IFolder) => void,
    onFolderSelect: (folder: IFolder) => void
}> = ({ data, expandedFolderIds, selectedFolder, onFolderExpandToggle, onFolderSelect }) => {
    
    const classes = useStyles();

    // React.useEffect(() => { 
    //     setOpenFolderIds(openFolderIds => [...openFolderIds.filter(_ => _ !== selectedFolder.id), selectedFolder.id]);
    // }, [selectedFolder])

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Toolbar />
            <List component="nav" aria-label="main mailbox folders">
            <FolderTreeBranch
                folder={data.find(_ => _.type === FolderType.TrashCan)}
                selectedFolder={selectedFolder}
                data={data.filter(_ => _.isDeleted)}
                leftPad={1}
                openFolderIds={expandedFolderIds}
                onFolderSelect={onFolderSelect}
                onFolderExpandToggle={onFolderExpandToggle}
            />
            <FolderTreeBranch
                folder={data.find(_ => _.type === FolderType.Favorites)}
                selectedFolder={selectedFolder}
                data={data.filter(_ => !_.isDeleted)}
                leftPad={1}
                openFolderIds={expandedFolderIds}
                onFolderSelect={onFolderSelect}
                onFolderExpandToggle={onFolderExpandToggle}
            />
            <FolderTreeBranch
                folder={data.find(_ => _.type === FolderType.DriveRoot)}
                selectedFolder={selectedFolder}
                data={data.filter(_ => !_.isDeleted)}
                leftPad={1}
                openFolderIds={expandedFolderIds}
                onFolderSelect={onFolderSelect}
                onFolderExpandToggle={onFolderExpandToggle}
            />
            </List>           
        </Drawer>
    );
}
    
export default FolderTree;