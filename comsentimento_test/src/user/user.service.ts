import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        protected readonly userRepository: Repository<User>,
    ) {};

    async save(body: any) {
        return this.userRepository.save(body);
    };

    async findOneBy(options: any) {
        if(options.id) {
            return this.userRepository.findOneBy({ id: options.id });
        }
        return this.userRepository.findOneBy({ email: options.email });
    };

    async find() {
      return this.userRepository.find();
    };

    async update(id: string, options: any) {
        return this.userRepository.update(id, options);
    };
}
