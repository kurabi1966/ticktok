export declare abstract class CustomeError extends Error {
    abstract statusCode: number;
    constructor(message: string);
    abstract serializeErrors(): {
        message: string;
        field?: string;
    }[];
}
