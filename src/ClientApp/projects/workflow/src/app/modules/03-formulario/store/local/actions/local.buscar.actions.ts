import update from 'immutability-helper';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IBuscardorLocal, IFormLocal, IFormBuscardorLocal } from '../local.store.interface';
import { LocalService } from '../../../service/local.service';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit } from '@lic/core';

export class LocalBuscadorActions {
  constructor(
    private getState: () => IBuscardorLocal,
    private setState: (newState: IBuscardorLocal) => void,
    private localService: LocalService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }

  setInit = (form: IFormBuscardorLocal) => {
    const state = this.getState();
    this.setState({
      ...state,
      formBuscar: form
    });
  }


  setModalEditar = (id: string) => {
    const state = this.getState();

  }
  setModalConsultar = (id: string) => {
    const state = this.getState();

  }

  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }


  asyncFetchLocal = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar) => {

    this.fetchLocalBegin();

    this.localService.searchPageLocal(pageRequest, filters).pipe(
      tap(response => {
        this.fetchPageLocalSucces(response.data, response.cout, pageRequest);
      }),
      catchError(error => {
        this.fetchLocalError(error);
        return throwError(error);
      })
    );
  }

  asyncFetchPageLocal = ( 
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar): Observable<any> => {
    this.fetchLocalBegin();
    return this.localService.getFormatoByVersion(filters.idVersion).pipe(
      tap(response => {        
        this.fetchPageLocalSucces(response.sedeFiliales.find(x => x.id == this.getState().formBuscar.id).locales, response.count, pageRequest);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  asynDeleteLocal = (id: string, codigoFilial: string): Observable<IFormLocal> => {
    this.fetchLocalBegin();
    const state = this.getState();
    return this.localService.getFormatoByVersion(state.formBuscar.idVersion)
      .pipe(
        map(response => {
          var index = response.sedeFiliales.findIndex(x => x.id == codigoFilial);
          let sedeFilial = response.sedeFiliales[index];
          var locales = sedeFilial.locales || [];
          let indexLocal = locales.findIndex(x => x.id == id);
          let local = locales[indexLocal];
          local.esEliminado = true;

          const audit = new AppAudit(this.storeCurrent);
          local = audit.setDelete(local);

          let localUpdate = {
            ...local, local            
          };
          const localesUpdate = [...locales.slice(0, indexLocal), localUpdate, ...locales.slice(indexLocal + 1)];

          let sedeFilialUpdate = {
            ...sedeFilial,
            locales: localesUpdate,
            "tipoOperacion":"M",
            "token":sedeFilial.token,
          };

          const sedesFilialesUpdate = [...response.sedeFiliales.slice(0, index), sedeFilialUpdate, ...response.sedeFiliales.slice(index + 1)];
          
          const request = {
            ...response,
            RecalculoNumeracion: {
              "nombre": "local",
              "prefijo": "F",
              "idVersion": state.formBuscar.idVersion,
              "idSedeFilial": codigoFilial,
              "idLocal": id,
              "TipoOperacion": "eliminacion"
            },
            datosProceso:{
              "nombre":"SEDEFILIALES",
              "idElemento": codigoFilial
            },
            sedeFiliales: sedesFilialesUpdate
          }
          return request;
        }),
        concatMap(request => this.localService.setUpdateFormato(request)),
        tap(response => {
          this.fetchLocalSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  private fetchLocalBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchLocalSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  private fetchPageLocalSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
    items.forEach(function(index){    
      index['nombreDepartamento'] = index.descripcionUbigeo.split('/')[0];
      index['nombreProvincia'] = index.descripcionUbigeo.split('/')[1];
      index['nombreDistrito'] = index.descripcionUbigeo.split('/')[2];
      index.esServicioEducativo = index.esServicioEducativo ? 'SÍ' : 'NO'; 
  }); 
    const totalItems = (items || []).filter(item => !item.esEliminado).length;
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
  private fetchLocalError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  };
}
