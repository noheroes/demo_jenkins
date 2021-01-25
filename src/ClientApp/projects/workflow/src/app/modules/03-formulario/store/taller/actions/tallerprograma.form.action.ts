import update from 'immutability-helper';
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, concatMap, filter, withLatestFrom } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IFormTallerPrograma, IEntidadTallerPrograma, } from '../taller.store.interface';
import { FormTallerPrograma, EntidadTallerPrograma } from '../taller.store.model';
import { TallerService } from '../../../service/taller.service';
import { MaestroProgramaService } from '../../../service/maestroprograma.service';
import * as uuid from 'uuid';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit } from '@lic/core';

export class TallerProgramaFormActions {
  constructor(
    private getState: () => IFormTallerPrograma,
    private setState: (newState: IFormTallerPrograma) => void,
    private tallerService: TallerService,
    private maestroProgramaService: MaestroProgramaService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }
  setInit = (codigoVersion: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idVersion: codigoVersion
    });
  }
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  setIdPrograma = (idPrograma: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idPrograma: idPrograma
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

  asynGetPrograma = (idPrograma: string): Observable<any> => {    
    const state = this.getState();
    let maestroPrograma: any;
    let programaSeleccionado : any;
    let facultadSeleccionada : any;
    var retorno = new Object();
    return this.maestroProgramaService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {        
        programaSeleccionado = response.programaMenciones.find(x => x.id == idPrograma);
        if (typeof(programaSeleccionado) != 'undefined') {
          facultadSeleccionada = response.facultades.find(x => x.id == programaSeleccionado.idFacultad);  
          retorno['idPrograma'] = idPrograma;
          retorno['programaMencion'] = programaSeleccionado.codigo + ' - ' + programaSeleccionado.denominacionPrograma;
          retorno['facultad'] = facultadSeleccionada.nombre;
          retorno['gradoAcademico']= programaSeleccionado.denominacionGradoAcademico;
          retorno['titulo'] = programaSeleccionado.denominacionTituloOtorgado;
        } else {
          programaSeleccionado = response.segundaEspecialidades.find(x => x.id == idPrograma);
          facultadSeleccionada = response.facultades.find(x => x.id == programaSeleccionado.idFacultad);  
          retorno['idPrograma'] = idPrograma;
          retorno['programaMencion'] = programaSeleccionado.codigo + ' - ' + programaSeleccionado.denominacionPrograma;
          retorno['facultad'] = facultadSeleccionada.nombre;
          retorno['gradoAcademico']= '-';
          retorno['titulo'] = programaSeleccionado.denominacionTituloOtorgado;
        }               
        return retorno;
      }),
      catchError(error => {
        return throwError(error);
      })
    );  
  }  

  private getMapProgramaTaller = (formatoDetalle: any, programa: any, codigoPrograma: string): any => {
    const state = this.getState();
    const tallerIndex = formatoDetalle.talleres.findIndex(item => item.id == state.codigoTaller);
    const taller = formatoDetalle.talleres[tallerIndex];
    const programaIndex = taller.programas.findIndex(item => item.idPrograma == codigoPrograma && !item.esEliminado);
    if (programaIndex != -1) {
      return of({ actualiza: false });
    }
    const programaUpdate = {
      ...programa,
      id: uuid.v4()
    };
    const programasUpdate = [programaUpdate, ...taller.programas];
    const tallerUpdate = {
      ...taller,
      programas: programasUpdate
    };
    const talleresUpdate = [
      ...formatoDetalle.talleres.slice(0, tallerIndex),
      tallerUpdate,
      ...formatoDetalle.talleres.slice(tallerIndex + 1)];
    const request = {
      ...formatoDetalle,
      talleres: talleresUpdate,
      actualiza: true
    };
    return request;
  }

  private saveProgramaTaller = (request: any): Observable<any> => {
    if (request.actualiza) {      
      return this.tallerService.setUpdateFormatoDetalle(request);
    } else {
      return new Observable<any>(subscriber => {
        subscriber.next({ success: request.value.actualiza });
        subscriber.complete();
      });
    }
  }

  asynAddPrograma = (form: IEntidadTallerPrograma): Observable<any> => {    
    this.crudTallerBegin();
    const state = this.getState();
    return this.tallerService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)
    .pipe(
      map(response => {               
        const request = this.getMapProgramaTaller(response, form, form.idPrograma);
        return request;       
      }),
      concatMap(this.saveProgramaTaller),
      tap(this.crudSucces),
      catchError(this.crudError)
    );
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

  private crudTallerProgramaSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };

  asynDeleteTallerPrograma = (id: string): Observable<IEntidadTallerPrograma> => {
    this.fetchTallerBegin();
    const state = this.getState();
    return this.tallerService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)
      .pipe(
        map(response =>           
          this.getMapDeleteProgramaTaller(response, id)
        ),
        concatMap(this.saveProgramaTaller),
        tap(this.crudSucces),
        catchError(this.crudError)
      );
  }

  private getMapDeleteProgramaTaller = (formatoDetalle: any, id: string): any => {   
    const state = this.getState();
    var idElemento = uuid.v4();
    const tallerIndex = formatoDetalle.talleres.findIndex(item => item.id == state.codigoTaller);
    const taller = formatoDetalle.talleres[tallerIndex];
    const programaIndex = taller.programas.findIndex(item => item.id == id);
    let programa = taller.programas[programaIndex];
    programa.esEliminado = true;
    const audit = new AppAudit(this.storeCurrent);
    programa = audit.setUpdate(programa);
    //programa.tipoOperacion = '3';


    const programasUpdate = [
      ...taller.programas.slice(0, programaIndex),
      programa,
      ...taller.programas.slice(programaIndex + 1)];

    const tallerUpdate = {
      ...taller,
      programas: programasUpdate
    };
    const talleresUpdate = [
      ...formatoDetalle.talleres.slice(0, tallerIndex),
      tallerUpdate,
      ...formatoDetalle.talleres.slice(tallerIndex + 1)];
    const request = {
      ...formatoDetalle,
      datosNumeracion : {
        "nombre": "tallerPrograma",
        "prefijo": "TAPROGRAMA",
        "idVersion": state.idVersion,
        "idSedeFilial": state.idSedeFilial,
        "idLocal": ""
      },
      datosProceso : {
        "nombre":"tallerProgramas",
        "idElemento": idElemento
      },
      talleres: talleresUpdate,
      actualiza: true
    };   
    return request;
  }
  private fetchTallerBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };
  
  asyncFetchPageTallerPrograma = (    
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState()): Observable<any> => {
    this.fetchTallerBegin();   
    const state = this.getState();
    return this.maestroProgramaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(reponse => {
          const state = this.getState();
          this.setState({
            ...state,
            formato: reponse
          });          
        }),
      concatMap(request => this.tallerService.getFormatoDetalleByVersion(filters.idVersion, filters.idSedeFilial)),
      tap(response => {            
        const state = this.getState();
          this.setState({
            ...state,
            formatoDetalle: response
          });   
        const talleres = response.talleres.find(item => item.id == filters.codigoTaller);
        this.fetchPageTallerProgramaSucces(this.getState().formato,talleres.programas, response.count, pageRequest);        
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  resetForm = () => {
    const state = this.getState();
    this.setState({
      ...state,
      form: new EntidadTallerPrograma()
    });
  }

  private fetchPageTallerProgramaSucces = (formato:any,items: any, total: number, pageRequest: IDataGridPageRequest) => {  
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
    elementos = (items || []).filter(items => !items.esEliminado)
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

    const totalItems =(items || []).filter(item => !item.esEliminado).length; 
    const elementosPag = (items || []).filter(item => !item.esEliminado)
      .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);

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

  resetModal = () => {
    this.setState(new FormTallerPrograma());
  };

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

  asynSavetallerPrograma = (form: IEntidadTallerPrograma): Observable<any> => {
    this.crudTallerBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    const datosNumeracion = {
        "nombre": "tallerPrograma",
        "prefijo": "TAPROGRAMA",
        "idVersion": state.idVersion,
        "idSedeFilial": state.idSedeFilial,
        "idLocal": ""
    }
    const datosProceso = {
      "nombre":"tallerProgramas",
      "idElemento": idElemento
    }

    const programa = this.getMapProgramas(state.formato, form.codigoProgramaVinculado);
    programa.usuarioCreacion = form["usuarioCreacion"];
    programa.fechaCreacion = form["fechaCreacion"];
    programa.tipoOperacion = form["tipoOperacion"];
    programa.token = form["token"];

    const request = this.getMapProgramaTaller(state.formatoDetalle, programa, form.codigoProgramaVinculado);
    request.datosNumeracion = datosNumeracion;
    request.datosProceso = datosProceso;

    return this.saveProgramaTaller(request);
    // return this.maestroProgramaService.getFormatoByVersion(state.idVersion)
    //   .pipe(
    //     withLatestFrom(this.tallerService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)),
    //     map(([formato, formatoDetalle]) => {
    //       const programa = this.getMapProgramas(formato, form.codigoProgramaVinculado);
    //       const request = this.getMapProgramaTaller(formatoDetalle, programa, form.codigoProgramaVinculado);
    //       return request;
    //     }),
    //     concatMap(this.saveProgramaTaller),
    //     tap(this.crudSucces),
    //     catchError(this.crudError)
    //   );
  }
  private crudTallerBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  asynFetchTallerPrograma = (codigoTaller: string): Observable<IEntidadTallerPrograma> => {
    return of({
      codigoProgramaVinculado:'',
      idPrograma:'',
      programaMencion:'',
      facultad:'',
      gradoAcademico:'',
      titulo:''    
    });
  }
  loadDataTallerPrograma = (data: any) => {
    this.fetchTallerProgramaSucces(data);
  }
  private fetchTallerProgramaSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  };
  setModalNew = (id: string, idSede: string, idLocal: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      codigoTaller: id,
      idSedeFilial: idSede,
      idLocal: idLocal,
      isLoading: false
    });
  }
}
