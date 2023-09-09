import express, { Express, Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import packsRouter from './routes/pack';
import productsRouter from './routes/product';
import validationRouter from './routes/validation';
import { parseCsv } from './utils/parser';
import { fileReader } from './utils/fileReader';
import { ProductUpdate } from './types/productUpdate';
import { validatePackageSalesPriceIsSumOfItsComponentsProductUpdate } from './utils/validation';
import { ValidationError } from './exceptions/validationError';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get('/', async (_, res: Response) => {
    let list;
    try {
        //No Error
        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_certo.csv');
        console.log({csv});
        list: ProductUpdate[] = parseCsv(csv);
        console.log({list}); */

        // Value Formatting Error
        
        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_formato_valor_errado_1.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list}); */

        // Header Formatting Error
        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_campo_faltando_1.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list}); */


        // Invalid Record Length
        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_campo_faltando_2.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list}); */

        // Header Formatting Error

        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_campo_faltando_3.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list}); */

        // Campo Faltando

        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_campo_faltando_4.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list}); */

        // Header Formatting Error
        const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_header_errado_1.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list});
        
        // Header Formatting Error
        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_header_errado_2.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list}); */
        
        // Pacote s/ component
        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_pacote_faltando_componente.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list}); */

        // componente s/ container
        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_componente_faltando_container.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list}); */

        // Pacote c/ componentes soma errada
        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_pacote_com_componentes_soma_errada.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list}); */
        
        // Pacote c/ componentes soma certa
        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_pacote_com_componentes_soma_certa.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list}); */
        
        // Pacote c/ componentes soma certa 2
        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_pacote_com_componentes_soma_certa_2.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list}); */
        
        // Pacote c/ componentes soma certa 2 invertido
        /* const csv = await fileReader.readFile('testes csvs/atualizacao_preco_exemplo_pacote_com_componentes_soma_certa_2_invertido.csv');
        console.log({csv});
        list = parseCsv(csv);
        console.log({list}); */
    } catch (err) {
        return res.status(400).json({ list });
    }
    
    console.log({isValidAtSums: await validatePackageSalesPriceIsSumOfItsComponentsProductUpdate(list)});
    res.status(200).json({ list });
});
app.use('/products', productsRouter);
app.use('/packs', packsRouter);
app.use('/file', validationRouter);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log({err});
    res.status(400).json({err: new ValidationError(err.message, err.line, err.column)});
};
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('App started on port ' + port);
});
