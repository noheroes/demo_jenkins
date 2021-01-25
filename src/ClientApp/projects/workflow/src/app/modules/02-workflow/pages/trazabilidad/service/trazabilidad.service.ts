import { TrazabilidadRequest } from './../store/trazabilidad.store.model';
import { IGridBandejaSolicitud, IBuscardorBandejaSolicitud, IBuscadorBandejaTrazabilidad, IGridBandejaTrazabilidad, ITrazabilidadRequest } from './../store/trazabilidad.store.interface';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class TrazabilidadService {
  private urlApiGateway: string = `${this.configuration.apiGatewayAddress}/api/v1`;
  private urlPresentacionWorkflow = `${this.configuration.apiPresentacionAddress}/api/v1/flujo`;
  private urlPresentacionEntidad = `${this.configuration.apiPresentacionAddress}/api/v1/entidad`;
  private urlPresentacionSolicitud: string = `${this.configuration.apiPresentacionAddress}/api/v1/datos`;
  private urlPresentacionFormatoDetalle: string = `${this.configuration.apiPresentacionAddress}/api/v1/formatoDetalle/version`;
  private urlPresentacionFormato: string = `${this.configuration.apiPresentacionAddress}/api/v1/formato`;
  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) {

  }
  getFormatoByVersion = (idVersion: string): Observable<any> => {
    // console.log(idVersion);
    //console.log(`${this.urlPresentacion}`);
    return this.http.post<any>(`${this.urlPresentacionFormato}/GetFormatoByVersion`, { 'IdVersion': idVersion });
  }

  getFormatoDetalleByVersion = (idVersion: string, idSedeFilial: string): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacionFormatoDetalle}/sedeFilial`, { 'IdVersion': idVersion, 'idSedeFilial': idSedeFilial });
  }

  setUpdateFormatoDetalle = (request: any): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacionFormatoDetalle}/SetFormatoDetalleByVersionSedeFilial`, request);
  }
  getSolicitudAll = (filter: Partial<IBuscardorBandejaSolicitud>): Observable<IGridBandejaSolicitud> => {
    return this.http.post<IGridBandejaSolicitud>(`${this.urlPresentacionSolicitud}/getSolicitudAll`,filter);
  }
  getProcesoAll = (filter: Partial<IBuscardorBandejaSolicitud>) => {
    return this.http.post<IGridBandejaSolicitud>(`${this.urlPresentacionSolicitud}/getSolicitudAll`,filter);
  }
  getEntidades = (): Observable<any[]> => {
    const items = this.http.post<any[]>(
      `${this.urlPresentacionEntidad}/getEntidades`,
      {}
    );
    return items;
  };
  getTrazabilidadByIdProceso = (filter: Partial<TrazabilidadRequest>) : Observable<any>=> {
    return this.http.post<any>(`${this.urlPresentacionWorkflow}/getSeguimientoTrazabilidad`,filter);
  }
}
