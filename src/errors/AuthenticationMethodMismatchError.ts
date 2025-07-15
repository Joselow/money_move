import { BaseError } from "./BaseError.js";

export class AuthenticationMethodMismatchError extends BaseError {
    constructor(message: string = 'You are already registered using a different authentication method', errors: any = null) {
        super(message, 401, errors);
    }
}