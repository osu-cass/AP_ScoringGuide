import * as Express from 'express';
import { HtmlRenderer, PdfGenerator } from "../PdfGenerator";
import { ItemCapture } from "../ItemCapture";
import { ItemDataManager } from "../ItemDataManager";
import * as RequestPromise from '../RequestPromise';
import { getConfig } from "../Config";
import { ItemViewModel } from "../Models";

export class APIRoute {
    manager: ItemDataManager;
    itemData: ItemViewModel[];
    router: Express.Router;

    constructor() {
        this.manager = new ItemDataManager({
            pageWidth: getConfig().screenshotPageWidth,
            screenshotPath: 'client/dist/images/screenshots'
        });
        RequestPromise.get(getConfig().api.sampleItems + '/ScoringGuide/Search')
            .then(items => this.itemData = JSON.parse(items));

        this.router = Express.Router();
        this.router.get('/pdf', this.pdf);
        this.router.get('/search', this.search);
    }

    pdf = async (req: Express.Request, res: Express.Response) => {
        const ids = req.query.ids as string || '';
        const idsArray = ids.split(',');
    
        let itemViews = await Promise.all(idsArray.map(id => this.manager.getItemData([id])));
    
        let questionNum = 1;
        itemViews.forEach(iv => 
            iv.questions.forEach(q => {
                q.data = this.itemData.find(item => 
                    item.bankKey + '-' + item.itemKey === q.id
                );
                q.questionNumber = questionNum++;
            })
        );
        
        const htmlString = HtmlRenderer.renderBody(itemViews, 'Mathematics', 'Grade 5');
        const title = 'Grade 5 Mathematics';
        res.type('application/pdf');
        PdfGenerator.generate(htmlString, title).pipe(res);
    }
    
    search = (req: Express.Request, res: Express.Response) => {
        res.status(200);
        res.type('application/json');
        res.send(JSON.stringify(this.itemData));
    }
}
