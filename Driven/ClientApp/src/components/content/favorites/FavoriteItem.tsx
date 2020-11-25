import React from "react";
import { faFolder, faStar as favorite } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt, faStar as notFavorite } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonBase, Grid, Menu, MenuItem } from "@material-ui/core";
import { IDocument } from "../../../models/IDocument";
import { IFolder } from "../../../models/IFolder";
import useContextMenu from "../../../hooks/useContextMenu";

const FavoriteItem: React.FC<{
    item: IFolder | IDocument,
    isSelected: boolean,
    isFolder?: boolean,
    onSelect: (item: IFolder | IDocument, isFolder: boolean) => void,
    onOpen: (item: IFolder | IDocument, isFolder: boolean) => void,
    onToggleFavorite: (item: IFolder | IDocument, isFolder: boolean) => void,
}> = ({
    item,
    isSelected, 
    isFolder, 
    onSelect, 
    onOpen,
    onToggleFavorite
}) => {

    const ctxMenu = useContextMenu();

    const handleCtxMenuOpen = (event: React.MouseEvent) => {
        ctxMenu.open(event);
        onSelect(item, isFolder);
    };

    const handleToggleFavorite = () => {
        ctxMenu.close();
        const toggled = {...item, isFavorite: !item.isFavorite};
        onToggleFavorite(toggled, isFolder);
    }

    return (
        <>
            <Grid item xs={1}>
                <ButtonBase
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
                </ButtonBase>
            </Grid>
            {ctxMenu.isOpen && <Menu
                keepMounted
                open={ctxMenu.isOpen}
                onClose={ctxMenu.close}
                anchorReference="anchorPosition"
                anchorPosition={ctxMenu.position}
            >
                <MenuItem onClick={handleToggleFavorite}>
                    <FontAwesomeIcon fixedWidth icon={item.isFavorite ? favorite : notFavorite} /> {!item.isFavorite ? "Add to favorites" : "Remove from favorites"}
                </MenuItem>
            </Menu>}
        </>
    )
}

export default FavoriteItem;