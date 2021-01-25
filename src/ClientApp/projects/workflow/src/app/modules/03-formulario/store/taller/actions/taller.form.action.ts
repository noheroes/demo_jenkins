import update from 'immutability-helper';
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { FormType } from '@sunedu/shared';
import { IFormTaller,IEntidadTaller } from '../taller.store.interface';
import { FormTaller } from './../taller.store.model';
import * as uuid from 'uuid';
import { TallerService } from '../../../service/taller.service';

export class TallerFormActions {
  
  constructor(
    private getState: () => IFormTaller,
    private setState: (newState: IFormTaller) => void,
    private tallerService: TallerService
  ) {

  }
  
  
  asynSaveTaller = (form: IEntidadTaller): Observable<IEntidadTaller> => {
    this.crudTallerBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    return this.tallerService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)
      .pipe(
        map(response => {          
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "taller",
              "prefijo": `${form.codigoLocal}TA`,
              "idVersion": state.idVersion,
              "idSedeFilial": state.idSedeFilial,
              "idLocal": state.idLocal
            },
            datosProceso:{
              "nombre":"talleres",
              "idElemento": idElemento
            },
            talleres: [{
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
            }, ...response.talleres]
          };          
          return request;
        }),        
        concatMap(request => this.tallerService.setGenerateFormatoDetalle(request)
        ),
        tap(response => {
          this.crudTallerSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }
  private crudTallerBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  asynUpdateTaller = (form: IEntidadTaller): Observable<IEntidadTaller> => {
    this.crudTallerBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    return this.tallerService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)
      .pipe(
        map(response => {          
          const index = response.talleres.findIndex(item => item.id == form.id);
          let tallerlUpdate = null;          
          if (-1 === index) {
            tallerlUpdate = [...response.talleres, form];
          } else {
            tallerlUpdate = [...response.talleres.slice(0, index),
              form,
            ...response.talleres.slice(index + 1)];
          }
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "taller",              
              "idVersion": state.idVersion,
              "idSedeFilial": state.idSedeFilial,
              "idLocal": state.idLocal
            },
            datosProceso:{
              "nombre":"talleres",
              "idElemento": idElemento
            }, 
            talleres: tallerlUpdate
          };          
          return request;
        }),
        concatMap(request => this.tallerService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.crudTallerSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  asynFetchTaller = (codigoTaller: string): Observable<IEntidadTaller> => {
    const state = this.getState();    
    return this.tallerService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial).pipe(
      map(response => {           
        return response.talleres.find(item => item.id == codigoTaller);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  loadDataTaller = (data: any) => {
    this.fetchTallerSucces(data);
  }
  private fetchTallerSucces = (data: any) => {
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
      codigoTaller: id,
      idSedeFilial: idSedeFilial,
      idLocal: idLocal,
      type: FormType.EDITAR,
      title: 'Modificar Taller'
    });

  }
  setModalReadOnly = (id: string, idSedeFilial: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false,
      codigoTaller: id,
      idSedeFilial: idSedeFilial,
      type: FormType.CONSULTAR,
      title: 'Consulta Taller'
    });
  }
  resetModal = () => {
    this.setState(new FormTaller());
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

  private crudTallerSucces = () => {
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
