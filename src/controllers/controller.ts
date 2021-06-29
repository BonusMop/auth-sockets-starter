import express from 'express';

export interface Controller {
    router: express.Router;
    requireAuthHeader: boolean;

    initializeRoutes(): void;
}
