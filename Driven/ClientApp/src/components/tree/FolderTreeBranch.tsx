import React from 'react';
import { faAngleDown, faAngleRight, faFolder, faHome, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItem } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { FolderType } from '../../enums/FolderType';
import { IFolder } from '../../models/IFolder';

const FolderTreeBranch: React.FC<{
    folder: IFolder,
    selectedFolder: IFolder,
    data: IFolder[],
    leftPad: number,
    openFolderIds: number[],
    onFolderSelect: (folder: IFolder) => void,
    onFolderExpandToggle: (folder: IFolder) => void
}> = ({ folder, selectedFolder, data, leftPad, openFolderIds, onFolderSelect, onFolderExpandToggle }) => {
    const isTrashCan = folder.type === FolderType.TrashCan;
    const isFavorites = folder.type === FolderType.Favorites;
    const children = data.filter(_ => _.parentId === folder.id);    
    const hasChildren = children?.length > 0;   
    const isOpen = openFolderIds.indexOf(folder.id) !== -1;  
    const iconStyle: CSSProperties = {
        paddingRight: 5,
    }

    return (
        <>
            <ListItem 
                button
                selected={selectedFolder?.id === folder?.id}
                onClick={e => onFolderSelect(folder)}
                onDoubleClick={e => onFolderExpandToggle(folder)}
                style={{ 
                    paddingLeft: leftPad * 5 + (!hasChildren ? 20 : 0),
                }}
            >
                {hasChildren && <FontAwesomeIcon
                    fixedWidth 
                    icon={isOpen ? faAngleDown : faAngleRight}
                    onClick={e => {e.stopPropagation(); onFolderExpandToggle(folder)}}
                    style={iconStyle} 
                />}
                {<FontAwesomeIcon
                    fixedWidth
                    icon={isTrashCan ? faTrash : isFavorites ? faStar : folder.parentId ? faFolder : faHome}
                    style={iconStyle} 
                />}
                {folder.name}
            </ListItem>
            {hasChildren && isOpen && children.map(child => 
            <FolderTreeBranch 
                folder={child}
                selectedFolder={selectedFolder} 
                data={data} 
                leftPad={leftPad + 1}
                openFolderIds={openFolderIds}
                onFolderSelect={onFolderSelect} 
                onFolderExpandToggle={onFolderExpandToggle}
                key={child.id}
            />)}
        </>    
    );
}

export default FolderTreeBranch;