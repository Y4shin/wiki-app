import express, {Express} from 'express';
const port = process.env.PORT || 3001;

const app: Express = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => console.log(`Listening on port ${port}`));