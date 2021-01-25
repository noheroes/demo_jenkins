import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IFormRepresentanteLegal, IFormBuscardorRepresentanteLegal, IGridBuscardorRepresentanteLegal } from '../store/datosgenerales/datosgenerales.store.interface';
/*
@Injectable({
  providedIn: 'root'
})*/
@Injectable()
export class RepresentanteLegalService {
  private urlApiGateway: string = `${this.configuration.apiGatewayAddress}/api/v1`;

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) {

  }

  getRepresentanteLegal = (codigoRepresentanteLegal: string): Observable<IFormRepresentanteLegal> => {
    return new Observable<IFormRepresentanteLegal>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler({
          codigoTipoDocumento: '1',
          numeroDocumento: '42129227',
          nombres:'ALEX',
          apellidoPaterno:'GUSMAN',
          apellidoMaterno:'LOPEZ',
          telefono:'935222822',
          numeroCasilla:'ABC',
          correo:'aguzman@lopez.com',
          tipoDocumentoEnum: '1',
          cargo: '1',
          oficinaRegistral: '1',
          numeroPartida: '1',
          asiento: '1',
          domicilioLegal: '1',
          codigoUbigeoRef: '1',
          nombreDepartamento: '1',
          nombreProvincia: '1',
          nombreDistrito: '1',
        });
      }, 750);
    });
    // return this.http.get<IFormRepresentanteLegal>(`${this.urlApiGateway}/ambiente/${codigoAmbiente}`);
  }
  saveRepresentanteLegal = (form: IFormRepresentanteLegal): Observable<IFormRepresentanteLegal> => {

    return new Observable<IFormRepresentanteLegal>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(form);
      }, 750);
    });
    //  return this.http.post(`${this.url}/registrar`, form);
  }
  updateRepresentanteLegal = (form: IFormRepresentanteLegal): Observable<IFormRepresentanteLegal> => {

    return new Observable<IFormRepresentanteLegal>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(form);
      }, 750);
    });
    // return this.http.put(`${this.url}/editar`, form);
  }
  deleteRepresentanteLegal = (codigo: string): Observable<IFormRepresentanteLegal> => {

    return new Observable<IFormRepresentanteLegal>((observer) => {
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

  searchPageRepresentanteLegal = (pageRequest: IDataGridPageRequest, value: Partial<IFormBuscardorRepresentanteLegal>): Observable<any> => {
    return new Observable<IGridBuscardorRepresentanteLegal[]>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(
          {
            data:  [{
              nombreApellidos: '',
              documento: '',
              cargo: ''
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
