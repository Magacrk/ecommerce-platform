import { Request, Response, NextFunction } from 'express';
export declare class HttpError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default errorHandler;
