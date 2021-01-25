import { find } from 'lodash/find';
import { state } from '@angular/animations';
import { DataMemory } from './../trazabilidad.store.model';
import { forEach } from '@angular/router/src/utils/collection';
import { AppCurrentFlowStore } from './../../../../../../../../../../src/app/core/store/app.currentFlow.store';
import { TrazabilidadService } from './../../service/trazabilidad.service';
import { IBandejaSolicitud, IBuscardorBandejaSolicitud, IDataMemory } from './../trazabilidad.store.interface';
import update from 'immutability-helper';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, concatMap, filter } from 'rxjs/operators';
import { FormType, IDataGridPageRequest, isNullOrEmptyArray, ComboList } from '@sunedu/shared';
import moment from 'moment';
import { isNullOrUndefined } from 'util';
export class SolicitudBandejaActions {



  constructor(
    private getState: () => IBandejaSolicitud,
    private setState: (newState: IBandejaSolicitud) => void,
    private trazabilidadService: TrazabilidadService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }
  setInit = (formRequest: Partial<IBuscardorBandejaSolicitud>) => {
    const state = this.getState();
    this.setState({
      ...state,
      formBuscar: formRequest
    });
  }

  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  asyncFetchListSolicitudes = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    }
    ,formBuscar: Partial<IBuscardorBandejaSolicitud> = this.getState().formBuscar)
    : Observable<any> =>{
      return this.trazabilidadService.getSolicitudAll(formBuscar).pipe(
      tap(response => {
        console.log(response);
        this.asyncFetchListSolicitudesSuccess(response,  pageRequest);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  private getUniversidadByID=(id:any)=>{
    return this.getState().dataMemory.universidad.find(s=>s.id==id).nombre;
  }
  private getEstado=(id:any)=>{
    return this.getState().dataMemory.estado.find(s=>s.value==id).text;
  }
  private asyncFetchListSolicitudesSuccess = (items: any,  pageRequest: IDataGridPageRequest) => {
    let elementos = (items || []).slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
    let numeracion = 1;

    let elementosNumerados = elementos.map(item=>{
      item.numero = numeracion;
      item.universidad = this.getUniversidadByID(item.idEntidad);
      item.estado = this.getEstado(item.estadoSolicitudEnum);
      //item.regimenEstudioEnum = regimenEstudioEnum.find(itemreg=>itemreg.value == item.regimenEstudioEnum).text.toUpperCase();
      numeracion++;
      return item;
    })
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        source: {
          items: { $set: elementosNumerados },
          total: { $set: items.length },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
    console.log('source');
    console.log(this.getState());
  };
  getEntidades = (): Observable<any[]> => {
    return this.trazabilidadService.getEntidades().pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  };
  fetchError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  }
  setDataMemory=(enums)=>{
    console.log("setDataMemory");
    let dataMemory:IDataMemory = new DataMemory();
    dataMemory.universidad = enums[1];
    dataMemory.estado = enums[0].list;
    this.setState(
      update(this.getState(), {
        dataMemory:{$set:dataMemory}
      })
    );
    console.log("comboLists");
    console.log(this.getState().comboLists);

  }
  setCombos = () => {
    let universidades = this.getState().dataMemory.universidad;
    let listaUniversidad = new ComboList([]);
    //console.log('CAYL state',state);
    if(universidades.length!=0){
      let list=[];
      let elementos = (universidades || []);
      elementos.map(element=>{
        list.push({
          text:element.nombre,
          value:element.id
        });
      });
      listaUniversidad = new ComboList(list);
    }
    this.setState(
      update(this.getState(), {
        comboLists:{
          universidades : { $set:listaUniversidad},
        }
      })
    );
  }
  setStateIsLoading(isLoading: boolean) {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: isLoading }
      })
    );
  }
}
