import express from 'express';

export interface IExpressController {
    router: express.Router;
}
