import ioserver from 'socket.io';
import { UserToken } from 'model/userToken';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export class SocketHandler {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected listeners: { [eventName: string]: any } = {};
    protected io: ioserver.Server<DefaultEventsMap, DefaultEventsMap> | undefined;
    protected socket: ioserver.Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
    protected user: UserToken | undefined;

    public register(io: ioserver.Server<DefaultEventsMap, DefaultEventsMap>, socket: ioserver.Socket<DefaultEventsMap, DefaultEventsMap>, user: UserToken): void {
        this.io = io;
        this.socket = socket;
        this.user = user;
        Object.entries(this.listeners).forEach(([eventName, listener]) => socket.on(eventName, listener));
    }
}