import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExternalPaisService {

  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/external`;

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) { }

    listarPaises = (): Observable<any> => {
    return this.http.post(`${this.urlPresentacion}/getPais`, {});
  }
}
