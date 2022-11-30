import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private _usesrService: UsersService) {}

  async signup(email: string, password: string) {
    const [user] = await this._usesrService.find(email);

    if (!!user) {
      throw new BadRequestException('Email already in use!');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const newUser = this._usesrService.create(email, result);

    return newUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this._usesrService.find(email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password!');
    }

    return user;
  }
}
