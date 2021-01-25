import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRequestRelacionDocente } from '../store/relaciondocente/relaciondocente.store.interface';

@Injectable()
export class RelacionDocenteService {

  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/formatoDetalle/version`;
  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) { }

  getFormatoDetalleByVersionSedeFilial = (request: IRequestRelacionDocente): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/sedeFilial`, request);
  }


  setUpdateFormatoDetalle = (request: any): Observable<any> => {    
    return this.http.post<any>(`${this.urlPresentacion}/SetFormatoDetalleByVersionSedeFilial`, request);
  }
}
