import { FormType, ComboList } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { MallaCurricularService } from '../../../service/mallacurricular.service';

import { IModalMallaCurricular, IFormMallaCurricular } from '../mallacurricular.store.interface';
import { ModalMallaCurricular } from '../mallacurricular.store.model';
import * as uuid from 'uuid';
import { stringify } from 'querystring';
import { MaestroProgramaService } from '../../../service/maestroprograma.service';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';
export class MallaCurricularModalActions {
  constructor(
    private getState: () => IModalMallaCurricular,
    private setState: (newState: IModalMallaCurricular) => void,
    private mallCurricularService: MallaCurricularService,/*,
    private maestroProgramaService: MaestroProgramaService*/
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

  setModalEdit = (idMallaCurricular: string, idPrograma: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoMallaCurricular: idMallaCurricular,
      idPrograma: idPrograma,
      type: FormType.EDITAR,
      title: 'Editar malla curricular'
    });

  }
  setModalReadOnly = (idMallaCurricular: string, idPrograma: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoMallaCurricular: idMallaCurricular,
      idPrograma: idPrograma,
      type: FormType.CONSULTAR,
      title: 'Consultar malla curricular'
    });
  }

  setModalNew = () => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false
    });
  }
  resetModalMallaCurricular = () => {
    this.setState(new ModalMallaCurricular());
  };

  private fetchMallaCurricularSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  };
  asyncFetchAllProgramas = (): Observable<ComboList> => {
    const state = this.getState();
    return this.mallCurricularService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        const programas = [
          ...response.segundaEspecialidades.filter(item => (!item.esEliminado)).map(item => ({
            value: item.id,
            text: item.codigo + ' - ' + item.denominacionPrograma, origen: 'SE',
            extra: { modalidadEstudioEnum: item.modalidadEstudioEnum, regimenEstudioEnum: item.regimenEstudioEnum }
          })),
          ...response.programaMenciones.filter(item => (!item.esEliminado)).map(item => ({
            value: item.id,
            text: item.codigo + ' - ' + item.denominacionPrograma, origen: 'PM',
            extra: { modalidadEstudioEnum: item.modalidadEstudioEnum, regimenEstudioEnum: item.regimenEstudioEnum }
          }))
        ];
        return new ComboList(programas);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  asyncFetchPrograma = (id: string): Observable<any> => {
    const state = this.getState();
    this.crudMallaCurricularBegin();
    return this.mallCurricularService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        const origenOrigen = this.getState().comboLists.programas.list.find(item => item.value == id);
        if (origenOrigen.origen == 'SE') {
          const programa = response.segundaEspecialidades.find(item => item.id == id);

        } else if (origenOrigen.origen == 'PM') {
          const programa = response.programaMenciones.find(item => item.id == id);

        }
        return { descripcionModalidad: 'descripcion Modalidad' }/* response.programas.find(item => item.id == id)*/;
      }),
      tap(response => {
        this.crudMallaCurricularSucces();
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  asyncFetchCombos = (enums) => {
    const newState = {
      ...this.getState(),
      comboLists: {
        modalidadEstudios: enums[0],
        regimenEstudios: enums[1],
        programas: enums[2]
      }
    };
    this.setState(newState);
  }
  loadDataMallaCurricular = (data: any) => {
    this.fetchMallaCurricularSucces(data);
  }
  asynFetchMallaCurricular = (codigoMallaCurricular: string): Observable<IFormMallaCurricular> => {
    this.crudMallaCurricularBegin();
    const state = this.getState();
    return this.mallCurricularService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          return response.mallaCurriculares.find(item => item.id == codigoMallaCurricular);
        }),
        tap(response => {
          this.crudMallaCurricularSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }
  asynSaveMallaCurricular = (form: IFormMallaCurricular): Observable<IFormMallaCurricular> => {
    this.crudMallaCurricularBegin();
    const state = this.getState(); 
    var idElemento =uuid.v4();   
    return this.mallCurricularService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          let mallaCurricularSave = {
            ...form,
            id: idElemento,
            "usuarioCreacion": form["usuarioCreacion"],
            "fechaCreacion": form["fechaCreacion"],
            "tipoOperacion": form["tipoOperacion"], 
            "token": form["token"],
          };
          //const audit = new AppAudit(this.storeCurrent);
          //mallaCurricularSave = audit.setInsert(mallaCurricularSave);
          const request = {
            ...response,
            datosProceso:{
              "nombre":"MALLACURRICULARES",
              "idElemento": idElemento
            },
            mallaCurriculares: [mallaCurricularSave, ...response.mallaCurriculares]
          };
          return request;
        }),
        concatMap(request => this.mallCurricularService.setUpdateFormato(request)),
        tap(response => {
          this.crudMallaCurricularSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  asynUpdateMallaCurricular = (form: IFormMallaCurricular): Observable<IFormMallaCurricular> => {
    this.crudMallaCurricularBegin();  
    const state = this.getState();    
    return this.mallCurricularService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const index = response.mallaCurriculares.findIndex(item => item.id == state.codigoMallaCurricular);
          const mallaCurricular = response.mallaCurriculares[index];

          let mallaCurricularUpdate = {
            ...mallaCurricular,
            idPrograma: form.idPrograma,
            descripcionModalidad: form.descripcionModalidad,
            fechaElaboracion: form.fechaElaboracion,
            tipoRegimenEstudioEnum: form.tipoRegimenEstudioEnum,
            descripcionRegimen: form.descripcionRegimen,
            otroRegimen: form.otroRegimen,
            numeroPeriodo: form.numeroPeriodo,
            duracionProgramaAnios: form.duracionProgramaAnios,
            duracionProgramaSemanas: form.duracionProgramaSemanas,
            valorCreditoTeorica: form.valorCreditoTeorica,
            valorCreditoPractica: form.valorCreditoPractica,
            "usuarioModificacion": form["usuarioModificacion"],
            "fechaModificacion": form["fechaModificacion"],
            "tipoOperacion": form["tipoOperacion"]
          };

          const mallaCurricularesUpdate = [...response.mallaCurriculares.slice(0, index),
            mallaCurricularUpdate,
          ...response.mallaCurriculares.slice(index + 1)];

          const request = {
            ...response,
            datosProceso:{
              "nombre":"MALLACURRICULARES",
              "idElemento": state.codigoMallaCurricular
            },
            mallaCurriculares: mallaCurricularesUpdate
          };
          return request;
        }),
        concatMap(request => this.mallCurricularService.setUpdateFormato(request)),
        tap(response => {
          this.crudMallaCurricularSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  private crudMallaCurricularBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private crudMallaCurricularSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
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
