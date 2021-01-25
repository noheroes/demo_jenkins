import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MaestroFacultadService {
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/formato`;
  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) { }

  getFormatoByVersion = (idVersion: string): Observable<any> => {
    
    return this.http.post<any>(`${this.urlPresentacion}/GetFormatoByVersion`, { 'IdVersion': idVersion });
  }
  setGenerateFormato = (request: any): Observable<any> => {    
    return this.http.post<any>(`${this.urlPresentacion}/setGenerateFormato`, request);
  }
  setUpdateFormato = (request: any): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/setUpdateFormato`, request);
  }
}
