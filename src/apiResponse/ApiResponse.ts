export class CustomApiResponse<T = any> {
    message: string;
    payload: T;
    token?: string;

    constructor(message: string, payload: T, token?: string) {
        this.message = message;
        this.payload = payload;
        this.token = token;
    }
}