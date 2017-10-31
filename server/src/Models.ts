import * as GradeLevels from '../../client/src/Models/GradeLevels';

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
    title: string;
    grade: GradeLevels.GradeLevels;
    gradeLabel: string;
    subjectCode: string;
    subjectLabel: string;
    claimCode: string;
    claimLabel: string;
    target: string;
    targetId: string;
    interactionTypeCode: string;
    interactionTypeLabel: string;
    isPerformanceItem: boolean;
    domain: string;
    depthOfKnowledge: string;
    commonCoreStandardId: string;
}

export interface AboutItemViewModel {
    itemCardViewModel: ItemViewModel;
    sampleItemScoring: SampleItemScoring;
    targetDescription: string;
    depthOfKnowledge: string;
    commonCoreStandardsDescription: string;
    educationalDifficulty: string;
    evidenceStatement: string;
    associatedItems: string;
}

export interface Rubric {
    language: string;
    rubricEntries: RubricEntry[];
    samples: Sample[];
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

export interface Subject {
    code: string;
    label: string;
    shortLabel: string;
}

export interface SampleItemScoring {
    answerKey: string;
    hasMachineRubric: boolean;
    scoringOptions: SmarterAppOption[];
    rubrics: Rubric[];
}

export interface SmarterAppOption {
    name: string;
    value: string;
    feedback: string;
    language: string;
    answer: string;
}