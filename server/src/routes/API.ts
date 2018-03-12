import * as path from "path";
import * as Express from "express";
import { HtmlRenderer, PdfGenerator } from "../PdfGenerator";
import { ItemCapture } from "../ItemCapture";
import { ItemDataManager } from "../ItemDataManager";
import * as RequestPromise from "../RequestPromise";
import { ApiRepo } from "../ApiRepo";
import {
    GradeLevel,
    SearchAPIParamsModel,
    SearchUrl,
    ItemModel
} from "@osu-cass/sb-components";

export class APIRoute {
    routes: Express.Router;
    repo: ApiRepo;

    constructor() {
        this.repo = new ApiRepo();
        this.routes = Express.Router();
        this.routes.post("/pdf/items", this.getPdfById);
        this.routes.get("/pdf", this.getPdf);
        this.routes.get("/search", this.search);
        this.routes.get("/aboutItem", this.getAboutItem);
        this.routes.get("/scoringGuideViewModel", this.getSubjects);
        this.routes.get("/filterSearchModel", this.getFilterSearchModel);
    }

    getPdf = (req: Express.Request, res: Express.Response) => {
        const searchParams = SearchUrl.decodeExpressQuery(req.query);
        const titlePage =
            ((req.query.TitlePage as string) || "true") === "true";
        const showRubric =
            ((req.query.ScoringInfo as string) || "true") === "true";

        if (
            !searchParams.subjects ||
            !searchParams.subjects[0] ||
            !searchParams.gradeLevels
        ) {
            res.status(400).send("Invalid subject or grade.");
        }

        if (!searchParams.catOnly && !searchParams.performanceOnly) {
            res.status(400).send("Invalid tech type.");
        }

        const gradeString = GradeLevel.gradeLevelToString(
            searchParams.gradeLevels
        );
        const subjectPromise = this.repo.getSubjectByCode(
            searchParams.subjects[0]
        );
        const pdfDataPromise = this.repo.getPdfDataByFilter(searchParams);

        Promise.all([subjectPromise, pdfDataPromise])
            .then(value => {
                const subjectString = value[0].label;
                const htmlString = HtmlRenderer.renderBody(
                    value[1],
                    subjectString,
                    gradeString,
                    titlePage,
                    showRubric
                );
                const title = `${gradeString} ${subjectString}`;
                res.type("application/pdf");
                PdfGenerator.generate(htmlString, title).pipe(res);
            })
            .catch(error => {
                console.error("/api/pdf:", error);
                res.sendStatus(500);
            });
    };

    getPdfById = (req: Express.Request, res: Express.Response) => {
        const ids = req.body.items;
        const assoc = (req.query.Assoc as string) || "false";
        const printAssoc = assoc.toLowerCase() === "true";
        const showRubric =
            ((req.query.ScoringInfo as string) || "true") === "true";

        if (ids.length > 0) {
            const requestedIds = ids.map(
                (id: ItemModel) => `${id.bankKey}-${id.itemKey}`
            );
            this.repo
                .getPdfDataByIds(requestedIds, printAssoc)
                .then(itemViews => {
                    const htmlString = HtmlRenderer.renderBody(
                        itemViews,
                        "",
                        "",
                        false,
                        showRubric
                    );
                    res.type("application/pdf");
                    PdfGenerator.generate(
                        htmlString,
                        "Custom Item Sequence"
                    ).pipe(res);
                })
                .catch(error => {
                    console.error("/api/pdf:", error);
                    res.sendStatus(500);
                });
        } else {
            res.sendStatus(400);
        }
    };

    getSubjects = (req: Express.Request, res: Express.Response) => {
        this.repo
            .getSubjects()
            .then(subjects => {
                res.type("application/json");
                res.send(JSON.stringify(subjects));
            })
            .catch(err => {
                console.error("/api/scoringGuideViewModel/:", err);
                res.sendStatus(500);
            });
    };

    search = (req: Express.Request, res: Express.Response) => {
        this.repo
            .getItemData()
            .then(searchResult => {
                res.type("application/json");
                res.send(JSON.stringify(searchResult));
            })
            .catch(err => {
                console.error("/api/search/:", err);
                res.sendStatus(500);
            });
    };

    getAboutItem = (req: Express.Request, res: Express.Response) => {
        const itemKey = Number(req.query.itemKey || 0) || 0;
        const bankKey = Number(req.query.bankKey || 0) || 0;

        this.repo
            .getAboutItem(itemKey, bankKey)
            .then(about => {
                if (about) {
                    res.type("application/json");
                    res.send(JSON.stringify(about));
                } else {
                    res.sendStatus(400);
                }
            })
            .catch(err => {
                console.error(`/api/aboutItem for ${bankKey}-${itemKey}:`, err);
                res.sendStatus(500);
            });
    };

    getFilterSearchModel = (req: Express.Request, res: Express.Response) => {
        this.repo
            .getFilterSearchModel()
            .then(model => {
                res.type("application/json");
                res.send(JSON.stringify(model));
            })
            .catch(err => {
                console.error("/api/filterSearchModel:", err);
                res.sendStatus(500);
            });
    };
}
