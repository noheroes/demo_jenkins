import * as uuid from 'uuid';
import { FormType, IDataGridPageRequest,IDataGridEvent } from '@sunedu/shared';
import update from 'immutability-helper';
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, withLatestFrom, concatMap } from 'rxjs/operators';
import { IFormLaboratorioPrograma, IEntidadLaboratorioPrograma, } from '../laboratorio.store.interface';
import { FormLaboratorioPrograma, EntidadLaboratorioPrograma } from '../laboratorio.store.model';
import { LaboratorioService } from '../../../service/laboratorio.service';
import { MaestroProgramaService } from '../../../service/maestroprograma.service';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit } from '@lic/core';

export class LaboratorioProgramaFormActions {
  constructor(
    private getState: () => IFormLaboratorioPrograma,
    private setState: (newState: IFormLaboratorioPrograma) => void,
    private laboratorioService: LaboratorioService,
    private maestroProgramaService: MaestroProgramaService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }
  setInit = (codigoVersion: string) => {
    const state = this.getState();
    this.setState({
      ...state,

    });
  }
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  asyncFetchProgramas = (): Observable<any> => {
    const state = this.getState();
    return this.maestroProgramaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(reponse => {          
          let listaProgramas = [];
          let listaSegundaEspecialidad = [];
          const state = this.getState();
          this.setState({
            ...state,
            formato: reponse
          });
          const programas = reponse.programaMenciones.filter(x => !x.esEliminado).forEach(item => {
            {
              if (state.allItems.findIndex(x => x.idPrograma == item.id) == -1) {
                listaProgramas.push({ value: item.id, text: item.codigo + ' - ' + item.denominacionPrograma });
              }              
            }   
          });          
          const segundaEspecialidad = reponse.segundaEspecialidades.filter(x => !x.esEliminado).forEach(item => 
            {              
              if (state.allItems.findIndex(x => x.idPrograma == item.id) == -1) {
                listaSegundaEspecialidad.push({ value: item.id, text: item.codigo + ' - ' + item.denominacionPrograma });
              }
            }            
          );          
          return [...listaProgramas, ...listaSegundaEspecialidad];
        }),
        tap(response => {
          this.fetchProgramasSucces(response);
        })
      );
  }
  private fetchProgramasSucces = data => {
    const state = this.getState();
    const newState = {
      ...state,
      isLoading: false,
      comboLists: {
        ...state.comboLists,
        programas: {
          list: data,
          loading: false
        }
      }
    }
    this.setState(newState);
  }
  private getMapDeleteProgramaLoboratio = (formatoDetalle: any, id: string): any => {
    const state = this.getState();
    var idElemento = uuid.v4();
    const laboratorioIndex = formatoDetalle.laboratorios.findIndex(item => item.id == state.idLaboratorio);
    const laboratorio = formatoDetalle.laboratorios[laboratorioIndex];
    const programaIndex = laboratorio.programas.findIndex(item => item.id == id);
    let programa = laboratorio.programas[programaIndex];
    programa.esEliminado = true;

    const audit = new AppAudit(this.storeCurrent);
    programa = audit.setDelete(programa);
    //programa.tipoOperacion = '3';

    const programasUpdate = [
      ...laboratorio.programas.slice(0, programaIndex),
      programa,
      ...laboratorio.programas.slice(programaIndex + 1)];

    const laboratorioUpdate = {
      ...laboratorio,
      programas: programasUpdate
    };
    const laboratoriosUpdate = [
      ...formatoDetalle.laboratorios.slice(0, laboratorioIndex),
      laboratorioUpdate,
      ...formatoDetalle.laboratorios.slice(laboratorioIndex + 1)];
    const request = {
      ...formatoDetalle,
      datosNumeracion : {
        "nombre": "laboratorioPrograma",
        "prefijo": "LABOPROGRAMA",
        "idVersion": state.idVersion,
        "idSedeFilial": state.idSedeFilial,
        "idLocal": ""
      },
      datosProceso : {
        "nombre":"laboratorioProgramas",
        "idElemento": idElemento
      },
      laboratorios: laboratoriosUpdate,
      actualiza: true
    };
    return request;
  }
  asynDeleteLaboratorioPrograma = (id: string): Observable<any> => {
    this.fetchLaboratorioBegin();
    const state = this.getState();
    return this.laboratorioService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)
      .pipe(
        map(response => this.getMapDeleteProgramaLoboratio(response, id)),
        concatMap(this.saveProgramaLaboratorio),
        tap(this.crudSucces),
        catchError(this.crudError)
      );
  }
  private fetchLaboratorioBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchLaboratorioSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
      })
    );
  };
  resetModal = () => {
    this.setState(new FormLaboratorioPrograma());
  };
  resetForm = () => {
    const state = this.getState();
    this.setState({
      ...state,
      form: new EntidadLaboratorioPrograma()
    });
  }
  private getMapProgramas = (maestroPrograma: any, codigo: string): any => {
    let programa = null;
    let programaLaboratorio = null;    
    if (maestroPrograma.programaMenciones.some(item => item.id == codigo)) {     
      programa = maestroPrograma.programaMenciones.find(item => item.id == codigo);
      programaLaboratorio = {
        idPrograma: codigo,
        programaMencion: programa.denominacionPrograma,
        facultad: maestroPrograma.facultades.find(x => x.id == programa.idFacultad).nombre,
        gradoAcademico: programa.denominacionGradoAcademico,
        titulo: programa.denominacionTituloOtorgado,
      };
    } else {
      programa = maestroPrograma.segundaEspecialidades.find(item => item.id == codigo);
      programaLaboratorio = {
        idPrograma: codigo,
        programaMencion: programa.denominacionPrograma,
        facultad: maestroPrograma.facultades.find(x => x.id == programa.idFacultad).nombre,
        gradoAcademico: '-',
        titulo: programa.denominacionTituloOtorgado
      };
    }
    return programaLaboratorio;
  }
  private getMapProgramaLoboratio = (formatoDetalle: any, programa: any, codigoPrograma: string): any => {
    const state = this.getState();
    const laboratorioIndex = formatoDetalle.laboratorios.findIndex(item => item.id == state.idLaboratorio);
    const laboratorio = formatoDetalle.laboratorios[laboratorioIndex];
    const programaIndex = laboratorio.programas.findIndex(item => item.idPrograma == codigoPrograma && !item.esEliminado);
    if (programaIndex != -1) {
      return of({ actualiza: false });
    }
    const programaUpdate = {
      ...programa,
      id: uuid.v4()
    };
    const programasUpdate = [programaUpdate, ...laboratorio.programas];
    const laboratorioUpdate = {
      ...laboratorio,
      programas: programasUpdate
    };
    const laboratoriosUpdate = [
      ...formatoDetalle.laboratorios.slice(0, laboratorioIndex),
      laboratorioUpdate,
      ...formatoDetalle.laboratorios.slice(laboratorioIndex + 1)];
    const request = {
      ...formatoDetalle,
      laboratorios: laboratoriosUpdate,
      actualiza: true
    };
    return request;
  }
  private saveProgramaLaboratorio = (request: any): Observable<any> => {
    if (request.actualiza) {
      return this.laboratorioService.setUpdateFormatoDetalle(request);        
    } else {
      return new Observable<any>(subscriber => {
        subscriber.next({ success: request.value.actualiza });
        subscriber.complete();
      });
    }    
  } 
 
  asynSaveLaboratorioPrograma = (form: IEntidadLaboratorioPrograma): Observable<any> => {
    this.crudLaboratorioBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    const datosNumeracion = {
        "nombre": "laboratorioPrograma",
        "prefijo": "LABOPROGRAMA",
        "idVersion": state.idVersion,
        "idSedeFilial": state.idSedeFilial,
        "idLocal": ""
    }
    const datosProceso = {
      "nombre":"laboratorioProgramas",
      "idElemento": idElemento
    }

    const programa = this.getMapProgramas(state.formato, form.codigoProgramaVinculado);
    programa.usuarioCreacion = form["usuarioCreacion"];
    programa.fechaCreacion = form["fechaCreacion"];
    programa.tipoOperacion = form["tipoOperacion"];
    programa.token = form["token"];
 
    const request = this.getMapProgramaLoboratio(state.formatoDetalle, programa, form.codigoProgramaVinculado);
    request.datosNumeracion = datosNumeracion;
    request.datosProceso = datosProceso;
           
    return this.saveProgramaLaboratorio(request);
    // return this.maestroProgramaService.getFormatoByVersion(state.idVersion)
    //   .pipe(
    //     withLatestFrom(this.laboratorioService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)),
    //     map(([formato, formatoDetalle]) => {
    //       const programa = this.getMapProgramas(formato, form.codigoProgramaVinculado);
    //       const request = this.getMapProgramaLoboratio(formatoDetalle, programa, form.codigoProgramaVinculado);
    //       return request;
    //     }),
    //     concatMap(this.saveProgramaLaboratorio),
    //     tap(this.crudSucces),
    //     catchError(this.crudError)
    //   );
  }
  private crudSucces = (response: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: null },
      })
    );
  }
  private crudError = (error) => {
    const mensajes = Object.entries(error.error.errors).map(item => ({ msg: item[1] }));
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: mensajes }
      })
    );
    return throwError(error);
  }

  private crudLaboratorioBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };
  asyncFetchPage = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().form): Observable<any> => {
    this.crudLaboratorioBegin();
    const state = this.getState();
    return  this.maestroProgramaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(reponse => {
          const state = this.getState();
          this.setState({
            ...state,
            formato: reponse
          });          
        }),
        concatMap(request => this.laboratorioService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)),
        tap(response => {
          const state = this.getState();
          this.setState({
            ...state,
            formatoDetalle: response
          });   
          const laboratorio = response.laboratorios.find(item => item.id == state.idLaboratorio);
          this.fetchPageProgramasSucces(this.getState().formato,laboratorio.programas, response.count, pageRequest);
        }),
        catchError(this.crudError)
      );
  }
  private fetchPageProgramasSucces = (formato:any,items: any, total: number, pageRequest: IDataGridPageRequest) => {
    let numeroOrden = 0;
    items.filter(item => !item.esEliminado).forEach(element => {     
      numeroOrden = numeroOrden + 1;
      element['numeroOrden'] = numeroOrden;
      const itemDescPro = formato.programaMenciones.filter(item => item.id==element.idPrograma);
      const itemDescSeg = formato.segundaEspecialidades.filter(item => item.id==element.idPrograma);
      let denominacionPrograma;
      if(itemDescPro.length!=0)
        denominacionPrograma = itemDescPro[0].denominacionPrograma
      else
        denominacionPrograma = itemDescSeg[0].denominacionPrograma;
      element.programaMencion = denominacionPrograma;
    });    
    let elementos = (items || []).filter(item => !item.esEliminado);
    elementos = items.filter(item => !item.esEliminado)
      .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);    
      const state = this.getState();

      const totalItems =(items || []).filter(item => !item.esEliminado).length; 
      const elementosPag = (items || []).filter(item => !item.esEliminado)
        .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);

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
        allItems:{$set:elementos},
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

  setModalNew = (id: string, codigoVersion: string, codigoSedeFilial: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      type: FormType.EDITAR,
      isLoading: false,
      idLaboratorio: id,
      idVersion: codigoVersion,
      idSedeFilial: codigoSedeFilial
    });
  }
}
