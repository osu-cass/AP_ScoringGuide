import * as Express from 'express';
import * as Path from 'path';
import pdfRoute from './routes/pdf';

const port = process.env.PORT || 3000;
const app = Express();
app.use(Express.static(Path.join(__dirname, 'public')));
app.post('/pdf', pdfRoute);
app.listen(port, () => console.log('Server started on port ', port));
