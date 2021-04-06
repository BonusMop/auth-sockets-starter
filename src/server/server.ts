import { App } from './app';
import { SocketApp } from './socketApp';
import { AuthController } from './controllers/auth';
import { HomeController } from './controllers/home';
import { TestController } from './controllers/test';

const app = new App(
    [
        new HomeController(),
        new AuthController(),
        new TestController(),
    ],
    3000);
app.listen();

new SocketApp(app.server);