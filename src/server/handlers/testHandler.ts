import { SocketHandler } from "./socketHandler";

export class TestHander extends SocketHandler {
    constructor() {
        super();

        this.sendName = this.sendName.bind(this);
        this.listeners = { 
            'test:whoami': this.sendName,
        };
    }

    private sendName() {
        console.log('user forgot their own name');
        this.socket?.emit('test:youare', this.user?.email)
    }
}