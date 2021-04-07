import ioserver from 'socket.io';
import jwt from 'jsonwebtoken';
import http from 'http';

import { UserToken } from 'model/userToken';
import { Environment } from './environment';
import { SocketHandler } from 'handlers/socketHandler';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface IncomingAuthenticatedMessage extends http.IncomingMessage {
    user: UserToken;
}

export class SocketApp {
    constructor(private handlers: SocketHandler[], private server: http.Server) {
    }

    public listen(): void {
        const io = new ioserver.Server(this.server);
        this.initializeAuthentication(io);
        console.log('socket.io is listening');

        io.on('connect', (socket) => {
            const user = (socket.request as IncomingAuthenticatedMessage).user;
            if (!user) {
                socket.disconnect(true);
            }
            this.handlers.forEach(h => h.register(io, socket, user));
            console.log(`user ${user?.email} connected to socket ${socket.id}`);
        })
    }

    private initializeAuthentication(io: ioserver.Server<DefaultEventsMap, DefaultEventsMap>) {
        io.use( (socket, next) => {
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
    }
}