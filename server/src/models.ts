export interface ItemMetadata {
    ids: string[];
    subject: number; //TODO: Change this to a Subject
}

export interface ItemTableData {
    item: string;
    claim: string;
    domain: string;
    target: string;
    depthOfKnowledge: string;
    ccssMc: string;
    ccssMp: string;
}