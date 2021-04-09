import jwt from 'jsonwebtoken';
import io from "socket.io-client";

import { SocketApp } from "../socketApp";
import { App } from "../app";
import { TestHander } from "./testHandler";
import { UserToken } from "../model/userToken";
import { Environment } from "../environment";

let clientSocket: SocketIOClient.Socket;
let socketApp: SocketApp;

beforeAll((done) => {
    const handler = new TestHander();
    const app = new App([], 1234);
    app.listen();
    socketApp = new SocketApp([handler], app.server)
    socketApp.listen();
    const userToken = new UserToken(1, 'email', false);

    const accessToken = jwt.sign(userToken.token, Environment.ACCESS_TOKEN_SECRET);
    clientSocket = io('http://localhost:1234', {
        auth: { token: accessToken }
    });
    clientSocket.on('connect', done);
});

afterAll(() => {
    socketApp.close();
    clientSocket.close();
});

test('test:whoami', (done) => {
    // Arrange
    // Act
    clientSocket.emit('test:whoami')

    // Assert
    clientSocket.on('test:youare', (arg: string) => {
        expect(arg).toBe('email');
        done()
    });
});