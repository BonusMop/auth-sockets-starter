import express from 'express';

import { IExpressController } from 'controllers/IExpressController';

export class App {
    private port: number;
    private app;

    constructor(controllers: IExpressController[], port: number) {
        this.port = port;
        this.app = express();
        this.initializeControllers(controllers);
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            return console.log(`server is listening on port ${this.port}`);
        });
    }

    private initializeControllers(controllers: IExpressController[]): void {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }

}