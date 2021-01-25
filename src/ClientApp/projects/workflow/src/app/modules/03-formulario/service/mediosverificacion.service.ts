import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';
import {
  IMediosVerificacion,
  ITreeNode,
} from '../store/mediosverificacion/mediosverificacion.store.interface';
import { map, catchError } from 'rxjs/operators';
import { AppContainerSolicitudModule } from '../components/app-container/container-solicitud/app-container-solicitud.module';
import { Store } from '@ngxs/store';
/*
@Injectable({
  providedIn: 'root'
})*/
@Injectable()
export class MediosVerificacionService {
  // private url: string;
  // private urlBusiness: string;
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1`;

  constructor(
    private store: Store,
    private configuration: ConfigurationService,
    private http: HttpClient
  ) {
    // this.url = `${this.configuration.apiGatewayAddress}`
    // this.url = this.store.selectSnapshot(
    //   (s) => s.appStore.globalConfig.configuration.support.gestorArchivos
    // );
    // this.urlBusiness = this.store.selectSnapshot(
    //   (s) =>
    //     s.appStore.globalConfig.configuration.support.gestorArchivosBusiness
    // );

    // this.url = this.urlPresentacion;
    // this.urlBusiness = this.urlPresentacion;
  }

  getSedesFiliales = (idVersionSolicitud: string): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}/formato/getFormatoByVersion`,
      { idVersion: idVersionSolicitud }
    );
  };

  getCatalogos = (idVersionSolicitud: string): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}/mvcatalog/getCatalogosByIdSolicitudVersion`,
      { idSolicitudVersion: idVersionSolicitud }
    );
  };

  getMediosVerificacionByIdCatalogo = (idCatalogo: string): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/mvcatalog/getById`, {
      idCatalogo: idCatalogo,
      incluirContenido: true,
      incluirContenidoArchivoInfo: true,
    });
  };

  downloadFile = (
    id: string,
    version: number,
    name: string
  ):Observable<any> => {
    // const params = {
    //   idArchivo: id,
    //   version: `${version}`,
    // };
    // https://linudev.sunedu.gob.pe:59524/api/v1/archivo/download?idArchivo=c5cf9643-603e-4084-9446-cf4669f086ea&version=1
    window.open(`${this.urlPresentacion}/archivo/download?idArchivo=${id}&version=${version}`,"_blank");
    return of(true);

    // return this.http
    //   .get(`${this.urlPresentacion}/archivo/download`, {
    //     params,
    //     responseType: 'blob' as 'json',
    //   })
    //   .pipe(
    //     map((response: any) => {
    //       const binaryData = [];
    //       binaryData.push(response);
    //       const downloadLink = document.createElement('a');
    //       downloadLink.href = window.URL.createObjectURL(
    //         new Blob(binaryData, { type: response.type })
    //       );
    //       downloadLink.setAttribute('download', name);
    //       document.body.appendChild(downloadLink);
    //       downloadLink.target = '_blank';
    //       downloadLink.click();
    //       //return downloadLink;
    //     })
    //   );

  };

  deleteFile = (
    trackingNumber: string,
    idContenido: string,
    idUsuario: string,
    idAplicacion: string
  ): Observable<any> => {
    let params = {
      trackingNumber: trackingNumber,
      idContenido: idContenido,
      idUsuario: idUsuario,
      invocarEliminacionArchivo: true,
      idAplicacion: idAplicacion,
    };
    // console.log(params);
    return this.http.post<any>(
      `${this.urlPresentacion}/mvcontent/setDelete`,
      params
    );
  };

  getByContenidoId = (idContenido: string): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}/mvcontent/comment/getByContenidoId`,
      { idContenido: idContenido }
    );
  };
  getInfoByTrackinNumber = (trackingNumber: string): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}/mvcontent/getByTrackNum`,
      { trackingNumber: trackingNumber }
    );
  };

  setCommentAdd = (comment: any): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}/mvcontent/comment/add`,
      comment
    );
  };

  setCommentDelete = (comment: any): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}/mvcontent/comment/delete`,
      comment
    );
  };

  uploadUrl = (formData: any, useBusinessRoute: boolean): Observable<any> => {
    //const url = useBusinessRoute ? this.urlBusiness : this.url;
    // this.url = `https://linudev.sunedu.gob.pe:59524/api/v1`;
    // console.log(formData);
    // return this.http.post(
    //   `${url}/archivo/upload`,
    //   formData,
    //   {
    //     reportProgress: true,
    //     observe: 'events',
    //     headers: {'Upload-File': 'true'}
    //   }
    // );
    return this.http.post(
      `${this.urlPresentacion}/mvcontent/setUpsert`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
        headers: { 'Upload-File': 'true' },
      }
    );
  };

  setReplicateToFtp = (current: any): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}/mvcontent/replicate`,
      current
    );
  };
  setReplicateFromFtp = (current: any): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}/mvcontent/import`,
      current
    );
  };
  getEstadoFirma = (parametros:any): Observable<any> =>{
    return this.http.post<any>(
      `${this.urlPresentacion}/flujo/getEstadoFirma`,parametros
    );
  }
  setUpdateEstadoFirma = (parametros:any): Observable<any> =>{
    return this.http.post<any>(
      //api/v1flujo/setUpdateEstadoFirma
      `${this.urlPresentacion}/flujo/setUpdateEstadoFirma`,parametros
    );
  }

  mediosVerificacionDiagnostic=(idSolicitudVersion:string)=>{
    const parametros = {
      idSolicitudVersion:idSolicitudVersion,
      verificarGA:true
    }
    return this.http.post<any>(
      `${this.urlPresentacion}/mvdiag/byidsolver`,
      parametros
    );
  }

}
