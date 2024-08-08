import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';

export interface IUserController {
	register: (req: Request, res: Response, next: NextFunction) => void;

	login: (req: Request, res: Response, next: NextFunction) => void;
	info: (req: Request, res: Response, next: NextFunction) => void;
}
