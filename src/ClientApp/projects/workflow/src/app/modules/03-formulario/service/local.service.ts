import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IFormAmbiente, IGridBuscardorAmbiente, IFormBuscardorAmbiente } from '../store/ambiente/ambiente.store.interface';
import { IFormLocal, IFormBuscardorLocal, IGridBuscardorLocal } from '../store/local/local.store.interface';
/*
@Injectable({
  providedIn: 'root'
})*/
@Injectable()
export class LocalService {
  private urlApiGateway: string = `${this.configuration.apiGatewayAddress}/api/v1`;
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/formato`;
  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) {

  }

  getFormatoByVersion = (idVersion: string): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/GetFormatoByVersion`, { 'IdVersion': idVersion });
  }

  setUpdateFormato = (request: any): Observable<any> => {    
    return this.http.post<any>(`${this.urlPresentacion}/setUpdateFormato`, request);
  }

  setGenerateFormato = (request: any): Observable<any> => {    
    return this.http.post<any>(`${this.urlPresentacion}/setGenerateFormato`, request);
  }

  getLocal = (codigoLocal: string): Observable<IFormLocal> => {
    return new Observable<IFormLocal>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler({
          id: codigoLocal,
          codigoSedeFilial: '',
          numeroLocal: '',
          codigoLocal: '',
          servicioEducativo: false,
          servicioEducacionalesComplementarios: false,
          otrosServicio: false,
          otroTipoServicio: '',
          resolucionAutorizacion: '',
          fechaAutorizacion: '',
          codigoDepartamento: '',
          codigoProvicia: '',
          codigoDistrito: '',
          direccion: '',
          referencia: '',
          areaTerreno: '',
          areaConstruida: '',
          aforoLocal: '',
          telefonoLocal: '',
          cantidadEstudiantes: '',
          comentarios: ''
        });
      }, 750);
    });
    // return this.http.get<IFormLocal>(`${this.urlApiGateway}/ambiente/${codigoAmbiente}`);
  }
  saveLocal = (form: IFormLocal): Observable<IFormLocal> => {

    return new Observable<IFormLocal>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(form);
      }, 750);
    });
    //  return this.http.post(`${this.url}/registrar`, form);
  }
  updateLocal = (form: IFormLocal): Observable<IFormLocal> => {

    return new Observable<IFormLocal>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(form);
      }, 750);
    });
    // return this.http.put(`${this.url}/editar`, form);
  }
  deleteLocal = (codigo: string): Observable<IFormLocal> => {

    return new Observable<IFormLocal>((observer) => {
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

  searchPageLocal = (pageRequest: IDataGridPageRequest, value: Partial<IFormBuscardorLocal>): Observable<any> => {
    return new Observable<IGridBuscardorLocal[]>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(
          {
            data: [{
              codigoLocal: '',
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
