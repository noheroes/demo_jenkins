import { IDataGridPageRequest } from '@sunedu/shared';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IFormBuscardorDocumentoConsulta } from '../store/documentos-consulta/documentos-consulta.store.interface';

@Injectable()
export class DocumentosConsultaService {
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1`;

  //urlBusiness = "https://linudev.sunedu.gob.pe:59524/api/v1/archivo/download?";

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient
  ) {
  
  }

  getDocumentosConsulta = (formBuscar:any, pageRequest:IDataGridPageRequest): Observable<any> => {
    // console.log('CAYL getDocumentosConsulta formBuscar', formBuscar);
    // console.log('CAYL getDocumentosConsulta pageRequest', pageRequest);
    let subtipos = [];
    if(formBuscar.idsSubTiposDocumento)
    {
      subtipos.push(formBuscar.idsSubTiposDocumento)
    }
    const parametros = {
      tipoBandeja: formBuscar.tipoBandeja,
      idsSubTiposDocumento:formBuscar.idsSubTiposDocumento?subtipos:null,
      nombreArchivo: formBuscar.nombreArchivo,
      fechaRecepcionSuneduDesde: formBuscar.fechaRecepcionSuneduDesde,
      fechaRecepcionSuneduHasta: formBuscar.fechaRecepcionSuneduHasta,
      fechaNotificacionUniversidadDesde: formBuscar.fechaNotificacionUniversidadDesde,
      fechaNotificacionUniversidadHasta: formBuscar.fechaNotificacionUniversidadHasta,
      pageSize: pageRequest.pageSize,
      skip: pageRequest.skip,
      sortField: pageRequest.orderBy,
      sortDir: pageRequest.orderDir
    }
    // const para = {
      
    //   idBandeja:["string"],
    //   descBandeja:["string"],
    //   fechaRecepcionDesde:["string"],
    //   fechaRecepcionHasta:["string"],
    //   subTipoDocumentoDesc:["string"],
    //   fechaNotificacionDesde:["string"],
    //   fechaNotificacionHasta:["string"],
    //   archivoNombre:["string"],
    // }
    //console.log('CAYL getEnviados parametros',parametros);
    return this.http.post<any>(`${this.urlPresentacion}/documentos/getbandeja`, parametros);
  };

  downloadDocumento = (
    id: string,
    version: number
  ):Observable<any> => {
    window.open(`${this.urlPresentacion}/archivo/download?idArchivo=${id}&version=${version}`,"_blank");
    return of(true);
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
