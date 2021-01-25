import { UpperCaseInterceptor } from './uppercase.interceptor';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenPunkuInterceptor } from './token-punku.interceptor';
// import { HttpResponseInterceptor } from './http-response.interceptor';

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenPunkuInterceptor,
            multi: true,
          },
          {
            provide: HTTP_INTERCEPTORS,
            useClass: UpperCaseInterceptor,
            multi: true
          }
    ]
  })
  export class InteceptorsModule { }
