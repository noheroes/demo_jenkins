import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AppStore } from './../../store/app.store';
import { Store } from '@ngxs/store';
import { ConfigurationService } from '../../services/infrastructure/configuration.service';


@Injectable()
export class GestorArchivosCargaMasivaService {

  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1`;

  constructor(
    private http: HttpClient,
    private store: Store,
    private configuration: ConfigurationService
  ) {
  }

  upload = (formData: any, useBusinessRoute: boolean): Observable<any> => {
    return this.http.post(
      `${this.urlPresentacion}/cargaMasiva/setUpsert`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
        headers: {'Upload-File': 'true'}
      }
    );
  }

  getFileSettings = (): Observable<any> => {
    return this.http.post(`${this.urlPresentacion}/archivo/settings`, null);
  }

  getInfoByTrackinNumber = (trackingNumber:string):Observable<any> =>{
    return this.http.post(`${this.urlPresentacion}/mvcontent/getByTrackNum`, {trackingNumber: trackingNumber}).pipe(catchError(err => {
      // console.log('error', err);
      return throwError(err);
    }));;
  }

  getFileInfo = (data: {
    id: string, version: number, buscarBorrador: boolean, modo: number, pageSize: number
  }): Observable<any> => {
    const body = new HttpParams()
      .set('id', data.id)
      .set('version', `${data.version}`)
      .set('buscarBorrador', `${data.buscarBorrador}`)
      .set('modo', `${data.modo}`)
      .set('pageSize', `${data.pageSize}`)

      .set('incluirHistorial', `true`)
      .set('maxVersionesHistorial', `0`);

    const params = {
      id:data.id,
      version: data.version,
      incluirHistorial: true,
      maxVersionesHistorial: 0
    }
    // console.log(params);


    return this.http.post(`${this.urlPresentacion}/archivo/fileInfo`, params).pipe(catchError(err => {
      // console.log('error', err);
      return throwError(err);
    }));;

  }

  download = (id: string, version: number, buscarBorrador: boolean, name: string): Observable<any> => {
    const params = {
      idArchivo: id,
      version: `${version}`,
    };
    return this.http.get(`${this.urlPresentacion}/archivo/download`, {
      params,
      responseType: 'blob' as 'json'
    }).pipe(map((response: any) => {
      const binaryData = [];
      binaryData.push(response);
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(
        new Blob(binaryData, { type: response.type })
      );
      downloadLink.setAttribute('download', name);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    }));
  }

  deleteFile = (params: any): Observable<any> => {
    let body = new HttpParams();

    Object.keys(params).forEach(k => {
      body = body.set(k, params[k]);
    });

    return this.http.post(`${this.urlPresentacion}/archivo/delete`, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(catchError(err => {
      // console.log('error', err);
      return throwError(err);
    }));
  }

  deleteDraft = (id: string): Observable<any> => {
    const body = new HttpParams()
      .set('id', id);
    return this.http.post(`${this.urlPresentacion}/archivo/deleteDraft`, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(catchError(err => {
      // console.log('error', err);
      return throwError(err);
    }));
  }

  updateTags = (params: any): Observable<any> => {
    let body = new HttpParams();

    Object.keys(params).forEach(k => {
      body = body.set(k, params[k]);
    });

    return this.http.post(`${this.urlPresentacion}/archivo/updTags`, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(catchError(err => {
      // console.log('error', err);
      return throwError(err);
    }));
  }
}
