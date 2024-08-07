import { Container } from "inversify";
import { App } from "./app";
import { ExceptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./users/users.controller";
import { TYPES } from "./types";
import { ILogger } from "./logger/logger.interface";
import { IExceptionFilter } from "./errors/exeption.filter.interface";

const appContainer = new Container();
appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
appContainer.bind<UserController>(TYPES.UserController).to(UserController);
appContainer.bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
appContainer.bind<App>(TYPES.Application).to(App);
const app = appContainer.get<App>(TYPES.Application)
app.init();

export { app, appContainer };