import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class EquipoTrabajoService {
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1`;

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient
  ) {
  
  }

  getMiembrosEquipoTrabajo = (idProceso: string): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/equipotrabajo/getUsuarios`, {
      idProceso: idProceso
    });
  };

  

}
