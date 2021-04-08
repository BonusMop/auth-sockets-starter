import jwt from 'jsonwebtoken';
import request from 'supertest';

import { AuthController } from "./auth";
import { App } from '../app';
import { UserToken } from '../model/userToken';
import { Environment } from '../environment';

test('initializes routes', () => {
    // Arrange
    const controller = new AuthController();
    const routes = controller.router.stack;

    // Act
    controller.initializeRoutes();

    // Assert
    expect(routes.length).toBe(3);
    expect(routes[0].route.path).toContain('/auth');
});

test('POST /auth/login', (done) => {
    // Arrange
    const controller = new AuthController();
    const app = new App([controller], 0);

    // Act
    const result = request(app.express)
        .post('/auth/login');

    // Assert
    result
    .expect( (response) => expect(response.body.accessToken).toBeDefined() )
    .expect( (response) => expect(response.body.refreshToken).toBeDefined() )
    .expect(200, done);
});

test('POST /auth/refresh requires auth', (done) => {
    // Arrange
    const controller = new AuthController();
    const app = new App([controller], 0);

    // Act
    const result = request(app.express)
        .post('/auth/refresh');

    // Assert
    result
    .expect(401, done);
});

test('POST /auth/refresh needs refresh token', (done) => {
    // Arrange
    const controller = new AuthController();
    const app = new App([controller], 0);
    const userToken = new UserToken(1, 'email', false);
    const accessToken = jwt.sign(userToken.token, Environment.ACCESS_TOKEN_SECRET);


    // Act
    const result = request(app.express)
        .post('/auth/refresh')
        .auth(accessToken, { type: 'bearer' });

    // Assert
    result
    .expect(401, done);
});

test('POST /auth/refresh', (done) => {
    // Arrange
    const controller = new AuthController();
    const app = new App([controller], 0);
    const refreshToken = jwt.sign({ user: 1 }, Environment.REFRESH_TOKEN_SECRET);

     // Act
    const result = request(app.express)
        .post('/auth/refresh')
        .auth(refreshToken, { type: 'bearer' });
    
    // Assert
    result
      .expect( (response) => expect(response.body.accessToken).toBeDefined() )
      .expect(200, done);
});

test('GET /auth/tokens/:userId must be admin', (done) => {
    // Arrange
    const controller = new AuthController();
    const app = new App([controller], 0);
    const userToken = new UserToken(1, 'email', false);
    const accessToken = jwt.sign(userToken.token, Environment.ACCESS_TOKEN_SECRET);

     // Act
    request(app.express).post('/auth/login').then(() => {
        const result = request(app.express)
            .get('/auth/tokens/1')
            .auth(accessToken, { type: 'bearer' });

        // Assert
        result
        .expect(401, done);
    }); 
});

test('GET /auth/tokens/:userId', (done) => {
    // Arrange
    const controller = new AuthController();
    const app = new App([controller], 0);
    const userToken = new UserToken(1, 'email', true);
    const accessToken = jwt.sign(userToken.token, Environment.ACCESS_TOKEN_SECRET);

     // Act
    request(app.express).post('/auth/login').then(() => {
        const result = request(app.express)
            .get('/auth/tokens/1')
            .auth(accessToken, { type: 'bearer' });

        // Assert
        result
        .expect( (response) => expect(response.body.length).toBe(1))
        .expect(200, done);
    }); 
});