import update from 'immutability-helper';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, concatMap, filter } from 'rxjs/operators';
import { IDataGridPageRequest, isNullOrEmptyArray } from '@sunedu/shared';
import { IBuscardorMallaCurricular, IFormMallaCurricular, IFormBuscardorMallaCurricular } from '../mallacurricular.store.interface';
import { MallaCurricularService } from '../../../service/mallacurricular.service';
import moment from 'moment';
import { DebugRenderer2 } from '@angular/core/src/view/services';
import { isNullOrUndefined } from 'util';
import { AppAudit, AppCurrentFlowStore } from '@lic/core';
export class MallaCurricularBuscadorActions {
  constructor(
    private getState: () => IBuscardorMallaCurricular,
    private setState: (newState: IBuscardorMallaCurricular) => void,
    private mallCurricularService: MallaCurricularService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }
  setInit = (form: IFormBuscardorMallaCurricular) => {
    const state = this.getState();
    this.setState({
      ...state,
      formBuscar: form
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
    const state = this.getState();
    const newState = {
      ...state,
      comboLists: {
        programas: enums[0]
      }
    };
    this.setState(newState);
  }
  setModalEditar = (id: string) => {
    const state = this.getState();

  }
  setModalConsultar = (id: string) => {
    const state = this.getState();
  }

  asyncFetchPageMallaCurricular = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar): Observable<any> => {

    this.fetchMallaCurricularBegin();
    const state = this.getState();
    return this.mallCurricularService.getFormatoByVersion(state.formBuscar.idVersion).pipe(
      tap(response => {
        const mallaCurriculaes = response.mallaCurriculares.filter(item => {
          return (item.idPrograma == filters.codigoPrograma || filters.codigoPrograma == '' || filters.codigoPrograma == null)
            && (moment(item.fechaElaboracion).format('DD/MM/YYYY') == moment(filters.fechaPlanCurricular).format('DD/MM/YYYY') || filters.fechaPlanCurricular == null);
        });
        //Imbuir metadatos de programas
        if (isNullOrEmptyArray(mallaCurriculaes) == false) {
          this.setExtendMallasCurriculares(mallaCurriculaes, response);
        }
        this.fetchPageMallaCurricularSucces(mallaCurriculaes, mallaCurriculaes.count, pageRequest);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  private getMetadataProgramas(rawResponseData: any): Map<string, any> {
    const mapProgramasMetadata = new Map<string, any>();
    if (isNullOrUndefined(rawResponseData)) { return mapProgramasMetadata; }
    //Extrayendo datos de Programas Menciones
    if (isNullOrEmptyArray(rawResponseData.programaMenciones) == false) {
      for (let i = 0; i < rawResponseData.programaMenciones.length; i++) {
        let currentPrograma = rawResponseData.programaMenciones[i];
        mapProgramasMetadata.set(currentPrograma.id, {
          modalidadEstudioEnum: currentPrograma.modalidadEstudioEnum,
          regimenEstudioEnum: currentPrograma.regimenEstudioEnum
        });
      }
    }
    //Extrayendo datos de Segundas especialidades
    if (isNullOrEmptyArray(rawResponseData.segundaEspecialidades) == false) {
      for (let i = 0; i < rawResponseData.segundaEspecialidades.length; i++) {
        let currentSegundaEspecialidad = rawResponseData.segundaEspecialidades[i];
        mapProgramasMetadata.set(currentSegundaEspecialidad.id, {
          modalidadEstudioEnum: -1, //No aplica
          regimenEstudioEnum: currentSegundaEspecialidad.regimenEstudioEnum
        });
      }
    }

    return mapProgramasMetadata;
  }
  private setExtendMallasCurriculares(mallaCurriculares: Array<any>, rawResponseData: any) {
    const mapMetadataProgramas = this.getMetadataProgramas(rawResponseData);
    for (let i = 0; i < mallaCurriculares.length; i++) {
      let currentMalla = mallaCurriculares[i];
      let currentMetadataPrograma = mapMetadataProgramas.get(currentMalla.idPrograma)
      if (isNullOrUndefined(currentMetadataPrograma)) {
        currentMetadataPrograma = { modalidadEstudioEnum: -1, regimenEstudioEnum: -1 };
      }
      let currentMallaExtended = {
        ...currentMalla,
        modalidadEstudioEnum: currentMetadataPrograma.modalidadEstudioEnum,
        regimenEstudioEnum: currentMetadataPrograma.regimenEstudioEnum
      };
      mallaCurriculares[i] = currentMallaExtended;
    }
  }

  asynDeleteMallaCurricular = (id: string): Observable<IFormMallaCurricular> => {
    this.fetchMallaCurricularBegin();
    const state = this.getState();
   
    return this.mallCurricularService.getFormatoByVersion(state.formBuscar.idVersion)
      .pipe(
        map(response => {
          const index = response.mallaCurriculares.findIndex(item => item.id == id);
          let form = response.mallaCurriculares[index];
          form.esEliminado = true;

          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);

          const mallaCurricularesUpdate = [...response.mallaCurriculares.slice(0, index),
            form,
          ...response.mallaCurriculares.slice(index + 1)];
          const request = {
            ...response,
            datosProceso:{
              "nombre":"MALLACURRICULARES",
              "idElemento": id
            },
            mallaCurriculares: mallaCurricularesUpdate
          };
          return request;
        }),
        concatMap(request => this.mallCurricularService.setUpdateFormato(request)),
        tap(response => {
          this.fetchMallaCurricularSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
  private fetchMallaCurricularBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchMallaCurricularSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  private fetchPageMallaCurricularSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
    let elementosTotal = (items || []).filter(item => !item.esEliminado);
    const elementos = (items || []).filter(item => !item.esEliminado)
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
          total: { $set: elementosTotal.length },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  };
  private fetchMallaCurricularError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  };
}
