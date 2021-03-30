interface JsonToken {
    id: number,
    email: string,
}

export class UserToken {
    constructor(public id: number, public email: string) {
    }

    public get token(): JsonToken { 
        return {
            id: this.id,
            email: this.email,
        }
    }
}