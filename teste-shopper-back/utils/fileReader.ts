import {promises as fs} from 'fs';
import path from 'path';

interface FileReader {
    readFile: (file: string) => Promise<string>,
}

const fileReader: FileReader = {
    readFile: async (file: string) => {
        const filePath = path.join(__dirname, '../' + file);
        let result: string = '';
        try {
            const data = await fs.readFile(filePath, { encoding: 'utf-8' });
            result = data;
        } catch (err: any) {
            throw new Error(err);
        }
        return result;
    },
};

export {
    fileReader,
};
