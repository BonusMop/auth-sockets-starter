import express from 'express';
import { Controller } from './controller';

export class HomeController implements Controller {
    public router = express.Router();
    public path = '/';
    public requireAuthHeader = false;

    public initializeRoutes(): void {
        this.router.get(this.path, this.getIndex);
    }

    private getIndex(request: express.Request, response: express.Response) {
        response.send('home controller');
    }
}