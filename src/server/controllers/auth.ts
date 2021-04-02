import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

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
        this.router.post(this.path + '/refresh', passport.authenticate('jwt-refresh', {session: false}), this.refresh);
    }

    private login(request: express.Request, response: express.Response) {
        const userToken = new UserToken(1,'me@somewhere.com');
        const accessToken = jwt.sign(userToken.token, Environment.ACCESS_TOKEN_SECRET, { expiresIn: '30m'});
        const refreshToken = jwt.sign({user: userToken.email}, Environment.REFRESH_TOKEN_SECRET, { expiresIn: '1y'});
        response.json({accessToken, refreshToken});
    }

    private refresh(request: express.Request, response: express.Response) {
        const userToken = new UserToken(1,'me@somewhere.com');
        const accessToken = jwt.sign(userToken.token, Environment.ACCESS_TOKEN_SECRET, { expiresIn: '30m'});
        response.json({accessToken});
    }
}