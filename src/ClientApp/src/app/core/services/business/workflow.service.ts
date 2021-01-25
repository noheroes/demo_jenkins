import { Observable, EMPTY, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IFormularioModel,
  IFormularioRequest,
  IBandejaActividad,
  IFiltroBandejaModel,
  ProcedimientoRequest,
  IFlujoInicialRequest,
} from '../../interfaces';
import { ConfigurationService } from '../infrastructure/configuration.service';
import { delay, retryWhen, catchError, map } from 'rxjs/operators';
import { ICurrentFlow } from '../../store';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private url: string = `${this.configuration.apiGatewayAddress}/api/v1`;
  private urlWorkflow: string = `${this.configuration.apiWorkflowAddress}/api/v1/`;
  private urlPresentacion: string = `${this.configuration.apiPresentacionAddress}/api/v1/`;
  constructor(
    private configuration: ConfigurationService,
    private http: HttpClient
  ) {}

  listarProcedimientos = (): Observable<any> => {
    // return this.http.get(`${this.urlWorkflow}workflow/ListarProcedimientos`);
    return this.http.post(
      `${this.urlPresentacion}config/getProcedimientos`,
      null
    );
  };

  listarEntidades = (): Observable<any> => {
    return this.http.get(`${this.urlWorkflow}solicitud/ListarEntidades`);
  };

  listarEntidadesInicio = (parametros:any): Observable<any> => {
    return this.http.post(`${this.urlPresentacion}flujo/getUniversidadesPor`, parametros);
  };


  listarSolicitudesInicio = (parametros:any): Observable<any> => {
    return this.http.post(`${this.urlPresentacion}flujo/getSolicitudPorUniversidad`, parametros);
  };

  listarProcedimientosInicio = (parametros:any): Observable<any> => {
    return this.http.post(`${this.urlPresentacion}flujo/getFlujosPor`, parametros);
  };

  listarSubFlujoInicio = (parametros:any): Observable<any> => {
    return this.http.post(`${this.urlPresentacion}flujo/getSubFlujosPor`, parametros);
  };

  inicioFlujoSeleccionado = (parametros:any): Observable<any> => {
    return this.http.post(`${this.urlPresentacion}flujo/setInicioFlujoSeleccionado`, parametros);
  };


  // getFormaluarioModel = (formularioRequest: IFormularioRequest): Observable<IFormularioModel> => {
  //   return this.http.get<IFormularioModel>(`${this.urlWorkflow}workflow/GetFormularioModel`, { params: {
  //     idProceso: `${formularioRequest.idProceso}`,
  //     idProcesoBandeja: `${formularioRequest.idProcesoBandeja}`
  //   }});
  // }

  getFormaluarioModel = (
    formularioRequest: any
  ): Observable<IFormularioModel> => {
    return this.http.post<IFormularioModel>(
      `${this.urlPresentacion}config/getFormularioModel`,
      formularioRequest
    );
    // return this.http.get<IFormularioModel>(`${this.urlWorkflow}workflow/GetFormularioModel`, { params: {
    //   idProceso: `${formularioRequest.idProceso}`,
    //   idProcesoBandeja: `${formularioRequest.idProcesoBandeja}`
    // }});
  };

  getFormaluarioModelConsulta = (
    formularioRequest:any
  ): Observable<IFormularioModel> => {
    return this.http.post<IFormularioModel>(
      `${this.urlPresentacion}config/getFormularioModelConsulta`,
      formularioRequest
    );
    // return this.http.get<IFormularioModel>(`${this.urlWorkflow}workflow/GetFormularioModel`, { params: {
    //   idProceso: `${formularioRequest.idProceso}`,
    //   idProcesoBandeja: `${formularioRequest.idProcesoBandeja}`
    // }});
  };

  getFrontSettings = (
  ): Observable<any> => {
    return this.http.post<any>(
      `${this.urlPresentacion}config/getFrontSettings`,null);
  };

  // getBandejaDetalle = (pageRequest: IDataGridPageRequest, filtroBandejaModel: IFiltroBandejaModel): Observable<any> => {
  //   const data = {
  //     PageSize: String(pageRequest.pageSize),
  //     Skip: String(pageRequest.skip),
  //     SortField: String(pageRequest.orderBy),
  //     SortDir: String(pageRequest.orderDir),
  //     'Filter.codigosFlujo': arrayToString(filtroBandejaModel.codigosFlujo),
  //     'Filter.Administrado': filtroBandejaModel.Administrado == null ? '' : filtroBandejaModel.Administrado,
  //     'Filter.nroExpediente': filtroBandejaModel.nroExpediente == null ? '' : filtroBandejaModel.nroExpediente,
  //   };
  //   return this.http.get<IBandejaActividad>(`${this.urlWorkflow}workflow/GetBandejaGenerica`, { params: data });
  // }

  // getBandejaDetalle = (pageRequest: IDataGridPageRequest, filtroBandejaModel: IFiltroBandejaModel): Observable<any> => {
  //   console.log("GET CurrentProcedimiento CAYL")
  //   const current = this.storeCurrent.state.currentProcedimiento;

  // const data = {
  //   PageSize: String(pageRequest.pageSize),
  //   Skip: String(pageRequest.skip),
  //   SortField: String(pageRequest.orderBy),
  //   SortDir: String(pageRequest.orderDir),
  //   'Filter.codigosFlujo': arrayToString(filtroBandejaModel.codigosFlujo),
  //   'Filter.Administrado': filtroBandejaModel.Administrado == null ? '' : filtroBandejaModel.Administrado,
  //   'Filter.nroExpediente': filtroBandejaModel.nroExpediente == null ? '' : filtroBandejaModel.nroExpediente,
  // };
  // return this.http.get<IBandejaActividad>(`${this.urlPresentacion}core/GetBandejaGenerica`, { params: data });

  //}

  getBandejaDetalle = (request: any): Observable<any> => {
    return this.http.post<IBandejaActividad>(
      `${this.urlPresentacion}flujo/getBandejaGenerica`,
      request
    );
  };

  // iniciarProcedimiento = (procedimientoRequest: ProcedimientoRequest) => {
  //   return this.http.post<any>(`${this.urlWorkflow}workflow/IniciarFlujo`, procedimientoRequest);
  // }

  iniciarProcedimiento = (flujoRequest: IFlujoInicialRequest) => {
    return this.http.post<any>(
      `${this.urlPresentacion}flujo/setInicioFlujo`,
      flujoRequest
    );
  };

  finalizarActividad = () => {
    return of({
      success: false,
      errors: [
        { msg: 'error 1' },
        { msg: 'error 2' },
        { msg: 'error 3' },
        { msg: 'error 4' },
        { msg: 'error 5' },
      ],
    }).pipe(
      delay(1000),
      map((resp) => {
        throw resp;
        return resp;
      }),
      catchError((err) => throwError(err))
    );
  };
  finalizarActividadOrquestador = (request) => {
    return this.http.post<any>(
      `${this.urlPresentacion + request.formulario.urlFinalizar} `,
      request
    );
  };
  validarActividad = () => {
    return of({
      success: false,
      errors: [
        { msg: 'error 1' },
        { msg: 'error 2' },
        { msg: 'error 3' },
        { msg: 'error 4' },
        { msg: 'error 5' },
      ],
    }).pipe(
      delay(1000),
      map((resp) => {
        throw resp;
        return resp;
      }),
      catchError((err) => throwError(err))
    );
  };

  // mediosVerificacionDiagnostic=(idSolicitudVersion:string)=>{
  //   const parametros = {
  //     idSolicitudVersion:idSolicitudVersion,
  //     verificarGA:true
  //   }
  //   return this.http.post<any>(
  //     `${this.urlPresentacion}mvdiag/byidsolver`,
  //     parametros
  //   );
  // }
}
