import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { error } from "console";
import { Response } from "express";
import { stat } from "fs";

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus()  


        
        if(exception instanceof BadRequestException){
            const responseBody= exception.getResponse()

            if(typeof responseBody === 'object' && 'message' in responseBody){
                return response.status(status).json({
                    error: exception.name || 'Validation Error',
                    message: responseBody.message,
                    statusCode: status                    
                })
            }
        }
        response.status(status).json({
            error: `${exception.name}` || 'Error',
            message: exception.message || 'An exception error occured',
            statusCode: status
        })
    }
}