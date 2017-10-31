import * as Express from 'express';
import { HtmlRenderer, PdfGenerator } from "../PdfGenerator";
import { ItemCapture } from "../ItemCapture";
import { ItemDataManager } from "../ItemDataManager";
import * as RequestPromise from '../RequestPromise';
import { ItemViewModel, AboutItemViewModel } from "../Models";
import * as Path from 'path';
import { ApiRepo } from '../ApiRepo';
import { getConfig } from '../Config';
import * as GradeLevels from '../../../client/src/Models/GradeLevels';

export class APIRoute {
    router: Express.Router;
    repo: ApiRepo;

    constructor() {
        this.repo = new ApiRepo();
        this.router = Express.Router();
        this.router.get('/pdf/items', this.getPdfById);
        this.router.get('/pdf', this.getPdf);
        this.router.get('/search', this.search);
        this.router.get('/aboutItem', this.getAboutItem);
        this.router.get('/scoringGuideViewModel', this.getSubjects);
    }

    getPdf = (req: Express.Request, res: Express.Response) => {
        const subject = req.query.subject as string || '';
        const grade = Number(req.query.grade) || -1;
        const titlePage = (req.query.titlePage as string || 'true') == "true";

        if (subject === '' || grade === -1) {
            res.status(400).send('Invalid subject or grade.');
        }

        const gradeString = GradeLevels.caseToString(grade)
        const subjectPromise = this.repo.getSubjectByCode(subject);
        const pdfDataPromise = this.repo.getPdfDataByGradeSubject(grade, subject);

        Promise.all([subjectPromise, pdfDataPromise])
            .then(value => {
                const subjectString = value[0].label;
                const htmlString = HtmlRenderer.renderBody(value[1], subjectString, gradeString, titlePage);
                const title = gradeString + ' ' + subjectString;
                res.type('application/pdf');
                PdfGenerator.generate(htmlString, title).pipe(res);
            }).catch(error => {
                console.error('/api/pdf:', error);
                res.sendStatus(500);
            });
    }

    getPdfById = (req: Express.Request, res: Express.Response) => {
        const ids = req.query.ids;
        const requestedIds = ids.split(',');
        
        if (requestedIds.length === 0) {
            res.sendStatus(400);
        }
    
        this.repo.getPdfDataByIds(requestedIds)
            .then(itemViews => {
                const htmlString = HtmlRenderer.renderBody(itemViews, "", "", false);
                res.type('application/pdf');
                PdfGenerator.generate(htmlString, "Custom Item Sequence").pipe(res);
            })
            .catch(error => {
                console.error('/api/pdf:', error);
                res.sendStatus(500);
            });
    }
    
    getSubjects = (req: Express.Request, res: Express.Response) => {
        this.repo.getSubjects()
            .then(subjects => {
                res.type('application/json');
                res.send(JSON.stringify(subjects));
            })
            .catch(err => {
                console.error('/api/scoringGuideViewModel/:', err);
                res.sendStatus(500);
            });
    }

    search = (req: Express.Request, res: Express.Response) => {
        this.repo.getItemData()
            .then(searchResult => {
                res.type('application/json');
                res.send(JSON.stringify(searchResult));
            })
            .catch(err => {
                console.error('/api/search/:', err);
                res.sendStatus(500);
            });
    }

    getAboutItem = (req: Express.Request, res: Express.Response) => {
        const itemKey = Number(req.query.itemKey || 0) || 0;
        const bankKey = Number(req.query.bankKey || 0) || 0;
        
        this.repo.getAboutItem(itemKey, bankKey)
            .then(about => {
                if (about) {
                    res.type('application/json');
                    res.send(JSON.stringify(about));
                } else {
                    res.sendStatus(400);
                }
            })
            .catch(err => {
                console.error(`/api/aboutItem for ${bankKey}-${itemKey}:`, err);
                res.sendStatus(500);
            });
    }
}
