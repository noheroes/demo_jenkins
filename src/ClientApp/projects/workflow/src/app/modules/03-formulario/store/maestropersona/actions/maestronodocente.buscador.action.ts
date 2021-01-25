import update from 'immutability-helper';
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import {
  IBuscardorMaestroPersona,
  IFormMaestroPersona,
  IFormBuscardorMaestroPersona, TIPO_PERSONA
} from '../maestropersona.store.interface';

import { MaestropersonaService } from '../../../service/maestropersona.service';
import { AppAudit, AppCurrentFlowStore } from '@lic/core';
export class MaestroNoDocenteaBuscadorActions {
  constructor(
    private getState: () => IBuscardorMaestroPersona,
    private setState: (newState: IBuscardorMaestroPersona) => void,
    private maestropersonaService: MaestropersonaService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }
  setInit = (form: IFormBuscardorMaestroPersona) => {
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
  setReadOnly = (readOnly: boolean) => {
    const state = this.getState();
    this.setState({
      ...state,
      readOnly: readOnly
    });
  }
  getData = () => {


  }
  asyncGetPersona = (idVersion: string) => {
    return this.maestropersonaService.getFormatoByVersion(idVersion).pipe(
      tap(response => {
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  asyncFetchPageMaestroNoDocente = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar): Observable<any> => {
    this.fetchMaestroPersonaBegin();
    return this.maestropersonaService.getFormatoByVersion(filters.idVersion).pipe(
      tap(response => {
        this.fetchPageMaestroPersonaSucces(response.personas, response.count, pageRequest);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  asynDeleteMaestroNoDocente = (id: string): Observable<IFormMaestroPersona> => {
    this.fetchMaestroPersonaBegin();
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.formBuscar.idVersion)
      .pipe(
        map(response => {
          const index = response.personas.findIndex(item => item.id == id);
          let form = response.personas[index];
          form.esEliminado = true;
          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);

          const personasUpdate = [...response.personas.slice(0, index), form, ...response.personas.slice(index + 1)];
          const request = {
            ...response,
            datosProceso: {
              "nombre": "PERSONAS",
              "idElemento": id
            },
            tipoOperacion: "M",
            personas: personasUpdate
          };

          return request;
        }),
        concatMap(request => this.maestropersonaService.setUpdateFormato(request)),
        tap(response => {
          this.fetchMaestroPersonaSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
  private fetchMaestroPersonaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchMaestroPersonaSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  private fetchPageMaestroPersonaSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
    var filters = this.getState().formBuscar;
    items.forEach(element => {
      element['tpl-sexo'] = filters.listSexoEnum.list.find(x => x.value == element.tipoSexoEnum).text.toUpperCase()
    });
    const elementosTotal = (items || []).filter(item => !item.esEliminado && item.tipoPersonaEnum == TIPO_PERSONA.NODOCENTE)
    const elementos = elementosTotal.slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);

    const state = this.getState();
    
    state.gridDefinition.columns.forEach(column => {
      if (column.label == 'Acciones') {
        column.buttons.forEach(button => {
          if (button.action == 'EDITAR') {
            button.hidden = item => state.readOnly;
          }
          if (button.action == 'ELIMINAR') {
            button.hidden = item => state.readOnly;
          }
        })
      }
    });

    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        source: {
          items: { $set: elementos },
          total: { $set: elementosTotal.length },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  }
  private fetchMaestroPersonaError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  }
}
