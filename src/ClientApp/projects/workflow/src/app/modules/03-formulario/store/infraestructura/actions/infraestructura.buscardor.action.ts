import update from 'immutability-helper';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IBuscardorInfraestructura, IFormInfraestructura, IFormBuscardorInfraestructura } from '../infraestructura.store.interface';
import { InfraestructuraService } from '../../../service/infraestructura.service';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit } from '@lic/core';

export class InfraestructuraBuscadorActions {
  constructor(
    private getState: () => IBuscardorInfraestructura,
    private setState: (newState: IBuscardorInfraestructura) => void,
    private InfraestructuraService: InfraestructuraService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }

  setInit = (form: IFormBuscardorInfraestructura) => {
    const state = this.getState();
    this.setState({
      ...state,
      formBuscar: form
    });
  }
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  setModalEditar = (id: string) => {
    const state = this.getState();

  }
  setModalConsultar = (id: string) => {
    const state = this.getState();

  }

  asyncFetchPageInfraestructura = ( 
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar): Observable<any> => {
    this.fetchInfraestructuraBegin();    
    return this.InfraestructuraService.getFormatoDetalleByVersion(filters.idVersion, filters.idSedeFilial).pipe(
      tap(response => {                      
        if (Object.entries(response).length != 0){
          this.fetchPageInfraestructuraSucces(response.infraestructuras.filter(x => x.idLocal == filters.idLocal), response.count, pageRequest);
        } else {
          this.fetchPageInfraestructuraSucces([], 0, pageRequest);
        }        
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  asyncFetchPageInfraestructuraSucces = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar): Observable<any> => {

    this.fetchInfraestructuraBegin();

    return this.InfraestructuraService.fetchPageInfraestructura(pageRequest, filters).pipe(
      tap(response => {
        this.fetchPageInfraestructuraSucces(response.data, response.count, pageRequest);
      }),
      catchError(error => {
        this.fetchInfraestructuraError(error);
        return throwError(error);
      })
    );
  }


  asynDeleteInfraestructura = (id: string): Observable<IFormInfraestructura> => {
    this.fetchInfraestructuraBegin();
    const state = this.getState();    
    return this.InfraestructuraService.getFormatoDetalleByVersion(state.formBuscar.idVersion, state.formBuscar.idSedeFilial)
      .pipe(
        map(response => {
          const index = response.infraestructuras.findIndex(item => item.id == id);
          let form = response.infraestructuras[index];

          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);
          form.esEliminado = true;

          const infraestructuraUpdate = [...response.infraestructuras.slice(0, index), form, ...response.infraestructuras.slice(index + 1)];
          const request = {
            ...response,
            /*datosBloqueo: {
              "NombreElemento": "infraestructura",
              "IdElemento": form.id
            },*/
            datosProceso:{
              "nombre":"infraestructuras",
              "idElemento": form.id
            },
            infraestructuras: infraestructuraUpdate
          };

          return request;
        }),
        concatMap(request => this.InfraestructuraService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.fetchInfraestructuraSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  private fetchInfraestructuraBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchInfraestructuraSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  private fetchPageInfraestructuraSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {       
    let elementos = (items || []).filter(item => !item.esEliminado);
    elementos = (items || []).filter(item => !item.esEliminado)
      .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
    const bloquearRegistro = (elementos.length!=0);
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
        bloquearRegistro: { $set: bloquearRegistro },
        isLoading: { $set: false },
        source: {
          items: { $set: elementos },
          total: { $set: elementos.length },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  };
  private fetchInfraestructuraError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  };
}
