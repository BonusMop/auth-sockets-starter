import express from 'express';
import { UserToken } from 'model/userToken';
import { Controller } from './controller';

export class TestController implements Controller {
    public router = express.Router();
    public path = '/test';
    public requireAuthHeader = true;

    public initializeRoutes(): void {
        this.router.get(this.path, this.getTest);
    }

    private getTest(request: express.Request, response: express.Response) {
        response.send(`Welcome ${(request.user as UserToken).email}`);
    }
}