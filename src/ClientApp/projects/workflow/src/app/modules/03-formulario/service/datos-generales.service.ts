import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { IDatosGeneralesBody } from '../store/datosgenerales/datosgenerales.store.interface';
import { Observable } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';
/*
@Injectable({
  providedIn: 'root'
})*/
@Injectable()
export class DatosGeneralesService {
  //private urlApiGateway: string = `${this.configuration.apiGatewayAddress}/api/v1`;

  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/datos`;

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) {

  }

  // OJO VERIFICAR INTERFACE NEW CAYL
  getDetalleSolicitudByVersion = (idVersion: string): Observable<IDatosGeneralesBody> => {
    return this.http.post<IDatosGeneralesBody>(`${this.urlPresentacion}/getDetalleSolicitudByVersion`,{idVersion: idVersion});
  }

  setModificacionDatosGenerales=(datosGeneralesBody:IDatosGeneralesBody):Observable<any>=>{
    //console.log(datosGeneralesBody);
    return this.http.post<any>(`${this.urlPresentacion}/setModificacionDatosGenerales`, datosGeneralesBody);
  }

  // fetchRepresentanteLegal = (pageRequest: IDataGridPageRequest, filter = null): Observable<{ persons: IRepresentanteLegal[], total: number }> => {
  //   // if (pageRequest.orderBy && pageRequest.orderDir) {
  //   //   // this.datasource = orderBy(this.datasource, [ pageRequest.orderBy ], [ pageRequest.orderDir ]);
  //   // }

  //   // const items = this.datasource.slice((pageRequest.page - 1) * pageRequest.pageSize).slice(0, pageRequest.pageSize);

  //   // return new Observable((observer) => {
  //   //   const handler = (e) => observer.next(e);
  //   //   setTimeout(() => {
  //   //     return handler({ persons: items, total: this.datasource.length });
  //   //   }, 750);
  //   // });

  // }
}
