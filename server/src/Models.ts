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

export interface ItemViewModel {
    bankKey: number;
    itemKey: number;
    gradeLabel: string;
    subjectLabel: string;
    claimCode: string;
    targetId: string;
    domain: string;
    depthOfKnowledge: string;
    commonCoreStandardId: string;
}

export interface AboutItemViewModel {
    itemCardViewModel: ItemViewModel;
    rubrics: Rubric[];
    targetDescription: string;
    depthOfKnowledge: string;
    commonCoreStandardsDescription: string;
    educationalDifficulty: string;
    evidenceStatement: string;
    associatedItems: string;
}

export interface Rubric {
    language: string;
    rubricEntries: RubricEntry[]
    samples: Sample[]
}

export interface RubricEntry {
    scorepoint: string;
    name: string;
    value: string;
}

export interface Sample {
    maxValue: string;
    minValue: string;
    sampleResponses: SampleResponse[];
}

export interface SampleResponse {
    purpose: string;
    scorePoint: string;
    name: string;
    sampleContent: string;
}