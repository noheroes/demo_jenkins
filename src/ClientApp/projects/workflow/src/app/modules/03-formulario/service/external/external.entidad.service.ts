import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExternalEntidadService {

  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/external`;

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) { }

    listarEntidades = (CodigoTipoAutorizacionEntidad: string, CodigoEstadoVigenciaEntidad: number): Observable<any> => {        
    return this.http.post(`${this.urlPresentacion}/getEntidad`, {codigoTipoAutorizacionEntidad: CodigoTipoAutorizacionEntidad, codigoEstadoVigenciaEntidad: CodigoEstadoVigenciaEntidad});
  }
}
