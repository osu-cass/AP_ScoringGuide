// tslint:disable-next-line: no-require-imports no-var-requires
require("dotenv").config();

import * as path from "path";
import * as Express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import { loggerApi } from "./Logger";
import { APIRoute } from "./routes/API";
import { ItemParser } from "./ItemParser";
import { itemViewCall } from "./ScoreGuideApiCalls";

const { PORT } = process.env;

/**
 * The ScoreGuideApp encapsulates an Express Application for the Scoring Guide
 * Server routes, configuration, and initialization is here.
 * @member {port: string} the port number that the server will listen on
 * @member {app: Express.Application} the Express.Application
 * @member {router: APIRouter} routes to the pdf api
 * @class ScoreGuideServer
 */
export class ScoreGuideApp {
    port: string;
    app: Express.Application;
    router: APIRoute;

    constructor() {
        this.port = PORT || "3000";
        this.app = Express();
        this.router = new APIRoute();
        this.config();
        this.routes();
    }

    config() {
        this.app.use(loggerApi("tiny"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(Express.static(path.join(__dirname, "..", "public")));
    }

    routes() {
        this.app.use("/api", this.router.routes);
        this.app.get("/item", (req, res) => {
            const id = req.param("id", "") as string;
            const itemParser = new ItemParser(itemViewCall);
            itemParser.loadPlainHtml(id)
                .then(item => res.send(item))
                .catch(err => res.status(500).send(err));
        });
        this.app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, "..", "public", "index.html"));
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            // tslint:disable-next-line: no-console
            console.log(`server started ${this.port}`);
        });
    }
}
