import update from 'immutability-helper';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { SedeFilialService } from '../../../service/sedefilial.service';
import { IBuscardorSedeFilial, IFormBuscardorSedeFilial, IFormSedeFilial } from '../sedefilial.store.interface';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit } from '@lic/core';

export class SedeFilialBuscadorActions {
  constructor(
    private getState: () => IBuscardorSedeFilial,
    private setState: (newState: IBuscardorSedeFilial) => void,
    private sedeFilialService: SedeFilialService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }

  setInit = (form: IFormBuscardorSedeFilial) => {
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
  
  

  asyncFetchSedeFilial = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar) => {

    this.fetchSedeFilialBegin();

    this.sedeFilialService.searchPageSedeFilial(pageRequest, filters).pipe(
      tap(response => {
        this.fetchPageSedeFilialSucces(response.data, response.cout, pageRequest);
      }),
      catchError(error => {
        this.fetchSedeFilialError(error);
        return throwError(error);
      })
    );
  }

  asyncFetchPageSedeFilial = ( 
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar): Observable<any> => {
    this.fetchSedeFilialBegin();
    return this.sedeFilialService.getFormatoByVersion(filters.idVersion).pipe(
      tap(response => {          
        let sede = response.sedeFiliales.filter(x => !x.esEliminado && x.esSedeFilial);        
        let orderFiliales = response.sedeFiliales.filter(x => !x.esEliminado && !x.esSedeFilial).sort(function(a, b) { if (a.codigo > b.codigo) return 1; if (a.codigo < b.codigo) return -1; return 0;});
        let orderSedeFiliales = sede.concat(orderFiliales);
        this.fetchPageSedeFilialSucces(orderSedeFiliales, response.count, pageRequest);        
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  private fetchSedeFilialBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  asynDeleteSedeFilial = (formValue: any): Observable<IFormSedeFilial> => {
    this.fetchSedeFilialBegin();
    const state = this.getState();
    return this.sedeFilialService.getFormatoByVersion(state.formBuscar.idVersion)
      .pipe(
        map(response => {
          const index = response.sedeFiliales.findIndex(item => item.id == formValue.id);
          let form = response.sedeFiliales[index];
          form.esEliminado = true;  
          
          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);
          
          const sedeFilialUpdate = [...response.sedeFiliales.slice(0, index), form, ...response.sedeFiliales.slice(index + 1)];
          const request = {
            ...response,
            RecalculoNumeracion: {
              "nombre": "sedeFilial",
              "prefijo": "F",
              "idVersion": state.formBuscar.idVersion,
              "idSedeFilial": form.id,
              "idLocal": "",
              "usuarioModificacion": form["usuarioModificacion"],
              "fechaModificacion": form["fechaModificacion"],
              "tipoOperacion": form["tipoOperacion"]
            },
            datosProceso:{
              "nombre":"SEDEFILIALES",
              "idElemento": form.id
            },
            sedeFiliales: sedeFilialUpdate
          };

          return request;
        }),
        concatMap(request => this.sedeFilialService.setUpdateFormato(request)),
        tap(response => {
          this.fetchSedeFilialSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  private fetchSedeFilialSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };

  private fetchPageSedeFilialSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
    
    if (typeof(items) != 'undefined'){
      items.forEach(function(index){    
        index['nombreDepartamento'] = index.descripcionUbigeo.split('/')[0];
        index['nombreProvincia'] = index.descripcionUbigeo.split('/')[1];
        index.esSedeFilial = index.esSedeFilial ? 'SÍ' : 'NO';       
      });    
    }
    const totalItems =(items || []).filter(item => !item.esEliminado).length; 
    const elementos = (items || []).filter(item => !item.esEliminado)
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
          items: { $set: elementos },
          total: { $set: totalItems},
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  }
  getSedesBandeja = ()=>{
    return this.getState().source.items;
  }
  private fetchSedeFilialError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  };
}
