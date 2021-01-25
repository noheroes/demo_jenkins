import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaestroEnumeradoService {

  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/maestro`;

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) { }


  listarEnumerados = ():Observable<any>=>{
    return this.http.post(`${this.urlPresentacion}/getEnumerado`,{});
  }



}
