import express, {Express} from 'express';
import bodyParser from 'body-parser';
const port = process.env.PORT || 3001;
import routes from './src/routes';

const app: Express = express();

app.use(bodyParser.json());

app.use('/', routes);

app.listen(port, () => console.log(`Listening on port ${port}`));