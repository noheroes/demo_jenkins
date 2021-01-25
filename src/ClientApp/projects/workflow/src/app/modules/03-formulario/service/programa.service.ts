import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';

@Injectable()
export class ProgramaService {
  private urlApiGateway: string = `${this.configuration.apiGatewayAddress}/api/v1`;
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
}
