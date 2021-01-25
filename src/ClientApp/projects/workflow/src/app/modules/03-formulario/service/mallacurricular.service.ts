import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MallaCurricularService {
  private urlPresentacion = `${this.configuration.apiPresentacionAddress}/api/v1/formato`;

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) {

  }

  getFormatoByVersion = (idVersion: string): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/GetFormatoByVersion`, { IdVersion: idVersion });
  }

  setUpdateFormato = (request: any): Observable<any> => {
    console.log(request);
    return this.http.post<any>(`${this.urlPresentacion}/setUpdateFormato`, request);
  }

}
