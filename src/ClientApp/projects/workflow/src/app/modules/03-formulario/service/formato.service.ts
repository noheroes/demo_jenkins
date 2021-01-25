import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IMediosVerificacion, ITreeNode } from '../store/mediosverificacion/mediosverificacion.store.interface';

/*
@Injectable({
  providedIn: 'root'
})*/
@Injectable()
export class FormatoService {
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1`;

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient) {

  }

  // getFormato = (idVersionSolicitud:string):Observable<any>=>{
  //   return this.http.post<any>(`${this.urlPresentacion}/formato/getFormatoByVersion`,{idVersion: idVersionSolicitud})
  // }

}
