import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './users.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const salt = this.configService.get('SALT');
		const newUser = new User(email, name);
		await newUser.setPassword(password, Number(salt));
		return newUser;
	}

	async validateUser(userLoginDto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
