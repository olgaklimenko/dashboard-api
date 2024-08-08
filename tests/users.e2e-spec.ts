import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - user exist error', async () => {
		await request(application.app).post('/users/register').send({
			email: 'testuser@example.com',
			password: 'testpassword',
			name: 'Test User',
		});
		const res = await request(application.app).post('/users/register').send({
			email: 'testuser@example.com',
			password: 'testpassword',
			name: 'Test User',
		});
		expect(res.statusCode).toBe(422);
	});
	it('Login - success', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'testuser@example.com',
			password: 'testpassword',
		});
		expect(res.body.token).not.toBeUndefined();
	});
	it('Login - wrong password error', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'testuser@example.com',
			password: 'wrong',
		});
		expect(res.statusCode).toBe(401);
	});
	it('Info - success', async () => {
		const { body } = await request(application.app).post('/users/login').send({
			email: 'testuser@example.com',
			password: 'testpassword',
		});
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${body.token}`);
		expect(res.body.email).toEqual('testuser@example.com');
	});
});

afterAll(() => {
	application.close();
});
