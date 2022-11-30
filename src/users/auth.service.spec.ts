import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: UserEntity[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((x) => x.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as UserEntity;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with a salted and hashed password', async () => {
    const user = service.signup('test@inter.net', 'mypassword');

    expect((await user).password).not.toEqual('mypassword');
    const [salt, hash] = (await user).password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: '1', password: '1' } as UserEntity]);

    await expect(
      service.signup('test@inter.net', 'mypassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if sign in is called with an unused email', async () => {
    await expect(service.signin('1@1.com', '1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'test@inter.net', password: '1' } as UserEntity,
      ]);

    await expect(service.signin('test@inter.net', '2')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('test@inter.net', '1');

    const user = await service.signin('test@inter.net', '1');
    expect(user).toBeDefined();
  });
});
