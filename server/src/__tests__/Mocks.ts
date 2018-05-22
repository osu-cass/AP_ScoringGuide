import {
    AboutItemModel,
    GradeLevels,
    ItemCardModel,
    ScoreGuideViewModel,
    ItemsSearchFilterModel,
    FilterType
} from "@osu-cass/sb-components";

export const itemVM: ItemCardModel = {
    bankKey: 123,
    itemKey: 4567,
    gradeLabel: "grade 3",
    subjectLabel: "math",
    claimCode: "234536",
    targetId: "23463467",
    domain: "MATH",
    depthOfKnowledge: "",
    commonCoreStandardId: "",
    title: "",
    grade: GradeLevels.Grade3,
    subjectCode: "MATH",
    claimLabel: "Math Claim",
    targetShortName: "1-3",
    targetDescription: "Description",
    interactionTypeCode: "",
    interactionTypeLabel: "",
    isPerformanceItem: false,
    targetHash: 212
};

export const aboutItemVM: AboutItemModel = {
    itemCardViewModel: itemVM,
    targetDescription: "string",
    depthOfKnowledge: "string",
    commonCoreStandardsDescription: "string",
    educationalDifficulty: "string",
    evidenceStatement: "string",
    associatedItems: "123-4567,123-4568"
};

export const itemVM2: ItemCardModel = {
    bankKey: 123,
    itemKey: 4568,
    gradeLabel: "grade 3",
    subjectLabel: "math",
    claimCode: "234536",
    targetId: "23463467",
    domain: "MATH",
    depthOfKnowledge: "",
    commonCoreStandardId: "",
    title: "",
    grade: GradeLevels.Grade3,
    subjectCode: "MATH",
    claimLabel: "Math Claim",
    targetShortName: "1-3",
    targetDescription: "Description",
    interactionTypeCode: "",
    interactionTypeLabel: "",
    isPerformanceItem: false,
    targetHash: 212
};

export const aboutItemVM2: AboutItemModel = {
    itemCardViewModel: itemVM2,
    targetDescription: "string",
    depthOfKnowledge: "string",
    commonCoreStandardsDescription: "string",
    educationalDifficulty: "string",
    evidenceStatement: "string",
    associatedItems: "123-4567,123-4568"
};

export const itemVM3: ItemCardModel = {
    bankKey: 123,
    itemKey: 4569,
    gradeLabel: "grade 4",
    subjectLabel: "math",
    claimCode: "234536",
    targetId: "23463467",
    domain: "MATH",
    depthOfKnowledge: "",
    commonCoreStandardId: "",
    title: "",
    grade: GradeLevels.Grade4,
    subjectCode: "MATH",
    claimLabel: "Math Claim",
    targetShortName: "1-3",
    targetDescription: "Description",
    interactionTypeCode: "",
    interactionTypeLabel: "",
    isPerformanceItem: false,
    targetHash: 212
};

export const aboutItemVM3: AboutItemModel = {
    itemCardViewModel: itemVM3,
    targetDescription: "string",
    depthOfKnowledge: "string",
    commonCoreStandardsDescription: "string",
    educationalDifficulty: "string",
    evidenceStatement: "string",
    associatedItems: "123-4569"
};

export const scoreGuideViewModel: ScoreGuideViewModel = {
    subjects: [],
    interactionTypes: []
};

export const itemSearchFilterModel: ItemsSearchFilterModel = {
    interactionTypes: {
        filterOptions: [],
        code: FilterType.InteractionType,
        label: ""
    },
    subjects: {
        filterOptions: [],
        code: FilterType.Subject,
        label: ""
    },
    claims: {
        filterOptions: [],
        code: FilterType.Subject,
        label: ""
    },
    targets: {
        filterOptions: [],
        code: FilterType.Target,
        label: ""
    },
    grades: {
        filterOptions: [],
        code: FilterType.Grade,
        label: ""
    },
    technologyTypes: {
        filterOptions: [],
        code: FilterType.TechnologyType,
        label: ""
    },
    calculator: {
        filterOptions: [],
        code: FilterType.Calculator,
        label: ""
    }
};

export const sgVMGetter = () =>
    new Promise<ScoreGuideViewModel>((resolve, reject) => {
        resolve(scoreGuideViewModel);
    });

export const isfmGetter = () =>
    new Promise<ItemsSearchFilterModel>((resolve, reject) => {
        resolve(itemSearchFilterModel);
    });

export const aboutItemsGetter = () =>
    new Promise<AboutItemModel[]>((res, rej) => {
        res([aboutItemVM, aboutItemVM2, aboutItemVM3]);
    });

export const itemViewGetter = (items: string[]) => {
    if (items.includes("link-item")) {
        return wrapItemHtml(
            "<p>test<p><a href='https://google.com'>google</a>"
        );
    }
};

function wrapItemHtml(html: string) {
    return `<?xml version='1.0' encoding='UTF-8' ?>
        <contents>
            <content>
                <html>
                    <![CDATA[${html}]]>
                </html>
            </content>
        </contents>`;
}
