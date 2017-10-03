import * as Express from 'express';
import * as Path from 'path';
import { APIRoute } from './routes/API';
import { ItemParser } from './ItemParser';
import { getConfig } from "./Config";
import * as BodyParser from 'body-parser';

const port = getConfig().port;
const apiRoute = new APIRoute();
const app = Express();
app.use(Express.static(Path.join(__dirname, '../../../../client/dist')));
app.use(BodyParser.urlencoded({
    extended: true,
    limit: '1mb'
}));
app.use(BodyParser.json({
    limit: '1mb'
}));

//TODO: change to post and add body-parser
app.use('/api', apiRoute.router);
app.get('/ScoringGuide', (req, res) => {
    res.sendFile(Path.join(__dirname, '../../../../client/dist/index.html'));
});
app.get('/item', (req, res) => {
    const id = req.param('id', '') as string;
    const ip = new ItemParser();
    ip.loadPlainHtml(id)
        .then(item => res.send(item))
        .catch(err => res.status(500).send(err));
    
})

app.listen(port, () => console.log('Server started on port', port));
