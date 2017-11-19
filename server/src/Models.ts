
export interface ItemGroup {
    passage?: ItemView;
    questions: Question[];
}

export interface Question {
    id: string;
    view: ItemView;
    data?: AboutItemViewModel;
    questionNumber?: number;
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



