import { AppAudit } from './../../../../../../../../../src/app/core/state/app-audit.action';
import { AppCurrentFlowStore } from './../../../../../../../../../src/app/core/store/app.currentFlow.store';
import { forEach } from '@angular/router/src/utils/collection';

import update from 'immutability-helper';
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest, ComboList, FormType } from '@sunedu/shared';
import { IRequestSolicitudVersion,IBandejaMaestroProgramaVinculado, IEntidadMaestroProgramaVinculado, IGridBandejaMaestroProgramaVinculado } from '../maestroprogramasegunda.store.interface';
import { MaestroProgramaSegundaService } from '../../../service/maestroprogramasegunda.service';
import { BandejaMaestroProgramaVinculado } from '../maestroprogramasegunda.store.model';
import * as uuid from 'uuid';


export class VinculadoBandejaActions {
  
  constructor(
    private getState: () => IBandejaMaestroProgramaVinculado,
    private setState: (newState: IBandejaMaestroProgramaVinculado) => void,
    private maestroProgramaSegundaService: MaestroProgramaSegundaService,
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
  asyncFetchCombos = () => {
    this.fetchMaestroProgramaSegundaBegin();
    const state = this.getState();   
    let lista = new ComboList([]);
    if(state.programas.filter(item => !item.esEliminado).length!=0){
      let list=[]; 

    

      state.programas.filter(item => !item.esEliminado).forEach(elementPrograma=>{
        state.programasSe.filter(itemSegEsp=>itemSegEsp.id==state.id).forEach(elementSegEsp =>{
          if(elementSegEsp.programasVinculados.findIndex(itemSe=>itemSe.id==elementPrograma.id)==-1)
          {
            list.push({
              text:elementPrograma.codigo+" - "+elementPrograma.denominacionPrograma,
              value:elementPrograma.id
            });
          }
        })
      }) 
     
      lista = new ComboList(list); 
    }
    
    state.comboLists = {
      codigoProgramaVinculados: lista,
    };
    this.setState(state);
    this.fetchMaestroProgramaSegundaSucces();
  }
  setProgramaId = (id:string) =>{
    const state = this.getState();
    this.setState({
      ...state,
      idPrograma: id
    });
  }
  getProgramaId = () =>{
    return this.getState().idPrograma;
  }
  getProgramas = ()=>{
    return this.getState().programas;
  }
  setModalVinculado = (id: string) : Observable<any>=> {
    this.fetchMaestroProgramaSegundaBegin();
    return this.maestroProgramaSegundaService.getFormatoByVersion(this.getState().formRequest.idVersion).pipe(
      map(response => {
        const state = this.getState();
        this.setState({
          ...state,
          id: id,
          programas:response.programaMenciones,
          programasSe:response.segundaEspecialidades
          //type: FormType.CONSULTAR,
        });
        this.fetchMaestroProgramaSegundaSucces();
        return response;
      }),
      catchError(error => {
        this.crudError(error);
        return throwError(error);
      })
    ); 
  };
  private crudBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  }; 
  setStateIsLoading(isLoading: boolean) {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: isLoading }
      })
    );
  } 
  asynSavePrograma = (element:any): Observable<any> => {
    this.crudBegin();
    let programaVinculado;
    if(element.codigoCINE!=-1)
      programaVinculado = {
        id: element.id, 
        denominacionPrograma:element.codigo+" - "+element.denominacionPrograma
      }
    else
      programaVinculado = {
        id: element.id, 
        denominacionPrograma:element.codigo+" - "+element.denominacionPrograma
      }
      const audit = new AppAudit(this.storeCurrent);
      programaVinculado = audit.setInsert(programaVinculado); 
    return this.maestroProgramaSegundaService.getFormatoByVersion(this.getState().formRequest.idVersion)
      .pipe(
        map(response => {
          const index = response.segundaEspecialidades.findIndex(item => item.id == this.getState().id);
          let listUpdate = null;
          const item = response.segundaEspecialidades[index];

          const itemUpdate = {
            ...item,
            "tipoOperacion":"M",
            programasVinculados:[
              ...item.programasVinculados,
              programaVinculado
            ]
          };

          listUpdate = [...response.segundaEspecialidades.slice(0, index), itemUpdate, ...response.segundaEspecialidades.slice(index + 1)];
          const request = {
            ...response,
            datosProceso:{
              "nombre":"SEGUNDAESPECIALIDADES",
              "idElemento": item.id
            },
            "tipoOperacion":"M",
            segundaEspecialidades: listUpdate
          };
          return request;
        }),
        concatMap(request => this.maestroProgramaSegundaService.setUpdateFormato(request)),
        tap(response => {          
          this.crudSucces();
          return response;
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  };
  private crudSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  private crudError = ({ error }) => {
    const mensajes = Object.entries(error.errors).map(item => ({ msg: item[1] }));
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: mensajes }
      })
    );
  }
  resetModal = () => {
    this.setState(new BandejaMaestroProgramaVinculado());
  };
  asyncFetchPageMaestroProgramaSegunda = (pageRequest: IDataGridPageRequest = {
    page: this.getState().source.page,
    pageSize: this.getState().source.pageSize,
    orderBy: this.getState().source.orderBy,
    orderDir: this.getState().source.orderDir,
  }): Observable<any> => {
    this.fetchMaestroProgramaSegundaBegin();
    return this.maestroProgramaSegundaService.getFormatoByVersion(this.getState().formRequest.idVersion).pipe(
      tap(response => {
        
        const index = response.segundaEspecialidades.findIndex(item => item.id == this.getState().id);
        const form = response.segundaEspecialidades[index];        
        this.fetchPageMaestroProgramaSegundaSucces(response,form.programasVinculados, pageRequest);
        return;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }; 
  private pad(num, size) {
    let s = num+'';
    while (s.length < size) s = "0" + s;
    return s;
  }
  private compareValues(key:string, order = 'asc') {
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
  setModalEditar = (id: string) => {
    const state = this.getState();

  }
  setModalConsultar = (id: string) => {
    const state = this.getState();

  }


  asynDeleteMaestroProgramaSegunda = (id: string): Observable<IEntidadMaestroProgramaVinculado> => {
    this.fetchMaestroProgramaSegundaBegin();
    const state = this.getState();
    return this.maestroProgramaSegundaService.getFormatoByVersion(state.formRequest.idVersion)
      .pipe(
        map(response => {
          const index = response.segundaEspecialidades.findIndex(item => item.id == this.getState().id);
          let listUpdate = null;
          const item = response.segundaEspecialidades[index];
          const indexVin = item.programasVinculados.findIndex(item => item.id == id);
          const itemVin = item.programasVinculados[indexVin];
          let itemVinUpdate = {
            ...itemVin,
            esEliminado:true,
            id: uuid.v4(),
            //tipoOperacion: "E"
          };

          const audit = new AppAudit(this.storeCurrent);
          itemVinUpdate = audit.setDelete(itemVinUpdate); 
          //[...response.segundaEspecialidades.slice(0, index), itemUpdate, ...response.segundaEspecialidades.slice(index + 1)];
          const itemUpdate = {
            ...item,
            "tipoOperacion":"M",
            programasVinculados:[
              ...item.programasVinculados.slice(0, indexVin),
              itemVinUpdate,
              ...item.programasVinculados.slice(indexVin + 1),
            ]
          };
          listUpdate = [...response.segundaEspecialidades.slice(0, index), itemUpdate, ...response.segundaEspecialidades.slice(index + 1)];
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "MAESTROPROGRAMASEGUNDAESPECIALIDAD",              
              "idVersion": state.formRequest.idVersion,
              "idSedeFilial": "",
              "idLocal": ""
            },
            datosProceso:{
              "nombre":"SEGUNDAESPECIALIDADES",
              "idElemento": item.id
            },
            "tipoOperacion":"M",
            segundaEspecialidades: listUpdate
          };
          return request;
        }),
        concatMap(request => this.maestroProgramaSegundaService.setUpdateFormato(request)),
        tap(response => {
          this.fetchMaestroProgramaSegundaSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
  private fetchMaestroProgramaSegundaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchMaestroProgramaSegundaSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  private fetchPageMaestroProgramaSegundaSucces = (formato:any,items: any, pageRequest: IDataGridPageRequest) => {
    let elementos:IGridBandejaMaestroProgramaVinculado[] = (items || []).filter(item => !item.esEliminado);
    const totalelementos = elementos.length;
    const elementosFinal = elementos.slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
    let numeracion = 0;
    const programas = this.getState().programas;
    elementosFinal.forEach(elemento => {
      const programaFiltrado = programas.filter(element => element.id==elemento.id);
      elemento.denominacionPrograma = programaFiltrado[0].denominacionPrograma;
    }); 

    /*const totalItems =(items || []).filter(item => !item.esEliminado).length; 
      const elementosPag = (items || []).filter(item => !item.esEliminado)
        .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);*/

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
        allItems:{$set:elementosFinal},
        programas:{$set:formato.programaMenciones},
        programasSe:{$set:formato.segundaEspecialidades},
        source: {
          items: { $set: elementosFinal },
          total: { $set: totalelementos },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
    
  };
  private fetchMaestroProgramaSegundaError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  };
}
