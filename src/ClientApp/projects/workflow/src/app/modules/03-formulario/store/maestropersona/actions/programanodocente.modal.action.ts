import { FormType, ComboList, IDataGridPageRequest } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError, iif } from 'rxjs';
import { IFormProgramaDocente, IModalProgramaNoDocente } from '../maestropersona.store.interface';
import { ModalProgramaDocente, FormProgramaDocente, ModalProgramaNoDocente, FormProgramaNoDocente } from '../maestropersona.store.model';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { MaestropersonaService } from '../../../service/maestropersona.service';
import { tap, concatMap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { AppAudit, AppCurrentFlowStore } from '@lic/core';
export class ProgramaNoDocenteModalActions {
  constructor(
    private getState: () => IModalProgramaNoDocente,
    private setState: (newState: IModalProgramaNoDocente) => void,
    private maestropersonaService: MaestropersonaService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }

  setInit = (idversion: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idVersion: idversion
    });
  }
  setReadOnly = (readOnly: boolean) => {
    const state = this.getState();
    this.setState({
      ...state,
      readOnly: readOnly
    });
  }


  setModalEdit = (id: string) => {

    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoMaestroPersona: id,
      type: FormType.EDITAR,
      title: 'Programas en los que trabaja'
    });
  }
  setModalReadOnly = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false,
      codigoMaestroPersona: id,
      type: FormType.CONSULTAR,
      title: 'Programas en los que trabaja'
    });
  }

  setModalNew = () => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false
    });
  }
  resetModal = () => {
    this.setState(new ModalProgramaNoDocente());
  }

  private fetchMaestroPersonaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
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
  asyncFetchCombos = (enums) => {
    const newState = {
      ...this.getState(),
      comboLists: {
        programas: new ComboList(enums[0], false)
      }
    };
    this.setState(newState);
  }
  loadData = (data: any) => {
    this.fetchSucces(data);
  }
  asynFetchProgramas = (): Observable<any> =>{
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        const programas = [
          ...response.segundaEspecialidades.filter(item => (!item.esEliminado)).map(item => ({
            value: item.id,
            text: item.codigo + ' - ' + item.denominacionPrograma, origen: 'SE'
          })),
          ...response.programaMenciones.filter(item => (!item.esEliminado)).map(item => ({
            value: item.id,
            text: item.codigo + ' - ' + item.denominacionPrograma, origen: 'PM'
          }))
        ];
        return programas;
      }),
      catchError(error => {
        this.crudError(error);
        return throwError(error);
      })
    );
  }
  asynFetch = (codigoPersona: string): Observable<any> => {
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        const programas = [
          ...response.segundaEspecialidades.filter(item => (!item.esEliminado)).map(item => ({
            value: item.id,
            text: item.codigo + ' - ' + item.denominacionPrograma, origen: 'SE'
          })),
          ...response.programaMenciones.filter(item => (!item.esEliminado)).map(item => ({
            value: item.id,
            text: item.codigo + ' - ' + item.denominacionPrograma, origen: 'PM'
          }))
        ];
        const programasSinDuplicado = [];
        programas.forEach(elementPrograma => {
          response.personas.filter(item => item.id == codigoPersona).forEach(element => {
            if (element.noDocente.programas.findIndex(itemPrograma => itemPrograma.idPrograma == elementPrograma.value && (!itemPrograma.esEliminado)) == -1)
              programasSinDuplicado.push(elementPrograma);
          }
          );
        });
        return programasSinDuplicado;
      }),
      catchError(error => {
        this.crudError(error);
        return throwError(error);
      })
    );
  }
  private getPrograma = (form: any, data: any): any => {
    const origenOrigen = this.getState().comboLists.programas.list.find(item => item.value == form.idPrograma);
    if (origenOrigen.origen == 'SE') {
      const programa = data.segundaEspecialidades.find(item => item.id == form.idPrograma);
      return {
        ...form,
        descripcion: programa.codigo + ' - ' + programa.denominacionPrograma
      };
    } else if (origenOrigen.origen == 'PM') {
      const programa = data.programaMenciones.find(item => item.id == form.idPrograma);
      return {
        ...form,
        descripcion: programa.codigo + ' - ' + programa.denominacionPrograma
      };
    }
  }
  asynUpdate = (form: IFormProgramaDocente): Observable<any> => {
    this.crudBegin();
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const index = response.personas.findIndex(item => item.id == state.codigoMaestroPersona);
          let request = null;
          if (index != -1) {
            let programasUpdate = null;

            let persona = response.personas[index];
            const Programas = response.personas[index].noDocente.programas || [];

            const indexPrograma = Programas
              .findIndex(item => item.idPrograma == form.idPrograma && !item.esEliminado);

            if (indexPrograma === -1) {
              let tempForm = this.getPrograma(form, response);
              const audit = new AppAudit(this.storeCurrent);
              tempForm = audit.setInsert(tempForm);
              programasUpdate = [...Programas, { ...tempForm, id: uuid.v4() }];
            } else {
              return of({ actualiza: false });
            }
            persona = {
              ...persona,
              tipoOperacion: "M",
              noDocente: {
                ...persona.noDocente,
                programas: programasUpdate
              }
            };
            const personasUpdate = [...response.personas.slice(0, index), persona, ...response.personas.slice(index + 1)];
            request = {
              ...response,
              datosProceso: {
                "nombre": "PERSONAS",
                "idElemento": state.codigoMaestroPersona
              },
              tipoOperacion: "M",
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
  asynDelete = (id: string): Observable<any> => {
    this.crudBegin();
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const index = response.personas.findIndex(item => item.id == state.codigoMaestroPersona);
          let request = null;
          if (index != -1) {
            let programasUpdate = null;

            let persona = response.personas[index];
            const Programas = persona.noDocente.programas || [];
            const indexPrograma = Programas.findIndex(item => item.id == id && !item.esEliminado);

            if (indexPrograma !== -1) {
              let programa = Programas[indexPrograma];
              programa.esEliminado = true;
              const audit = new AppAudit(this.storeCurrent);
              programa = audit.setUpdate(programa);
              programasUpdate = [...Programas.slice(0, indexPrograma), programa, ...Programas.slice(indexPrograma + 1)];
            } else {
              return of({ actualiza: false });
            }
            persona = {
              ...persona,
              tipoOperacion: "M",
              noDocente: {
                ...persona.noDocente,
                programas: programasUpdate
              }
            };
            const personasUpdate = [...response.personas.slice(0, index), persona, ...response.personas.slice(index + 1)];
            request = {
              ...response,
              datosProceso: {
                "nombre": "PERSONAS",
                "idElemento": state.codigoMaestroPersona
              },
              tipoOperacion: "M",
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
        isLoading: { $set: true }
      })
    );
  }

  private crudSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  }
  resetForm = () => {
    const state = this.getState();
    this.setState({
      ...state,
      form: new FormProgramaNoDocente()
    });
  }
  asyncFetchPage = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().form): Observable<any> => {
    this.fetchPageBegin();
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion).pipe(
      tap(response => {
        const persona = response.personas.find(item => item.id == state.codigoMaestroPersona);
        this.fetchPageSucces(response, persona.noDocente.programas, response.count, pageRequest);
      }),
      catchError(error => {
        this.crudError(error);
        return throwError(error);
      })
    );
  }

  private fetchPageBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true },
        error: { $set: null }
      })
    );
  }


  private fetchPageSucces = (solicitud: any, items: any, total: number, pageRequest: IDataGridPageRequest) => {
    const elementosTotal = items.filter(item => !item.esEliminado);
    const elementos = elementosTotal.slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);

    elementos.forEach(element => {
      const itemDescPro = solicitud.programaMenciones.filter(item => item.id == element.idPrograma);
      const itemDescSeg = solicitud.segundaEspecialidades.filter(item => item.id == element.idPrograma);
      let denominacionPrograma;
      if (itemDescPro.length != 0)
        denominacionPrograma = itemDescPro[0].denominacionPrograma
      else
        denominacionPrograma = itemDescSeg[0].denominacionPrograma;

      element.descripcion = denominacionPrograma;
    });
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

    //console.log('CAYL fetchPageSucces', elementos);

    this.asynFetchProgramas().subscribe((programas)=>{
        //console.log('CAYL asynFetchProgramas',programas);
        elementos.forEach(element => {
          const program = programas.find(x=>x.value==element.idPrograma);
          if(program) element.descripcion=program.text;
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
            },
            error: { $set: null }
          })
        );
    });




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
