import { Actividad } from './../../../../../03-formulario/store/cargamasiva/cargamasiva.store.model';
import { DataMemory, BandejaTrazabilidad, TrazabilidadRequest, BuscadorBandejaTrazabilidad } from './../trazabilidad.store.model';
import { AppCurrentFlowStore } from './../../../../../../../../../../src/app/core/store/app.currentFlow.store';
import { TrazabilidadService } from './../../service/trazabilidad.service';
import { IBandejaTrazabilidad, IBuscadorBandejaTrazabilidad, IDataMemory, ITrazabilidadRequest, IGridBandejaTrazabilidad, ITrazabilidadDistinct } from './../trazabilidad.store.interface';
import update from 'immutability-helper';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, concatMap, filter } from 'rxjs/operators';
import { FormType, IDataGridPageRequest, isNullOrEmptyArray, ComboList } from '@sunedu/shared';

export class TrazabilidadBandejaActions {

  constructor(
    private getState: () => IBandejaTrazabilidad,
    private setState: (newState: IBandejaTrazabilidad) => void,
    private trazabilidadService: TrazabilidadService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }
  setInit = (form: Partial<IBuscadorBandejaTrazabilidad>) => {
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
  setModalReadOnly = (formRequest:IBuscadorBandejaTrazabilidad) => {
    const state = this.getState();
    this.setState({
      ...state,
      //isLoading: true,
      formBuscar:formRequest
    });
  }
  setStateIsLoading(isLoading: boolean) {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: isLoading }
      })
    );
  }
  fetchError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  }
  setDataMemory=(formRequest:Partial<IBuscadorBandejaTrazabilidad>)=>{
    this.setState(
      update(this.getState(), {
        dataMemory:{
          idProceso: {$set:formRequest.idProceso}
        }
      })
    );
  }
  private setDataMemoryCombos=(listUnicos:Partial<ITrazabilidadDistinct>)=>{
    this.setState(
      update(this.getState(), {
        dataMemory:{
          fechamin : {$set:listUnicos.fechaMinimo},
          fechamax : {$set:listUnicos.fechaMaximo},
          actividad: {$set:listUnicos.pasoNombre},
          responsable: {$set:listUnicos.responsable},
          estado: {$set:listUnicos.estado},
          rol: {$set:listUnicos.rol},
        }
      })
    );
    console.log('setDataMemoryCombos')
    console.log(this.getState());
  }
  getDataMemory=()=>{
    return this.getState().dataMemory;
  }
  setCombos = () => {
    let dataMemory = this.getState().dataMemory;

    this.setState(
      update(this.getState(), {
        comboLists:{
          actividades : { $set:this.setComboList(dataMemory.actividad)},
          responsables : { $set:this.setComboList(dataMemory.responsable)},
          estados : { $set:this.setComboList(dataMemory.estado)},
          roles : { $set:this.setComboList(dataMemory.rol)},
        }
      })
    );
    console.log('setCombos')
    console.log(this.getState());
  }
  private setComboList(items:Array<string>){
    let listCombo = new ComboList([]);
    //console.log('CAYL state',state);
    if(items.length!=0){
      let list=[];
      let elementos = (items || []);
      elementos.map(element=>{
        list.push({
          text:element,
          value:element
        });
      });
      listCombo = new ComboList(list);
    }
    return listCombo
  }
  asyncFetchListTrazabilidad = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    }
    ,formBuscar: Partial<IBuscadorBandejaTrazabilidad> = this.getState().formBuscar)
    : Observable<IBuscadorBandejaTrazabilidad> =>{
      let request = new TrazabilidadRequest();
      request.filter = formBuscar;
      //request.filter.idProceso = formBuscar.idProceso;
      return this.trazabilidadService.getTrazabilidadByIdProceso(request).pipe(
        map(response => {
          console.log('asyncFetchListTrazabilidad');
          console.log(response);
          this.setDataMemoryCombos(response.data[0].listUnicos);
          this.asyncFetchListTrazabilidadSuccess(response.data[0].proceso,response.totalPages, response.totalRows, pageRequest);
          return response;
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }
  private crudError = ({ error }) => {
    const mensajes = Object.entries(error.errors).map(item => ({ msg: item[1] }));
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: mensajes }
      })
    );
  }
  compareValues = (key, order = 'asc') => {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }
  private asyncFetchListTrazabilidadSuccess = (elements,totalItems,totalPages,  pageRequest: IDataGridPageRequest) => {
    const total = elements.length;
    let elementos = (elements || []).slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);

    elementos = elementos.sort(this.compareValues(pageRequest.orderBy,pageRequest.orderDir));
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        source: {
          items: { $set: elementos },
          total: { $set: total },
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
  resetModal = () => {
    this.setState(new BandejaTrazabilidad());
  };
}

