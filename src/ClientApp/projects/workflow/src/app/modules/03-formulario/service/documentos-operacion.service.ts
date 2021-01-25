import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpError } from '@aspnet/signalr';

@Injectable()
export class DocumentosOperacionService {
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1`;

  //urlBusiness = "https://linudev.sunedu.gob.pe:59524/api/v1/archivo/download?";

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient
  ) {
  
  }

  getDocumentosOperacion = (parametros:any): Observable<any> => {
    //console.log('CAYL getEnviados parametros',parametros);
    return this.http.post<any>(`${this.urlPresentacion}/documentos/getlistaop`, parametros);
  };

  getTiposDocumentosById = (idsSubtipos: number[]): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/subtiposdoc/getbyids`, {
      idsSubtipos: idsSubtipos
    });
  };

  getDocumentoById = (idDocumento:string):Observable<any>=>{
    return this.http.post<any>(`${this.urlPresentacion}/documentos/getbyid`, {idDocumento});
  }

  setRegistrarRTD = (parametros:any):Observable<any>=>{
    return this.http.post<any>(`${this.urlPresentacion}/documentos/setUpdateDocumentoICMeta`, parametros);
  }

  downloadDocumento = (
    id: string,
    version: number
  ):Observable<any> => {
    window.open(`${this.urlPresentacion}/archivo/download?idArchivo=${id}&version=${version}`,"_blank");
    return of(true);
  };

  deleteDocumentoOperacion = (parametros:any): Observable<any> => {
    // let params = {
    //   trackingNumber: trackingNumber,
    //   idDocumento:idDocumento,
    //   idUsuario: idUsuario,
    //   invocarEliminacionArchivo: true,
    //   idAplicacion: idAplicacion,
    // };
    // console.log(params);
    return this.http.post<any>(
      `${this.urlPresentacion}/documentos/del`,
      parametros
    );
  };

  getFileInfo = (id: string, version: number) => {    
    const params = {
      id:id,
      version: version,
      incluirHistorial: true,
      maxVersionesHistorial: 0
    }
    // console.log(params);

    return this.http.post<any>(`${this.urlPresentacion}/archivo/fileInfo`, params);
  }

  private handleError(error:HttpError, idSubtipoDocumento:number):Observable<any>{
    //console.error('CAYL error',error);
    window.open(`${this.urlPresentacion}/documentos/getDownloadTemplate?IdSubtipoDocumento=${idSubtipoDocumento}`,"_blank");
    return throwError(error|| 'Server error');
  }

  downloadPlantilla = (
    idSubtipoDocumento: number
  ) => {
    const params = {
      IdSubtipoDocumento: `${idSubtipoDocumento}`
    };
    return this.http
      .get(`${this.urlPresentacion}/documentos/getDownloadTemplate`, {
        params,
        responseType: 'json',
      })
      // .subscribe(
      //   response=>{
      //     console.log(response);
      //       window.open(`${this.urlPresentacion}/documentos/getDownloadTemplate?IdSubtipoDocumento=${idSubtipoDocumento}`,"_blank");
      //   },
      //   error => (this.handleError(error))
      // );
      .pipe(
        map(
          (response: any)=>{
            console.log(response);
            if(response){
              if(!response.success){
                return response;
              }
            }
            else{
              window.open(`${this.urlPresentacion}/documentos/getDownloadTemplate?IdSubtipoDocumento=${idSubtipoDocumento}`,"_blank");
            }
          }
        ),
        catchError(error=>this.handleError(error, idSubtipoDocumento))
      )
      // .pipe(
      //   map((response: any) => {
      //     const binaryData = [];
      //     binaryData.push(response);
      //     const downloadLink = document.createElement('a');
      //     downloadLink.href = window.URL.createObjectURL(
      //       new Blob(binaryData, { type: response.type })
      //     );
      //     downloadLink.setAttribute('download', `${nombreArchivo}`);
      //     document.body.appendChild(downloadLink);
      //     downloadLink.click();

      //     window.open(`${this.urlPresentacion}/documentos/getDownloadTemplate?IdSubtipoDocumento=${idSubtipoDocumento}`,"_blank");
      //   }),
      //   catchError(error=>console.log(error)
      //   )
      //   )
      // );
  };

  //   window.open(`${this.urlPresentacion}/documentos/getDownloadTemplate?IdSubtipoDocumento=${idSubtipoDocumento}`,"_blank");
  //   return of(true);
  // };

  // downloadFile = (
  //   nombreArchivo: string,
  //   esPlantilla: boolean,
  //   idArchivo: string  
  // ): Observable<any> => {
  //   const params = {
  //     idArchivo: `${idArchivo}`,
  //     nombre: `${nombreArchivo}`,
  //     esPlantilla: `${esPlantilla}`          
  //   };        
  //   return this.http
  //     .get(`${this.urlPresentacion}/download`, {
  //       params,
  //       responseType: 'blob' as 'json',
  //     })
  //     .pipe(
  //       map((response: any) => {
  //         const binaryData = [];
  //         binaryData.push(response);
  //         const downloadLink = document.createElement('a');
  //         downloadLink.href = window.URL.createObjectURL(
  //           new Blob(binaryData, { type: response.type })
  //         );
  //         downloadLink.setAttribute('download', `${nombreArchivo}`);
  //         document.body.appendChild(downloadLink);
  //         downloadLink.click();
  //       })
  //     );
  // };

  setReplicateToFtp = (current: any): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}/documentos/replicate`,
      current
    );
  };

  setReplicateFromFtp = (current: any): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}/documentos/import`,
      current
    );
  };

}
