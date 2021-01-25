import { EntidadRequestValues } from './../presupuesto.store.model';
import { IEntidadRequestValues } from './../presupuesto.store.interface';
import { FormType } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, Subscription, throwError } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';

import { IFormPresupuesto, IEntidadPresupuesto } from '../presupuesto.store.interface';
import { PresupuestoService } from '../../../service/presupuesto.service';
import { FormPresupuesto } from '../presupuesto.store.model';
import * as uuid from 'uuid';

export class PresupuestoFormActions {
  constructor(
    private getState: () => IFormPresupuesto,
    private setState: (newState: IFormPresupuesto) => void,
    private presupuestoService: PresupuestoService
  ) {
    
  }

  setModalEdit = (id: string,idVersion: string,idSede: string,idLocal: string) => {
    const state = this.getState();
    let requestValue:IEntidadRequestValues;
    requestValue = new EntidadRequestValues();
    requestValue.id = id;
    requestValue.idVersion = idVersion;
    requestValue.idSedeFilial = idSede;
    requestValue.idLocal = idLocal;
    this.setState({
      ...state,
      isLoading: true,
      type: FormType.EDITAR,
      title: 'Modificar Presupuesto',
      requestValues: requestValue
    });

  }
  setModalReadOnly = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      type: FormType.CONSULTAR,
      title: 'Consultar Presupuesto'
    });
  }
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }

  setModalNew = (tipoCBCEnum:number,idVersion: string,idSede: string,idLocal: string) => {
    const state = this.getState();
    //debugger;
    let requestValue:IEntidadRequestValues;
    requestValue = new EntidadRequestValues();
    requestValue.idVersion = idVersion;
    requestValue.idSedeFilial = idSede;
    requestValue.idLocal = idLocal;
    requestValue.tipoCBCEnum = tipoCBCEnum;
    this.setState({
      ...state,
      type: FormType.REGISTRAR,
      title: 'Registrar Presupuesto',
      requestValues: requestValue
    });
  }
  resetModalPresupuesto = () => {
    this.setState(new FormPresupuesto());
  };

  asyncFetch = (id:string,idVersion:string,idSede:string): Observable<any> => {
    this.fetchBegin();
    return this.presupuestoService.getFormatoDetalleByVersion(idVersion,idSede).pipe(
      map(response =>{
        if(response.presupuestos!=[]){
          return response.presupuestos.find(item => item.id == id);
        };
        return null;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  };
  asynUpdate = (form: IEntidadPresupuesto,requestValues:EntidadRequestValues): Observable<any> => {
    this.crudBegin();
    var idElemento = uuid.v4();
    const state = this.getState();
    return this.presupuestoService.getFormatoDetalleByVersion(requestValues.idVersion,requestValues.idSedeFilial)
      .pipe(
        map(response => {
          const index = response.presupuestos.findIndex(item => item.id == requestValues.id);
          let listItems = null;
          if (-1 === index) {
            listItems = [...response.presupuestos, form];
          } else {
            const item = response.presupuestos[index];
            const itemUpdate = {
              ...item,
              ...form,
              /*codigo: form.codigo,
              concepto:form.concepto,
              anioUnoPresupuesto:form.anioUnoPresupuesto,
              anioUnoEjecucion: form.anioUnoEjecucion,
              anioDosPresupuesto: form.anioDosPresupuesto,
              anioTresPresupuesto: form.anioTresPresupuesto,
              anioCuatroPresupuesto: form.anioCuatroPresupuesto,
              anioCincoPresupuesto: form.anioCincoPresupuesto,
              anioSeisPresupuesto: form.anioSeisPresupuesto,
              esOtroconcepto:form.esOtroconcepto*/
            };
            listItems = [...response.presupuestos.slice(0, index), itemUpdate, ...response.presupuestos.slice(index + 1)];
          }
          const request = {
            ...response,
            datosProceso:{
              "nombre":"presupuestos",
              "idElemento": idElemento
            },  
            presupuestos: listItems
          };
          return request;
        }),
        concatMap(request => this.presupuestoService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.crudSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      ); 
  };
  getprefijo = (tipoCBC:any)=>{
    let prefijo;
    switch (tipoCBC) {
      case "10":
        prefijo = "I.";
        break;
      case "20":
        prefijo = "II.";
        break;    
      case "30":
        prefijo = "III.";
          break;
      case "40":
        prefijo = "IV.";
        break;
      case "51":
        prefijo = "V.1.";
        break;    
      case "52":
        prefijo = "V.2.";
          break;
      case "60":
        prefijo = "VI.";
        break;
      default:
        break;
    }
    return prefijo;
  }
  asynSave = (form: IEntidadPresupuesto,requestValues:EntidadRequestValues): Observable<any> => {
    //debugger;
    this.crudBegin();
    var idElemento = uuid.v4();
    return this.presupuestoService.getFormatoDetalleByVersion(requestValues.idVersion,requestValues.idSedeFilial)
      .pipe(
        map(response => {
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "PRESUPUESTOCBCSEDEFILIAL"+this.getprefijo(requestValues.tipoCBCEnum),
              "prefijo": this.getprefijo(requestValues.tipoCBCEnum),
              "idVersion": requestValues.idVersion,
              "idSedeFilial": requestValues.idSedeFilial,
              "idLocal": requestValues.idLocal
            },
            datosProceso:{
              "nombre":"PRESUPUESTOS",
              "idElemento": idElemento
            },
            presupuestos: [{
              ...form,
              idLocal:requestValues.idLocal,
              tipoCBCEnum:requestValues.tipoCBCEnum,
              /*codigo: form.codigo,
              concepto:form.concepto,
              anioUnoPresupuesto:form.anioUnoPresupuesto,
              anioUnoEjecucion: form.anioUnoEjecucion,
              anioDosPresupuesto: form.anioDosPresupuesto,
              anioTresPresupuesto: form.anioTresPresupuesto,
              anioCuatroPresupuesto: form.anioCuatroPresupuesto,
              anioCincoPresupuesto: form.anioCincoPresupuesto,
              anioSeisPresupuesto: form.anioSeisPresupuesto,*/
              esOtroconcepto:true,
              id: idElemento,
              esRegistro:true,
              "usuarioCreacion": form["usuarioCreacion"],                    
              "fechaCreacion": form["fechaCreacion"],  
              "tipoOperacion": form["tipoOperacion"], 
              "token": form["token"], 
            }, ...response.presupuestos]
          };
          return request;
        }),
        concatMap(request => this.presupuestoService.setGenerateFormatoDetalle(request)),
        tap(response => {
          this.crudSucces();
          return response;
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
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
  private fetchBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchSucces = (data: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  };

  loadDataPresupuesto = (data: any) => {
    this.fetchSucces(data);
  }

  private crudBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private crudSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
}
