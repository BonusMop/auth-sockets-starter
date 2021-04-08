import jwt from 'jsonwebtoken';
import request from 'supertest';

import { TestController } from './testController';
import { App } from '../app';
import { UserToken } from '../model/userToken';
import { Environment } from '../environment';

test('initializes routes', () => {
    // Arrange
    const controller = new TestController();
    const routes = controller.router.stack;

    // Act
    controller.initializeRoutes();

    // Assert
    expect(routes.length).toBe(1);
    expect(routes[0].route.path).toBe('/test');
});

test('GET /test', (done) => {
    // Arrange
    const controller = new TestController();
    const app = new App([controller], 0);
    const userToken = new UserToken(1, 'email', false);
    const accessToken = jwt.sign(userToken.token, Environment.ACCESS_TOKEN_SECRET);

    // Act
    const result = request(app.express)
        .get('/test')
        .auth(accessToken, { type: 'bearer' });

    // Assert
    result.expect(200, 'Welcome email', done);
});