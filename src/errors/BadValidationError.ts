import { BaseError } from "./BaseError.js";

export class BadValidationError500 extends BaseError {
    constructor(message: string = 'Error due to poor system validation', errors: any = null) {
        super(message, 500, errors);
    }
}