export interface PicturePath {
    item: string,
    path: string,
    type: PictureType,
    captured: boolean
}

export interface ItemPictures {
    passage?: PicturePath,
    questions: PicturePath[]
}

export enum PictureType {
    question,
    passage
}

export interface Item {
    passage: PicturePath;
    questions: Question[];
}

export interface Question {
    id: string;
    tableData: QuestionTableData;
    path: PicturePath;
}

export interface QuestionTableData {
    item: string;
    claim: string;
    domain: string;
    target: string;
    depthOfKnowledge: string;
    ccssMc: string;
    ccssMp: string;
}