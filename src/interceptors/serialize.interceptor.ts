import { 
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
 } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs";

export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        console.log('Running before the handler', context);
        return handler.handle().pipe(
            map((data:any) =>{
                console.log('Running before sending the response', data);
            })
        );
    }
}
