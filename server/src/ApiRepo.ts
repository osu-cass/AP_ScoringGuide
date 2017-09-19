import { AboutItemViewModel, ItemGroup, ItemViewModel } from "./Models";
import { ItemDataManager } from "./ItemDataManager";
import { getConfig } from "./Config";
import * as Path from 'path';
import * as RequestPromise from './RequestPromise';

export class PdfRepo {
    manager: ItemDataManager;
    itemData: ItemViewModel[];
    aboutItems: AboutItemViewModel[];

    constructor() {
        const path = Path.join(__dirname, '../../../client/dist/images/screenshots');
        this.manager = new ItemDataManager({
            pageWidth: getConfig().screenshotPageWidth,
            screenshotPath: path
        });
    }

    async loadDataFromSiw() {
        const items = await RequestPromise.get(getConfig().api.sampleItems + '/ScoringGuide/AboutAllItems')
        this.aboutItems = JSON.parse(items);
        this.itemData = this.aboutItems.map(i => i.itemCardViewModel);
    }

    getAssociatedItems(requestedIds: string[]) {
        let idsArray = requestedIds.map(reqId => 
            this.aboutItems
                .find(ai => ai.associatedItems.includes(reqId))
                .associatedItems
        );

        idsArray = idsArray.filter((idGroup, index) => 
            idsArray.indexOf(idGroup) === index
        );

        const splitIdsArray = idsArray.map(idGroup => idGroup.split(','));
        return splitIdsArray;
    }

    addDataToView(itemViews: ItemGroup[]) {
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
}