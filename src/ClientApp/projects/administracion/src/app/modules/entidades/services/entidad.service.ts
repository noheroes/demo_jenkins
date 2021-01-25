import { Injectable } from '@angular/core';
import { ConfigurationService } from '@lic/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IDataGridPageRequest } from '@sunedu/shared';

import {
  IEntidad,
  IFormBuscardorEntidad,
  StatusResponse,
} from '../stores/entidad.store.interface';
/*
@Injectable({
  providedIn: 'root'
})*/
@Injectable()
export class EntidadService {
  private urlPresentacion = `${this.configuration.apiPresentacionAddress}/api/v1`;

  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient
  ) {}

  getEntidades = (): Observable<IEntidad[]> => {
    const items = this.http.post<IEntidad[]>(
      `${this.urlPresentacion}/entidad/getEntidades`,
      {}
    );
    return items;
  };
  saveEntidad = (form: IEntidad): Observable<StatusResponse> => {
    form.rowNum = 0;

    return this.http.post<StatusResponse>(
      `${this.urlPresentacion}/entidad/setRegistroEntidad`,
      form
    );
  };
  updateEntidad = (form: any): Observable<any> => {
    return this.http.post<any>(`${this.urlPresentacion}/entidad/setModificacionEntidad`,form);
  };
  deleteEntidad = (form: IEntidad): Observable<StatusResponse> => {
    return this.http.post<StatusResponse>(
      `${this.urlPresentacion}/entidad/setEliminacionEntidad`,
      form
    );
  };
  searchPageEntidad = (
    pageRequest: IDataGridPageRequest,
    value: Partial<IFormBuscardorEntidad>
  ): Observable<IEntidad[]> => {
    return this.getEntidades();
  };
}
