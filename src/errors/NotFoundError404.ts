import { BaseError } from "./BaseError.js";

export class NotFoundError404 extends BaseError {
    constructor(message: string = 'Not found', errors: any = null) {
        super(message, 404, errors);
    }
}