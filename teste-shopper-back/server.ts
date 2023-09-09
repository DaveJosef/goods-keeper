import express, { Express, ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import packsRouter from './routes/pack';
import productsRouter from './routes/product';
import validationRouter from './routes/validation';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/products', productsRouter);
app.use('/packs', packsRouter);
app.use('/file', validationRouter);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    //console.log({err});
    res.status(400).json({err});
};
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('App started on port ' + port);
});
