import update from 'immutability-helper'; 
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest, ComboList } from '@sunedu/shared';
import { IBandejaPrograma,IEntidadPrograma, IEntidadProgramaMencionSedeFilial, IRequestSolicitudVersion } from '../programa.store.interface';
import { ProgramaService } from '../../../service/programa.service';
import * as uuid from 'uuid';
import { AppAudit, AppCurrentFlowStore } from '@lic/core';

export class ProgramaBandejaActions {
  constructor(
    private getState: () => IBandejaPrograma,
    private setState: (newState: IBandejaPrograma) => void,
    private programaService: ProgramaService,
    private storeCurrent: AppCurrentFlowStore
  ) { 

  }
  setInit = (formRequest: IRequestSolicitudVersion) => {
    const state = this.getState();
    this.setState({
      ...state,
      formRequest: formRequest
    });
  }
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }
  setProgramaId = (id:string) =>{
    const state = this.getState();
    this.setState({
      ...state,
      idPrograma: id
    });
  }
  getProgramaId = () =>{
    return this.getState().idPrograma;
  }
  getProgramas = () =>{
    return this.getState().programas;
  }
  private setProgramas = (programas:any) => {
    const state = this.getState();   
    let lista = new ComboList([]);
    if(programas.filter(item => !item.esEliminado).length!=0){
      let list=[];
      programas.filter(item => !item.esEliminado).map(element=>{
        if(state.allItems.findIndex(s=>s.idPrograma==element.id)==-1)
        list.push({
          text:element.codigo+" - "+element.denominacionPrograma,
          value:element.id
        });
      });
      lista = new ComboList(list); 
    };
    state.programas = programas; 
    state.comboLists = {
      listadoProgramas: lista,
    };
    
  }; 
  asyncFetchPage = (idSede:string,idLocal:string,pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    }): Observable<any> => {
    this.fetchBegin();
    const state = this.getState();
    return this.programaService.getFormatoByVersion(state.formRequest.idVersion)
    .pipe(
      map(reponse => {
        const state = this.getState();
        this.setState({
          ...state,
          programas: reponse.programaMenciones
        });          
      }),
    concatMap(request => this.programaService.getFormatoDetalleByVersion(this.getState().formRequest.idVersion,idSede)),
      tap(response =>{
        if(response.programaMencionSedeFiliales!=null){
          this.fetchPageSucces(this.getState().programas,response.programaMencionSedeFiliales,idLocal, pageRequest);
        };
        this.fetchSucces();
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  } 
  asyncFetchPageSearch = (idVersion:string): Observable<any> => {
    this.fetchBegin();
   
    return this.programaService.getFormatoByVersion(idVersion).pipe(
      tap(response => {
        //let elementos = (response.programaMenciones || []).filter(item => !item.esEliminado);
        //console.log(elementos);
        this.setProgramas(response.programaMenciones);
        this.fetchSucces();
        //this.fetchPageSucces(listResults, listResults.count, pageRequest);
        return;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  } 
  private fetchPageSucces = (programas:any,items: any,idLocal:string, pageRequest: IDataGridPageRequest) => {
    let elementos = (items || []).filter(item => !item.esEliminado&&item.idLocal == idLocal);
    const totalelementos=elementos.length ;
    const elementosFinal = elementos.slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
    let numeracion = 0;
    elementosFinal.forEach( element => {
      element.numero = numeracion+1;
      const itemPrograma = programas.filter(item => item.id==element.idPrograma);
      element.denominacionPrograma = itemPrograma[0].denominacionPrograma;
      element.gradoAcademico = itemPrograma[0].denominacionGradoAcademico;
      element.titulo = itemPrograma[0].denominacionTituloOtorgado;
      numeracion=numeracion+1;
    }); 
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
        allItems:{$set:elementos},
        source: {
          items: { $set: elementosFinal },
          total: { $set: totalelementos},
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
    
  }

  asyncFetchPageProgramaSucces = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().form): Observable<any> => {
 
    this.fetchBegin();
    this.fetchSucces();
    return of({
      data: [{
        id: '',
        numero: '',
        denominacion: '',
        facultad: '',
        gradoAcademico: '',
        titulo: '',
      }],
      count: 1
    });
  }
  private fetchBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  }; 
  
  asynDeleteMaestroPrograma = (id: string): Observable<IEntidadPrograma> => {
    this.fetchBegin();
    return of(null);
  }
  private fetchSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  };
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
  private crudError = ({ error }) => {
    const mensajes = Object.entries(error.errors).map(item => ({ msg: item[1] }));
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: mensajes }
      })
    );
  } 
  asynSavePrograma = (element:any,idSede:string,idLocal:string): Observable<any> => {
    this.crudBegin();
    var idElemento = uuid.v4();
    return this.programaService.getFormatoDetalleByVersion(this.getState().formRequest.idVersion,idSede)
      .pipe(
        map(response => {
          const request = { 
            ...response,
            datosNumeracion: {
              "nombre": "programaMencionSedeFilial",
              "prefijo": "PROSEFI",
              "idVersion": this.getState().formRequest.idVersion,
              "idSedeFilial": "",
              "idLocal": ""
            },
            datosProceso:{
              "nombre":"programaMencionSedeFiliales",
              "idElemento": idElemento
            },
            tipoOperacion:"M",
            programaMencionSedeFiliales: [{
              ...element,
              idLocal:idLocal,
              idPrograma:element.id,
              denominacionPrograma:element.denominacionPrograma,
              facultad:element.idFacultad,
              gradoAcademico:element.denominacionGradoAcademico,
              titulo:element.denominacionTituloOtorgado,
              id: idElemento,
              "usuarioCreacion": element["usuarioCreacion"],                    
              "fechaCreacion": element["fechaCreacion"],  
              "tipoOperacion": element["tipoOperacion"], 
              "token": element["token"],
            }, ...response.programaMencionSedeFiliales]
          };
          return request;
        }),
        concatMap(request => this.programaService.setUpdateFormatoDetalle(request)),
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
  asyncDelete = (id: string,idSede:string): Observable<any> => {
    this.fetchBegin();
    const state = this.getState();
    return this.programaService.getFormatoDetalleByVersion(this.getState().formRequest.idVersion,idSede)
    .pipe(
        map(response => {
          const index = response.programaMencionSedeFiliales.findIndex(item => item.id == id);
          let form = response.programaMencionSedeFiliales[index];
          
          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);
          form.esEliminado = true;
          //form.tipoOperacion = "3";

          const programasUpdate = [...response.programaMencionSedeFiliales.slice(0, index), form, ...response.programaMencionSedeFiliales.slice(index + 1)];
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "programaMencionSedeFilial",
              "prefijo": "PROSEFI",
              "idVersion": this.getState().formRequest.idVersion,
              "idSedeFilial": "",
              "idLocal": ""
            },
            datosProceso:{
              "nombre":"programaMencionSedeFiliales",
              "idElemento": form.id
            },
            tipoOperacion:"M",
            programaMencionSedeFiliales: programasUpdate
          };
          return request;
        }),
        concatMap(request => this.programaService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.fetchSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

}
