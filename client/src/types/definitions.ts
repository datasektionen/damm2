import moment from "moment";

export interface Box {
    id: number;
    name: string;
    "#patches": number;
    "#uniquePatches": number;
    bags?: {
        id: number;
        name: string;
        boxId: number;
        "#patches": number;
        "#uniquePatches": number;
    }[]
}

export interface Bag {
    id: number;
    name: string;
    boxId: number;
    box: {
        id: number;
        name: string;
    };
    patches?: IPatch[];
    "#patches": number;
    "#uniquePatches": number;
}
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
    bag?: Bag;
    bagId?: number;
    amount: number;
    createdBy: IPerson[];
}

export interface ITag {
    id: number;
    name: string;
    description: string;
    color: string;
    backgroundColor: string;
    createdAt: string;
    updatedAt: string;
    category:   "RECEPTION" | "COMMITTEE" | "EVENT" | "OTHER";
    type: "PATCH" | "ARTEFACT"
}

export interface IPerson {
    id: number;
    name: string;
}

export interface IEvent {
    id: number;
    title: string;
    content: string;
    date: string;
    type: "SM_DM" | "ANNIVERSARY" | "GENERAL" | "DFUNKT";
    protocol?: string;
    mandates?: { date: moment.Moment; role: IRole; user: IUser}[];
    createdBy: string;
}

export interface IEventsPerYear {
    year: number;
    cards: IEvent[];
}

export interface IRole {
    id: number;
    title: string;
    description: string;
    identifier: string;
    email: string;
    active: boolean;
    Group: { name: string; identifier: string; };
}

export interface IUser {
    first_name: string,
    last_name: string,
    email: string | null,
    kthid: string,
    ugkthid: string
}

export interface IArtefact {
    id: number;
    name: string;
    description: string;
    date: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
    files: string[];
    tags: ITag[];
}