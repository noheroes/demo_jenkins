import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IFormAmbiente, IGridBuscardorAmbiente, IFormBuscardorAmbiente } from '../store/ambiente/ambiente.store.interface';
import { IFormSedeFilial, IFormBuscardorSedeFilial, IGridBuscardorSedeFilial } from '../store/sedefilial/sedefilial.store.interface';
/*
@Injectable({
  providedIn: 'root'
})*/
@Injectable()
export class SedeFilialService {
  private urlApiGateway: string = `${this.configuration.apiGatewayAddress}/api/v1`;
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/formato`;
  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) {

  }

  getFormatoByVersion = (idVersion: string): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/getFormatoByVersion`, { idVersion: idVersion });
  }

  setUpdateFormato = (request: any): Observable<any> => {    
    return this.http.post<any>(`${this.urlPresentacion}/setUpdateFormato`, request);
  }

  setGenerateFormato = (request: any): Observable<any> => {    
    return this.http.post<any>(`${this.urlPresentacion}/setGenerateFormato`, request);
  }

  getSedeFilial = (codigoSedeFilial: string): Observable<IFormSedeFilial> => {
    return new Observable<IFormSedeFilial>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler({
          id: codigoSedeFilial,
          codigoSedeFilial: '',
          codigoDepartamento: '',
          codigoProvicia: '',
          esSede: true
        });
      }, 750);
    });
    // return this.http.get<IFormSedeFilial>(`${this.urlApiGateway}/ambiente/${codigoAmbiente}`);
  }
  saveSedeFilial = (form: IFormSedeFilial): Observable<IFormSedeFilial> => {

    return new Observable<IFormSedeFilial>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(form);
      }, 750);
    });
    //  return this.http.post(`${this.url}/registrar`, form);
  }
  updateSedeFilial = (form: IFormSedeFilial): Observable<IFormSedeFilial> => {

    return new Observable<IFormSedeFilial>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(form);
      }, 750);
    });
    // return this.http.put(`${this.url}/editar`, form);
  }
  deleteSedeFilial = (codigo: string): Observable<IFormSedeFilial> => {

    return new Observable<IFormSedeFilial>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(null);
      }, 750);
    });
    // const data = {
    //   id: codigo
    // };
    // const params = convertObjectToGetParams(data);
    // return this.http.delete(`${this.url}/`, {
    //   params
    // });
  }

  searchPageSedeFilial = (pageRequest: IDataGridPageRequest, value: Partial<IFormBuscardorSedeFilial>): Observable<any> => {
    return new Observable<IGridBuscardorSedeFilial[]>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(
          {
            data: [{
              codigoSedeFilial: '',
              departamento: '',
              provincia: '',
              esSedePrincipal: ''
            }],
            count: 1
          }
        );
      }, 750);
    });
    // return this.http.get<IGridBuscardorAmbiente>(`${this.urlApiGateway}/buscar`, {
    //   params: this.getQueryString(pageRequest, value),
    // });
  }
}
