export interface ItemGroup {
    passage?: ItemView;
    questions: Question[];
}

export interface Question {
    id: string;
    view: ItemView;
    data?: ItemViewModel;
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

export interface ItemViewModel {
    bankKey: number;
    itemKey: number;
    title: string;
    gradeLabel: string;
    subjectLabel: string;
    claimCode: string;
    targetId: string;
    domain: string;
    depthOfKnowledge: string;
    commonCoreStandardId: string;
}