import { FormType } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, Subscription, throwError, from } from 'rxjs';
import { map, tap, catchError, concatMap } from 'rxjs/operators';
import { IModalSedeFilial, IFormSedeFilial } from '../sedefilial.store.interface';
import { SedeFilialService } from '../../../service/sedefilial.service';
import { ModalSedeFilial } from '../sedefilial.store.model';
import * as uuid from 'uuid';
export class SedeFilialModalActions {
  constructor(
    private getState: () => IModalSedeFilial,
    private setState: (newState: IModalSedeFilial) => void,
    private sedeFilialService: SedeFilialService
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
  setModalEdit = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoSedeFilial: id,
      type: FormType.EDITAR,
      title: 'Modificar sede/filial'
    });

  }

  asynFetchSedeFilial = (codigoSedeFilial: string): Observable<IFormSedeFilial> => {
    const state = this.getState();
    return this.sedeFilialService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        return response.sedeFiliales.find(item => item.id == codigoSedeFilial);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  asynValidateUpdateSedeFilial = (id: string, codigoSedeFilial: string, esSedeFilial: boolean): Observable<string> => {
    const state = this.getState();
    return this.sedeFilialService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        var mensaje = "";                
        var existeSedeFilial = response.sedeFiliales.findIndex(x => x.codigo.toUpperCase() == codigoSedeFilial.toUpperCase()
                                                              && x.id != id && x.esEliminado == false) > -1;
        if (existeSedeFilial) mensaje = `Ya se encuentra registrado una sede filial con el código ${codigoSedeFilial}.`;        
        var esSede = esSedeFilial ? response.sedeFiliales.findIndex(x => x.esSedeFilial && !x.esEliminado && x.id != id) > -1 : false;
        if (esSede) mensaje =  "Ya se encuentra registrada una sede";
        return mensaje;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  asynValidateSedeFilial = (codigoSedeFilial: string, esSedeFilial: boolean): Observable<string> => {
    const state = this.getState();
    return this.sedeFilialService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        var mensaje = "";
        var existeSedeFilial = (response.sedeFiliales.findIndex(x => !x.codigo && !x.esEliminado) > -1) ?
                               false : (response.sedeFiliales.findIndex(x => x.codigo.toUpperCase() == codigoSedeFilial.toUpperCase() && !x.esEliminado) > -1) ;
        if (existeSedeFilial) mensaje = `Ya se encuentra registrado una sede filial con el código ${codigoSedeFilial}.`;
        var esSede = esSedeFilial ? response.sedeFiliales.findIndex(x => x.esSedeFilial && !x.esEliminado) > -1 : false;
        if (esSede) mensaje =  "Ya se encuentra registrada una sede";
        return mensaje;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  asynValidarDepartamentoProvincia = ():string => {
    var mensaje = "Ya se encuenta un registro para ";
    return mensaje;
  }

  asynUpdateSedeFilial = (form: IFormSedeFilial): Observable<IFormSedeFilial> => {
    this.crudSedeFilialBegin();
    const state = this.getState();   
    var EsCambioFilial;    
    form.locales = state.form.locales;    
    return this.sedeFilialService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {         
          const index = response.sedeFiliales.findIndex(item => item.id == form.id);
          let sedeFilialUpdate = null;
          let descripcionDepartamento = form.descripcionUbigeo.split('/')[0] == 'undefined' ? 
                                        response.sedeFiliales[index].descripcionUbigeo.split('/')[0] :
                                        form.descripcionUbigeo.split('/')[0];
          let descripcionProvincia = form.descripcionUbigeo.split('/')[1] == 'undefined' ? 
                                        response.sedeFiliales[index].descripcionUbigeo.split('/')[1] :
                                        form.descripcionUbigeo.split('/')[1];
          form.descripcionUbigeo = `${descripcionDepartamento}/${descripcionProvincia}`;          
          //EsCambioFilial = response.sedeFiliales.findIndex(item => item.id == form.id && item.esSedeFilial && item.esSedeFilial != form.esSedeFilial) > -1;
          //form['EsCambioFilial'] = EsCambioFilial;
          form.codigo = form.esSedeFilial ? "S" : form.codigo;
          if (-1 === index) {
            sedeFilialUpdate = [...response.sedeFiliales, form];
          } else {
            sedeFilialUpdate = [...response.sedeFiliales.slice(0, index),
              form,
            ...response.sedeFiliales.slice(index + 1)];
          }
          var request = {};
          // if (!EsCambioFilial) {
          //   request = {
          //     ...response,
          //     RecalculoNumeracion: {
          //       "nombre": "sedeFilial",
          //       "prefijo": "F",
          //       "idVersion": state.idVersion,
          //       "idSedeFilial": form.id,
          //       "idLocal": "",
          //       "TipoOperacion": form['tipoOperacion']
          //     },
          //     sedeFiliales: sedeFilialUpdate
          //   };
          // } else {
          //   request = {
          //     ...response, 
          //     RecalculoNumeracion: {
          //       "nombre": "sedeFilial",
          //       "prefijo": "F",
          //       "idVersion": state.idVersion,
          //       "idSedeFilial": form.id,
          //       "idLocal": "",
          //       "TipoOperacion": form['tipoOperacion']
          //     },             
          //     sedeFiliales: sedeFilialUpdate
          //   };
          // }
          request = {
            ...response, 
            RecalculoNumeracion: {
              "nombre": "sedeFilial",
              "prefijo": "F",
              "idVersion": state.idVersion,
              "idSedeFilial": form.id,
              "idLocal": "",
              "usuarioModificacion": form["usuarioModificacion"],
              "fechaModificacion": form["fechaModificacion"],
              "tipoOperacion": form["tipoOperacion"],
              "UbigeoActual": form['ubigeo']
            }, 
            datosProceso:{
              "nombre":"SEDEFILIALES",
              "idElemento": form.id
            },            
            sedeFiliales: sedeFilialUpdate
          };
          return request;
        }),
        concatMap(request => 
          //(!EsCambioFilial) ? this.sedeFilialService.setUpdateFormato(request) : this.sedeFilialService.setGenerateFormato(request)),
          this.sedeFilialService.setUpdateFormato(request)),
        tap(response => {
          this.crudSedeFilialSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  asynSaveSedeFilial = (form: IFormSedeFilial): Observable<IFormSedeFilial> => {
    this.crudSedeFilialBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    return this.sedeFilialService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          var request = {};
          if (form.esSedeFilial) {
            request = {
              ...response,
              datosProceso:{
                "nombre":"SEDEFILIALES",
                "idElemento": idElemento
              },
              sedeFiliales: [{
                ...form,
                "id": idElemento,
                "codigo": "S",
                "esSedeFilial": form.esSedeFilial,
                "ubigeo": form.nombreProvincia.substr(0, 4),
                "descripcionUbigeo": form.descripcionUbigeo,
                esRegistro: true,
                cantidadLocal: 0,
                "usuarioCreacion": form["usuarioCreacion"],
                "fechaCreacion": form["fechaCreacion"],
                "tipoOperacion": form["tipoOperacion"],
                "token": form["token"],
                locales: [
                  ...form.locales
                ]
              }, ...response.sedeFiliales]
            };
          } else {
           request = {
            ...response,
            datosNumeracion: {
              "nombre": "sedeFilial",
              "prefijo": "F",
              "idVersion": state.idVersion,
              "idSedeFilial": "",
              "idLocal": ""
            },
            datosProceso:{
              "nombre":"SEDEFILIALES",
              "idElemento": idElemento
            },
            sedeFiliales: [{
              ...form,
              "id": idElemento,              
              "esSedeFilial": form.esSedeFilial,
              "ubigeo": form.nombreProvincia.substr(0, 4),
              "descripcionUbigeo": form.descripcionUbigeo,
              "usuarioCreacion": form["usuarioCreacion"],
              "fechaCreacion": form["fechaCreacion"],
              "tipoOperacion": form["tipoOperacion"],
              "token": form["token"],
              esRegistro: true,
              cantidadLocal: 0,
              locales: [
                ...form.locales
              ]
            }, ...response.sedeFiliales]
          };
        }
          return request;
        }),        
        concatMap(request =>           
          (form.esSedeFilial) ? this.sedeFilialService.setUpdateFormato(request) : this.sedeFilialService.setGenerateFormato(request) 
        ),
        tap(response => {
          this.crudSedeFilialSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  setModalReadOnly = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoSedeFilial: id,
      type: FormType.CONSULTAR,
      title: 'Consulta sede/filial'
    });
  }

  setModalNew = (sedesBandeja:any) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false,
      listSedes:sedesBandeja
    });
  }
  getSedesBandeja = () =>{
    return this.getState().listSedes;
  }
  resetModalSedeFilial = () => {
    this.setState(new ModalSedeFilial());
  };

  private fetchSedeFilialSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: {
          $set: data
        },
      })
    );
  };

  loadDataSedeFilial = (data: any) => {
    this.fetchSedeFilialSucces(data);
  }

  private crudSedeFilialBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private crudSedeFilialSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  }
}
