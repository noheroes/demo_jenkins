import { FormType } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, Subscription, throwError, from } from 'rxjs';
import { map, tap, catchError, concatMap } from 'rxjs/operators';
import { IModalLocal, IFormLocal } from '../local.store.interface';
import { LocalService } from '../../../service/local.service';
import { ModalLocal } from '../local.store.model';
import * as uuid from 'uuid';

export class LocalModalActions {
  constructor(
    private getState: () => IModalLocal,
    private setState: (newState: IModalLocal) => void,
    private localService: LocalService
  ) {
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

  setModalEdit = (id: string, codigoSedeFilial: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoLocal: id,
      codigoSedeFilial: codigoSedeFilial,
      type: FormType.EDITAR,
      title: 'Modificar local'
    });

  }
  setModalReadOnly = (id: string, codigoSedeFilial: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoLocal: id,
      codigoSedeFilial: codigoSedeFilial,
      type: FormType.CONSULTAR,
      title: 'Consulta local'
    });
  }

  setModalNew = (codigoSedeFilial: string, ubigeo: string, codigo: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      codigoSedeFilial: codigoSedeFilial,
      ubigeo: ubigeo,
      codigo: codigo,
      isLoading: false
    });
  }
  resetModalLocal = () => {
    this.setState(new ModalLocal());
  };

  private fetchDepartamentosBegin = () => {
    this.setState(
      update(this.getState(), {
        comboLists: { departamentos: { loading: { $set: true } } }
      })
    );
  };

  private fetchDepartamentosSucces = data => {
    this.setState(
      update(this.getState(), {
        comboLists: { departamentos: { $set: { list: data, loading: false } } }
      })
    );
  };

  asyncFetchDepartamentos = () => {
    const source = of([{ 'text': 'SL01', 'value': 'value' }]);
    this.fetchDepartamentosBegin();
    source.subscribe(value => {
      this.fetchDepartamentosSucces(value);
    });
  }

  private fetchLocalBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchLocalSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  };

  loadDataLocal = (data: any) => {
    this.fetchLocalSucces(data);
  }

  asynFetchLocal = (codigoLocal: string): Observable<IFormLocal> => {
    const state = this.getState();
    return this.localService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        const codigoSedeFilial = state.codigoSedeFilial;
        return response.sedeFiliales.find(item => item.id == codigoSedeFilial).locales
          .find(x => x.id == codigoLocal);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  asynSaveLocal = (form: IFormLocal): Observable<IFormLocal> => {
    this.crudLocalBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    return this.localService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          var a = this.getState();
          var index = response.sedeFiliales.findIndex(x => x.id == a.codigoSedeFilial);
          let sedeFilial = response.sedeFiliales[index];
          var locales = sedeFilial.locales || [];
          const localesUpdate = [...locales,             
            { ...form, id: idElemento,
              EsRegistro:true,
              "usuarioCreacion": form["usuarioCreacion"],
              "fechaCreacion": form["fechaCreacion"],
              "tipoOperacion": form["tipoOperacion"],
              "token": form["token"],
            }
          ];
          let sedeFilialUpdate = {
            ...sedeFilial,
            "tipoOperacion":"M",
            "token":sedeFilial.token,
            locales: localesUpdate
          };

          const sedesFilialesUpdate = [...response.sedeFiliales.slice(0, index), sedeFilialUpdate, ...response.sedeFiliales.slice(index + 1)];
          
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "local",
              "prefijo": form.codigoSedeFilial.indexOf('S') > -1 ? `SL` :`${form.codigoSedeFilial}L`,
              "idVersion": state.idVersion,
              "idSedeFilial": state.codigoSedeFilial,
              "idLocal": ""
            },
            datosProceso:{
              "nombre":"SEDEFILIALES",
              "idElemento": this.getState().codigoSedeFilial
            },
            sedeFiliales: sedesFilialesUpdate
          }                    
          return request;
        }),
        concatMap(request => this.localService.setGenerateFormato(request)),
        tap(response => {
          this.crudLocalSucces();
        }),
        catchError(error => {          
          this.crudError(error);                   
          return throwError(error);
        })
      );
  }

  asynUpdateLocal = (form: IFormLocal): Observable<IFormLocal> => {
    this.crudLocalBegin();
    const state = this.getState();
    return this.localService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          var index = response.sedeFiliales.findIndex(x => x.id == this.getState().codigoSedeFilial);
          let sedeFilial = response.sedeFiliales[index];
          var locales = sedeFilial.locales || [];
          let indexLocal = locales.findIndex(x => x.id == this.getState().codigoLocal);
          let local = locales[indexLocal];
          let localUpdate = {
            ...local,
            codigoSedeFilial: form.codigoSedeFilial,            
            codigo: form.codigo,
            esServicioEducativo: form.esServicioEducativo,
            esServicioEducativoComplementario: form.esServicioEducativoComplementario,
            esOtroServicio: form.esOtroServicio,
            otroServicio: form.otroServicio,
            resolucionAutorizacion: form.resolucionAutorizacion,
            fechaAutorizacion: form.fechaAutorizacion,
            ubigeo: form.ubigeo,
            descripcionUbigeo: form.descripcionUbigeo,
            direccion: form.direccion,
            referencia: form.referencia,
            areaTerreno: form.areaTerreno,
            areaConstruida: form.areaConstruida,
            aforo: form.aforo,
            telefono: form.telefono,
            cantidadEstudiantes: form.cantidadEstudiantes,
            comentarios: form.comentarios,
            "usuarioModificacion": form["usuarioModificacion"],
            "fechaModificacion": form["fechaModificacion"],
            "tipoOperacion": form["tipoOperacion"],
          };
          const localesUpdate = [...locales.slice(0, indexLocal), localUpdate, ...locales.slice(indexLocal + 1)];

          let sedeFilialUpdate = {
            ...sedeFilial,
            "tipoOperacion":"M",
            "token":sedeFilial.token,
            locales: localesUpdate
          };

          const sedesFilialesUpdate = [...response.sedeFiliales.slice(0, index), sedeFilialUpdate, ...response.sedeFiliales.slice(index + 1)];
          
          const request = {
            ...response,
            datosProceso:{
              "nombre":"SEDEFILIALES",
              "idElemento": this.getState().codigoSedeFilial
            },
            sedeFiliales: sedesFilialesUpdate
          }
          return request;
        }),
        concatMap(request => this.localService.setUpdateFormato(request)),
        tap(response => {
          this.crudLocalSucces();
        }),
        catchError(error => {
          this.crudError(error);

          return throwError(error);
        })
      );
  }

  private crudLocalBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private crudLocalSucces = () => {
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
