import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IFormEquipamiento, IGridBuscardorEquipamiento, IFormBuscardorEquipamiento } from '../store/equipamiento/equipamiento.store.interface';

/*
@Injectable({
  providedIn: 'root'
})*/
@Injectable()
export class EquipamientoService {
  private urlApiGateway: string = `${this.configuration.apiGatewayAddress}/api/v1`;
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/formatoDetalle/version`;
  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) {

  }

  getFormatoDetalleByVersion = (idVersion: string, idSedeFilial: string): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/sedeFilial`, { 'IdVersion': idVersion, 'idSedeFilial': idSedeFilial });
  }

  setUpdateFormatoDetalle = (request: any): Observable<any> => {        
    return this.http.post<any>(`${this.urlPresentacion}/SetFormatoDetalleByVersionSedeFilial`, request);
  }

  getEquipamiento = (codigoAmbiente: string): Observable<IFormEquipamiento> => {
    return new Observable<IFormEquipamiento>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler({
          codigoLaboratorio: '1',
          numeroEquipos: '1',
          nombreEquipos: '1',
          codigoTipoEquipos: '1',
          valorizacion: '1',
            comentarios: '',
        });
      }, 750);
    });
    // return this.http.get<IFormAmbiente>(`${this.urlApiGateway}/ambiente/${codigoAmbiente}`);
  }

  saveEquipamiento = (form: IFormEquipamiento): Observable<IFormEquipamiento> => {

    return new Observable<IFormEquipamiento>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(form);
      }, 750);
    });
    //  return this.http.post(`${this.url}/registrar`, form);
  }
  updateEquipamiento = (form: IFormEquipamiento): Observable<IFormEquipamiento> => {

    return new Observable<IFormEquipamiento>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(form);
      }, 750);
    });
    // return this.http.put(`${this.url}/editar`, form);
  }

  deleteEquipamiento = (codigo: string): Observable<IFormEquipamiento> => {

    return new Observable<IFormEquipamiento>((observer) => {
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

  fetchPageEquipamiento = (pageRequest: IDataGridPageRequest, value: Partial<IFormBuscardorEquipamiento>): Observable<any> => {
    return new Observable<IGridBuscardorEquipamiento[]>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(
          {
            data: [{
              codigoLaboratorio: '',
              numeroEquipos: '',
              nombreEquipos: '',
              codigoTipoEquipos: ''
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
