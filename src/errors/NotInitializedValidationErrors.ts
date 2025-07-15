import { BaseError } from "./BaseError.js";

export class NotInitializedValidationErrors extends BaseError {
    constructor(message: string = 'You have not initialized tha validation errors map', errors: any = null) {
        super(message, 500, errors);
    }
}