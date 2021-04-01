import express from 'express';
import jwt from 'jsonwebtoken';
import { Controller } from './controller';
import { UserToken } from '../model/userToken';
import { Environment } from '../environment';

export class AuthController implements Controller {
    public router = express.Router();
    public path = '/auth';
    public requireAuthHeader = false;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/login', this.login);
    }

    private login(request: express.Request, response: express.Response) {
        const userToken = new UserToken(1,'me@somewhere.com');
        const signedToken = jwt.sign(userToken.token, Environment.ACCESS_TOKEN_SECRET);
        response.json({signedToken});
    }
}