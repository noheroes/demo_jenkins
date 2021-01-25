import { FormType, ComboList } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError } from 'rxjs';
import { IModalMaestroPersona, IFormMaestroPersona, NIVELPROGRAMA, TIPO_PERSONA } from '../maestropersona.store.interface';
import { ModalMaestroPersona } from '../maestropersona.store.model';
import { MaestropersonaService } from '../../../service/maestropersona.service';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';
export class MaestroPersonaModalActions {

  constructor(
    private getState: () => IModalMaestroPersona,
    private setState: (newState: IModalMaestroPersona) => void,
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
        tipoPersonaEnum: TIPO_PERSONA.DOCENTE
      }
    });
  }

  setModalEdit = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoMaestroPersona: id,
      type: FormType.EDITAR,
      title: 'Modificar docente'
    });

  }
  setModalReadOnly = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoMaestroPersona: id,
      type: FormType.CONSULTAR,
      title: 'Consulta de docente'
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
    this.setState(new ModalMaestroPersona());
  }

  asyncFetchCombos = (enums) => {
    const newState = {
      ...this.getState(),
      comboLists: {
        sexos: enums[0],
        tipoDocumentos: enums[1],
        mayorGrados: enums[5],
        categoriaDocentes: enums[2],
        regimenDedicaciones: enums[3],
        actividaInvestifacion: enums[4],
        registraRENACYT: enums[4],
        grupoRENACYT: enums[7],
        nivelRENACYT: enums[8],
        paises: enums[6]
      }
    };
    this.setState(newState);
  }
  SetNivelRENACYT = (grupoRENACYT: any, nivelEnum: any) => {
    console.log(nivelEnum);
    let listaNivel = new ComboList([]);
    let list = [];
    nivelEnum.list.map(element => {
      if (element.value.toString().substring(0, 2) * 1 == grupoRENACYT * 1) {
        list.push({
          text: element.text,
          value: element.value
        });
      }
    });
    listaNivel = new ComboList(list);
    const state = this.getState();
    this.setState({
      ...state,
      comboLists: {
        ...state.comboLists,
        nivelRENACYT: listaNivel
      }
    });
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

  loadDataEdit = (data: any) => {
    const newState = {
      ...this.getState(),
      isLoading: false,
      form: {
        ...data,
        docente: {
          ...data.docente,
          nivelProgramaPregrado: data.docente.idNivelProgramas.some(x => x == NIVELPROGRAMA.NIVELPROGRAMAPREGRADO),
          nivelProgramaMaestria: data.docente.idNivelProgramas.some(x => x == NIVELPROGRAMA.NIVELPROGRAMAMAESTRIA),
          nivelProgramaDoctorado: data.docente.idNivelProgramas.some(x => x == NIVELPROGRAMA.NIVELPROGRAMADOCTORADO),
        }
      }
    };
    this.setState(newState);
  }
  loadDataMaestroPersona = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  }
  asynFetchMaestroPersona = (codigoMaestro: string): Observable<IFormMaestroPersona> => {
    const state = this.getState();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        return response.personas.find(item => item.id == codigoMaestro);
      }),
      catchError(error => {
        this.crudError(error);
        return throwError(error);
      })
    );
  }
  asynUpdateMaestroPersona = (form: IFormMaestroPersona): Observable<IFormMaestroPersona> => {
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
            let personaUpdate = {
              ...persona,
              apellidoPaterno: form.apellidoPaterno,
              apellidoMaterno: form.apellidoMaterno,
              nombres: form.nombres,
              tipoSexoEnum: form.tipoSexoEnum,
              tipoDocumentoEnum: form.tipoDocumentoEnum,
              descripcionTipoDocumento: form.descripcionTipoDocumento,
              numeroDocumento: form.numeroDocumento,
              codigoNacionalidad: form.codigoNacionalidad,
              docente: {
                ...persona.docente,
                tipoGradoAcademicoMayorEnum: form.docente.tipoGradoAcademicoMayorEnum,
                descripcionGradoAcademicoMayor: form.docente.descripcionGradoAcademicoMayor,
                tipoCategoriaDocenteEnum: form.docente.tipoCategoriaDocenteEnum,
                anioCategoria: form.docente.anioCategoria,
                tipoRegimenDedicatoriaEnum: form.docente.tipoRegimenDedicatoriaEnum,
                conActividadInvestigacionEnum: form.docente.conActividadInvestigacionEnum,
                conRENACYTEnum: form.docente.conRENACYTEnum,
                grupoRENACYTEnum: form.docente.grupoRENACYTEnum,
                nivelRENACYTEnum: form.docente.nivelRENACYTEnum,
                fechaInicioContrato: form.docente.fechaInicioContrato,
                fechaFinContrato: form.docente.fechaFinContrato,
                idNivelProgramas: form.docente.idNivelProgramas,
                comentario: form.docente.comentario,
                "usuarioModificacion": form["usuarioModificacion"],
                "fechaModificacion": form["fechaModificacion"],
              },
              "usuarioModificacion": form["usuarioModificacion"],
              "fechaModificacion": form["fechaModificacion"],
              "tipoOperacion": form["tipoOperacion"]
            };
            
            personasUpdate = [...response.personas.slice(0, index), personaUpdate, ...response.personas.slice(index + 1)];
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
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  asynSaveMaestroPersona = (form: IFormMaestroPersona): Observable<IFormMaestroPersona> => {
    this.crudMaestroPersonaBegin();
    const state = this.getState();
    var idElemento =  uuid.v4();
    return this.maestropersonaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          let personaSave = {
            ...form,
            id:idElemento,
            cantidadProgramaVinculado: 0,
            docente: {
              ...form.docente,
              gradoAcademicos: [],
              horaAsignadas: [],
              programas: [],              
              "usuarioCreacion": form["usuarioCreacion"],
              "fechaCreacion": form["fechaCreacion"],
              "tipoOperacion": form["tipoOperacion"],
              "token": form["token"],
            },
            noDocente: {
              ...form.noDocente,
              tipoGradoAcademicoMayorEnum: '1',
              denominacionPuesto: '1',
              idNivelProgramas: [],
              comentario: '1',
              "usuarioCreacion": form["usuarioCreacion"],
              "fechaCreacion": form["fechaCreacion"],
              "tipoOperacion": form["tipoOperacion"],
              "token": form["token"],
            },
            "usuarioModificacion": form["usuarioModificacion"],
            "fechaModificacion": form["fechaModificacion"],
            tipoOperacion: form["tipoOperacion"],
          };
          
          const request = {
            ...response,
            datosProceso:{
              "nombre":"PERSONAS",
              "idElemento": form.id
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
          this.crudError(error);
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
