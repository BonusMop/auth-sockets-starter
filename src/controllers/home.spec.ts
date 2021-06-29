import request from 'supertest';

import { HomeController } from "./home";
import { App } from '../app';

test('initializes routes', () => {
    // Arrange
    const controller = new HomeController();
    const routes = controller.router.stack;

    // Act
    controller.initializeRoutes();

    // Assert
    expect(routes.length).toBe(1);
    expect(routes[0].route.path).toBe('/');
});

test ('GET /', (done) => {
    // Arrange
    const controller = new HomeController();
    const app = new App([controller], 0);

    // Act
    const result = request(app.express)
        .get('/');

    // Assert
    result.expect(200, 'home controller', done);
});