import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IFormInfraestructura, IGridBuscardorInfraestructura, IFormBuscardorInfraestructura } from '../store/infraestructura/infraestructura.store.interface';

/*
@Injectable({
  providedIn: 'root'
})*/
@Injectable()
export class InfraestructuraService {
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

  getInfraestructura = (codigoAmbiente: string): Observable<IFormInfraestructura> => {
    return new Observable<IFormInfraestructura>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler({
            totalLaboratorioComputo: '1',
            totalLaboratorioEnsenianza: '1',
            totalTalleresEnsenianza: '1',
            totalBibliotecas: '1',
            totalAulas: '1',
            totalAmbientesDocentes: '1',
            totalTopico: '1',
            denominacionAmbientesComplementarios: '1',
            denominacionAmbientesServicioUniversitario: '1',
            comentarios: '',
        });
      }, 750);
    });
    // return this.http.get<IFormAmbiente>(`${this.urlApiGateway}/ambiente/${codigoAmbiente}`);
  }

  saveInfraestructura = (form: IFormInfraestructura): Observable<IFormInfraestructura> => {

    return new Observable<IFormInfraestructura>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(form);
      }, 750);
    });
    //  return this.http.post(`${this.url}/registrar`, form);
  }
  updateInfraestructura = (form: IFormInfraestructura): Observable<IFormInfraestructura> => {

    return new Observable<IFormInfraestructura>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(form);
      }, 750);
    });
    // return this.http.put(`${this.url}/editar`, form);
  }

  deleteInfraestructura = (codigo: string): Observable<IFormInfraestructura> => {

    return new Observable<IFormInfraestructura>((observer) => {
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

  fetchPageInfraestructura = (pageRequest: IDataGridPageRequest, value: Partial<IFormBuscardorInfraestructura>): Observable<any> => {
    return new Observable<IGridBuscardorInfraestructura[]>((observer) => {
      const handler = (e) => observer.next(e);
      setTimeout(() => {
        return handler(
          {
            data: [{
                totalLaboratorioComputo: '',
                totalLaboratorioEnsenianza: '',
                totalTalleresEnsenianza: '',
                totalBibliotecas: '',
                totalAulas: ''
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
