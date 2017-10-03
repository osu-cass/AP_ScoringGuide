import { AboutItemViewModel, ItemGroup, ItemViewModel, Subject } from "./Models";
import { ItemDataManager } from "./ItemDataManager";
import { getConfig } from "./Config";
import * as Path from 'path';
import * as RequestPromise from './RequestPromise';

export class ApiRepo {
    manager: ItemDataManager;
    itemCards: ItemViewModel[];
    aboutItems: AboutItemViewModel[];
    subjects: Subject[];

    constructor() {
        const path = Path.join(__dirname, '../../client/dist/images/screenshots');
        this.manager = new ItemDataManager({
            pageWidth: getConfig().screenshotPageWidth,
            screenshotPath: path
        });
    }

    private async loadSubjectsFromSiw() {
        const subjects = await RequestPromise.get(getConfig().sampleItemsApi + '/ScoringGuide/ScoringGuideViewModel');
        console.log("Subjects received from SampleItemsWebsite API:", getConfig().sampleItemsApi);
        this.subjects = JSON.parse(subjects).subjects.forEach((s: any) => {
            return {
                code: s.code,
                label: s.label,
                shortLabel: s.shortLabel
            }
        });
    }

    private async loadDataFromSiw() {
        const items = await RequestPromise.get(getConfig().sampleItemsApi + '/ScoringGuide/AboutAllItems');
        console.log("Data received from SampleItemsWebsite API:", getConfig().sampleItemsApi);
        this.aboutItems = JSON.parse(items);
        this.itemCards = this.aboutItems.map(i => i.itemCardViewModel);
    }

    async getAssociatedItems(requestedIds: string[]) {
        let idsArray: string[] = [];
        const aboutItems = await this.getAboutAllItems();
        requestedIds.forEach(reqId => {
            const item = aboutItems.find(ai => ai.associatedItems.split(',').includes(reqId));
            if (item && !idsArray.includes(item.associatedItems)) {
                idsArray.push(item.associatedItems);
            }
        });
        
        const splitIdsArray = idsArray.map(idGroup => idGroup.split(','));
        return splitIdsArray;
    }

    async addDataToViews(itemViews: ItemGroup[]) {
        let questionNum = 1;
        const aboutItems = await this.getAboutAllItems();
        itemViews.forEach(iv => 
            iv.questions.forEach(q => {
                q.data = aboutItems.find(item => 
                    item.itemCardViewModel 
                    && item.itemCardViewModel.bankKey + '-' + item.itemCardViewModel.itemKey === q.id
                );
                q.questionNumber = questionNum++;
            })
        );
    }

    /** Loads HTML and, if needed, screenshots of items. 
     * Takes an array of string arrays, each of which should 
     * be an item Id or group of performance Ids. */
    async loadViewData(itemIds: string[][]) {
        let itemGroups = await Promise.all(
            itemIds.map(idGroup => 
                this.manager.getItemData(idGroup)
            )
        );
        return itemGroups;
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
        const about = this.aboutItems.find(i => 
            i.itemCardViewModel  
            && i.itemCardViewModel.itemKey === itemKey
            && i.itemCardViewModel.bankKey === bankKey);
        return about;
    }

    private async getAboutAllItems() {
        if (!this.aboutItems) {
            await this.loadDataFromSiw();
        }
        return this.aboutItems;
    }

    async getPdfDataByIds(requestedIds: string[]) {
        const idGroups = await this.getAssociatedItems(requestedIds);
        const views = await this.loadViewData(idGroups);
        await this.addDataToViews(views);
        return views;
    }

    async getSubjectByCode(code: string) {
        const subjects = await this.getSubjects();
        return subjects.find(s => s.code === code);
    }

    async getPdfDataByGradeSubject(gradeCode: number, subjectCode: string) {
        const subjects = await this.getSubjects();

        const idGroups = (await this.getAboutAllItems()).filter(ai => 
                ai.itemCardViewModel 
                && ai.itemCardViewModel.grade === gradeCode
                && ai.itemCardViewModel.subjectCode.toLowerCase() === subjectCode.toLowerCase()
            ).map(ai => ai.associatedItems.split(','));
        
        const views = await this.loadViewData(idGroups);
        await this.addDataToViews(views); //TODO: Optimize this by adding data first!
        return views;
    }
}