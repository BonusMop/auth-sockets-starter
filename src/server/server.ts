import { App } from './app';
import { SocketApp } from './socketApp';
import { AuthController } from './controllers/auth';
import { HomeController } from './controllers/home';
import { TestController } from './controllers/test';
import { TestHander } from './handlers/test';

const app = new App(
    [
        new HomeController(),
        new AuthController(),
        new TestController(),
    ],
    3000);
app.listen();

const socketApp = new SocketApp(
    [
        new TestHander(),
    ],
    app.server);
socketApp.listen();