import update from 'immutability-helper';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, concatMap, filter } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { IBuscardorCurso, IFormCurso } from '../curso.store.interface';
import { CursoService } from '../../../service/curso.service';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';
export class CursoBuscadorActions {
  constructor(
    private getState: () => IBuscardorCurso,
    private setState: (newState: IBuscardorCurso) => void,
    private maestroCursoService: CursoService,
    private storeCurrent: AppCurrentFlowStore
  ) {

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

  setInit = (idMallaCurricular: string,
    idVersionSolicitud: string,
    descripcionPrograma: string,
    duracionProgramaEnSemanas: string
  ) => {
    const state = this.getState();
    this.setState({
      ...state,
      idMallaCurricular: idMallaCurricular,
      idVersion: idVersionSolicitud,
      descripcionPrograma: descripcionPrograma,
      duracionProgramaEnSemanas: duracionProgramaEnSemanas
    });
  }

  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  setModalEditar = (id: string) => {
    const state = this.getState();

  }
  setModalConsultar = (id: string) => {
    const state = this.getState();

  }

  asyncFetchPageCurso = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar): Observable<any> => {
    this.fetchCursoBegin();
    const state = this.getState();
    return this.maestroCursoService.getFormatoByVersion(state.idVersion)
      .pipe(
        tap(response => {
          const mallaCurricular = response.mallaCurriculares.find(item => item.id == state.idMallaCurricular && !item.esEliminado);
          const where = item => {
            return (item.id == filters.codigoCurso || filters.codigoCurso == '' || filters.codigoCurso == null)
              && (item.tipoPeriodoAcademico == filters.codigoPeriodoAcademico || filters.codigoPeriodoAcademico == '' || filters.codigoPeriodoAcademico == null)
              && (item.nombre.includes(filters.nombreCurso) || filters.nombreCurso == '' || filters.nombreCurso == null)
              && (item.tipoEstudioEnum == filters.codigoTipoEstudio || filters.codigoTipoEstudio == '' || filters.codigoTipoEstudio == null)
              && (item.tipoCursoEnum == filters.codigoTipoCurso || filters.codigoTipoCurso == '' || filters.codigoTipoCurso == null)
              && (item.totalSemanas == filters.numeroTotalSemanas || filters.numeroTotalSemanas == '' || filters.numeroTotalSemanas == null);
          }
          const cursos = mallaCurricular.cursos.filter(where);
          this.fetchPageCursoSucces(cursos, cursos.count, pageRequest);
        }),
        catchError(error => {
          this.fetchCursoError(error);
          return throwError(error);
        })
      );

  }

  asynDeleteCurso = (id: string): Observable<IFormCurso> => {
    this.fetchCursoBegin();
    const state = this.getState();
    return this.maestroCursoService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const index = response.mallaCurriculares.findIndex(item => item.id == state.idMallaCurricular && !item.esEliminado);
          const mallaCurricular = response.mallaCurriculares[index];
          const cursos = mallaCurricular.cursos || [];
          const cursoIndex = cursos.findIndex(item => item.id == id);
          const curso = cursos[cursoIndex];
          let cursoUpdate = {
            ...curso,
            esEliminado: true
            //tipoOperacion: '3'
          };
          const audit = new AppAudit(this.storeCurrent);
          cursoUpdate = audit.setUpdate(cursoUpdate);
          cursoUpdate.tipoOperacion = '3';

          const cursosUpdate = [...cursos.slice(0, index),
            cursoUpdate,
          ...cursos.slice(index + 1)];

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
          this.fetchCursoSucces();
        }),
        catchError(error => {
          this.fetchCursoError(error);
          return throwError(error);
        })
      );
  }
  private fetchCursoBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchCursoSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  private fetchPageCursoSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
    let elementostotal = (items || []).filter(item => !item.esEliminado);
    let elementos = (items || []).filter(item => !item.esEliminado)
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
          total: { $set: elementostotal.length },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  };
  private fetchCursoError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  };
}
