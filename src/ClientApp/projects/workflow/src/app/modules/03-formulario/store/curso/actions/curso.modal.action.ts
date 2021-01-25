import { FormType } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { CursoService } from '../../../service/curso.service';
import { IModalCurso, IFormCurso } from '../curso.store.interface';
import { ModalCurso } from '../curso.store.model';
import uuid from 'uuid';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';
export class CursoModalActions {
  constructor(
    private getState: () => IModalCurso,
    private setState: (newState: IModalCurso) => void,
    private maestroCursoService: CursoService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }
  setInit = (id: string) => {
    const state = this.getState();
    if (state.type == FormType.REGISTRAR) {
      state.form.totalSemanas = state.duracionProgramaEnSemanas;
    }
    this.setState({
      ...state,
      idVersion: id,
    });
  }
  setModalEdit = (id: string, idMalla: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoCurso: id,
      idMallaCurricular: idMalla,
      type: FormType.EDITAR,
      title: 'Editar curso'
    });

  }
  setModalReadOnly = (id: string, idMalla: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoCurso: id,
      idMallaCurricular: idMalla,
      type: FormType.CONSULTAR,
      title: 'Consultar curso'
    });
  }
  asyncFetchCombos = (enums) => {
    const newState = {
      ...this.getState(),
      comboLists: {
        perdiodoAcademicos: enums[0],
        tipoEstudios: enums[1],
        tipoCursos: enums[2]
      }
    };
    this.setState(newState);
  }
  setModalNew = (idMallaCurricular: string, duracionProgramaEnSemanas:string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false,
      idMallaCurricular: idMallaCurricular,
      duracionProgramaEnSemanas: duracionProgramaEnSemanas
    });
  }
  resetModalCurso = () => {
    this.setState(new ModalCurso());
  };

  private fetchCursoBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchCursoSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  };

  loadDataCurso = (data: any) => {
    this.fetchCursoSucces(data);
  }
  asynUpdateCurso = (form: IFormCurso): Observable<IFormCurso> => {
    this.crudCursoBegin();
    const state = this.getState();
    return this.maestroCursoService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const index = response.mallaCurriculares.findIndex(item => item.id == state.idMallaCurricular && !item.esEliminado);
          const mallaCurricular = response.mallaCurriculares[index];
          const cursos = mallaCurricular.cursos || [];
          const cursoIndex = cursos.findIndex(item => item.id == state.codigoCurso && !item.esEliminado);
          const curso = cursos[cursoIndex];
          let cursoUpdate = {
            ...curso,
            codigo: form.codigo,
            tipoPeriodoAcademico: form.tipoPeriodoAcademico,
            nombre: form.nombre,
            tipoEstudioEnum: form.tipoEstudioEnum,
            descripcionEstudio: form.descripcionEstudio,
            tipoCursoEnum: form.tipoCursoEnum,
            descripcionTipoCurso: form.descripcionTipoCurso,
            totalSemanas: form.totalSemanas,
            creditosAcademicos: form.creditosAcademicos,
            "usuarioCreacion": form["usuarioCreacion"],
            "fechaCreacion": form["fechaCreacion"],
            "tipoOperacion": form["tipoOperacion"],
          };

          const audit = new AppAudit(this.storeCurrent);
          cursoUpdate = audit.setUpdate(cursoUpdate);
          cursoUpdate.tipoOperacion = '2';

          const cursosUpdate = [...cursos.slice(0, cursoIndex),
            cursoUpdate,
          ...cursos.slice(cursoIndex + 1)];

          const mallaCurricularUpdate = {
            ...mallaCurricular,
            tipoOperacion:"M",
            cursos: cursosUpdate
          };

          const mallaCurricularesUpdate = [...response.mallaCurriculares.slice(0, index),
            mallaCurricularUpdate,
          ...response.mallaCurriculares.slice(index + 1)];

          const request = {
            ...response,
            datosProceso:{
              "nombre":"MALLACURRICULARES",
              "idElemento": mallaCurricular.id
            },
            tipoOperacion:"M",
            mallaCurriculares: mallaCurricularesUpdate
          };
          return request;
        }),
        concatMap(request => this.maestroCursoService.setUpdateFormato(request)),
        tap(response => {
          this.crudCursoSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }
  asynFetchCurso = (codigoCurso: string): Observable<IFormCurso> => {
    const state = this.getState();
    return this.maestroCursoService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        const mallaCurricular = response.mallaCurriculares.find(item => item.id == state.idMallaCurricular);
        const curso = mallaCurricular.cursos.find(item => item.id == state.codigoCurso);
        return curso;
      }),
      catchError(error => {
        this.crudError(error);
        return throwError(error);
      })
    );
  }
  asynSaveCurso = (form: IFormCurso): Observable<IFormCurso> => {
    this.crudCursoBegin();
    const state = this.getState();
    return this.maestroCursoService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const index = response.mallaCurriculares.findIndex(item => item.id == state.idMallaCurricular && !item.esEliminado);
          const mallaCurricular = response.mallaCurriculares[index];
          const cursos = mallaCurricular.cursos || [];
          const curso = {
            ...form,
            id: uuid.v4(),
            "usuarioCreacion": form["usuarioCreacion"],
            "fechaCreacion": form["fechaCreacion"],
            "tipoOperacion": form["tipoOperacion"],
            "token": form["token"],     
          };

          const cursosUpdate = [{ ...curso }, ...cursos];
          const mallaCurricularUpdate = {
            ...mallaCurricular,
            tipoOperacion:"M",
            cursos: cursosUpdate
          };

          const mallaCurricularesUpdate = [...response.mallaCurriculares.slice(0, index),
            mallaCurricularUpdate,
          ...response.mallaCurriculares.slice(index + 1)];

          const request = {
            ...response,
            datosProceso:{
              "nombre":"MALLACURRICULARES",
              "idElemento": mallaCurricular.id
            },
            tipoOperacion:"M",
            mallaCurriculares: mallaCurricularesUpdate
          };
          return request;
        }),
        concatMap(request => this.maestroCursoService.setUpdateFormato(request)),
        tap(response => {
          this.crudCursoSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  private crudCursoBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private crudCursoSucces = () => {
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
