import update from 'immutability-helper';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IBuscardorRelacionDocente, IGridBuscardorRelacionDocente, TIPO_PERSONA } from '../relaciondocente.store.interface';
import { MaestropersonaService } from '../../../service/maestropersona.service';
import { IDataGridPageRequest } from '@sunedu/shared';
import { RelacionDocenteService } from '../../../service/relaciondocente.service';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';

export class RelacionDocenteBuscadorActions {
  constructor(
    private getState: () => IBuscardorRelacionDocente,
    private setState: (newState: IBuscardorRelacionDocente) => void,
    private maestropersonaService: MaestropersonaService,
    private relacionDocenteService: RelacionDocenteService,
    private storeCurrent: AppCurrentFlowStore) {

  }
  setInit = (codigoVersion: string, codigoSedeFilial: string, codigoLocal: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idVersion: codigoVersion,
      idSedeFilial: codigoSedeFilial,
      idLocal: codigoLocal
    });
  }
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  getItems=()=>{
    const state = this.getState();
    return state.source.items;
  }
  asyncFetchPageMaestroPersona = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar): Observable<any> => {
    this.fetchMaestroPersonaBegin();
    const state = this.getState();
    const requestFromatoDetalle = {
      idVersion: state.idVersion,
      idSedeFilial: state.idSedeFilial
    };
    let formatoResponse;
    return this.maestropersonaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          formatoResponse = response;
          return response;
        }),
        concatMap(responseA => {
          return this.relacionDocenteService.getFormatoDetalleByVersionSedeFilial(requestFromatoDetalle)
        }),
        tap(responseB => {
          let personaLocales = (responseB.personaLocales || []).filter(item => !item.esEliminado && item.idLocal == state.idLocal && item.tipoPersonaEnum == TIPO_PERSONA.DOCENTE)
          personaLocales.forEach(element => {
            const persona = formatoResponse.personas.find(item=>item.id==element.idPersona);
            element.descripcionDocente = persona.descripcionTipoDocumento + ' ' + persona.numeroDocumento + ' - ' + persona.nombres + ' ' + persona.apellidoPaterno + ' ' + persona.apellidoMaterno;;
            element.mayorGrado = persona.docente.descripcionGradoAcademicoMayor;
          });          
          this.fetchPageMaestroPersonaSucces(personaLocales, responseB.count, pageRequest);
          this.crudSucces();
          return responseB;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
    /*return this.relacionDocenteService.getFormatoDetalleByVersionSedeFilial(request)
      .pipe(
        tap(response => {
          const personaLocales = (response.personaLocales || []).filter(item => !item.esEliminado && item.idLocal == state.idLocal && item.tipoPersonaEnum == TIPO_PERSONA.DOCENTE)
          this.fetchPageMaestroPersonaSucces(personaLocales, response.count, pageRequest);
        }),
        catchError(error => {
          return throwError(error);
        })
      );*/
  }
  private fetchMaestroPersonaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };
  private fetchPageMaestroPersonaSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
    let elementos = (items || []).filter(item => !item.esEliminado);
    elementos = (items || []).filter(item => !item.esEliminado)
      .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
    let relacionDocentes: Array<IGridBuscardorRelacionDocente> = null;
    relacionDocentes = elementos.map(item => ({
      id: item.id, persona: item.descripcionDocente, mayorGrado: item.mayorGrado
    }));
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
        source: {
          items: { $set: relacionDocentes },
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

  asynDeleteRelacionDocente = (id: string): Observable<any> => {
    this.crudBegin();
    const state = this.getState();
    const request = {
      idVersion: state.idVersion,
      idSedeFilial: state.idSedeFilial
    };
    return this.relacionDocenteService.getFormatoDetalleByVersionSedeFilial(request)
      .pipe(
        map(response => {
          const personaLocalIndex = response.personaLocales.findIndex(item => item.id == id);
          let personaLocal = response.personaLocales[personaLocalIndex];
          personaLocal.esEliminado = true;

          const audit = new AppAudit(this.storeCurrent);
          personaLocal = audit.setDelete(personaLocal);

          const personaLocalesUpdate = [...response.personaLocales.slice(0, personaLocalIndex),
            personaLocal,
          ...response.personaLocales.slice(personaLocalIndex + 1)];
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "personasLocal",
              "prefijo": "PELOCAL",
              "idVersion": state.idVersion,
              "idSedeFilial": state.idSedeFilial,
              "idLocal": personaLocal.idLocal
            },
            datosProceso:{
              "nombre":"personasLocales",
              "idElemento": personaLocal.id
            },
            personaLocales: personaLocalesUpdate
          };
          return request;
        }),
        concatMap(request => request == null ? throwError('No existe la persona')
          : this.relacionDocenteService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.crudSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );


  }
  private crudBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true },
        error: { $set: null }
      })
    );
  }

  private crudSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: null },
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


}
