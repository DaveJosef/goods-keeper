import { parse } from 'csv-parse/sync';
import { getValidator, isNumber, validateSnakeCase } from './validation';
import { ProductUpdate } from '../types/productUpdate';
import { ValidationError } from '../exceptions/validationError';

const columnTypes: ('number' | 'array')[] = ['number', 'number'];

const parseCsv: ((csv: string) => ProductUpdate[]) = (csv: string) => {
      /* 
  const parser = parse({
    bom: true,
    delimiter: ',',
    columns: true,
    comment: '#',
    comment_no_infix: true,
    from: 1,
    cast: (value, context) => {
      if (context.header) {
        if (!validateSnakeCase(value)) throw new ValidationError('Header Formating Error', context.lines, context.index);
        return value;
      }
      const validate = getValidator(columnTypes[context.index]);
      console.log('index', context.index);
      if (!validate(value as any)) {
        throw new ValidationError('Value Formating Error', context.lines, context.index);
      }
      return Number(value);
    },
  });

  const records: ProductUpdate[] = [];

  parser.on('readable', function(){
    let record;
    while ((record = parser.read()) !== null) {
      records.push(record);
    }
  });

  parser.on('error', function(err){
    //throw new ValidationError(err.message, -1, -1);
    console.log({err})
    //return new ValidationError(err.message, -1, -1);
    throw err;
  });

  parser.on('end', function(){
    console.log({ records });
  });

  parser.write(csv);
  parser.end();

  return records;
 */try {
    const records = parse(csv, {
      bom: true,
      delimiter: ',',
      columns: true,
      comment: '#',
      comment_no_infix: true,
      from: 1,
      cast: (value, context) => {
        if (context.header) {
          if (!validateSnakeCase(value)) throw new ValidationError('Header Formating Error', context.lines - 1, context.index);
          return value;
        }
        const validate = getValidator(columnTypes[context.index]);
        console.log('index', context.index);
        if (!validate(value as any)) {
          throw new ValidationError('Value Formating Error', context.lines - 1, context.index);
        }
        return Number(value);
      },
    });
    return records;
  } catch (err: any) {
    if (err.code === "CSV_RECORD_INCONSISTENT_COLUMNS") {
      console.log({err})
      throw new ValidationError('Inconsistent Columns', 0, err.index - 1);
    }
    throw err;
  }
}

export {
  parseCsv,
};
