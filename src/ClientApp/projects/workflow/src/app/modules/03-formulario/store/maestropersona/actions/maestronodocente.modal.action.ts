import { AppCurrentFlowStore } from './../../../../../../../../../src/app/core/store/app.currentFlow.store';
import { FormType } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError } from 'rxjs';
import { IFormMaestroPersona, IModalMaestroNoDocente, NIVELPROGRAMA, TIPO_PERSONA } from '../maestropersona.store.interface';
import { ModalMaestroPersona, ModalMaestroNoDocente } from '../maestropersona.store.model';
import { MaestropersonaService } from '../../../service/maestropersona.service';
import { concatMap, catchError, map, tap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { AppAudit } from '@lic/core';
export class MaestroNoDocenteModalActions {
  constructor(
    private getState: () => IModalMaestroNoDocente,
    private setState: (newState: IModalMaestroNoDocente) => void,
    private maestropersonaService: MaestropersonaService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }

  setInit = (idversion: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idVersion: idversion,
      form: {
        ...state.form,
        tipoPersonaEnum: TIPO_PERSONA.NODOCENTE
      }
    });
  }


  asyncFetchCombos = (enums) => {
    const newState = {
      ...this.getState(),
      comboLists: {
        sexos: enums[0],
        tipoDocumentos: enums[1],
        mayorGrados: enums[2],
        paises: enums[3]
      }
    };
    this.setState(newState);
  }

  setModalEdit = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoMaestroPersona: id,
      type: FormType.EDITAR,
      title: 'Modificar no docente'
    });

  }
  setModalReadOnly = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoMaestroPersona: id,
      type: FormType.CONSULTAR,
      title: 'Consulta de no docente'
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
    this.setState(new ModalMaestroNoDocente());
  }

  private fetchMaestroPersonaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  }

  private fetchMaestroPersonaSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  }

  loadData = (data: any) => {
    this.fetchMaestroPersonaSucces(data);
  }
  loadDataEdit = (data: any) => {
    const newState = {
      ...this.getState(),
      isLoading: false,
      form: {
        ...data,
        noDocente: {
          ...data.noDocente,
          nivelProgramaPregrado: data.noDocente.idNivelProgramas.some(x => x == NIVELPROGRAMA.NIVELPROGRAMAPREGRADO),
          nivelProgramaMaestria: data.noDocente.idNivelProgramas.some(x => x == NIVELPROGRAMA.NIVELPROGRAMAMAESTRIA),
          nivelProgramaDoctorado: data.noDocente.idNivelProgramas.some(x => x == NIVELPROGRAMA.NIVELPROGRAMADOCTORADO),
        }
      }
    };
    this.setState(newState);
  }

  asynFetch = (codigoPersona: string): Observable<IFormMaestroPersona> => {
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        return response.personas.find(item => item.id == codigoPersona);
      }),
      catchError(error => {
        this.crudMaestroPersonaError(error);
        return throwError(error);
      })
    );
  }
  asynUpdate = (form: IFormMaestroPersona): Observable<IFormMaestroPersona> => {
    this.crudMaestroPersonaBegin();
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const index = response.personas.findIndex(item => item.id == form.id);
          let personasUpdate = null;
          if (-1 === index) {
            personasUpdate = [...response.personas, form];
          } else {
            const persona = response.personas[index];
            let personUpdate = {
              ...persona,
              apellidoPaterno: form.apellidoPaterno,
              apellidoMaterno: form.apellidoMaterno,
              nombres: form.nombres,
              tipoSexoEnum: form.tipoSexoEnum,
              tipoDocumentoEnum: form.tipoDocumentoEnum,
              descripcionTipoDocumento: form.descripcionTipoDocumento,
              numeroDocumento: form.numeroDocumento,
              codigoNacionalidad: form.codigoNacionalidad,
              noDocente: {
                ...persona.noDocente,
                tipoGradoAcademicoMayorEnum: form.noDocente.tipoGradoAcademicoMayorEnum,
                descripcionGradoAcademicoMayor: form.noDocente.descripcionGradoAcademicoMayor,
                denominacionPuesto: form.noDocente.denominacionPuesto,
                idNivelProgramas: form.noDocente.idNivelProgramas,
                comentario: form.noDocente.comentario,
                "usuarioModificacion": form.noDocente["usuarioModificacion"],
                "fechaModificacion": form.noDocente["fechaModificacion"],
                "tipoOperacion": form.noDocente["tipoOperacion"],
                "token": form.noDocente["token"]
              }
            };
            const audit = new AppAudit(this.storeCurrent);
            personUpdate = audit.setUpdate(personUpdate);
            personasUpdate = [...response.personas.slice(0, index), personUpdate, ...response.personas.slice(index + 1)];
          }
          const request = {
            ...response,
            datosProceso:{
              "nombre":"PERSONAS",
              "idElemento": form.id
            },
            tipoOperacion:"M",
            personas: personasUpdate
          };
          return request;
        }),
        concatMap(request => this.maestropersonaService.setUpdateFormato(request)),
        tap(response => {
          this.crudMaestroPersonaSucces();
        }),
        catchError(error => {
          this.crudMaestroPersonaError(error);
          return throwError(error);
        })
      );
  }
  asynSave = (form: IFormMaestroPersona): Observable<IFormMaestroPersona> => {
    this.crudMaestroPersonaBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          let personaSave = {
            ...form,
            id: idElemento,
            cantidadProgramaVinculado: 0,
            noDocente: {
              ...form.noDocente,
              gradoAcademicos: [],
              horaAsignadas: [],
              programas: [],
              "usuarioCreacion": form["usuarioCreacion"],
              "fechaCreacion": form["fechaCreacion"],
              "tipoOperacion": form["tipoOperacion"],
              "token": form["token"],
            },
            docente: {
              ...form.docente,
              anioCategoria: 0,
              conRENACYTEnum: 0,
              tipoCategoriaDocenteEnum: 0,
              tipoRegimenDedicatoriaEnum: 0,
              tipoGradoAcademicoMayorEnum: 0,
              conActividadInvestigacionEnum: 0,
              "usuarioCreacion": form["usuarioCreacion"],
              "fechaCreacion": form["fechaCreacion"],
              "tipoOperacion": form["tipoOperacion"],
              "token": form["token"],
            }
          };
          const audit = new AppAudit(this.storeCurrent);
          personaSave = audit.setInsert(personaSave);
          const request = {
            ...response,
            datosProceso:{
              "nombre":"PERSONAS",
              "idElemento": idElemento
            },
            tipoOperacion:"M",
            personas: [personaSave, ...response.personas]
          };
          return request;
        }),
        concatMap(request => this.maestropersonaService.setUpdateFormato(request)),
        tap(response => {
          this.crudMaestroPersonaSucces();
        }),
        catchError(error => {
          this.crudMaestroPersonaError(error);
          return throwError(error);
        })
      );
  }



  private crudMaestroPersonaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true },
        error: { $set: null }
      })
    );
  }

  private crudMaestroPersonaSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: null }
      })
    );
  }
  private crudMaestroPersonaError = ({ error }) => {
    const mensajes = Object.entries(error.errors).map(item => ({ msg: item[1] }));
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: mensajes }
      })
    );
  }
}
