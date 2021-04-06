import ioserver, { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import http from 'http';

import { UserToken } from 'model/userToken';
import { Environment } from './environment';

interface IncomingAuthenticatedMessage extends http.IncomingMessage {
    user: UserToken;
}

export class SocketApp {
    private io: Server;

    constructor(server: http.Server) {
        this.io = new ioserver.Server(server);
        console.log('socket.io is listening');

        this.io.use( (socket, next) => {
            if (!socket.handshake.auth || !socket.handshake.auth.token) {
                next(new Error('not authorized'));
                return;
            }
            
            const token = socket.handshake.auth.token;
            try {
                const decoded = jwt.verify(token, Environment.ACCESS_TOKEN_SECRET);
                (socket.request as IncomingAuthenticatedMessage).user = decoded as UserToken;
                next();
            } catch (error) {
                next (error);
            }
        });

        this.io.on('connect', (socket) => {
            const user = (socket.request as IncomingAuthenticatedMessage).user;
            if (!user) {
                socket.disconnect(true);
            }
            console.log(`user ${user?.email} connected to socket ${socket.id}`);
        })

    }
}