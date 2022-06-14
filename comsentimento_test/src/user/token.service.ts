import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(Token)
        protected readonly tokenRepository: Repository<Token>,
    ) {}

    async save(body: any) {
        return this.tokenRepository.save(body);
    }

    async findOneBy(options: any) {
        return this.tokenRepository.findOneBy({ user_id: options.user_id });
    }

    async delete(options: any) {
        return this.tokenRepository.delete(options);
    }
}
