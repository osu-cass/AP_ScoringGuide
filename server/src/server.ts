import * as Express from 'express';
import * as Path from 'path';
import pdfRoute from './routes/Pdf';
import { ItemParser } from './ItemParser';

const port = process.env.PORT || 3000;
const app = Express();
app.use(Express.static(Path.join(__dirname, '../../client/dist')));

//TODO: change to post and add body-parser
app.get('/pdf', pdfRoute);
app.get('/ScoringGuide', (req, res) => {
    res.sendFile(Path.join(__dirname, '../../client/dist/index.html'));
});
app.get('/item', (req, res) => {
    const id = req.param('id', '') as string;
    const ip = new ItemParser()
    ip.loadPlainHtml(id)
        .then(item => res.send(item))
        .catch(err => res.status(500).send(err));
    
})

app.listen(port, () => console.log('Server started on port ', port));
