import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LaboratorioService {

  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/formatoDetalle/version`;
  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) { }

    getFormatoDetalleByVersion = (idVersion: string, idSedeFilial: string): Observable<any> => {
      return this.http.post<any>(`${this.urlPresentacion}/sedeFilial`, { 'IdVersion': idVersion, 'idSedeFilial': idSedeFilial });
    }

    setUpdateFormatoDetalle = (request: any): Observable<any> => {
      return this.http.post<any>(`${this.urlPresentacion}/SetFormatoDetalleByVersionSedeFilial`, request);
    }

    setGenerateFormatoDetalle = (request: any): Observable<any> => {    
      return this.http.post<any>(`${this.urlPresentacion}/setGenerateFormatoDetalle`, request);
    }
}
