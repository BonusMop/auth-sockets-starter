import { App } from './app';
import { HomeController } from './controllers/home';

const app = new App(
    [new HomeController()],
    3000);
    
app.listen();