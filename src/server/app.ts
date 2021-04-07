import express from 'express';
import passport from 'passport';
import { Strategy as StrategyJwt, ExtractJwt, StrategyOptions } from 'passport-jwt';
import http from 'http';

import { Controller } from 'controllers/controller';
import { Environment } from './environment';

export class App {
    private app;
    public server;

    constructor(controllers: Controller[], private port: number) {
        this.port = port;
        this.app = express();
        this.initializeAuthentication();
        this.server = http.createServer(this.app);
        this.initializeControllers(controllers);
    }

    public listen(): void {
        this.server.listen(this.port, () => console.log(`server is listening on port ${this.port}`));
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach(controller => {
            if (controller.requireAuthHeader) {
                this.app.use('/', passport.authenticate('jwt-access', {session: false}), controller.router);
            } else {
                this.app.use('/', controller.router);
            }
        });
    }
    
    private initializeAuthentication() {
        this.initializeJwt('jwt-access', Environment.ACCESS_TOKEN_SECRET);
        this.initializeJwt('jwt-refresh', Environment.REFRESH_TOKEN_SECRET);
    }

    private initializeJwt(strategyName: string, secret: string) {
        const jwtOptions: StrategyOptions = {
            secretOrKey: secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        };

        passport.use(strategyName, new StrategyJwt(jwtOptions, (payload, done) => {
            return done(null, payload);
        }))
    }

}