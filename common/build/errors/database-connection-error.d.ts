import { CustomeError } from './custome-error';
export declare class DatabaseConnectionError extends CustomeError {
    statusCode: number;
    constructor();
    serializeErrors: () => {
        message: string;
    }[];
}
