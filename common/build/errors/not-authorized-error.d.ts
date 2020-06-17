import { CustomeError } from './custome-error';
export declare class NotAuthorizedError extends CustomeError {
    statusCode: number;
    constructor();
    serializeErrors: () => {
        message: string;
    }[];
}
