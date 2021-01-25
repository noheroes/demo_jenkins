import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class FirmantesService {  
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/flujo`;
  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) {
  }

  getUsuariosByEntidad = (filter:any): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/getUsuariosByEntidad`, filter);
  }
}
