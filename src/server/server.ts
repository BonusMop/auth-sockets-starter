import { App } from './app';
import { AuthController } from './controllers/auth';
import { HomeController } from './controllers/home';

const app = new App(
    [
        new HomeController(),
        new AuthController(),
    ],
    3000);
    
app.listen();