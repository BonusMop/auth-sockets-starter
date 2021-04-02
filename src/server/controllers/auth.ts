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

    // TODO: Track this in a data store. This stub will provide some data in order to get started.
    private inMemoryRefreshTokens = [];
    private users = [
        {
            id: 1,
            name: 'A User',
            email: 'me@somewhere.com',
        }      
    ];

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/login', this.login.bind(this));
        this.router.post(this.path + '/refresh', passport.authenticate('jwt-refresh', {session: false}), this.refresh.bind(this));
    }

    private login(request: express.Request, response: express.Response) {
        const userToken = this.userRecordToToken(this.users[0]); // TODO: Log in the first, fake user for development.
        const accessToken = jwt.sign(userToken.token, Environment.ACCESS_TOKEN_SECRET, { expiresIn: '30m'});
        const refreshToken = jwt.sign({user: userToken.id}, Environment.REFRESH_TOKEN_SECRET, { expiresIn: '1y'});
        response.json({accessToken, refreshToken});
    }

    private refresh(request: express.Request, response: express.Response) {
        const user = this.users.find(u => u.id === (request.user as {user: number}).user);
        if (!user) {
            response.status(401);
            return;
        }
        console.log(`received access token refresh request for ${user.name}`);
        const userToken = this.userRecordToToken(user);
        const accessToken = jwt.sign(userToken.token, Environment.ACCESS_TOKEN_SECRET, { expiresIn: '30m'});
        response.json({accessToken});
    }

    private userRecordToToken(user: {id: number, name: string, email: string}) {
        return new UserToken(user.id, user.email);
    }
}