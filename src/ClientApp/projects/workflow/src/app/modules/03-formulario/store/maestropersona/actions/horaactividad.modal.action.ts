
import { FormType, IDataGridPageRequest } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError, iif } from 'rxjs';
import { IModalHoraAsignadaDocente, IFormHoraAsignadaDocente, IFormMaestroPersona, HORAASIGNADA } from '../maestropersona.store.interface';
import { ModalHoraAsignadaDocente, FormHoraAsignadaDocente } from '../maestropersona.store.model';
import { tap, map, catchError, concatMap } from 'rxjs/operators';
import { MaestropersonaService } from '../../../service/maestropersona.service';
import * as uuid from 'uuid';
import { ItemsList } from '@ng-select/ng-select/ng-select/items-list';
import { DebugRenderer2 } from '@angular/core/src/view/services';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';
export class HoraActividadModalActions {
  constructor(
    private getState: () => IModalHoraAsignadaDocente,
    private setState: (newState: IModalHoraAsignadaDocente) => void,
    private maestropersonaService: MaestropersonaService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }
  setInit = (idversion: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      form: {
        ...state.form,
        idVersion: idversion
      }
    });
  }
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  asyncFetchCombos = (enums) => {
    const newState = {
      ...this.getState(),
      comboLists: {
        horaActividades: enums
      }
    };
    this.setState(newState);
  }
  setUpdateCombo = (tipoHoraActividadEnum: string, operacion: HORAASIGNADA) => {
    const state = this.getState();
    let lista = state.comboLists.horaActividades.list;

    if (operacion == HORAASIGNADA.AGREGAR) {

    } else if (operacion == HORAASIGNADA.ELIMINAR) {

    }
  }
  setModalEdit = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoMaestroPersona: id,
      type: FormType.EDITAR,
      title: 'Horas de dedicación'
    });

  }
  resetModal = () => {
    this.setState(new ModalHoraAsignadaDocente());
  }
  resetForm = () => {
    const state = this.getState();
    this.setState({
      ...state,
      form: {
        ...state.form,
        cantidad: null,
        tipoHoraActividadEnum: null
      }
    });
  }
  private fetchBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  }

  private fetchSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  }

  loadData = (data: any) => {
    this.fetchSucces(data);
  }
  asynFetch = (Codigo: string): Observable<IFormHoraAsignadaDocente> => {
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.form.idVersion).pipe(
      map(response => {
        return response.personas.find(item => item.id == Codigo);
      }),
      catchError(error => {
        this.crudError(error);
        return throwError(error);
      })
    );
  }
  asynUpdate = (form: IFormHoraAsignadaDocente): Observable<any> => {
    this.crudBegin();
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.form.idVersion)
      .pipe(
        map(response => {
          const index = response.personas.findIndex(item => item.id == state.codigoMaestroPersona);
          let request = null;
          if (index != -1) {
            let horasAsignadasUpdate = null;

            let persona = response.personas[index];
            const horasAsignadas = response.personas[index].docente.horaAsignadas || [];

            const indexHoraAsignada = horasAsignadas
              .findIndex(item => item.tipoHoraActividadEnum == form.tipoHoraActividadEnum && !item.esEliminado);

            if (indexHoraAsignada === -1) {
              const audit = new AppAudit(this.storeCurrent);
              form = audit.setInsert(form);
              horasAsignadasUpdate = [...horasAsignadas, { ...form, id: uuid.v4() }];
            } else {
              return of({ actualiza: false });
              // horasAsignadasUpdate = [...horasAsignadas.slice(0, indexHoraAsignada), form, ...horasAsignadas.slice(indexHoraAsignada + 1)];
            }
            persona = {
              ...persona,
              tipoOperacion:"M",
              docente: {
                ...persona.docente,
                horaAsignadas: horasAsignadasUpdate
              }
            };
            const personasUpdate = [...response.personas.slice(0, index), persona, ...response.personas.slice(index + 1)];

            request = {
              ...response,
              datosProceso:{
                "nombre":"PERSONAS",
                "idElemento": state.codigoMaestroPersona
              },
              tipoOperacion:"M",
              personas: personasUpdate,
              actualiza: true
            };
            return request;
          }
          return request;
        }),
        concatMap(request =>
          iif(
            () => request.actualiza,
            this.maestropersonaService.setUpdateFormato(request),
            new Observable<any>(subscriber => {
              subscriber.next({ success: request.value.actualiza });
              subscriber.complete();
            })
          )
        ),
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

  asyncFetchPage = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().form): Observable<any> => {
    this.fetchPageHoraActividadBegin();
    return this.maestropersonaService.getFormatoByVersion(filters.idVersion).pipe(
      tap(response => {
        const state = this.getState();
        const persona = response.personas.find(item => item.id == state.codigoMaestroPersona);
        this.fetchPageHoraActividadSucces(persona.docente.horaAsignadas, response.count, pageRequest);
      }),
      catchError(error => {
        this.crudError(error);
        return throwError(error);
      })
    );
  }
  private fetchPageHoraActividadBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  }
  private fetchPageHoraActividadSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
    let elementos = (items || []).filter(item => !item.esEliminado);
    elementos = items.filter(item => !item.esEliminado)
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
          total: { $set: elementos.length },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  }
  asynDeleteHoraAsignada = (id: string): Observable<IFormMaestroPersona> => {
    this.crudBegin();
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.form.idVersion)
      .pipe(
        map(response => {
          const index = response.personas.findIndex(item => item.id == state.codigoMaestroPersona);
          let request = null;
          if (index != -1) {
            let horasAsignadasUpdate = null;

            let persona = response.personas[index];
            const horasAsignadas = response.personas[index].docente.horaAsignadas || [];

            const indexHoraAsignada = horasAsignadas.findIndex(item => item.id == id);
            let horaAsignada = horasAsignadas[indexHoraAsignada];
            horaAsignada.esEliminado = true;
            const audit = new AppAudit(this.storeCurrent);
            horaAsignada = audit.setUpdate(horaAsignada);

            horasAsignadasUpdate = [...horasAsignadas.slice(0, indexHoraAsignada),
              horaAsignada,
            ...horasAsignadas.slice(indexHoraAsignada + 1)];

            persona = {
              ...persona,
              tipoOperacion:"M",
              docente: {
                ...persona.docente,
                horaAsignadas: horasAsignadasUpdate
              }
            };

            const personasUpdate = [...response.personas.slice(0, index), persona, ...response.personas.slice(index + 1)];
            request = {
              ...response,
              datosProceso:{
                "nombre":"PERSONAS",
                "idElemento": state.codigoMaestroPersona
              },
              tipoOperacion:"M",
              personas: personasUpdate
            };
            return request;
          }
          return request;
        }),
        concatMap(request => request == null ? throwError('No existe la persona')
          : this.maestropersonaService.setUpdateFormato(request)),
        tap(response => {
          this.crudSucces();
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
}
