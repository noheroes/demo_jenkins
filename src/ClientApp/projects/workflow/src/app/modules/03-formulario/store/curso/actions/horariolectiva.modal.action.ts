import { FormType, IDataGridPageRequest } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError, iif } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { ModalCurso, ModalHorarioLectivoCurso } from '../curso.store.model';
import uuid from 'uuid';

import { CursoService } from '../../../service/curso.service';
import { IModalHoraLectivaCurso, IFormCurso, IFormHoraLectivaCurso } from '../curso.store.interface';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';

export class HorariolectivaModalActions {
  constructor(
    private getState: () => IModalHoraLectivaCurso,
    private setState: (newState: IModalHoraLectivaCurso) => void,
    private maestroCursoService: CursoService,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  setInit = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idVersion: id
    });
  }
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }

  setModalEdit = (id: string, codigoMallaCurricular: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      idCurso: id,
      idMallaCurricular: codigoMallaCurricular,
      type: FormType.EDITAR,
      title: 'Agregar hora lectivas por periodo académico'
    });

  }

  asyncFetchCombos = (enums) => {
    const newState = {
      ...this.getState(),
      comboLists: {
        horaLectivas: enums[0]
      }
    };
    this.setState(newState);
  }

  resetModalHoraLectiva = () => {
    const state = this.getState();
    this.setState({
      ...state,
      form: {
        ...state.form,
        cantidad: null,
        tipoHoraLectivaEnum: null,
        descripcionHoraLectiva: ''
      }
    });
  };

  private fetchCursoBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };


  asynUpdateHoraLectiva = (form: IFormHoraLectivaCurso): Observable<any> => {
    this.crudHoraLectivaBegin();
    const state = this.getState();
    return this.maestroCursoService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {

          const index = response.mallaCurriculares.findIndex(item => item.id == state.idMallaCurricular && !item.esEliminado);
          const mallaCurricular = response.mallaCurriculares[index];

          const cursos = mallaCurricular.cursos;
          const cursoIndex = cursos.findIndex(item => item.id == state.idCurso);
          const curso = cursos[cursoIndex];

          const horaLectivas = curso.horaLectivas || [];
          const indexhoraLevtiva = horaLectivas.findIndex(item => item.tipoHoraLectivaEnum == form.tipoHoraLectivaEnum && !item.esEliminado);
          if (indexhoraLevtiva !== -1) {
            return of({ actualiza: false });
          }
          
          const horaLectivasUpdate = [{ 
            ...form, id: uuid.v4(),
            "usuarioCreacion": form["usuarioCreacion"],
            "fechaCreacion": form["fechaCreacion"],
            "tipoOperacion": form["tipoOperacion"],
            "token": form["token"],
          }, ...horaLectivas];

          const cursoUpdate = {
            ...curso,
            horaLectivas: horaLectivasUpdate
          };
          
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
            mallaCurriculares: mallaCurricularesUpdate,
            actualiza: true
          };
          return request;
        }),
        concatMap(request =>
          iif(
            () => request.actualiza,
            this.maestroCursoService.setUpdateFormato(request),
            new Observable<any>(subscriber => {
              subscriber.next({ success: request.value.actualiza });
              subscriber.complete();
            })
          )
        ),
        tap(response => {
          this.crudHoraLectivaSucces();
        }),
        catchError(error => {
          this.crudHoraLectivaError(error);
          return throwError(error);
        })
      );
  }

  asynDeleteHoraAsignada = (id: string): Observable<IFormHoraLectivaCurso> => {
    this.crudHoraLectivaBegin();
    const state = this.getState();
    return this.maestroCursoService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const index = response.mallaCurriculares.findIndex(item => item.id == state.idMallaCurricular);
          const mallaCurricular = response.mallaCurriculares[index];

          const cursos = mallaCurricular.cursos;
          const cursoIndex = cursos.findIndex(item => item.id == state.idCurso);
          const curso = cursos[cursoIndex];

          const horaLectivasIndex = curso.horaLectivas.findIndex(item => item.id == id);
          let horaLectivaUpdate = curso.horaLectivas[horaLectivasIndex];
          horaLectivaUpdate.esEliminado = true;

          const audit = new AppAudit(this.storeCurrent);
          horaLectivaUpdate = audit.setDelete(horaLectivaUpdate);

          const horaLectivasUpdate = [
            ...curso.horaLectivas.slice(0, horaLectivasIndex),
            horaLectivaUpdate,
            ...curso.horaLectivas.slice(horaLectivasIndex + 1)
          ];
          const cursoUpdate = {
            ...curso,
            horaLectivasUpdate
          };
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
        concatMap(request => request == null ? throwError('No existe la hora lectiva')
          : this.maestroCursoService.setUpdateFormato(request)),
        tap(response => {
          this.crudHoraLectivaSucces();
        }),
        catchError(error => {
          this.crudHoraLectivaError(error);
          return throwError(error);
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
    this.crudHoraLectivaBegin();
    const state = this.getState();
    return this.maestroCursoService.getFormatoByVersion(state.idVersion).pipe(
      tap(response => {
        const state = this.getState();
        const mallaCurricular = response.mallaCurriculares.find(item => item.id == state.idMallaCurricular);
        const curso = mallaCurricular.cursos.find(item => item.id == state.idCurso);
        this.fetchPageHoraLectivaSucces(curso.horaLectivas || [], response.count, pageRequest);
      }),
      catchError(error => {
        this.crudHoraLectivaError(error);
        return throwError(error);
      })
    );
  }

  private fetchPageHoraLectivaSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
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
          total: { $set: /*total*/elementos.length },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  }

  private crudHoraLectivaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private crudHoraLectivaSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  private crudHoraLectivaError = ({ error }) => {
    const mensajes = Object.entries(error.errors).map(item => ({ msg: item[1] }));
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: mensajes }
      })
    );
  }
}
