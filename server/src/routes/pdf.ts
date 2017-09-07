import { Request, Response } from 'express';
import { HtmlRenderer, PdfGenerator } from "../PdfGenerator";
import { ItemCapture } from "../ItemCapture";
import { ItemDataManager } from "../ItemDataManager";
import * as RequestPromise from '../RequestPromise';
import { getConfig } from "../Config";
import { ItemViewModel } from "../Models";

let manager = new ItemDataManager({
    pageWidth: 800,
    screenshotPath: 'client/dist/images/screenshots'
})

let itemData: ItemViewModel[];
RequestPromise.get(getConfig().api.sampleItems + '/ScoringGuide/Search')
    .then(items => 
        itemData = JSON.parse(items)
    );

export default async function post(req: Request, res: Response) {
    const ids = req.query.ids as string || '';
    const idsArray = ids.split(',');

    let itemViews = await Promise.all(idsArray.map(id => manager.getItemData([id])));
    itemViews.forEach(iv => 
        iv.questions.forEach(q => 
            q.data = itemData.find(item => 
                item.bankKey + '-' + item.itemKey === q.id)));
    
    const htmlString = HtmlRenderer.renderBody(itemViews, 'Mathematics', 'Grade 5');
    const title = 'Grade 5 Mathematics';
    res.type('application/pdf');
    PdfGenerator.generate(htmlString, title).pipe(res);
}