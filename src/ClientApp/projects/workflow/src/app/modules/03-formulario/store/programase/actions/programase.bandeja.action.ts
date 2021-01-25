import update from 'immutability-helper'; 
import { Observable, throwError, from, of } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { IDataGridPageRequest, ComboList } from '@sunedu/shared';
import { IBandejaProgramaSe,IEntidadProgramaSe, IEntidadSegundaEspecialidadSedeFilial, IRequestSolicitudVersion } from '../programase.store.interface';
import { ProgramaSeService } from '../../../service/programase.service';
import * as uuid from 'uuid';
import { AppAudit, AppCurrentFlowStore } from '@lic/core';

export class ProgramaSeBandejaActions {
  constructor(
    private getState: () => IBandejaProgramaSe,
    private setState: (newState: IBandejaProgramaSe) => void,
    private programaSeService: ProgramaSeService,
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
  setProgramaSeId = (id:string) =>{
    const state = this.getState();
    this.setState({
      ...state,
      idProgramaSe: id
    });
  }
  getProgramaSeId = () =>{
    return this.getState().idProgramaSe;
  }
  getProgramaSes = () =>{
    return this.getState().ProgramaSes;
  }
  private setProgramaSes = (ProgramaSes:any) => {
    const state = this.getState();   
    let lista = new ComboList([]);
    if(ProgramaSes.filter(item => !item.esEliminado).length!=0){
      let list=[];
      ProgramaSes.filter(item => !item.esEliminado).map(element=>{
        if(state.allItems.findIndex(s=>s.idPrograma==element.id)==-1)
        list.push({
          text:element.codigo+" - "+element.denominacionPrograma,
          value:element.id
        });
      });
      lista = new ComboList(list); 
    };
    state.ProgramaSes = ProgramaSes; 
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
    return this.programaSeService.getFormatoByVersion(state.formRequest.idVersion)
    .pipe(
      map(reponse => {
        const state = this.getState();
        this.setState({
          ...state,
          ProgramaSes: reponse.segundaEspecialidades
        });          
      }),
    concatMap(request => this.programaSeService.getFormatoDetalleByVersion(this.getState().formRequest.idVersion,idSede)),
      tap(response =>{
        if(response.segundaEspecialidadSedeFiliales!=null){
          this.fetchPageSucces(this.getState().ProgramaSes,response.segundaEspecialidadSedeFiliales,idLocal, pageRequest);
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
   
    return this.programaSeService.getFormatoByVersion(idVersion).pipe(
      tap(response => {
        let elementos = (response.segundaEspecialidades || []).filter(item => !item.esEliminado)
        
        this.setProgramaSes(elementos);
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
    let elementos = (items || []).filter(item => !item.esEliminado && item.idLocal==idLocal);
    const totalelementos = elementos.length;
    const elementosFinal = elementos.slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
    let numeracion = 0;
    elementosFinal.forEach( element => {
      element.numero = numeracion+1;
      const itemPrograma = programas.filter(item => item.id==element.idPrograma);
      element.denominacionPrograma = itemPrograma[0].denominacionPrograma;
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
          total: { $set: totalelementos },
          page: { $set: pageRequest.page },
          pageSize: { $set: pageRequest.pageSize },
          orderBy: { $set: pageRequest.orderBy },
          orderDir: { $set: pageRequest.orderDir },
          skip: { $set: pageRequest.skip }
        }
      })
    );
    
  }

  asyncFetchPageProgramaSeSucces = (
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
  
  asynDeleteMaestroProgramaSe = (id: string): Observable<IEntidadProgramaSe> => {
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
  asynSaveProgramaSe = (element:any,idSede:string,idLocal:string): Observable<any> => {
    this.crudBegin();
    var idElemento = uuid.v4();
    return this.programaSeService.getFormatoDetalleByVersion(this.getState().formRequest.idVersion,idSede)
      .pipe(
        map(response => {
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "segundaEspecialidadSedeFilial",
              "prefijo": "SEESSEFI",
              "idVersion": this.getState().formRequest.idVersion,
              "idSedeFilial": "",
              "idLocal": ""
            },
            datosProceso:{
              "nombre":"SEGUNDAESPECIALIDADSEDEFILIALES",
              "idElemento": idElemento
            },
            segundaEspecialidadSedeFiliales: [{
              ...element,
              idLocal:idLocal,
              idPrograma:element.id,
              denominacionPrograma:element.denominacionPrograma,
              facultad:element.idFacultad,
              gradoAcademico:'gradoAcademico',
              titulo:element.denominacionTituloOtorgado,
              id: idElemento,
              "usuarioCreacion": element["usuarioCreacion"],                    
              "fechaCreacion": element["fechaCreacion"],  
              "tipoOperacion": element["tipoOperacion"], 
              "token": element["token"],
            }, ...response.segundaEspecialidadSedeFiliales]
          };
          return request;
        }),
        concatMap(request => this.programaSeService.setUpdateFormatoDetalle(request)),
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
    return this.programaSeService.getFormatoDetalleByVersion(this.getState().formRequest.idVersion,idSede)
    .pipe(
        map(response => {
          const index = response.segundaEspecialidadSedeFiliales.findIndex(item => item.id == id);
          let form = response.segundaEspecialidadSedeFiliales[index];

          const audit = new AppAudit(this.storeCurrent);
          form = audit.setDelete(form);
          form.esEliminado = true;

          const ProgramaSesUpdate = [...response.segundaEspecialidadSedeFiliales.slice(0, index), form, ...response.segundaEspecialidadSedeFiliales.slice(index + 1)];
          const request = {
            ...response,
            datosNumeracion: {
              "nombre": "segundaEspecialidadSedeFilial",
              "prefijo": "PROSEFI",
              "idVersion": this.getState().formRequest.idVersion,
              "idSedeFilial": "",
              "idLocal": ""
            },
            datosProceso:{
              "nombre":"segundaEspecialidadSedeFiliales",
              "idElemento": form.id
            },
            segundaEspecialidadSedeFiliales: ProgramaSesUpdate
          };
          return request;
        }),
        concatMap(request => this.programaSeService.setUpdateFormatoDetalle(request)),
        tap(response => {
          this.fetchSucces();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

}
