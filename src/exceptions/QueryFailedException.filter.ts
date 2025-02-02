import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(TypeOrmExceptionFilter.name);

    catch(exception: QueryFailedError & { code?: string, detail?: string }, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        // Determine error details
        const errorCode = exception.code || 'UNKNOWN_DB_ERROR';
        const errorMessage = this.getErrorMessage(errorCode, exception);

        // Log the full error for server-side tracking
        this.logger.error(`Database Error: ${errorMessage}`, exception.stack);

        // Structured error response
        response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Database Error',
            message: errorMessage,
            errorCode: errorCode
        });
    }

    private getErrorMessage(code: string, exception: any): string {
        switch (code) {
            case '22P02': // Invalid input for enum
                return this.handleEnumError(exception);
            case '23505': // Unique constraint violation
                return 'Duplicate entry. This record already exists.';
            case '23503': // Foreign key constraint
                return 'Cannot perform operation due to related records.';
            default:
                return exception.message || 'An unexpected database error occurred';
        }
    }

    private handleEnumError(exception: any): string {
        // Extract enum type and invalid value from the error message
        const matches = exception.message.match(/invalid input value for enum (\w+): "([^"]+)"/);

        if (matches) {
            const [, enumType, invalidValue] = matches;
            return `Invalid value "${invalidValue}" for enum ${enumType}. Please provide a valid enum value.`;
        }

        return 'Invalid enum value provided';
    }
}
