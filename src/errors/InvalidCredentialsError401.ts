import { BaseError } from "./BaseError.js";

export class InvalidCredentialsError401 extends BaseError {
    constructor(message: string = 'Invalid Credentials', errors: any = null) {
        super(message, 401, errors);
    }
}