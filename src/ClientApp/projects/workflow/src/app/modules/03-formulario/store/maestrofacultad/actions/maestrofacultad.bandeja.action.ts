import update from 'immutability-helper';
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IRequestSolicitudVersion,IBandejaMaestroFacultad, IEntidadMaestroFacultad } from '../maestrofacultad.store.interface';
import { MaestroFacultadService } from '../../../service/maestrofacultad.service';
import { RequestSolicitudVersion } from '../maestrofacultad.store.model';
import { AppAudit, AppCurrentFlowStore } from '@lic/core';
export class MaestroFacultadBandejaActions {
  
  constructor(
    private getState: () => IBandejaMaestroFacultad,
    private setState: (newState: IBandejaMaestroFacultad) => void,
    private maestroFacultadService: MaestroFacultadService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }
  setInit = (formRequest: IRequestSolicitudVersion) => {
    const state = this.getState();
    this.setState({
      ...state,
      formRequest: formRequest
    });
  }
  
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  
  
  asyncFetchPageMaestroFacultad = (formRequest:Partial<RequestSolicitudVersion>,pageRequest: IDataGridPageRequest = {
    page: this.getState().source.page,
    pageSize: this.getState().source.pageSize,
    orderBy: this.getState().source.orderBy,
    orderDir: this.getState().source.orderDir,
  }): Observable<any> => {
    this.fetchMaestroFacultadBegin();
    return this.maestroFacultadService.getFormatoByVersion(formRequest.idVersion).pipe(
      tap(response => {
        this.fetchPageMaestroFacultadSucces(response.facultades, pageRequest);
        return;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  } 
 

  asynDeleteMaestroFacultad = (id: string,idVersion: string): Observable<IEntidadMaestroFacultad> => {
    this.fetchMaestroFacultadBegin();
    const state = this.getState();
    return this.maestroFacultadService.getFormatoByVersion(idVersion)
      .pipe(
        map(response => {
          const index = response.facultades.findIndex(item => item.id == id);
          let form = response.facultades[index];
          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);
          form.esEliminado = true;
          const facultadesUpdate = [...response.facultades.slice(0, index), form, ...response.facultades.slice(index + 1)];
          const request = {
            ...response,
            datosBloqueo: {
              "NombreElemento": "Facultad",
              "IdElemento": form.id
            },
            datosProceso:{
              "nombre":"FACULTADES",
              "idElemento": form.id
            },
            facultades: facultadesUpdate
          };

          return request;
        }),
        concatMap(request => this.maestroFacultadService.setUpdateFormato(request)),
        tap(response => {
          this.fetchMaestroFacultadSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
  private fetchMaestroFacultadBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchMaestroFacultadSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  
  //response.programaMenciones,regimenEstudioEnum
  private fetchPageMaestroFacultadSucces = (items: any, pageRequest: IDataGridPageRequest) => {
    let elementos = (items || []).filter(item => !item.esEliminado);
    let numeracion = 0;
    
    const totalItems = elementos.length;
    elementos = elementos.slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);    
    //Ordenar descendente
    elementos = elementos.sort(
      function (a, b) {
        if (a.codigo> b.codigo)
          return 1;
        if (a.codigo < b.codigo)
          return -1;
        return 0;
      });
     
      const state = this.getState();
    state.gridDefinition.columns.forEach(column=>{
      if(column.label=='Acciones'){
        column.buttons.forEach(button=>{
          if(button.action=='EDITAR'){
            button.hidden = item=>state.readOnly;
          }
          if(button.action=='ELIMINAR'){
            button.hidden = item=>state.readOnly;
          }
        })
      }
    });
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        source: {
          items: { $set: elementos },
          total: { $set: totalItems },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  };
  private fetchMaestroFacultadError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  }; 
}
