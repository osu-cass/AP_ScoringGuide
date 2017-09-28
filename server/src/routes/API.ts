import * as Express from 'express';
import { HtmlRenderer, PdfGenerator } from "../PdfGenerator";
import { ItemCapture } from "../ItemCapture";
import { ItemDataManager } from "../ItemDataManager";
import * as RequestPromise from '../RequestPromise';
import { ItemViewModel, AboutItemViewModel } from "../Models";
import * as Path from 'path';
import { PdfRepo } from '../ApiRepo';
import { getConfig } from '../Config';

export class APIRoute {
    router: Express.Router;
    pdfRepo: PdfRepo;

    constructor() {
        this.pdfRepo = new PdfRepo();
        this.router = Express.Router();
        this.router.get('/pdf', this.getPdf); //TODO: Remove this after testing
        this.router.get('/search', this.search);
        this.router.get('/aboutItem', this.getAboutItem);
        this.router.post('/pdf', this.postPdf);
    }

    getPdf = (req: Express.Request, res: Express.Response) => {
        const ids = req.query.ids as string || '';
        const requestedIds = ids.split(',');

        if (requestedIds.length === 0) {
            res.sendStatus(400);
        }
    
        let idGroups = this.pdfRepo.getAssociatedItems(requestedIds);
        this.pdfRepo.loadViewData(idGroups)
            .then(itemViews => {
                this.pdfRepo.addDataToViews(itemViews);
                const htmlString = HtmlRenderer.renderBody(itemViews, 'Mathematics', 'Grade 5');
                const title = 'Grade 5 Mathematics';
                res.type('application/pdf');
                PdfGenerator.generate(htmlString, title).pipe(res);
            })
            .catch(error => {
                console.error('/api/pdf: ', error);
                res.sendStatus(500);
            });
    }

    postPdf = (req: Express.Request, res: Express.Response) => {
        const items = req.body.items;
        res.send(items);
    }
    
    search = (req: Express.Request, res: Express.Response) => {
        this.pdfRepo.getItemData()
            .then(searchResult => {
                res.type('application/json');
                res.send(JSON.stringify(searchResult));
            })
            .catch(err => {
                console.error('/api/search/: ', err);
                res.sendStatus(500);
            });
    }

    getAboutItem = (req: Express.Request, res: Express.Response) => {
        const itemKey = Number(req.query.itemKey || 0) || 0;
        const bankKey = Number(req.query.bankKey || 0) || 0;

        this.pdfRepo.getAboutItem(itemKey, bankKey)
            .then(about => {
                if (about) {
                    res.type('application/json');
                    res.send(JSON.stringify(about));
                } else {
                    res.sendStatus(400);
                }
            })
            .catch(err => {
                console.error(`/api/aboutItem for ${bankKey}-${itemKey}: `, err);
                res.sendStatus(500);
            });
    }
}
