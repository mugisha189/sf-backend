import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants/constants";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        // Check if jwtToken is provided
        if(!token){
            throw new UnauthorizedException("No jwtToken provided")
        }



        try {

            // Obtain the payload from the jwtToken
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            )


            // Pass the payload the request as 'user'
            request['user'] = payload
        } catch (error) {
            if(error instanceof UnauthorizedException){
                throw new UnauthorizedException(error.message)
            }
            throw new BadRequestException(error.message)
        }
 
        return true
    }

    private extractTokenFromHeader(request: Request):string |undefined{
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }

}