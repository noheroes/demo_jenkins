import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DocumentoEnviadoService {
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1`;

  //urlBusiness = "https://linudev.sunedu.gob.pe:59524/api/v1/archivo/download?";

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient
  ) {
  
  }

  getEnviados = (): Observable<any> => {
    const parametros = {
        idActividad: ["string"],
        idSubtipo:["string"],
        numeroDocumentoSISAD:"string",
        nombreArchivo:"string",
        fechaCargaDesde:"string",
        fechaCargaHasta:"string",
        idsEstadoDocumento:["string"]

    }
    //console.log('CAYL getEnviados parametros',parametros);
    return this.http.post<any>(`${this.urlPresentacion}/documentos/getEnviados`, parametros);
  };

//   getTiposDocumentosById = (idsSubtipos: number[]): Observable<any> => {
//     return this.http.post<any>(`${this.urlPresentacion}/subtiposdoc/getbyids`, {
//       idsSubtipos: idsSubtipos
//     });
//   };

//   downloadDocumento = (
//     id: string,
//     version: number
//   ):Observable<any> => {
//     window.open(`${this.urlPresentacion}/archivo/download?idArchivo=${id}&version=${version}`,"_blank");
//     return of(true);
//   };

//   deleteDocumento = (
//     trackingNumber: string,
//     idUsuario: string,
//     idAplicacion: string
//   ): Observable<any> => {
//     let params = {
//       trackingNumber: trackingNumber,
//       idUsuario: idUsuario,
//       invocarEliminacionArchivo: true,
//       idAplicacion: idAplicacion,
//     };
//     // console.log(params);
//     return this.http.post<any>(
//       `${this.urlPresentacion}/documentos/del`,
//       params
//     );
//   };

//   getFileInfo = (id: string, version: number) => {    
//     const params = {
//       id:id,
//       version: version,
//       incluirHistorial: true,
//       maxVersionesHistorial: 0
//     }
//     // console.log(params);

//     return this.http.post<any>(`${this.urlPresentacion}/archivo/fileInfo`, params);
//   }

}
