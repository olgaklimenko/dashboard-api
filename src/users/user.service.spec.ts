import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';
import { UserService } from './users.service';
import { TYPES } from '../types';
import { UserModel } from '@prisma/client';
import { User } from './user.entity';
import { UserLoginDto } from './dto/user-login.dto';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.IUserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.IUsersRepository).toConstantValue(UsersRepositoryMock);

	usersService = container.get<IUserService>(TYPES.IUserService);
	configService = container.get<IConfigService>(TYPES.IConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.IUsersRepository);
});

let createdUser: UserModel | null;

describe('User service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('salt');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'example@example.com',
			name: 'TestUser',
			password: 'qwerty',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('qwerty');
	});

	it('validateUser - success', async () => {
		configService.get = jest.fn().mockReturnValueOnce('salt');
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const userLoginDto: UserLoginDto = {
			email: 'example@example.com',
			password: 'qwerty',
		};
		const validatedUser = await usersService.validateUser(userLoginDto);
		expect(validatedUser).toEqual(true);
	});
	it('validateUser - wrong password', async () => {
		configService.get = jest.fn().mockReturnValueOnce('salt');
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const userLoginDto: UserLoginDto = {
			email: 'example@example.com',
			password: 'wrong',
		};
		const validatedUser = await usersService.validateUser(userLoginDto);
		expect(validatedUser).toEqual(false);
	});
	it('validateUser - user not found', async () => {
		configService.get = jest.fn().mockReturnValueOnce('salt');
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const userLoginDto: UserLoginDto = {
			email: 'example@example.com',
			password: 'qwerty',
		};
		const validatedUser = await usersService.validateUser(userLoginDto);
		expect(validatedUser).toEqual(false);
	});
});
