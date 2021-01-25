import update from 'immutability-helper';
import { of, Observable, throwError } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { LaboratorioService } from '../../../service/laboratorio.service';
import { IRequestLaboratorio,IBandejaLaboratorio, IGridBandejaLaboratorio,
  IEntidadLaboratorio } from '../laboratorio.store.interface';
  import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit } from '@lic/core';

export class LaboratorioBandejaActions {

  constructor(
    private getState: () => IBandejaLaboratorio,
    private setState: (newState: IBandejaLaboratorio) => void,
    private laboratorioService: LaboratorioService,
    private storeCurrent: AppCurrentFlowStore,
  ) {

  }
  
  setInit = (formRequest: IRequestLaboratorio) => {
    const state = this.getState();
    this.setState({
      ...state,
      form: formRequest
    });
  }
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  asyncFetchPageLaboratorio = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().form): Observable<any> => {
    this.fetchLaboratorioBegin(); 
    
    return this.laboratorioService.getFormatoDetalleByVersion(filters.idVersion, filters.idSedeFilial).pipe(
      tap(response => {
        if (Object.entries(response).length != 0){
          this.fetchPageLaboratorioSucces(response.laboratorios.filter(x => x.idLocal == filters.idLocal.toUpperCase()), response.count, pageRequest);        
        } else {
          this.fetchPageLaboratorioSucces([], 0, pageRequest);        
        }        
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  
  asynDeleteLaboratorio = (id: string): Observable<IEntidadLaboratorio> => {
    this.fetchLaboratorioBegin();    
    const state = this.getState();  
    return this.laboratorioService.getFormatoDetalleByVersion(state.form.idVersion, state.form.idSedeFilial)
      .pipe(
        map(response => {
          const index = response.laboratorios.findIndex(item => item.id == id);
          let form = response.laboratorios[index];
          form.esEliminado = true;

          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);

          const laboratorioUpdate = [...response.laboratorios.slice(0, index), form, ...response.laboratorios.slice(index + 1)];
          
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "laboratorio",              
              "idVersion": state.form.idVersion,
              "idSedeFilial": state.form.idSedeFilial,
              "idLocal": state.form.idLocal
            },
            datosProceso: {
              "nombre": "laboratorios",
              "IdElemento": form.id
            },
            laboratorios: laboratorioUpdate
          };

          return request;
        }),
        concatMap(request => this.laboratorioService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.fetchLaboratorioSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
  private fetchLaboratorioSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };

  private fetchLaboratorioBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };
  private fetchPageLaboratorioSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {  
    var filters = this.getState().form;    
    let elementos = (items || []).filter(item => !item.esEliminado);
    elementos = (items || []).filter(item => !item.esEliminado)
      .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
    elementos = elementos.sort(
      function (a, b) {
        if (a.codigo> b.codigo)
          return 1;
        if (a.codigo < b.codigo)
          return -1;
        return 0;
      });
      let numeroOrden = 0;
      
      elementos.forEach(element => {     
        numeroOrden = numeroOrden + 1;
        element['numeroOrden'] = numeroOrden;
        element['descripcionTipoLaboratorioTaller'] = filters.listTipoLaboratorio.list.find(x => x.value == element.tipoLaboratorioTallerEnum).text.toUpperCase()      
      });

      const totalItems =(items || []).filter(item => !item.esEliminado).length; 
      const elementosPag = (items || []).filter(item => !item.esEliminado)
        .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
  
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
          items: { $set: elementosPag },
          total: { $set: totalItems },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  }
  
}
