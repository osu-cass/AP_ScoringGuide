export interface ItemGroup {
    passage?: ItemView;
    questions: Question[];
}

export interface Question {
    id: string;
    view: ItemView;
    tableData?: QuestionTableData;
}

export interface ItemView {
    id: string;
    html?: string;
    picturePath?: string;
    captured: boolean;
    type: ViewType;
}

export enum ViewType {
    picture,
    html
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
