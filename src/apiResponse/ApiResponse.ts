export class CustomApiResponse<T=any>{
    message: string;
    entity: T;
    token?:string;

    constructor(message:string, entity:T, token?: string){
        this.message = message;
        this.entity = entity;
        this.token = token;
    }
}