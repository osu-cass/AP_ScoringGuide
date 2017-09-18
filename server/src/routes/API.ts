import * as Express from 'express';
import { HtmlRenderer, PdfGenerator } from "../PdfGenerator";
import { ItemCapture } from "../ItemCapture";
import { ItemDataManager } from "../ItemDataManager";
import * as RequestPromise from '../RequestPromise';
import { getConfig } from "../Config";
import { ItemViewModel, AboutItemViewModel } from "../Models";
import * as Path from 'path';

export class APIRoute {
    manager: ItemDataManager;
    itemData: ItemViewModel[];
    aboutItems: AboutItemViewModel[];
    router: Express.Router;

    constructor() {
        const path = Path.join(__dirname, '../../../client/dist/images/screenshots');
        this.manager = new ItemDataManager({
            pageWidth: getConfig().screenshotPageWidth,
            screenshotPath: path
        });
        RequestPromise.get(getConfig().api.sampleItems + '/ScoringGuide/AboutAllItems')
            .then(items => {
                this.aboutItems = JSON.parse(items);
                //this.aboutItems = this.aboutItems.filter(i => i.rubrics.length !== 0);
                this.itemData = this.aboutItems.map(i => i.itemCardViewModel);
            });

        this.router = Express.Router();
        this.router.get('/pdf', this.pdf);
        this.router.get('/search', this.search);
        this.router.get('/aboutItem', this.getAboutItem);
    }

    pdf = async (req: Express.Request, res: Express.Response) => {
        const ids = req.query.ids as string || '';
        const requestedIds = ids.split(',');
    
        const idsArray = requestedIds.map(reqId => 
            this.aboutItems
                .find(ai => ai.associatedItems.includes(reqId))
                .associatedItems
        );

        idsArray.filter((idGroup, index) => 
            idsArray.indexOf(idGroup) === index
        );

        let itemViews = await Promise.all(
            idsArray.map(idGroup => 
                this.manager.getItemData(idGroup.split(','))
            )
        );
    
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

    getAboutItem = (req: Express.Request, res: Express.Response) => {
        const itemKey = Number(req.query.itemKey || 0) || 0;
        const bankKey = Number(req.query.bankKey || 0) || 0;
        const about = this.aboutItems.find(i => 
            i.itemCardViewModel  
            && i.itemCardViewModel.itemKey === itemKey
            && i.itemCardViewModel.bankKey === bankKey);
        if (about) {
            res.status(200);
            res.type('application/json');
            res.send(JSON.stringify(about));
        } else {
            res.sendStatus(400);
        }
    }
}
