import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestExceptionAuth extends HttpException {
    constructor() {
        super('Inavlid credencials', HttpStatus.BAD_REQUEST);
    }
};

export class Unauthorized extends HttpException {
    constructor() {
        super('You are not authorized to access this feature', HttpStatus.UNAUTHORIZED);
    }
}
