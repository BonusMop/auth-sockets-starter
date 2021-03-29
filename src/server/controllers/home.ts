import express from 'express';
import { IExpressController } from './IExpressController';

export class HomeController implements IExpressController {
    public router = express.Router();
    public path = '/';

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getIndex);
    }

    private getIndex(request: express.Request, response: express.Response) {
        response.send('home controller');
    }
}