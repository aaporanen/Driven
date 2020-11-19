import React from "react";
import { faFolder, faPen, faSearch, faTrash, faStar as favorite } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt, faStar as notFavorite } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonBase, Grid, Input, Menu, MenuItem } from "@material-ui/core";
import { IDocument } from "../../../models/IDocument";
import { IFolder } from "../../../models/IFolder";

const ctxMenuInitialState = {
    mouseX: null,
    mouseY: null,
    isRenameInitiated: false
};

const FolderItem: React.FC<{
    item: IFolder | IDocument,
    isSelected: boolean,
    isFolder?: boolean,
    onSelect: (item: IFolder | IDocument, isFolder: boolean) => void,
    onOpen: (item: IFolder | IDocument, isFolder: boolean) => void,
    onRename: (item: IFolder | IDocument, isFolder: boolean) => void,
    onDelete: (item: IFolder | IDocument, isFolder: boolean) => void,
    onToggleFavorite: (item: IFolder | IDocument, isFolder: boolean) => void,
    onDragStart: (item: IFolder | IDocument, isFolder: boolean) => void,
    onDragEnter: (item: IFolder | IDocument, isFolder: boolean) => void,
    onDrop: () => void
}> = ({
    item,
    isSelected, 
    isFolder, 
    onSelect, 
    onOpen,
    onRename,
    onDelete,
    onToggleFavorite,
    onDragStart,
    onDragEnter,
    onDrop
}) => {

    const [ctxMenuState, setCtxMenuState] = React.useState(ctxMenuInitialState);

    const [isEditMode, setIsEditMode] = React.useState<boolean>(false);

    const handleCtxMenuOpen = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect(item, isFolder);
        setCtxMenuState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            isRenameInitiated: false
        });
    };

    const handleCtxMenuClose = () => {
        setCtxMenuState(ctxMenuInitialState);
    };

    const handleOpen = () => {
        onOpen(item, isFolder);      
    }

    const handleEndRename = (newName: string) => {
        const renamedItem = {...item, name: newName };
        onRename(renamedItem, isFolder);
        setIsEditMode(false);
    }

    const handleBeginRename = () => {
        setCtxMenuState({...ctxMenuInitialState, isRenameInitiated: true});       
    }

    const handleDelete = () => {
        handleCtxMenuClose();
        onDelete(item, isFolder)          
    }

    const handleToggleFavorite = () => {
        const toggled = {...item, isFavorite: !item.isFavorite};
        onToggleFavorite(toggled, isFolder);
    }

    const handleDragStart = (e: any) => {
        onDragStart(item, isFolder);
    }

    const handleDragEnter = (e: any) => {
        onDragEnter(item, isFolder);
    }

    const handleDragOver = (e: any) => {
        e.preventDefault();       
    }

    React.useEffect(() => {
        if(!item.id) {
            handleBeginRename();
        }
    }, [item])

    React.useEffect(() => {
        if(ctxMenuState.isRenameInitiated) {
            setIsEditMode(true);
        }
    }, [ctxMenuState])

    return (
        <>
            <Grid 
                item 
                xs={1}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver} 
                onDrop={onDrop}
            >
                {!isEditMode && 
                <ButtonBase
                    draggable
                    onDragStart={handleDragStart}
                    onClick={e => onSelect(item, isFolder)}
                    onDoubleClick={e => onOpen(item, isFolder)} 
                    onContextMenu={handleCtxMenuOpen}
                    style={{
                        textAlign: "center",
                        display: "block",
                        backgroundColor: isSelected ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0)"
                    }}
                >
                    <FontAwesomeIcon fixedWidth size="4x" icon={isFolder ? faFolder : faFileAlt} />
                    <div>{item.name}</div>
                </ButtonBase>}
                {isEditMode && 
                <>
                    <FontAwesomeIcon fixedWidth size="4x" icon={isFolder ? faFolder : faFileAlt} />
                    <NameEditor originalName={item.name} onRename={handleEndRename} />
                </>}
            </Grid>
            {!!ctxMenuState.mouseY && <Menu
                keepMounted
                open={!!ctxMenuState.mouseY}
                onClose={handleCtxMenuClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    !!ctxMenuState.mouseY && !!ctxMenuState.mouseX
                    ? { top: ctxMenuState.mouseY, left: ctxMenuState.mouseX }
                    : undefined
                }
            >
                <MenuItem onClick={handleOpen}><FontAwesomeIcon fixedWidth icon={faSearch} /> Open</MenuItem>
                <MenuItem onClick={handleBeginRename}><FontAwesomeIcon fixedWidth icon={faPen} /> Rename</MenuItem>
                <MenuItem onClick={handleDelete}><FontAwesomeIcon fixedWidth icon={faTrash} /> Delete</MenuItem>
                <MenuItem onClick={handleToggleFavorite}><FontAwesomeIcon fixedWidth icon={item.isFavorite ? favorite : notFavorite} /> {!item.isFavorite ? "Add to favorites" : "Remove from favorites"}</MenuItem>
            </Menu>}
        </>
    )
}

const NameEditor: React.FC<{
    originalName: string,
    onRename: (newName: string) => void
}> = ({ originalName, onRename }) => {
    const [name, setName] = React.useState<string>(originalName);
    const handleOnRename = () => { 
        name ? onRename(name) : onRename(originalName);       
    }
    
    return (
        <Input 
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={handleOnRename}
            onKeyPress={e => e.key === "Enter" && handleOnRename()}
            autoFocus
            onFocus={e => e.currentTarget.select()}
        />
    )
}

export default FolderItem;