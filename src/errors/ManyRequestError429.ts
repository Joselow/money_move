import { BaseError } from "./BaseError.js";

export class ManyRequestError429 extends BaseError {
    constructor(message: string = 'Demasiados intentos', errors: any = null) {
        super(message, 429, errors);
    }
}