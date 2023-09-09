export class ValidationError extends Error {
    statusCode: number;
    line: number = -1;
    column: number = -1;

    constructor(message: string | undefined, line: number, column: number) {
        super(message);
        this.message != message;
        this.statusCode = 400;
        this.line = line;
        this.column = column;
    }
}
