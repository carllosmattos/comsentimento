import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    protected readonly postRepository: Repository<Post>,
  ) { };

  async save(body: any) {
    return this.postRepository.save(body);
  };

  async update(id: string, options: any) {
    return this.postRepository.update(id, options);
  };

  async findOneBy(options: any) {
    return this.postRepository.findOneBy(
      { id: options.id }
    );
  };

  async find() {
    return this.postRepository.find();
  };

  async delete(options: any) {
    return this.postRepository.delete(options);
  }
}
