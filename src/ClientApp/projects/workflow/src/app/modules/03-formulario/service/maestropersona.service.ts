import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { IDatosGeneralesBody } from '../store/datosgenerales/datosgenerales.store.interface';
import { Observable } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';

@Injectable()
export class MaestropersonaService {
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/formato`;
  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) { }

  getFormatoByVersion = (idVersion: string): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/GetFormatoByVersion`, { 'IdVersion': idVersion });
  }

  setUpdateFormato = (request: any): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/setUpdateFormato`, request);
  }
}
