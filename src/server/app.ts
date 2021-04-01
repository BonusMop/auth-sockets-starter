import express from 'express';
import passport from 'passport';
import { Strategy as StrategyJwt, ExtractJwt, StrategyOptions } from 'passport-jwt';

import { Controller } from 'controllers/controller';
import { UserToken } from 'model/userToken';
import { Environment } from './environment';

export class App {
    private port: number;
    private app;

    constructor(controllers: Controller[], port: number) {
        this.port = port;
        this.app = express();
        this.initializeAuthentication();
        this.initializeControllers(controllers);
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            return console.log(`server is listening on port ${this.port}`);
        });
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach(controller => {
            if (controller.requireAuthHeader) {
                this.app.use('/', passport.authenticate('jwt', {session: false}), controller.router);
            } else {
                this.app.use('/', controller.router);
            }
        });
    }

    private initializeAuthentication() {
        const jwtOptions: StrategyOptions = {
            secretOrKey: Environment.ACCESS_TOKEN_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        };

        passport.use(new StrategyJwt(jwtOptions, (payload: UserToken, done) => {
            return done(null, payload);
        }))
    }

}