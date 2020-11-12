export interface IDocument {
    id: number,
    key: string,
    name: string,
    content?: string,
    folderId: number,
    isDeleted: boolean,
    isFavorite: boolean
}