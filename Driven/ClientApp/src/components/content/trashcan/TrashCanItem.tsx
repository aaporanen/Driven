import React from "react";
import { faFolder, faTrash, faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonBase, Grid, Menu, MenuItem } from "@material-ui/core";
import { IDocument } from "../../../models/IDocument";
import { IFolder } from "../../../models/IFolder";
import useContextMenu from "../../../hooks/useContextMenu";

const TrashCanItem: React.FC<{
    item: IFolder | IDocument,
    isSelected: boolean,
    isFolder?: boolean,
    onSelect: (item: IFolder | IDocument, isFolder: boolean) => void,
    onRestore: (item: IFolder | IDocument, isFolder: boolean) => void,
    onDeletePermanently: (item: IFolder | IDocument, isFolder: boolean) => void,
}> = ({
    item,
    isSelected, 
    isFolder, 
    onSelect, 
    onRestore,
    onDeletePermanently 
}) => {

    const ctxMenu = useContextMenu();

    const handleCtxMenuOpen = (event: React.MouseEvent) => {
        ctxMenu.open(event);
        onSelect(item, isFolder);
    };

    const handleRestore = (e: React.MouseEvent) => {
        ctxMenu.close();
        onRestore(item, isFolder);      
    }

    const handleDeletePermanently = (e: React.MouseEvent) => {
        ctxMenu.close();
        onDeletePermanently(item, isFolder)          
    }

    return (
        <>
            <Grid item xs={1}>
                <ButtonBase
                    onClick={e => onSelect(item, isFolder)}
                    onContextMenu={handleCtxMenuOpen}
                    style={{
                        textAlign: "center",
                        display: "block",
                        backgroundColor: isSelected ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0)"
                    }}
                >
                    <FontAwesomeIcon fixedWidth size="4x" icon={isFolder ? faFolder : faFileAlt} />
                    <div>{item.name}</div>
                </ButtonBase>
            </Grid>
            {ctxMenu.isOpen && <Menu
                keepMounted
                open={ctxMenu.isOpen}
                onClose={ctxMenu.close}
                anchorReference="anchorPosition"
                anchorPosition={ctxMenu.position}
            >
                <MenuItem onClick={handleRestore}><FontAwesomeIcon fixedWidth icon={faTrashRestore} /> Restore</MenuItem>
                <MenuItem onClick={handleDeletePermanently}><FontAwesomeIcon fixedWidth icon={faTrash} /> Delete</MenuItem>
            </Menu>}
        </>
    )
}

export default TrashCanItem;