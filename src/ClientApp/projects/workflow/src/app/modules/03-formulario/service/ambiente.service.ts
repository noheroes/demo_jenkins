import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IFormAmbiente, IGridBuscardorAmbiente, IFormBuscardorAmbiente } from '../store/ambiente/ambiente.store.interface';
/*
@Injectable({
  providedIn: 'root'
})*/
@Injectable()
export class AmbienteService {
  private urlApiGateway: string = `${this.configuration.apiGatewayAddress}/api/v1`;

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) {

  }

  getAmbiente = (codigoAmbiente: string): Observable<IFormAmbiente> => {
    return new Observable<IFormAmbiente>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler({
          id: codigoAmbiente,
          codigoLocalRef: '1',
          codigo: '1',
          ubicacion: '1',
          aforo: '1',
          cantidadDocente: '1',
          tieneInternet: '1',
          cantidadSillas: '1',
          cantidadMesas: '1',
          tipoRegimenDedicacionEnum: '1',
          otroEquipamentoMobiliario: '1',
          comentario: '1'
        });
      }, 750);
    });
    // return this.http.get<IFormAmbiente>(`${this.urlApiGateway}/ambiente/${codigoAmbiente}`);
  }
  saveAmbiente = (form: IFormAmbiente): Observable<IFormAmbiente> => {

    return new Observable<IFormAmbiente>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(form);
      }, 750);
    });
    //  return this.http.post(`${this.url}/registrar`, form);
  }
  updateAmbiente = (form: IFormAmbiente): Observable<IFormAmbiente> => {

    return new Observable<IFormAmbiente>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(form);
      }, 750);
    });
    // return this.http.put(`${this.url}/editar`, form);
  }
  deleteAmbiente = (codigo: string): Observable<IFormAmbiente> => {

    return new Observable<IFormAmbiente>((observer) => {
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

  searchPageAmbiente = (pageRequest: IDataGridPageRequest, value: Partial<IFormBuscardorAmbiente>): Observable<any> => {
    return new Observable<IGridBuscardorAmbiente[]>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(
          {
            data: {
              codigoLocal: '1',
              codigoAmbiente: '1',
              ubicacion: '1',
              aforo: '1',
              cantidadDocente: '1',
              cantidadSillas: '1',
              cantidadMesas: '1',
              tieneInternet: '1',
              registroDocentes: '1'
            },
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
