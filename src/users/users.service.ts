import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private _userRepo: Repository<UserEntity>,
  ) {}

  create(email: string, password: string) {
    const user = this._userRepo.create({ email, password });

    return this._userRepo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this._userRepo.findOneBy({ id });
  }

  find(email: string) {
    return this._userRepo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<UserEntity>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    Object.assign(user, attrs);

    return this._userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this._userRepo.remove(user);
  }
}
