import update from 'immutability-helper';
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest } from '@sunedu/shared';
import { FormType } from '@sunedu/shared';
import { IFormLaboratorio,IEntidadLaboratorio } from '../laboratorio.store.interface';
import { FormLaboratorio } from './../laboratorio.store.model';
import { LaboratorioService } from '../../../service/laboratorio.service';
import * as uuid from 'uuid';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';

export class LaboratorioFormActions {
  
  constructor(
    private getState: () => IFormLaboratorio,
    private setState: (newState: IFormLaboratorio) => void,
    private laboratorioService: LaboratorioService,
    private storeCurrent: AppCurrentFlowStore 
  ) {

  }
  
  
  asynSaveLaboratorio = (form: IEntidadLaboratorio): Observable<IEntidadLaboratorio> => {
    this.crudLaboratorioBegin();
    const state = this.getState();   
    var idElemento = uuid.v4();
    return this.laboratorioService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)
      .pipe(
        map(response => {          
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "laboratorio",         
              "prefijo": `${form.codigoLocal}LA`,     
              "idVersion": state.idVersion,
              "idSedeFilial": state.idSedeFilial,
              "idLocal": state.idLocal
            },           
            datosProceso:{
              "nombre":"laboratorios",
              "idElemento": idElemento
            },
            laboratorios: [{
              "id": idElemento,
              "idLocal": state.idLocal,              
              "codigo": form.codigo,                
              "nombre": form.nombre,
              "tipoLaboratorioTallerEnum": form.tipoLaboratorioTallerEnum,
              "ubicacion": form.ubicacion,
              "aforo": form.aforo,
              "comentario": form.comentario,
              "cantidadProgramaVinculado": 0,
              esRegistro: true,
              "usuarioCreacion": form["usuarioCreacion"],
              "fechaCreacion": form["fechaCreacion"],
              "tipoOperacion": form["tipoOperacion"], 
              "token": form["token"],
              programa: {
                ...form.programa
              }
            }, ...response.laboratorios]                      
          };       
          return request;
        }),        
        concatMap(request => this.laboratorioService.setGenerateFormatoDetalle(request)
        ),
        tap(response => {
          this.crudLaboratorioSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  asynUpdateLaboratorio = (form: IEntidadLaboratorio): Observable<IEntidadLaboratorio> => {
    this.crudLaboratorioBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    return this.laboratorioService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)
      .pipe(
        map(response => {          
          const index = response.laboratorios.findIndex(item => item.id == form.id);
          let laboratoriolUpdate = null; 
               
          if (-1 === index) {
            laboratoriolUpdate = [...response.laboratorios, form];
          } else {
            laboratoriolUpdate = [...response.laboratorios.slice(0, index),
              form,
            ...response.laboratorios.slice(index + 1)];                
          }
          //const audit = new AppAudit(this.storeCurrent);
          //laboratoriolUpdate = audit.setUpdate(laboratoriolUpdate);         
          
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "laboratorio",              
              "idVersion": state.idVersion,
              "idSedeFilial": state.idSedeFilial,
              "idLocal": state.idLocal
            },
            datosProceso:{
              "nombre":"laboratorios",
              "idElemento": idElemento
            },  
            laboratorios: laboratoriolUpdate
          };  
          return request;
        }),
        concatMap(request => this.laboratorioService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.crudLaboratorioSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  private crudLaboratorioBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  asynFetchLaboratorio = (codigoLaboratorio: string): Observable<IEntidadLaboratorio> => {    
    const state = this.getState();   
    return this.laboratorioService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial).pipe(
      map(response => {           
        return response.laboratorios.find(item => item.id == codigoLaboratorio);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  loadDataLaboratorio = (data: any) => {
    this.fetchLaboratorioSucces(data);
  }
  private fetchLaboratorioSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  };
  setModalEdit = (id: string, idSedeFilial: string, idLocal: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false,
      codigoLaboratorio: id,
      idSedeFilial: idSedeFilial,
      idLocal: idLocal,
      type: FormType.EDITAR,
      title: 'Modificar laboratorio'
    });

  }
  setModalReadOnly = (id: string, idSedeFilial: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false,
      codigoLaboratorio: id,
      idSedeFilial: idSedeFilial,
      type: FormType.CONSULTAR,
      title: 'Consulta laboratorio'
    });
  }
  resetModal = () => {
    this.setState(new FormLaboratorio());
  };
  setModalNew = (idSedeFilial: string, idLocal: string, codigoLocal: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idSedeFilial: idSedeFilial,
      idLocal: idLocal,
      codigoLocal: codigoLocal,
      isLoading: false
    });
  }

  private crudLaboratorioSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  }

  setInit = (idversion: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idVersion: idversion,
      form: {
        ...state.form
      }
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
