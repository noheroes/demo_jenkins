import { PUNKU_ACTIONS } from './../enums/punku-actions.enum';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAppUser, IServerConfig, IAppSession } from '../store/app.state.interface';
import { buildPunkuHeaders } from '../functions/http-punku-headers';
import { Store, Select } from '@ngxs/store';
import { AppGlobalConfigState } from '../state/app-global-config.state';
import { AppSessionState } from '../state/app-session.state';

// HEADERS DE PRUEBA PARA EL GESTOR DE ARCHIVOS
const FAKE_HEADERS = [
  { name: 'Authorization', value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkX3VzdWFyaW8iOiIwZGI2YTk5Ny0yMjhlLTRhMTMtYjE3OS1hNDgyMzRlMTdlMjEiLCJndWlkX3Nlc2lvbiI6ImEyYzYwMmE5LTU2ZmMtNGM4Ni05NjRjLWUyY2E1ZGRiMTA4NSIsIm5iZiI6MTU4Mjg0NTc2NywiZXhwIjoxNTgyODc0NTY3LCJpYXQiOjE1ODI4NDU3NjcsImlzcyI6Imh0dHBzOi8vMTAwLjEwLjEwMC4xNDEiLCJhdWQiOiJodHRwczovLzEwMC4xMC4xMDAuMTQxIn0.PXUzPf0m0-GIb_D-lAKejpEYfN0ORzdn49OOBslbLI4' },
  { name: 'guid_rol', value: 'fb56aa54-c4f1-49bc-a89a-9adf856585f0' },
  { name: 'codigo_accion', value: 'CON' },
  { name: 'guid_menu', value: 'dc97a402-3cdf-4cc2-b98c-69a18b04eb03' },
];


@Injectable({
  providedIn: 'root'
})
export class TokenPunkuInterceptor implements HttpInterceptor {
  constructor(private store: Store) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const request = this.addHeadersPunku(req);

    return next.handle(request);
  }

  addHeadersPunku = (req: HttpRequest<any>): HttpRequest<any> => {
    const session = this.store.selectSnapshot<IAppSession>(state => state.appStore.session);
    const configuration = this.store.selectSnapshot<IServerConfig>(state => state.appStore.globalConfig.configuration);
    const user: IAppUser = session.user;

    const headers = buildPunkuHeaders(configuration, session, user, req.method);

    try {

      [...headers].forEach(header => {

        req = this.setHeader(req, header);

      });

    } catch (e) {
      console.error('ocurrió un error al crear los request headers', e)
    }

    if (!req.headers.has('Content-Type') && !req.headers.has('Upload-File')) {
      req = req.clone({
        headers: req.headers.append('Content-Type', 'application/json; charset=UTF-8')
      });
    }

    return req;
  }

  private setHeader = (req: HttpRequest<any>, header: { name: string, value: string }): HttpRequest<any> => {

    if (req.headers.has(header.name)) {
      return req;
    }

    return req.clone({
      headers: req.headers.append(header.name, header.value)
    });

  }

}
