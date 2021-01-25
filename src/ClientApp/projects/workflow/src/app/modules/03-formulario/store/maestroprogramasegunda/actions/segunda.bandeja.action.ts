import update from 'immutability-helper';
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IRequestSolicitudVersion,IBandejaMaestroProgramaSegunda, IEntidadMaestroProgramaSegunda } from '../maestroprogramasegunda.store.interface';
import { MaestroProgramaSegundaService } from '../../../service/maestroprogramasegunda.service';
import { AppAudit, AppCurrentFlowStore } from '@lic/core';

export class SegundaBandejaActions { 
  constructor(
    private getState: () => IBandejaMaestroProgramaSegunda,
    private setState: (newState: IBandejaMaestroProgramaSegunda) => void,
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
  /*setProgramasResponse = (response: any) => {
    const state = this.getState();
    this.setState({
      ...state,
      programasResponse: response
    });
  }*/
  
  getCodigoGenerado =() => {
    const state = this.getState();
    return state.codigoGenerado;
  }
  getFormResponse =() => {
    const state = this.getState();
    return state.formResponse;
  }
  /*
  getProgramasResponse =() => {
    const state = this.getState();
    return state.programasResponse;
  }*/
  asyncFetchPageMaestroProgramaSegunda = (regimenEstudioEnum:any,pageRequest: IDataGridPageRequest = {
    page: this.getState().source.page,
    pageSize: this.getState().source.pageSize,
    orderBy: this.getState().source.orderBy,
    orderDir: this.getState().source.orderDir,
  }): Observable<any> => {
    this.fetchMaestroProgramaSegundaBegin();
    return this.maestroProgramaSegundaService.getFormatoByVersion(this.getState().formRequest.idVersion).pipe(
      tap(response => {
        this.fetchPageMaestroProgramaSegundaSucces(response.segundaEspecialidades,regimenEstudioEnum, pageRequest);
        this.setFormResponse(response.facultades);
        //this.setProgramasResponse(response.programaMenciones);
        return null;
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

  asyncFetchPageMaestroProgramaSegundaSucces = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    }): Observable<any> => {

    this.fetchMaestroProgramaSegundaBegin();
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

  asynDeleteMaestroProgramaSegunda = (id: string): Observable<IEntidadMaestroProgramaSegunda> => {
    this.fetchMaestroProgramaSegundaBegin();
    const state = this.getState();
    return this.maestroProgramaSegundaService.getFormatoByVersion(state.formRequest.idVersion)
      .pipe(
        map(response => {

          const index = response.segundaEspecialidades.findIndex(item => item.id == id);
          let form = response.segundaEspecialidades[index];
          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);
          form.esEliminado = true;
          const programasUpdate = [...response.segundaEspecialidades.slice(0, index), form, ...response.segundaEspecialidades.slice(index + 1)];
          const request = {
            ...response,
            datosBloqueo: {
              "NombreElemento": "ProgramaSe",
              "IdElemento": form.id
            },
            datosProceso:{
              "nombre":"SEGUNDAESPECIALIDADES",
              "idElemento": form.id
            },
            segundaEspecialidades: programasUpdate
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
 
  private fetchPageMaestroProgramaSegundaSucces = (items: any,regimenEstudioEnum:any,pageRequest: IDataGridPageRequest) => {
    let elementos = (items || []).filter(item => !item.esEliminado);
    const totalItems = elementos.length;
    elementos = elementos.slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
    let numeracion = 0;
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
          total: { $set: totalItems},
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
