import { ItemDataManager } from "./ItemDataManager";

import {
    AboutItemModel,
    ItemCardModel,
    SubjectModel,
    ItemGroupModel,
    PdfViewType,
    SearchAPIParamsModel,
    ItemSearch,
    ItemsSearchFilterModel,
    ScoreGuideViewModel,
    FilterSearchModel
} from "@osu-cass/sb-components";

const { SCREENSHOT_WIDTH, SAMPLE_ITEMS_API } = process.env;

export class ApiRepo {
    manager: ItemDataManager;
    itemCards: ItemCardModel[];
    aboutItems: AboutItemModel[];
    subjects: SubjectModel[];
    filterSearchModel: ItemsSearchFilterModel;
    sgViewModelGetter: () => Promise<ScoreGuideViewModel>;
    filterSearchModelGetter: () => Promise<ItemsSearchFilterModel>;
    aboutAllItemsGetter: () => Promise<AboutItemModel[]>;
    itemViewGetter: (items: string[]) => Promise<string>;

    constructor(
        sgViewModelGetter: () => Promise<ScoreGuideViewModel>,
        filterSearchModelGetter: () => Promise<ItemsSearchFilterModel>,
        aboutAllItemsGetter: () => Promise<AboutItemModel[]>,
        itemViewGetter: (items: string[]) => Promise<string>
    ) {
        this.manager = new ItemDataManager(itemViewGetter);
        this.sgViewModelGetter = sgViewModelGetter;
        this.filterSearchModelGetter = filterSearchModelGetter;
        this.aboutAllItemsGetter = aboutAllItemsGetter;
        this.itemViewGetter = itemViewGetter;
    }

    /**
     * Load `ScoringGuideViewModel` from API, cache the subjects object from it.
     * Returns cached version if we have it.
     */
    private async loadSubjects(): Promise<SubjectModel[]> {
        if (!this.subjects) {
            const scoreGuideVM = await this.sgViewModelGetter();
            this.subjects = scoreGuideVM.subjects;
        }

        return this.subjects;
    }

    /**
     * Load `ItemsSearchFilterModel` from the API
     */
    public async getFilterSearchModel(): Promise<ItemsSearchFilterModel> {
        if (!this.filterSearchModel) {
            this.filterSearchModel = await this.filterSearchModelGetter();
        }

        return this.filterSearchModel;
    }

    /**
     * Load `AboutItemModel`s from API, use that data to get `ItemCardModel`s.
     */
    private async loadAboutItems(): Promise<AboutItemModel[]> {
        if (!this.aboutItems) {
            this.aboutItems = await this.aboutAllItemsGetter();
            this.itemCards = this.aboutItems.map(i => i.itemCardViewModel);
        }

        return this.aboutItems;
    }

    async getItemData(): Promise<ItemCardModel[]> {
        if (!this.itemCards) {
            await this.loadAboutItems();
        }

        return this.itemCards;
    }

    /**
     * Returns a array of string arrays, each containing an item's associated items. The associated
     * items are each elements of the corresponding string array. Note that the mapped string array
     * will also contain the given item id.
     *
     * @param {string[]} requestedIds
     */
    public async getAssociatedItems(
        requestedIds: string[]
    ): Promise<string[][]> {
        const idsArray: string[] = [];
        const aboutItems = await this.loadAboutItems();
        requestedIds.forEach(reqId => {
            const item = aboutItems.find(ai =>
                ai.associatedItems.includes(reqId)
            );
            if (item && !idsArray.includes(item.associatedItems)) {
                idsArray.push(item.associatedItems);
            }
        });

        return idsArray.map(idGroup => idGroup.split(","));
    }

    /**
     * Adds `AboutItemData` and question number to each item in the `itemViews` array.
     * @param itemViews view models that data gets added to
     */
    async addDataToViews(itemViews: ItemGroupModel[]): Promise<void> {
        let questionNum = 1;
        const aboutItems = await this.loadAboutItems();
        itemViews.forEach(iv =>
            iv.questions.forEach(q => {
                q.data = aboutItems.find(
                    item =>
                        item.itemCardViewModel &&
                        `${item.itemCardViewModel.bankKey}-${
                            item.itemCardViewModel.itemKey
                        }` === q.id
                );
                q.questionNumber = questionNum++;
            })
        );
    }
    /**
     * Loads HTML and, if needed, screenshots of items.Takes an array of string arrays,
     * each of which should be an item Id or group of performance Ids.
     * @param {string[][]} itemIds
     */
    async loadViewData(itemIds: string[][]): Promise<ItemGroupModel[]> {
        return Promise.all(
            itemIds.map(idGroup => this.manager.getItemData(idGroup))
        );
    }

    /**
     * Find the `AboutItemModel` that corresponds to the given item and bank keys.
     *
     * @param {number} itemKey
     * @param {number} bankKey
     */
    public async getAboutItem(
        itemKey: number,
        bankKey: number
    ): Promise<AboutItemModel> {
        if (!this.aboutItems) {
            await this.loadAboutItems();
        }

        return this.aboutItems.find(
            i =>
                i.itemCardViewModel &&
                i.itemCardViewModel.itemKey === itemKey &&
                i.itemCardViewModel.bankKey === bankKey
        );
    }

    /**
     * Given an array of item ids, return a corresponding array of `ItemGroupModel`s including the view data for each item and its metadata.
     *
     * @param {string[]} requestedIds Array of item ids of the form `BANK-ITEM`
     * @param {boolean} printAssoc Include associated items? (performance items)
     */
    async getPdfDataByIds(
        requestedIds: string[],
        printAssoc: boolean
    ): Promise<ItemGroupModel[]> {
        let idGroups: string[][];
        if (printAssoc) {
            idGroups = await this.getAssociatedItems(requestedIds);
        } else {
            idGroups = requestedIds.map(id => [id]);
        }
        const views = await this.loadViewData(idGroups);
        await this.addDataToViews(views);

        return views;
    }

    async getSubjectByCode(code: string): Promise<SubjectModel> {
        const subjects = await this.loadSubjects();

        return subjects.find(s => s.code === code);
    }

    /**
     * Filter `AboutItemModel`s down based on the `SearchAPIParamsModel` using `ItemSearch.filterItemCards() and return the result`
     *
     * @param {SearchAPIParamsModel} filter
     */
    private async getAboutItemsByFilter(
        filter: SearchAPIParamsModel
    ): Promise<AboutItemModel[]> {
        const allItems = await this.getItemData();
        const filteredItems = ItemSearch.filterItemCards(allItems, filter);
        const aboutAllItems = await this.loadAboutItems();

        return filteredItems.map(i =>
            aboutAllItems.find(
                ai =>
                    ai.itemCardViewModel &&
                    ai.itemCardViewModel.itemKey === i.itemKey &&
                    ai.itemCardViewModel.bankKey === i.bankKey
            )
        );
    }

    /** Filter down items based on given filter, then return a array of `ItemGroupModel`s including the view data for filtered items and its metadata.
     *
     * @param {SearchAPIParamsModel} filter
     */
    async getPdfDataByFilter(
        filter: SearchAPIParamsModel
    ): Promise<ItemGroupModel[]> {
        const aboutItems = await this.getAboutItemsByFilter(filter);
        const associatedItems: string[] = [];
        aboutItems.forEach(ai => {
            if (!associatedItems.includes(ai.associatedItems)) {
                associatedItems.push(ai.associatedItems);
            }
        });

        const idGroups = associatedItems.map(ai => ai.split(","));
        let views = await this.loadViewData(idGroups);
        views = this.combineLikePassages(views);
        await this.addDataToViews(views);

        return views;
    }

    /**
     * Finds all items with the same passage and combines the items into one passage with multiple questions
     */
    private combineLikePassages(
        itemGroups: ItemGroupModel[]
    ): ItemGroupModel[] {
        const combinedItems: ItemGroupModel[] = [];
        let addedIds: string[] = [];

        for (const item of itemGroups) {
            if (item.passage) {
                const samePassageItems = itemGroups.filter(
                    (ig, filterIdx) =>
                        ig.passage &&
                        ig.passage.type === PdfViewType.html &&
                        ig.passage.html === item.passage.html
                );
                const samePassageQuestions = samePassageItems
                    .map(ig => ig.questions)
                    .reduce((prev, curr) => prev.concat(curr), []);
                if (
                    samePassageQuestions
                        .map(q => addedIds.includes(q.id))
                        .every(bool => bool === false)
                ) {
                    combinedItems.push({
                        passage: item.passage,
                        questions: samePassageQuestions
                    });
                    addedIds = addedIds.concat(
                        samePassageQuestions.map(q => q.id)
                    );
                }
            } else {
                combinedItems.push(item);
            }
        }

        return combinedItems;
    }
}
