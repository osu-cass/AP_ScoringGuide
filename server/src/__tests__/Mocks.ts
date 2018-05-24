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

function instaPromise<T>(content: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        resolve(content);
    });
}

export const sgVMGetter = () => instaPromise(scoreGuideViewModel);

export const isfmGetter = () => instaPromise(itemSearchFilterModel);

export const aboutItemsGetter = () =>
    instaPromise([aboutItemVM, aboutItemVM2, aboutItemVM3]);

export const itemViewGetter = (items: string[]) => {
    if (items.includes("multi-items")) {
        return instaPromise(
            wrapItemHtml("<p>test<p><a href='https://google.com'>google</a>")
        );
    }
    if (items.includes("link-item")) {
        return instaPromise(
            wrapItemHtml("<p>test<p><a href='https://google.com'>google</a>")
        );
    }
    if (items.includes("interactive-item")) {
        return instaPromise(
            wrapItemHtml("<p>test<span>Initializing</span><p>")
        );
    }
};

export function wrapItemHtml(html: string) {
    return `<?xml version='1.0' encoding='UTF-8' ?>
        <contents>
            <content>
                <html>
                    <![CDATA[${html}]]>
                </html>
            </content>
        </contents>`;
}

// tslint:disable:no-multiline-string
export const multipleChoicePTag = `<div class='optionContainer'>
    <input type="radio" value="A" class="option">
    <div class='optionContent'>
        <p>option 1</p>
    </div>
</div>`;

export const multipleChoiceHtml = `<div class='optionContainer'>
    <input type="radio" value="B" class="option">
    <div class='optionContent'>
        <div>option 2</div><b>bold text</b>
    </div>
</div>`;

export const question1234Html = `<main><div id="Item_1234">
    ${multipleChoicePTag}
</div></main>`;

export const question1234Init = `<main><div id="Item_1234">
    <div><span>Initializing</span></div>
</div></main>`;

export const passage1234Html = `<main>
    <div class='thePassage'>
        <p>What is 2+2-1?</p>
    </div>
</main>`;

export const passage1234Init = `<main>
    <div class='thePassage'>
        <div><span>Initializing</span></div>
    </div>
</main>`;
// tslint:enable:no-multiline-string
