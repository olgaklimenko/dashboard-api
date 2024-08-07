import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { ExceptionFilter } from "./errors/exeption.filter";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./users/users.controller";
import { TYPES } from "./types";
import { ILogger } from "./logger/logger.interface";
import { IExceptionFilter } from "./errors/exeption.filter.interface";
import { IUserController } from "./users/users.controller.interface";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService);
    bind<IUserController>(TYPES.IUserController).to(UserController);
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
    bind<App>(TYPES.Application).to(App);
});

function bootstrap() {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application)
    app.init();
    return { appContainer, app };
}

export const { app, appContainer } = bootstrap();