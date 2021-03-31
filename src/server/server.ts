import { App } from './app';
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