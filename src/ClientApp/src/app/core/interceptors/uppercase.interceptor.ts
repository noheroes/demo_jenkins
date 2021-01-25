import { Injectable } from '@angular/core';
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class UpperCaseInterceptor implements HttpInterceptor {
  constructor(private store: Store) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const request = this.checkBodyString(req);

    return next.handle(request);
  }

  checkBodyString = (req: HttpRequest<any>): HttpRequest<any> => {
    //console.log('CAYL interceptor', req);
    const body = req.body;
    req = this.setUpper(req, body);
    return req;
  }


  private setUpper = (req: HttpRequest<any>,body:Object)=>{
      //console.log('CAYL Interceptor BODY', body);
      if(body === undefined || body === null || Object.keys(body).length === 0) {
      //console.log('CAYL intercaptor body clear');
      return req;
      }

      body = this.transformUpper(body);

      return req.clone({
      body: body
      })
  }

  transformUpper=(obj:Object)=>{
    //console.log('CAYL interceptor transformUpper',obj);
    for (const property in obj)
    {
      //console.log(`CAYL interceptor properties ${property}: ${obj[property]}`);
      let valor = obj[property];

      if(valor === null) {
        //console.log('CAYL interceptor property is null');
        continue
      };
      
      if(typeof valor === 'object' && valor !== null) this.transformUpper(valor);

      if(typeof valor==="string") {
        obj[property] = valor.toUpperCase();
        //console.log('CAYL interceptor property STRING!', obj[property]);
      }
    }
    return obj;
  }

}
