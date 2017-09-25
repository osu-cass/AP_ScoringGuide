import { AboutItemViewModel, ItemGroup, ItemViewModel } from "./Models";
import { ItemDataManager } from "./ItemDataManager";
import { getConfig } from "./Config";
import * as Path from 'path';
import * as RequestPromise from './RequestPromise';

export class PdfRepo {
    manager: ItemDataManager;
    itemCards: ItemViewModel[];
    aboutItems: AboutItemViewModel[];

    constructor() {
        const path = Path.join(__dirname, '../../client/dist/images/screenshots');
        this.manager = new ItemDataManager({
            pageWidth: getConfig().screenshotPageWidth,
            screenshotPath: path
        });
    }

    async loadDataFromSiw() {
        const items = await RequestPromise.get(getConfig().sampleItemsApi + '/ScoringGuide/AboutAllItems')
        this.aboutItems = JSON.parse(items);
        this.itemCards = this.aboutItems.map(i => i.itemCardViewModel);
    }

    getAssociatedItems(requestedIds: string[]) {
        let idsArray: string[] = [];
        requestedIds.forEach(reqId => {
            const item = this.aboutItems.find(ai => ai.associatedItems.split(',').includes(reqId));
            if (item && !idsArray.includes(item.associatedItems)) {
                idsArray.push(item.associatedItems);
            }
        });
        
        const splitIdsArray = idsArray.map(idGroup => idGroup.split(','));
        return splitIdsArray;
    }

    addDataToViews(itemViews: ItemGroup[]) {
        let questionNum = 1;
        itemViews.forEach(iv => 
            iv.questions.forEach(q => {
                q.data = this.aboutItems.find(item => 
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
}