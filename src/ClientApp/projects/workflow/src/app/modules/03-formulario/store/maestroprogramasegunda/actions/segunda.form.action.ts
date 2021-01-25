import { FormType, ComboList } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IFormMaestroProgramaSegunda, IEntidadMaestroProgramaSegunda } from '../maestroprogramasegunda.store.interface';
import { FormMaestroProgramaSegunda } from '../maestroprogramasegunda.store.model';
import { MaestroProgramaSegundaService } from '../../../service/maestroprogramasegunda.service';
import * as uuid from 'uuid';
export class SegundaFormActions {
  
  
  constructor(
    private getState: () => IFormMaestroProgramaSegunda,
    private setState: (newState: IFormMaestroProgramaSegunda) => void,
    private maestroProgramaSegundaService: MaestroProgramaSegundaService
  ) {

  }
  setStateIsLoading = (isLoading: boolean) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: isLoading }
      })
    );
  };
  asyncFetchCombos = (enums,listCINE) => {
    this.crudMaestroProgramaSegundaBegin();
    const state = this.getState();
    let listaFacultad = new ComboList([]);
    //console.log('CAYL state',state);
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
    let listaCINE  = new ComboList([]);
    if(listCINE.length!=0){
      let list=[];
      listCINE.map(element=>{
        list.push({
          text:element.denominacionCompleta.toUpperCase(),
          value:element.id
        });
      });
      /*list.push({
        text:"Otro",
        value:-1
      });*/
      listaCINE = new ComboList(list);
    }
    state.comboLists = {
      nombreFacultades: listaFacultad,
      regimenEstudios: enums[0],
      denominacionClasificadorCINEs: listaCINE,
    };
    this.setState(state);
    this.crudMaestroProgramaSegundaSucces();
  }
  get=()=>{
    return this.getState();
  }
  setModalEdit = (id: string,idVersion:string,facultades:any) => {
    const state = this.getState();
    this.setState({
      ...state,
      //isLoading: true,
      id: id,
      type: FormType.EDITAR,
      title: 'Modificar segunda especialidad',
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
      title: 'Consulta segunda especialidad',
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
    this.setState(new FormMaestroProgramaSegunda());
  };

  private fetchMaestroProgramaSegundaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchMaestroProgramaSegundaSucces = (data: any) => {
    data.codigoCINE=data.codigoCINE*1
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        form: { $set: data }
      })
    );
  };

  loadDataMaestroProgramaSegunda = (data: any) => {
    this.fetchMaestroProgramaSegundaSucces(data);
  }
  loadCodigoMaestroProgramaSegunda = (codigo: string) => {
    const entidadMaestroProgramaSe = this.getState().form;
    entidadMaestroProgramaSe.codigo = codigo;
    this.fetchMaestroProgramaSegundaSucces(entidadMaestroProgramaSe);
  }
  asynFetchMaestroProgramaSegunda = (id: string): Observable<IEntidadMaestroProgramaSegunda> => {
    const state = this.getState();
    return this.maestroProgramaSegundaService.getFormatoByVersion(state.idVersion).pipe(
      map(response => {
        if(response.segundaEspecialidades!=[])
          return response.segundaEspecialidades.find(item => item.id == id);
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

  asynSaveMaestroProgramaSegunda = (form: IEntidadMaestroProgramaSegunda): Observable<any> => {
    this.crudMaestroProgramaSegundaBegin();
    const state = this.getState();
    form.descripcionFacultad = state.comboLists.nombreFacultades.list.find(item=>item.value == form.idFacultad).text;
    if(form.codigoCINE =="-1")
      form.descripcionCINE =form.denominacionPrograma;
    else
      form.descripcionCINE = state.comboLists.denominacionClasificadorCINEs.list.find(item=>item.value == form.codigoCINE).text;
    var idElemento = uuid.v4();
    return this.maestroProgramaSegundaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "maestroProgramaSegundaEspecialidad",
              "prefijo": "SEG",
              "idVersion": state.idVersion,
              "idSedeFilial": "",
              "idLocal": ""
            },
            datosProceso:{
              "nombre":"SEGUNDAESPECIALIDADES",
              "idElemento": idElemento
            },
            segundaEspecialidades: [{
              ...form,
              id: idElemento,
              esRegistro:true,
              cantidadProgramaVinculado: 0
            }, ...response.segundaEspecialidades]
          };
          return request;
        }),
        concatMap(request => this.maestroProgramaSegundaService.setGenerateFormato(request)),
        tap(response => {
          this.crudMaestroProgramaSegundaSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }
  asynUpdateMaestroProgramaSegunda = (form: IEntidadMaestroProgramaSegunda): Observable<IEntidadMaestroProgramaSegunda> => {
    this.crudMaestroProgramaSegundaBegin();
    const state = this.getState();
    form.descripcionFacultad = state.comboLists.nombreFacultades.list.find(item=>item.value == form.idFacultad).text;
    if(form.codigoCINE =="-1")
      form.descripcionCINE =form.denominacionPrograma;
    else
      form.descripcionCINE = state.comboLists.denominacionClasificadorCINEs.list.find(item=>item.value == form.codigoCINE).text;
    return this.maestroProgramaSegundaService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {
          const index = response.segundaEspecialidades.findIndex(item => item.id == form.id);
          let programasUpdate = null;
          if (-1 === index) {
            programasUpdate = [...response.segundaEspecialidades, form];
          } else {
            const programa = response.segundaEspecialidades[index];
            const programaUpdate = {
              ...programa,
              ...form
              /*codigo: form.codigo,
              resolucionCreacionModalidad: form.resolucionCreacionModalidad,
              fechaCreacionModalidad: form.fechaCreacionModalidad,
              idFacultad: form.idFacultad,
              regimenEstudioEnum:form.regimenEstudioEnum,
              denominacionTituloOtorgado:form.denominacionTituloOtorgado,
              codigoCINE:form.codigoCINE,
              denominacionPrograma:form.denominacionPrograma,
              descripcionCINE:form.descripcionCINE,
              descripcionFacultad:form.descripcionFacultad*/
            };
            programasUpdate = [...response.segundaEspecialidades.slice(0, index), programaUpdate, ...response.segundaEspecialidades.slice(index + 1)];
          }
          const request = {
            ...response,
            datosProceso:{
              "nombre":"SEGUNDAESPECIALIDADES",
              "idElemento": form.id
            },
            segundaEspecialidades: programasUpdate
          };
          return request;
        }),
        concatMap(request => this.maestroProgramaSegundaService.setUpdateFormato(request)),
        tap(response => {
          this.crudMaestroProgramaSegundaSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  private crudMaestroProgramaSegundaBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private crudMaestroProgramaSegundaSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
  //:Observable<any>
  getExternalCINE=()=>{
    this.fetchMaestroProgramaSegundaBegin();
    return new Promise(
      (resolve)=>{
        this.maestroProgramaSegundaService.getCINE('2','2')
        .subscribe(info=>{
          this.fetchMaestroProgramaSegundaCINESucces(info);
          resolve(info);
        })
      });
    /*this.MaestroProgramaSeService.getCINE('1','1').toPromise()
    .then(response => {
      // console.log('cine 3');
      // console.log(response);
      this.setCINE(response);
      return response;
    })
    .catch(console.log);
    *//*.pipe(
      tap(response=>{
        // console.log('pipe tab response CINE');
        // console.log(response);
      }),
      catchError(error => {
        // console.log('pipe tab error response CINE');
        // console.log(error);
        return throwError(error);
      })
    );*/
  }
  getCINE =() => {
    const state = this.getState();
    return state.codigoGenerado;
  }
  private fetchMaestroProgramaSegundaCINEBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };

  private fetchMaestroProgramaSegundaCINESucces = (cine: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        cine: { $set: cine }
      })
    );
  };
}
