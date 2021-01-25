import update from 'immutability-helper';
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IBandejaTaller, IGridBandejaTaller,
  IEntidadTaller, 
  IRequestTaller} from '../taller.store.interface';
import { TallerService } from '../../../service/taller.service';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit } from '@lic/core';
export class TallerBandejaActions {
  
  constructor(
    private getState: () => IBandejaTaller,
    private setState: (newState: IBandejaTaller) => void,
    private tallerService: TallerService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }

  setInit = (formRequest: IRequestTaller) => {
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
  asynDeleteTaller = (id: string): Observable<IEntidadTaller> => {
    this.fetchTallerBegin();    
    const state = this.getState();   
    return this.tallerService.getFormatoDetalleByVersion(state.form.idVersion, state.form.idSedeFilial)
      .pipe(
        map(response => {
          const index = response.talleres.findIndex(item => item.id == id);
          let form = response.talleres[index];
          form.esEliminado = true;

          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);

          const tallerUpdate = [...response.talleres.slice(0, index), form, ...response.talleres.slice(index + 1)];
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "taller",              
              "idVersion": state.form.idVersion,
              "idSedeFilial": state.form.idSedeFilial,
              "idLocal": state.form.idLocal
            },
            datosProceso: {
              "nombre": "talleres",
              "IdElemento": form.id
            },
            talleres: tallerUpdate
          };

          return request;
        }),
        concatMap(request => this.tallerService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.fetchTallerSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  private fetchTallerSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };

  private fetchTallerBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };


  asyncFetchPageTaller = (    
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().form): Observable<any> => {
    this.fetchTallerBegin(); 
    //debugger;  
    return this.tallerService.getFormatoDetalleByVersion(filters.idVersion, filters.idSedeFilial).pipe(
      tap(response => {
        if (Object.entries(response).length != 0){
          this.fetchPageTallerSucces(response.talleres.filter(x => x.idLocal == filters.idLocal.toUpperCase()), response.count, pageRequest);          
        } else {
          this.fetchPageTallerSucces([], 0, pageRequest);
        }        
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  private fetchPageTallerSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {  
    var filters = this.getState().form;    
    let numeroOrden = 0;
    //debugger;
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
      elementos.forEach(element => {
        numeroOrden = numeroOrden + 1;
        element['numeroOrden'] = numeroOrden;
        element['descripcionTipoLaboratorioTaller'] = filters.listTipoTaller.list.find(x => x.value == element.tipoLaboratorioTallerEnum).text.toUpperCase()      
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
