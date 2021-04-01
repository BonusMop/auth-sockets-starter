export class Environment {
    public static get ACCESS_TOKEN_SECRET(): string {
        return this.guaranteeDefined('ACCESS_TOKEN_SECRET');
    }

    public static get REFRESH_TOKEN_SECRET(): string {
        return this.guaranteeDefined('REFRESH_TOKEN_SECRET');
    }

    private static guaranteeDefined(key: string): string {
        const value = process.env[key];
        if (value === undefined) {
            throw `${key} is not defined` 
        }
        return value;
    }
}