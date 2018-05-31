import {
    AboutItemModel,
    GradeLevels,
    ItemCardModel,
    ScoreGuideViewModel,
    ItemsSearchFilterModel,
    FilterType,
    ItemGroupModel,
    PdfViewType
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
    return items
        .map(i => {
            if (i === "123-4567") {
                return question4567Html;
            }
            if (i === "123-4568") {
                return question4568Html;
            }
        })
        .join("\n");
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

export const question4567Html = `<main><div id="Item_4567">
    ${multipleChoicePTag}
</div></main>`;

export const question4568Html = `<main><div id="Item_4568">
    <div><span>Initializing</span></div>
</div></main>`;
// tslint:enable:no-multiline-string

export const itemGroupModel4567: ItemGroupModel = {
    questions: [
        {
            id: "123-4567",
            view: {
                id: "123-4567",
                html: "<p>first question</p>",
                captured: true,
                type: PdfViewType.html
            }
        },
        {
            id: "123-4568",
            view: {
                id: "123-4568",
                html: "<p>this is the 2nd question</p>",
                captured: true,
                type: PdfViewType.html
            }
        }
    ]
};

export const itemGroupModel4569: ItemGroupModel = {
    questions: [
        {
            id: "123-4569",
            view: {
                id: "123-4569",
                captured: true,
                type: PdfViewType.picture,
                picturePath: "c:/pics/4569.png",
                screenshotUrl: "/pics/4569.png"
            }
        }
    ]
};

export function clone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
}
