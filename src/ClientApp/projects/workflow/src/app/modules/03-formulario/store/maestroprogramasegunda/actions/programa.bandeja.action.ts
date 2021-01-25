import { AppAudit } from './../../../../../../../../../src/app/core/state/app-audit.action';
import { AppCurrentFlowStore } from './../../../../../../../../../src/app/core/store/app.currentFlow.store';
import update from 'immutability-helper';
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IRequestSolicitudVersion,IBandejaMaestroPrograma, IEntidadMaestroPrograma } from '../maestroprogramasegunda.store.interface';
import { MaestroProgramaSegundaService } from '../../../service/maestroprogramasegunda.service';


export class ProgramaBandejaActions {
  
  constructor(
    private getState: () => IBandejaMaestroPrograma,
    private setState: (newState: IBandejaMaestroPrograma) => void,
    private maestroProgramaService: MaestroProgramaSegundaService,
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
  setCodigoGenerado = (codigoGenerado: any) => {
    const state = this.getState();
    this.setState({
      ...state,
      codigoGenerado: codigoGenerado
    });
  }
  setFormResponse = (response: any) => {
    const state = this.getState();
    this.setState({
      ...state,
      formResponse: response
    });
  }
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  getCodigoGenerado =() => {
    const state = this.getState();
    return state.codigoGenerado;
  }
  getFormResponse =() => {
    const state = this.getState();
    return state.formResponse;
  }
  
  asyncFetchPageMaestroPrograma = (regimenEstudioEnum:any,pageRequest: IDataGridPageRequest = {
    page: this.getState().source.page,
    pageSize: this.getState().source.pageSize,
    orderBy: this.getState().source.orderBy,
    orderDir: this.getState().source.orderDir,
  }): Observable<any> => {
    this.fetchMaestroProgramaBegin();
    return this.maestroProgramaService.getFormatoByVersion(this.getState().formRequest.idVersion).pipe(
      tap(response => {
        //const itemsPre = this.fetchPagePreSucces();
        this.fetchPageMaestroProgramaSucces(response.programaMenciones,regimenEstudioEnum, pageRequest);
        this.setFormResponse(response.facultades);
        return;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  } 
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

  asyncFetchPageMaestroProgramaSucces = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    }): Observable<any> => {

    this.fetchMaestroProgramaBegin();
    return of({
      data: [{
        id: '',
        codigoPrograma: '',
        resolucionCreacion: '',
        fechaCreacion: '',
        modalidadEstudio: '',
        resolucionCreacionModalidad: '',
        fechaCreacionModalidad: '',
        nombreFacultad: '',
        regimenEstudio: '',
        gradoAcademico: '',
        denominacionGradoAcademico: '',
        denominacionTituloOtorgado: '',
        denominacionClasificadorCINE: '',
        denominacionProgramaEstudioMencion: '',
        comentarios: '',
      }],
      count: 1
    });
    // return this.mallCurricularService.fetchPageMallaCurricular(pageRequest, filters).pipe(
    //   tap(response => {
    //     this.fetchPageMaestroPersonaSucces(response.data, response.count, pageRequest);
    //   }),
    //   catchError(error => {
    //     this.fetchMaestroPersonaError(error);
    //     return throwError(error);
    //   })
    // );
  }

  asynDeleteMaestroPrograma = (id: string): Observable<IEntidadMaestroPrograma> => {
    
    this.fetchMaestroProgramaBegin();
    const state = this.getState();
    return this.maestroProgramaService.getFormatoByVersion(state.formRequest.idVersion)
      .pipe(
        map(response => {
          const index = response.programaMenciones.findIndex(item => item.id == id);
          let form = response.programaMenciones[index];
          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);
          form.esEliminado = true;
          const programasUpdate = [...response.programaMenciones.slice(0, index), form, ...response.programaMenciones.slice(index + 1)];
          const request = {
            ...response,
            datosBloqueo: {
              "NombreElemento": "PROGRAMAMENCIONES",
              "IdElemento": form.id
            },
            datosProceso:{
              "nombre":"PROGRAMAMENCIONES",
              "idElemento": form.id
            },
            tipoOperacion:"M",
            programaMenciones: programasUpdate
          };

          return request;
        }),
        concatMap(request => this.maestroProgramaService.setUpdateFormato(request)),
        tap(response => {
          this.fetchMaestroProgramaSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
  private fetchMaestroProgramaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchMaestroProgramaSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  
  //response.programaMenciones,regimenEstudioEnum
  private fetchPageMaestroProgramaSucces = (items: any,regimenEstudioEnum:any, pageRequest: IDataGridPageRequest) => {
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
      let elementosNumerados = elementos.map(item=>{
        item.numero = numeracion+1;
        item.regimenEstudioEnum = regimenEstudioEnum.find(itemreg=>itemreg.value == item.regimenEstudioEnum).text.toUpperCase();
        numeracion=numeracion+1;
        return item;
      })
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
          items: { $set: elementosNumerados },
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
  private fetchMaestroProgramaError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  };
  setCINE = (response: any) => {
    const state = this.getState();
    this.setState({
      ...state,
      cine: response
    });
  }
  getCINE =() => {
    const state = this.getState();
    return state.codigoGenerado;
  }
}
