import { FormMaestroFacultad } from './../maestrofacultad.store.model';
import update from 'immutability-helper';
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { FormType, IDataGridPageRequest } from '@sunedu/shared';
import { IRequestSolicitudVersion,IBandejaMaestroFacultad,IEntidadMaestroFacultad } from '../maestrofacultad.store.interface';
import { MaestroFacultadService } from '../../../service/maestrofacultad.service';
import * as uuid from 'uuid';
import { AppAudit, AppCurrentFlowStore, APP_FORM_VALIDATOR } from '@lic/core'; 
export class MaestroFacultadFormActions {
  
  
  constructor(
    private getState: () => FormMaestroFacultad,
    private setState: (newState: FormMaestroFacultad) => void,
    private maestroFacultadService: MaestroFacultadService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }
  resetModal() {
    this.setState(new FormMaestroFacultad());
  }

  setModalNew(formRequest: Partial<IRequestSolicitudVersion>) {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false,
      formRequest:formRequest 
    });
  }
  setStateIsLoading = (isLoading: boolean) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: isLoading }
      })
    );
  };
  loadDataMaestroFacultad(data: IEntidadMaestroFacultad) {
    this.fetchMaestroFacultadSuccess(data);
  }
  private fetchMaestroFacultadSuccess = (data: IEntidadMaestroFacultad) => {
    this.setState(
      update(this.getState(), {
        form: { $set: data }
      })
    );
  };
  setModalEdit = (formRequest: IRequestSolicitudVersion) => {
    const state = this.getState();
    this.setState({
      ...state,
      //isLoading: true,
      type: FormType.EDITAR,
      title: 'Editar facultad',
      formRequest: formRequest,
    });

  }
  setModalReadOnly = (formRequest:IRequestSolicitudVersion) => {
    const state = this.getState();
    this.setState({
      ...state,
      //isLoading: true,
      type: FormType.CONSULTAR,
      title: 'Consultar facultad',
      formRequest:formRequest
    });
  }
  setInit = (formRequest: IRequestSolicitudVersion) => {
    const state = this.getState();
    this.setState({
      ...state,
      formRequest: formRequest
    });
  }
  asyncFetchMaestroFacultad = (id: string): Observable<IEntidadMaestroFacultad> => {
    
    const state = this.getState();
    return this.maestroFacultadService.getFormatoByVersion(state.formRequest.idVersion).pipe(
      map(response => {
        if(response.facultades!=[])
          return response.facultades.find(item => item.id == id);
        else
          return null;
      }),
      catchError(error => {
        this.crudError(error);
        return throwError(error);
      })
    );
  }
  existeFacultad = (facultad: string,facultades:any) => {
    const state = this.getState();
    let facultadNoExistente = true;
    for (let index = 0; index <facultades.length; index++) {
      if(facultades[index]['nombre'].trim().toUpperCase()==facultad.trim().toUpperCase())
      {
        facultadNoExistente = false;
        break;
      }
    }
    return facultadNoExistente;
  }
  
 
  private fetchMaestroFacultadBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );

  }
  
  asynSaveMaestroFacultad = (formValue:IEntidadMaestroFacultad): Observable<any> => {
    //debugger;
    this.fetchMaestroFacultadBegin();
    const state = this.getState();
    let facultadesUpdate = [];
    var idElemento = uuid.v4();
    return this.maestroFacultadService.getFormatoByVersion(state.formRequest.idVersion)
    .pipe(
      map(
        response => {
        const request = {
          ...response,
          datosNumeracion: {
            "nombre": "facultad",
            "prefijo": "FAC",
            "idVersion": state.formRequest.idVersion,
            "idSedeFilial": "",
            "idLocal": ""
          },
          datosProceso:{
            "nombre":"FACULTADES",
            "idElemento": idElemento
          },
          facultades: [{
            ...formValue,
            id: idElemento,
            esRegistro:true,
            "usuarioCreacion": formValue["usuarioCreacion"],
            "fechaCreacion": formValue["fechaCreacion"],
            "tipoOperacion": formValue["tipoOperacion"],
            "token": formValue["token"],
          }, ...response.facultades]
        };
        facultadesUpdate = request.facultades;
        return request;
        }
      ),
      concatMap(request => this.maestroFacultadService.setGenerateFormato(request)),
      tap(response => {
            /*
            const pageRequest: IDataGridPageRequest = {
              page: this.getState().source.page,
              pageSize: this.getState().source.pageSize,
              orderBy: this.getState().source.orderBy,
              orderDir: this.getState().source.orderDir,
            }
            this.maestroFacultadService.getFormatoByVersion(state.formRequest.idVersion).pipe(
              tap(response => {
                this.fetchPageMaestroFacultadSucces(response.facultades,pageRequest);
                //return;
              }),
              catchError(error => {
                //console.log(error);
                return throwError(error);
              })
            );
            */
            //this.fetchPageMaestroFacultadSucces(facultadesUpdate);
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  
  asyncUpdateMaestroFacultad = (form: IEntidadMaestroFacultad): Observable<IEntidadMaestroFacultad> => {
    this.setStateIsLoading(true);
    const state = this.getState();
    return this.maestroFacultadService.getFormatoByVersion(state.formRequest.idVersion)
      .pipe(
        map(response => {
          const index = response.facultades.findIndex(item => item.id == form.id);
          let listUpdate = null;
          if (-1 === index){
            console.log('El programa no existe');
            //throw new exception('El programa no existe');
            //programasUpdate = [...response.programaMenciones, form];
          } else {
            const element = response.facultades[index];
            const elementUpdate = {
              ...element,
              ...form,
              /*codigo: form.codigo,
              resolucionCreacion: form.resolucionCreacion,
              fechaCreacionResolucion: form.fechaCreacionResolucion,
              modalidadEstudioEnum: form.modalidadEstudioEnum,
              resolucionCreacionModalidad: form.resolucionCreacionModalidad,
              fechaCreacionModalidad: form.fechaCreacionModalidad,
              idFacultad: form.idFacultad,
              regimenEstudioEnum:form.regimenEstudioEnum,
              tipoGradoAcademicoEnum:form.tipoGradoAcademicoEnum,
              denominacionGradoAcademico:form.denominacionGradoAcademico,
              denominacionTituloOtorgado:form.denominacionTituloOtorgado,
              codigoCINE:form.codigoCINE,
              denominacionPrograma:form.denominacionPrograma,
              comentario:form.comentario,
              descripcionCINE:form.descripcionCINE,
              descripcionFacultad:form.descripcionFacultad*/
            };
            
            listUpdate = [...response.facultades.slice(0, index), elementUpdate, ...response.facultades.slice(index + 1)];
          }
          const request = {
            ...response,
            datosProceso:{
              "nombre":"FACULTADES",
              "idElemento": form.id
            },
            facultades: listUpdate
          };
          return request;
        }),
        concatMap(request => this.maestroFacultadService.setUpdateFormato(request)),
        tap(response => {
          this.setStateIsLoading(false);
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
