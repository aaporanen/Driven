import { FolderType } from "../enums/FolderType";

export interface IFolder {
    id: number,
    key: string,
    name: string,
    parentId?: number,
    isDeleted: boolean,
    isFavorite: boolean,
    type: FolderType
}