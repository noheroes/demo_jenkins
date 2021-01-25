import { FormType, ComboList, IDataGridPageRequest } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError } from 'rxjs';
import { tap, catchError, concatMap, map } from 'rxjs/operators';
import { EquipamientoService } from '../../../service/equipamiento.service';
import { IModalEquipamiento, IFormEquipamiento } from '../equipamiento.store.interface';
import { ModalEquipamiento, FormEquipamiento } from '../equipamiento.store.model';
import * as uuid from 'uuid';
import { AppCurrentFlowStore, AppAudit } from '@lic/core';


export class EquipamientoModalActions {
  constructor(
    private getState: () => IModalEquipamiento,
    private setState: (newState: IModalEquipamiento) => void,
    private EquipamientoService: EquipamientoService,
    private storeCurrent: AppCurrentFlowStore
  ) {

  }

  setInit = (idversion: string, tipoEquipoMobiliarioEnum: any) => {
    const state = this.getState();
    this.setState({
      ...state,
      idVersion: idversion,
      tipoEquipoMobiliarioEnum: tipoEquipoMobiliarioEnum,
      form: {
        ...state.form
      }
    });
  }

  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  setModalEdit = (id: string, idSedeFilial: string, idLocal: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoEquipamiento: id,
      idSedeFilial: idSedeFilial,
      idLocal: idLocal,
      type: FormType.EDITAR,
      title: 'Modificar Equipamiento'
    });

  }
  setModalReadOnly = (id: string, idSedeFilial: string, idLocal: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      codigoEquipamiento: id,
      idSedeFilial: idSedeFilial,
      idLocal: idLocal,
      type: FormType.CONSULTAR,
      title: 'Consulta Equipamiento'
    });
  }

  setModalNew = (idSedeFilial: string, idLocal: string, codigoLaboratorioTaller: string, tipoEquipamiento: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idSedeFilial: idSedeFilial,
      idLocal: idLocal,
      codigoLaboratorioTaller: codigoLaboratorioTaller,
      isLoading: false,
      tipoEquipamiento: tipoEquipamiento
    });
  }
  resetModalEquipamiento = () => {
    this.setState(new ModalEquipamiento());
  };

  private fetchEquipamientoBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchEquipamientoSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  };

  loadDataEquipamiento = (data: any) => {
    this.fetchEquipamientoSucces(data);
  }

  asynFetchListLaboratorio = (): Observable<any> => {
    const state = this.getState();
    return this.EquipamientoService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial).pipe(
      map(response => {
        let elementos = new Object();
        let list = [];
        if (Object. entries(response).length != 0) {
          //Laboratorios
          response.laboratorios.filter(x => !x.esEliminado).forEach(function(item) {
              list.push({
                  text: `${item.codigo} - ${item.nombre}`,
                  value: item.codigo
              });
          });
          //Taller
          response.talleres.filter(x => !x.esEliminado).forEach(function(item) {
              list.push({
                  text: `${item.codigo} - ${item.nombre}`,
                  value: item.codigo
              });
          });
        }
        elementos['list'] = list;
        elementos['loading'] = false;
        return elementos;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  asynFetchEquipamiento = (codigoEquipamiento: string): Observable<IFormEquipamiento> => {
    const state = this.getState();
    return this.EquipamientoService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial).pipe(
      map(response => {
        let equipamiento: IFormEquipamiento = new FormEquipamiento();
        return equipamiento;
        //return response.equipoMobiliarios.find(item => item.id == codigoEquipamiento);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  asynSaveEquipamiento = (form: IFormEquipamiento): Observable<IFormEquipamiento> => {
    this.crudEquipamientoBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    
    let nombreNumeracion = "";
    let prefijo = "";
    let nombreProceso = "";
    
    if(state.tipoEquipamiento == "T"){
      nombreNumeracion = "tallerEquipoMobiliario";
      prefijo = "TAEQUIMOBILARIO";
      nombreProceso = "tallerEquipoMobiliarios";
    }else{
      nombreNumeracion = "laboratorioEquipoMobiliario";
      prefijo = "LABEQUIMOBILARIO";
      nombreProceso = "laboratorioEquipoMobiliarios";
    }
    
    return this.EquipamientoService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)
      .pipe(
        map(response => {
          const request = {
            ...response,
            datosNumeracion : {
              "nombre": nombreNumeracion,
              "prefijo": prefijo,
              "idVersion": state.idVersion,
              "idSedeFilial": state.idSedeFilial,
              "idLocal": ""
            },
            datosProceso : {
              "nombre": nombreProceso,
              "idElemento": idElemento
            },
            equipoMobiliarios: [{
              "id": idElemento,//uuid.v4(),
              "idLocal": state.idLocal, //Falta establecer el ID local
              "codigoLaboratorioTaller": form.codigoLaboratorioTaller,
              "numeroEqMobSoft": form.numeroEqMobSoft,
              "nombreEqMobSoft": form.nombreEqMobSoft,
              "tipoEquipoMobiliarioEnum": form.tipoEquipoMobiliarioEnum,
              "valorizacion": form.valorizacion,
              "comentario": form.comentario,
              "usuarioCreacion": form["usuarioCreacion"],
              "fechaCreacion": form["fechaCreacion"],
              "tipoOperacion": form["tipoOperacion"],
              "token": form["token"],
            }, ...response.equipoMobiliarios]
          };
          return request;
        }),
        concatMap(request => this.EquipamientoService.setUpdateFormatoDetalle(request)
        ),
        tap(response => {
          this.crudEquipamientoSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  asynUpdateAmbiente = (form: IFormEquipamiento): Observable<IFormEquipamiento> => {
    this.crudEquipamientoBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    
    let nombreNumeracion = "";
    let prefijo = "";
    let nombreProceso = "";

    if(state.tipoEquipamiento == "T"){
      nombreNumeracion = "tallerEquipoMobiliario";
      prefijo = "TAEQUIMOBILARIO";
      nombreProceso = "tallerEquipoMobiliarios";
    }else{
      nombreNumeracion = "laboratorioEquipoMobiliario";
      prefijo = "LABEQUIMOBILARIO";
      nombreProceso = "laboratorioEquipoMobiliarios";
    }

    return this.EquipamientoService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)
      .pipe(
        map(response => {
          const index = response.equipoMobiliarios.findIndex(item => item.id == form.id);

          let equipamientoUpdate = null;
          if (-1 === index) {
            equipamientoUpdate = [...response.equipoMobiliarios, form];
          } else {
            equipamientoUpdate = [...response.equipoMobiliarios.slice(0, index),
              form,
            ...response.equipoMobiliarios.slice(index + 1)];
          }

          const request = {
            datosNumeracion : {
              "nombre": nombreNumeracion,//"laboratorioEquipoMobiliario",
              "prefijo": prefijo,//"LABEQUIMOBILARIO",
              "idVersion": state.idVersion,
              "idSedeFilial": state.idSedeFilial,
              "idLocal": ""
            },
            datosProceso : {
              "nombre": nombreProceso,//"laboratorioEquipoMobiliarios",
              "idElemento": idElemento
            },
            laboratorios: response.laboratorios,
            talleres: response.talleres,
            id: response.id,
            idSedeFilial: response.idSedeFilial,
            idVersion: response.idVersion,
            equipoMobiliarios: equipamientoUpdate
          };
          return request;
        }),
        concatMap(request => this.EquipamientoService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.crudEquipamientoSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  private crudEquipamientoBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private crudEquipamientoSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: '' }
      })
    );
  };

  asyncFetchPageEquipamiento = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    }): Observable<any> => {
    this.fetchEquipamientoBegin();
    const state = this.getState();    
    return this.EquipamientoService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial).pipe(
      tap(response => {        
        if (Object.entries(response).length != 0){
          this.fetchPageEquipamientoSucces(response.equipoMobiliarios.filter(x => x.idLocal == state.idLocal).filter(x => x.codigoLaboratorioTaller == state.codigoLaboratorioTaller), response.count, pageRequest);
        } else {
          this.fetchPageEquipamientoSucces([], 0, pageRequest);
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  asyncFetchPageEquipamientoSucces = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().formBuscar): Observable<any> => {

    this.fetchEquipamientoBegin();

    return this.EquipamientoService.fetchPageEquipamiento(pageRequest, filters).pipe(
      tap(response => {
        this.fetchPageEquipamientoSucces(response.data, response.count, pageRequest);
      }),
      catchError(error => {
        this.fetchEquipamientoError(error);
        return throwError(error);
      })
    );
  }

  private fetchEquipamientoError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  };

  private fetchPageEquipamientoSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
    var filters = this.getState();   
    let numeroOrden = 0;
    items.forEach(element => {
      numeroOrden = numeroOrden + 1;
      element['numero'] = numeroOrden;
      element['descripcionEquipoMobiliario'] = filters.tipoEquipoMobiliarioEnum.list.find(x => x.value == element.tipoEquipoMobiliarioEnum).text.toUpperCase()
    });
    let elementos = (items || []).filter(item => !item.esEliminado);
    elementos = (items || []).filter(item => !item.esEliminado)
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

    const totalItems =(items || []).filter(item => !item.esEliminado).length; 
    const elementosPag = (items || []).filter(item => !item.esEliminado)
      .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);

    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        source: {
          items: { $set: elementosPag },
          total: { $set: totalItems },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
  };

  asynDeleteEquipamiento = (id: string): Observable<IFormEquipamiento> => {
    this.fetchEquipamientoBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    return this.EquipamientoService.getFormatoDetalleByVersion(state.idVersion, state.idSedeFilial)
      .pipe(
        map(response => {
          const index = response.equipoMobiliarios.findIndex(item => item.id == id);
          let form = response.equipoMobiliarios[index];
          form.esEliminado = true;

          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);

          let nombreNumeracion = "";
          let prefijo = "";
          let nombreProceso = "";
      
          //const tipoEquipoMobiliario = form.codigoLaboratorioTaller.split("0",1);
          if(state.tipoEquipamiento == "T"){
            nombreNumeracion = "tallerEquipoMobiliario";
            prefijo = "TAEQUIMOBILARIO";
            nombreProceso = "tallerEquipoMobiliarios";
          }else{
            nombreNumeracion = "laboratorioEquipoMobiliario";
            prefijo = "LABEQUIMOBILARIO";
            nombreProceso = "laboratorioEquipoMobiliarios";
          }

          const equipamientoUpdate = [...response.equipoMobiliarios.slice(0, index), form, ...response.equipoMobiliarios.slice(index + 1)];
          const request = {
            ...response,
            datosNumeracion : {
              "nombre": nombreNumeracion,//"laboratorioEquipoMobiliario",
              "prefijo": prefijo,//"LABEQUIMOBILARIO",
              "idVersion": state.idVersion,
              "idSedeFilial": state.idSedeFilial,
              "idLocal": ""
            },
            datosProceso : {
              "nombre": nombreProceso,//"laboratorioEquipoMobiliarios",
              "idElemento": idElemento
            },
            equipoMobiliarios: equipamientoUpdate
          };

          return request;
        }),
        concatMap(request => this.EquipamientoService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.fetchEquipamientoDeleteSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  private fetchEquipamientoDeleteSucces = () => {
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
