export class ValidationError extends Error {
    statusCode: number;
    line: number = -1;
    column: number = -1;
    info: string;

    constructor(info: string, line: number, column: number, message?: string) {
        super(message);
        this.info = info;
        this.statusCode = 400;
        this.line = line;
        this.column = column;
    }
}
