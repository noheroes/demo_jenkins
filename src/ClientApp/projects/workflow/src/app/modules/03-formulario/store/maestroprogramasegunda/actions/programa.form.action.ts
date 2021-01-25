import { find } from 'lodash/find';
import { FormType, ComboList } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IFormMaestroPrograma, IEntidadMaestroPrograma } from '../maestroprogramasegunda.store.interface';
import { FormMaestroPrograma } from '../maestroprogramasegunda.store.model';
import { MaestroProgramaSegundaService } from '../../../service/maestroprogramasegunda.service';
import * as uuid from 'uuid';

export class ProgramaFormActions {
  constructor(
    private getState: () => IFormMaestroPrograma,
    private setState: (newState: IFormMaestroPrograma) => void,
    private maestroProgramaService: MaestroProgramaSegundaService    
  ) {

  }
  
  asyncFetchCombos = (enums,listCINE) => {
    this.crudMaestroProgramaBegin();
    const state = this.getState(); 
    //console.log('CAYL enums',enums);
    //console.log('CAYL listCINE',listCINE);
    if(listCINE.list.length > 0){
      listCINE.list.forEach((element) => {
        element.text = element.text.toUpperCase();
      });
    }
    let listaFacultad = new ComboList([]);    
    if(state.facultades.length!=0){
      let list=[];
      let elementos = (state.facultades || []).filter(item => !item.esEliminado)
      elementos.map(element=>{
        list.push({
          text:element.nombre,
          value:element.id
        });
      });
      listaFacultad = new ComboList(list); 
    }
    // let listaCINE  = new ComboList([]);
    // if(listCINE.length!=0){
    //   let list=[];
    //   listCINE.map(element=>{
    //     list.push({
    //       text:element.denominacionCompleta,
    //       value:element.id
    //     });
    //   });
    //   /*list.push({
    //     text:"Otra denominación del programa",
    //     value:-1
    //   });*/
      
    //   listaCINE = new ComboList(list); 
    // }   
    state.comboLists = {
      modalidadEstudios: enums[0],
      nombreFacultades: listaFacultad,
      regimenEstudios: enums[1],
      gradoAcademicos: enums[2],
      denominacionClasificadorCINEs: listCINE,
    };
    this.setState(state);
    this.crudMaestroProgramaSucces();
  }
  setModalEdit = (id: string,idVersion:string,facultades:any) => {
    const state = this.getState();
    this.setState({
      ...state,
      //isLoading: true,
      id: id,
      type: FormType.EDITAR,
      title: 'Editar programas y mención',
      idVersion:idVersion,
      facultades:facultades
    });

  }
  setModalReadOnly = (id: string,idVersion:string,facultades:any) => {
    const state = this.getState();
    this.setState({
      ...state,
      //isLoading: true,
      id: id,
      type: FormType.CONSULTAR,
      title: 'Consultar programas y mención',
      idVersion:idVersion,
      facultades:facultades
    });
  }

  setModalNew = (codigoGenerado:string,facultad:any,idVersion:string) => {
    
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: false,
      codigoGenerado: codigoGenerado,
      facultades: facultad,
      idVersion:idVersion 
    });
  }
  resetModal = () => {
    this.setState(new FormMaestroPrograma());
  };

  private fetchMaestroProgramaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchMaestroProgramaSuccess = (data: any) => {
    data.codigoCINE=data.codigoCINE*1
    this.setState(
      update(this.getState(), {
        form: { $set: data }
      })
    );
  };

  loadDataMaestroPrograma = (data: any) => {
    this.fetchMaestroProgramaSuccess(data);
  }
  loadCodigoMaestroPrograma = (codigo: string) => {
    const entidadMaestroPrograma = this.getState().form;
    entidadMaestroPrograma.codigo = codigo;
    this.fetchMaestroProgramaSuccess(entidadMaestroPrograma);
  }
  asynFetchMaestroPrograma = (id: string): Observable<IEntidadMaestroPrograma> => {
    const state = this.getState();
    return this.maestroProgramaService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        if(response.programaMenciones!=[])
          return response.programaMenciones.find(item => item.id == id);
        else
          return null;
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
  
  asynSaveMaestroPrograma = (form: IEntidadMaestroPrograma): Observable<any> => {
    this.crudMaestroProgramaBegin();
    const state = this.getState();
    var idElemento = uuid.v4();
    form.descripcionFacultad = state.comboLists.nombreFacultades.list.find(item=>item.value == form.idFacultad).text;
    if(form.codigoCINE =="-1")
      form.descripcionCINE =form.denominacionPrograma;
    else
      form.descripcionCINE = state.comboLists.denominacionClasificadorCINEs.list.find(item=>item.value == form.codigoCINE).text;
    var idElemento = uuid.v4();
    return this.maestroProgramaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const request = { 
            ...response,
            datosNumeracion: {
              "nombre": "maestroPrograma",
              "prefijo": "P",
              "idVersion": state.idVersion,
              "idSedeFilial": "",
              "idLocal": ""
            }, 
            datosProceso:{
              "nombre":"PROGRAMAMENCIONES",
              "idElemento": idElemento
            },
            programaMenciones: [{
              ...form,
              id: idElemento,
              esRegistro: true,
              "usuarioCreacion": form["usuarioCreacion"],
              "fechaCreacion": form["fechaCreacion"],
              "tipoOperacion": form["tipoOperacion"], 
              "token": form["token"],
            }, ...response.programaMenciones]
          };
          return request;
        }),
        concatMap(request => this.maestroProgramaService.setGenerateFormato(request)),
        tap(response => {
          this.crudMaestroProgramaSucces();
        }),
        catchError(error => { 
          this.crudError(error);
          return throwError(error);
        })
      );
  }
  asynUpdateMaestroPrograma = (form: IEntidadMaestroPrograma): Observable<IEntidadMaestroPrograma> => {
    this.crudMaestroProgramaBegin();
    const state = this.getState();
    form.descripcionFacultad = state.comboLists.nombreFacultades.list.find(item=>item.value == form.idFacultad).text;
    form.descripcionCINE =form.denominacionPrograma;
    return this.maestroProgramaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const index = response.programaMenciones.findIndex(item => item.id == form.id);
          let programasUpdate = null;
          if (-1 === index){
            console.log('El programa no existe');
            //throw new exception('El programa no existe');
            //programasUpdate = [...response.programaMenciones, form];
          } else {
            const programa = response.programaMenciones[index];
            const programaUpdate = {
              ...programa,
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
            
            programasUpdate = [...response.programaMenciones.slice(0, index), programaUpdate, ...response.programaMenciones.slice(index + 1)];
          }
          const request = {
            ...response,
            datosProceso:{
              "nombre":"PROGRAMAMENCIONES",
              "idElemento": form.id
            },
            programaMenciones: programasUpdate
          };
          return request;
        }),
        concatMap(request => this.maestroProgramaService.setUpdateFormato(request)),
        tap(response => {
          this.crudMaestroProgramaSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  private crudMaestroProgramaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private crudMaestroProgramaSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  //:Observable<any>
  getExternalCINE=()=>{    
    this.fetchMaestroProgramaBegin();
    return new Promise(
      (resolve)=>{
        this.maestroProgramaService.getCINE('1','1') 
        .subscribe(info=>{
          this.fetchMaestroProgramaCINESucces(info);
          resolve(info);
        })
      });
  }
  getCINE =() => {
    const state = this.getState();
    return state.codigoGenerado;
  }
  private fetchMaestroProgramaCINESucces = (cine: any) => {
    this.setState(
      update(this.getState(), {
        //isLoading: { $set: false },
        cine: { $set: cine }
      })
    );
  };
  setStateIsLoading = (isLoading: boolean) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: isLoading }
      })
    );
  };
}
