
import { FormType, IDataGridPageRequest } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError } from 'rxjs';
import { IModalGradoAcademico, IFormGradoAcademico, IFormMaestroPersona, TIPOMENCION } from '../maestropersona.store.interface';
import { ModalGradoAcademico, FormGradoAcademico } from '../maestropersona.store.model';
import { catchError, map, concatMap, tap } from 'rxjs/operators';
import { MaestropersonaService } from '../../../service/maestropersona.service';
import * as uuid from 'uuid';
import { AppAudit, AppCurrentFlowStore } from '@lic/core';

export class GradoAcademicoModalActions {
  constructor(
    private getState: () => IModalGradoAcademico,
    private setState: (newState: IModalGradoAcademico) => void,
    private maestropersonaService: MaestropersonaService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }
  setInit = (idversion: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idVersion: idversion,
      //nombre_docente: name,
      form: {
        ...state.form
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
        tipoGrado: enums[0],
        listadoUniversidades: enums[1],
        tipoRespuesta: enums[2],
        paises: enums[3]
      }
    };
    this.setState(newState);
  }

  setCodigoMaestroPersona = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      codigoMaestroPersona: id
    });
  }

  setModalEdit = (id: string,gradoAcademico: any) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoMaestroPersona: id,
      gradoAcademico: gradoAcademico,
      type: FormType.EDITAR,
      title: 'Modificar grados académicos del docente'
    });
  }
  setModalReadOnly = (id: string,gradoAcademico: any) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoMaestroPersona: id,
      gradoAcademico: gradoAcademico,
      type: FormType.CONSULTAR,
      title: 'Consultar grados académicos del docente'
    });
  }

  setModalNew = () => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      type: FormType.REGISTRAR,
      title: 'Agregar grados y/o títulos académicos del docente'
    });
  }
  resetModal = () => {
    this.setState(new ModalGradoAcademico());
  }

  private fetchMaestroPersonaBegin = () => {
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
  asynFetch = (codigoPersona: string): Observable<IFormGradoAcademico> => {
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        let gradoAcademico: IFormGradoAcademico = new FormGradoAcademico();
        return gradoAcademico;
      }),
      catchError(error => {
        return throwError(error);
      })
    );

  }
  asynSave = (form: IFormGradoAcademico): Observable<IFormGradoAcademico> => {
    this.crudBegin();
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const request = {
            ...response,
          };
          return request;
        }),
        concatMap(request => this.maestropersonaService.setUpdateFormato(request)),
        tap(response => {
          this.crudSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }
  private updateGradoAcademico(form: IFormGradoAcademico, gradoAcademicos: any[]): any {

    gradoAcademicos.forEach(item => {
      if (item.id == form.id) {
        item.tipoMencionEnum = form.tipoMencionEnum;
        item.mencion = form.mencion;
        item.codigoPaisGrado = form.codigoPaisGrado;
        item.codigoUniversidadGrado = form.codigoUniversidadGrado;
        item.institucionGrado = form.institucionGrado;
        item.resolucionSunedu = form.resolucionSunedu;
        item.esTitulado = form.esTitulado;
        item.denominacionTitulo = form.denominacionTitulo;
        item.codigoPaisTitulo = form.codigoPaisTitulo;
        item.codigoUniversidadTitulo = form.codigoUniversidadTitulo;
        item.institucionTitulo = form.institucionTitulo;

        const audit = new AppAudit(this.storeCurrent);
        item = audit.setUpdate(item);

      }
    });

    return gradoAcademicos;
  }
  private insertGradoAcademico(form: IFormGradoAcademico, gradoAcademicos: any[]): any {

    let gradoAcademicosUpdate = gradoAcademicos;
    let gradoAcademicoInsert = {
      id: uuid.v4(),
      tipoMencionEnum: form.tipoMencionEnum,
      mencion: form.mencion,
      codigoPaisGrado: form.codigoPaisGrado,
      codigoUniversidadGrado: form.codigoUniversidadGrado,
      institucionGrado: form.institucionGrado,
      resolucionSunedu: form.resolucionSunedu,
      esTitulado: form.esTitulado,
      denominacionTitulo: form.denominacionTitulo,
      codigoPaisTitulo: form.codigoPaisTitulo,
      codigoUniversidadTitulo: form.codigoUniversidadTitulo,
      institucionTitulo: form.institucionTitulo
    };
    const audit = new AppAudit(this.storeCurrent);
    gradoAcademicoInsert = audit.setInsert(gradoAcademicoInsert);

    gradoAcademicosUpdate.push(gradoAcademicoInsert);
    return gradoAcademicosUpdate;
  }

  private deleteGradoAcademico(id: string, gradoAcademicos: any[]): any {
    gradoAcademicos.forEach(item => {
      if (item.id == id) {
        item.esEliminado = true;
        const audit = new AppAudit(this.storeCurrent);
        item = audit.setUpdate(item);
      }
    });

    return gradoAcademicos;
  }

  asynDelete = (id: string): Observable<IFormGradoAcademico> => {
    this.crudBegin();
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const index = response.personas.findIndex(item => item.id == state.codigoMaestroPersona);
          const persona = response.personas[index];
          const docente = response.personas[index].docente;
          const gradoAcademicos = docente.gradoAcademicos;
          let gradoAcademicosUpdate = null;
          gradoAcademicosUpdate = this.deleteGradoAcademico(id, gradoAcademicos);

          const personaUpdate = {
            ...persona,
            tipoOperacion:"M",
            docente: {
              ...docente,
              gradoAcademicos: gradoAcademicosUpdate
            }
          };
          let personasUpdate = null;
          personasUpdate = [...response.personas.slice(0, index), personaUpdate, ...response.personas.slice(index + 1)];
          const request = {
            ...response,
            datosProceso:{
              "nombre":"PERSONAS",
              "idElemento": state.codigoMaestroPersona
            },
            tipoOperacion:"M",
            personas: personasUpdate
          };
          return request;
        }),
        concatMap(request => this.maestropersonaService.setUpdateFormato(request)),
        tap(response => {
          this.crudSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  asynUpdate = (form: IFormGradoAcademico): Observable<IFormGradoAcademico> => {
    this.crudBegin();
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const index = response.personas.findIndex(item => item.id == state.codigoMaestroPersona);
          const persona = response.personas[index];
          const docente = response.personas[index].docente;
          const gradoAcademicos = docente.gradoAcademicos;
          let gradoAcademicosUpdate = null;
          if (form.id === '') {
            gradoAcademicosUpdate = this.insertGradoAcademico(form, gradoAcademicos);
          } else {
            gradoAcademicosUpdate = this.updateGradoAcademico(form, gradoAcademicos);
          }
          const personaUpdate = {
            ...persona,
            tipoOperacion:"M",
            docente: {
              ...docente,
              gradoAcademicos: gradoAcademicosUpdate
            }
          };
          let personasUpdate = null;
          personasUpdate = [...response.personas.slice(0, index), personaUpdate, ...response.personas.slice(index + 1)];
          const request = {
            ...response,
            datosProceso:{
              "nombre":"PERSONAS",
              "idElemento": state.codigoMaestroPersona
            },
            tipoOperacion:"M",
            personas: personasUpdate
          };
          return request;
        }),
        concatMap(request => this.maestropersonaService.setUpdateFormato(request)),
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
        error: { $set: null }
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
        this.fetchPageSucces(persona.docente.gradoAcademicos, response.count, pageRequest);
      }),
      catchError(error => {
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


  private fetchPageSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
    var state = this.getState();
    items.forEach(element => {
      element['descTipoGrado'] = state.comboLists.tipoGrado.list.find(x => x.value == element.tipoMencionEnum).text;
      element['descPaisGrado'] = state.comboLists.paises.list.find(x => x.value == element.codigoPaisGrado).text.toUpperCase();
      if (!element.hasOwnProperty('codigoUniversidadGrado') || element.codigoUniversidadGrado == '') {
        element['descInstGrado'] = element.institucionGrado;
      } else {
        element['descInstGrado'] = state.comboLists.listadoUniversidades.list.find(x => x.value == element.codigoUniversidadGrado).text;
      }
    });
    const elementosTotal = items.filter(item => !item.esEliminado);
    const elementos = elementosTotal.slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);


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
          total: { $set: elementosTotal.length },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip },
          //error: { $set: null }
        }
      })
    );
  }

}
