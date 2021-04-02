interface JsonToken {
    id: number,
    email: string,
    admin: boolean,
}

export class UserToken {
    constructor(public id: number, public email: string, public admin: boolean) {
    }

    public get token(): JsonToken { 
        return {
            id: this.id,
            email: this.email,
            admin: this.admin,
        }
    }
}