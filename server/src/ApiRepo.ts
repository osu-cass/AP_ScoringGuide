import { ItemDataManager } from "./ItemDataManager";
import * as Path from 'path';
import * as RequestPromise from './RequestPromise';
import {
    AboutItemModel,
    ItemCardModel,
    SubjectModel,
    ItemGroupModel,
    PdfViewType,
    SearchAPIParamsModel,
    ItemSearch,
    ItemsSearchFilterModel
} from '@osu-cass/sb-components';

const { SCREENSHOT_WIDTH, SAMPLE_ITEMS_API } = process.env;

export class ApiRepo {
    manager: ItemDataManager;
    itemCards: ItemCardModel[];
    aboutItems: AboutItemModel[];
    subjects: SubjectModel[];
    filterSearchModel: ItemsSearchFilterModel;

    constructor() {
        const path = Path.join(__dirname, '../public/screenshots');
        this.manager = new ItemDataManager({
            pageWidth: parseInt(SCREENSHOT_WIDTH, 10),
            screenshotPath: path
        });
    }

    private async loadSubjectsFromSiw() {
        const subjects = await RequestPromise.get(`${SAMPLE_ITEMS_API}/ScoringGuide/ScoringGuideViewModel`);
        this.subjects = JSON.parse(subjects).subjects.map((s: {code: number, label: string, shortLabel: string}) => {
            return {
                code: s.code,
                label: s.label,
                shortLabel: s.shortLabel
            };
        });
    }

    /**
     * Load `ItemsSearchFilterModel` from the API
     */
    public async getFilterSearchModel() {
        if (!this.filterSearchModel) {
            const modelString = await RequestPromise.get(`${SAMPLE_ITEMS_API}/BrowseItems/FilterSearchModel`);
            this.filterSearchModel = JSON.parse(modelString);
        }

        return this.filterSearchModel;
    }

    private async loadDataFromSiw() {
        const items = await RequestPromise.get(`${SAMPLE_ITEMS_API}/ScoringGuide/AboutAllItems`);
        this.aboutItems = JSON.parse(items);
        this.itemCards = this.aboutItems.map(i => i.itemCardViewModel);
    }

    /**
     * Returns a array of string arrays, each containing an item's associated items. The associated 
     * items are each elements of the corresponding string array. Note that the mapped string array 
     * will also contain the given item id.
     * 
     * @param {string[]} requestedIds 
     */
    public async getAssociatedItems(requestedIds: string[]) {
        const idsArray: string[] = [];
        const aboutItems = await this.getAboutAllItems();
        requestedIds.forEach(reqId => {
            const item = aboutItems.find(ai => (ai.associatedItems).includes(reqId));
            if (item && !idsArray.includes(item.associatedItems)) {
                idsArray.push(item.associatedItems);
            }
        });

        return idsArray.map(idGroup => idGroup.split(','));
    }

    async addDataToViews(itemViews: ItemGroupModel[]) {
        let questionNum = 1;
        const aboutItems = await this.getAboutAllItems();
        itemViews.forEach(iv =>
            iv.questions.forEach(q => {
                q.data = aboutItems.find(item =>
                    item.itemCardViewModel
                    && `${item.itemCardViewModel.bankKey}-${item.itemCardViewModel.itemKey}` === q.id
                );
                q.questionNumber = questionNum += 1;
            })
        );
    }
    /**
     * Loads HTML and, if needed, screenshots of items.Takes an array of string arrays,
     * each of which should be an item Id or group of performance Ids.
     * @param {string[][]} itemIds
     */
    async loadViewData(itemIds: string[][]) {
        return await Promise.all(
            itemIds.map(idGroup =>
                this.manager.getItemData(idGroup)
            )
        );
    }

    async getItemData() {
        if (!this.itemCards) {
            await this.loadDataFromSiw();
        }

        return this.itemCards;
    }

    async getSubjects() {
        if (!this.subjects) {
            await this.loadSubjectsFromSiw();
        }

        return this.subjects;
    }

    async getAboutItem(itemKey: number, bankKey: number) {
        if (!this.aboutItems) {
            await this.loadDataFromSiw();
        }

        return this.aboutItems.find(i =>
            i.itemCardViewModel
            && i.itemCardViewModel.itemKey === itemKey
            && i.itemCardViewModel.bankKey === bankKey);
    }

    private async getAboutAllItems() {
        if (!this.aboutItems) {
            await this.loadDataFromSiw();
        }

        return this.aboutItems;
    }

    async getPdfDataByIds(requestedIds: string[], printAssoc: boolean) {
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

    async getSubjectByCode(code: string) {
        const subjects = await this.getSubjects();

        return subjects.find(s => s.code === code);
    }

    async getAboutItemsByFilter(filter: SearchAPIParamsModel) {
        const allItems = await this.getItemData();
        const filteredItems = ItemSearch.filterItemCards(allItems, filter);
        const aboutAllItems = await this.getAboutAllItems();

        return filteredItems.map(i =>
            aboutAllItems.find(ai =>
                ai.itemCardViewModel && ai.itemCardViewModel.itemKey === i.itemKey && ai.itemCardViewModel.bankKey === i.bankKey
            )
        );
    }

    async getPdfDataByFilter(filter: SearchAPIParamsModel) {
        const aboutItems = await this.getAboutItemsByFilter(filter);
        const associatedItems: string[] = [];
        aboutItems.forEach(ai => {
            if (!associatedItems.includes(ai.associatedItems)) {
                associatedItems.push(ai.associatedItems);
            }
        });

        const idGroups = associatedItems.map(ai => ai.split(','));
        let views = await this.loadViewData(idGroups);
        views = this.combineLikePassages(views);
        // TODO: Optimize this by adding data first
        await this.addDataToViews(views);

        return views;
    }

    /**
     * Finds all items with the same passage and combines the items into one passage with multiple questions
     */
    combineLikePassages(itemGroups: ItemGroupModel[]) {
        const combinedItems: ItemGroupModel[] = [];
        let addedIds: string[] = [];

        for (const item of itemGroups) {
            if (item.passage) {

                const samePassageItems = itemGroups.filter((ig, filterIdx) =>
                    ig.passage && ig.passage.type === PdfViewType.html
                    && ig.passage.html === item.passage.html);
                const samePassageQuestions = samePassageItems
                    .map(ig => ig.questions)
                    .reduce((prev, curr) => prev.concat(curr), []);
                if (samePassageQuestions.map(q => addedIds.includes(q.id)).every(bool => bool === false)) {
                    combinedItems.push({ passage: item.passage, questions: samePassageQuestions });
                    addedIds = addedIds.concat(samePassageQuestions.map(q => q.id));
                }

                // itemGroups = itemGroups.filter(ig => !samePassageItems.includes(ig));
            } else {
                combinedItems.push(item);
            }
        }

        return combinedItems;
    }
}
