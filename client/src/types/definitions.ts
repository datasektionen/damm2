
export interface IPatch {
    id: number;
    name: string;
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    creators: string[];
    tags: ITag[];
    images: string[];
    files: string[];
}

export interface ITag {
    id: number;
    name: string;
    description: string;
    color: string;
    backgroundColor: string;
    createdAt: string;
    updatedAt: string;
    children: ITag[];
    tagId: number;
}