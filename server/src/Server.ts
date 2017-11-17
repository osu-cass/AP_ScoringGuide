require('dotenv').config();

import * as path from 'path';
import * as Express from 'express';
import { APIRoute } from './routes/API';
import { ItemParser } from './ItemParser';

const {PORT} = process.env;

const app = Express();

//TODO: change to post and add body-parser
const apiRoute = new APIRoute();
app.use('/api', apiRoute.router);

app.get('/item', (req, res) => {
    const id = req.param('id', '') as string;
    const ip = new ItemParser();
    ip.loadPlainHtml(id)
        .then(item => res.send(item))
        .catch(err => res.status(500).send(err));
})

app.use(Express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
})

app.listen(PORT || 3000, () => {
  console.log('server started', PORT || 3000)
});
