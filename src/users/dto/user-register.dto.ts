import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Bad email' })
	email: string;

	@IsString()
	password: string;

	@IsString()
	name: string;
}
