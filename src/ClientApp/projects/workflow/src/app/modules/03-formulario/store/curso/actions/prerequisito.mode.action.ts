import { forEach } from '@angular/router/src/utils/collection';
import { IFormPreRequisitoCurso } from './../curso.store.interface';
import { AppCurrentFlowStore } from './../../../../../../../../../src/app/core/store/app.currentFlow.store';
import { ComboList, FormType, IDataGridPageRequest } from '@sunedu/shared';
import update from 'immutability-helper';
import { of, Observable, throwError, iif } from 'rxjs';
import { tap, catchError, map, concatMap } from 'rxjs/operators';
import { ModalCurso, ModalHorarioLectivoCurso } from '../curso.store.model';
import uuid from 'uuid';
import { IDataGridEvent, IDataGridButtonEvent, DialogService, AlertService } from '@sunedu/shared';
import { CursoService } from '../../../service/curso.service';
import { IModalHoraLectivaCurso, IFormCurso, IFormHoraLectivaCurso, IModalPreRequisitoCurso } from '../curso.store.interface';
import { AppAudit } from '@lic/core';
//import { AppCurrentFlowStore, AppAudit } from '@lic/core';

export class PreRequisitoModalActions {
  constructor(
    private getState: () => IModalPreRequisitoCurso,
    private setState: (newState: IModalPreRequisitoCurso) => void,
    private maestroCursoService: CursoService,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  setInit = (id: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      idVersion: id
    });
  }
  setReadOnly=(readOnly:boolean)=>{
    const state = this.getState();
    this.setState({
      ...state,
      readOnly:readOnly
    });
  }

  setModalEdit = (id: string, codigoMallaCurricular: string) => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      idCurso: id,
      idMallaCurricular: codigoMallaCurricular,
      type: FormType.EDITAR,
      title: 'Agregar Cursos Pre-Requisitos'
    });
  }

  getCursos = ()=>{
    return new Promise(
        (resolve)=>{ 
            this.crudBegin();
            const state = this.getState();
            this.maestroCursoService.getFormatoByVersion(state.idVersion)
            .subscribe(
                response=>{
                  console.log(response);
                    const index = response.mallaCurriculares.findIndex(item => item.id == state.idMallaCurricular && !item.esEliminado);
                    const mallaCurricular = response.mallaCurriculares[index];
        
                    const cursos = mallaCurricular.cursos;

                    const requisitos = mallaCurricular.cursosRequisitos || [];

                    // limpiar del combo los cursos ya resitrados como prerequisitos
                    let listado = [];
                    cursos.forEach(curso=>{
                      const existe = requisitos.find(x=>x.idCursoRequisito==curso.id && x.idCurso==state.idCurso);
                      if(!existe){
                        listado.push(curso);
                      }
                    });

                    // limpiar por referencia circular
                    let listado2 = [];
                    listado.forEach(item => {
                      const encontrado = requisitos.find(x=>x.idCursoRequisito==state.idCurso && x.idCurso==item.id);
                      if(!encontrado){
                        listado2.push(item);
                      }
                    });
                    
                    //  eliminar del combo el curso activo
                    let depurados = listado2.filter(x=>x.id!=state.idCurso);
                    
                    this.setState({
                        ...this.getState(),
                        isLoading:false,
                        cursos: depurados
                    })
                    resolve();
                }
            );
      });
  }

  asyncFetchCombos = () => {
    return new Promise(
        (resolve)=>{ 
            const state = this.getState();
            const cursos = state.cursos;
            if(cursos.length){
                let list=[];
                cursos.map(item=>{
                  if(!item.esEliminado){
                    list.push({
                      text:`${item.codigo.toUpperCase()} - ${item.nombre.toUpperCase()}`,
                      value:item.id
                    });
                  }
                });
              this.setState({
                ...this.getState(),
                comboLists:{
                    cursos: new ComboList(list)
                } 
              })
             resolve();
            };
        })
  }

  resetModalPreRequisito = () => {
    const state = this.getState();
    this.setState({
      ...state,
      form: {
        ...state.form,
        codigo: '',
        nombre: '',
        totalSemanas:null
      },
      comboLists:{
        cursos: new ComboList([])
      }
    });
  };

  private fetchCursoBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  };


  asynUpdatePreRequisito = (form: IFormPreRequisitoCurso): Observable<any> => {
    this.crudBegin();
    const state = this.getState();
    return this.maestroCursoService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {

          const index = response.mallaCurriculares.findIndex(item => item.id == state.idMallaCurricular && !item.esEliminado);
          const mallaCurricular = response.mallaCurriculares[index];

          const requisito = {
            idCurso:state.idCurso,
            idCursoRequisito:form.codigo,
            "usuarioCreacion": form["usuarioCreacion"],
            "fechaCreacion": form["fechaCreacion"],
            "tipoOperacion": form["tipoOperacion"],
            "token": form["token"],
          }

          const requisitosUpdate = mallaCurricular.cursosRequisitos || [];
          requisitosUpdate.push(requisito);

          const mallaCurricularUpdate = {
            ...mallaCurricular,
            tipoOperacion:"M",
            cursosRequisitos: requisitosUpdate
          };
          
          const mallaCurricularesUpdate = [...response.mallaCurriculares.slice(0, index),
            mallaCurricularUpdate,
          ...response.mallaCurriculares.slice(index + 1)];

          const request = {
            ...response,
            datosProceso:{
              "nombre":"MALLACURRICULARES",
              "idElemento": mallaCurricular.id
            },
            tipoOperacion:"M",
            mallaCurriculares: mallaCurricularesUpdate,
            actualiza: true
          };
          return request;
        }),
        concatMap(request =>
          iif(
            () => request.actualiza,
            this.maestroCursoService.setUpdateFormato(request),
            new Observable<any>(subscriber => {
              subscriber.next({ success: request.value.actualiza });
              subscriber.complete();
            })
          )
        ),
        tap(response => {
          this.crudSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  asyncDeletePreRequisito = (codigo:string): Observable<IFormPreRequisitoCurso>=>{
    this.crudBegin();
    const state = this.getState();
    return this.maestroCursoService.getFormatoByVersion(state.idVersion)
      .pipe(
        map(response => {

          const index = response.mallaCurriculares.findIndex(item => item.id == state.idMallaCurricular && !item.esEliminado);
          const mallaCurricular = response.mallaCurriculares[index];

          const cursos = mallaCurricular.cursos;
          const curso = cursos.find(x=>x.codigo==codigo);
          const id = curso.id;          
          
          let requisitosUpdate = mallaCurricular.cursosRequisitos || [];
          
          if(requisitosUpdate.length)
          {
            requisitosUpdate = requisitosUpdate.filter(x=>x.idCursoRequisito!=id);
          }
          const mallaCurricularUpdate = {
            ...mallaCurricular,
            tipoOperacion:"M",
            cursosRequisitos: requisitosUpdate
          };
          
          const audit = new AppAudit(this.storeCurrent);
          requisitosUpdate = audit.setDelete(requisitosUpdate);

          const mallaCurricularesUpdate = [...response.mallaCurriculares.slice(0, index),
            mallaCurricularUpdate,
          ...response.mallaCurriculares.slice(index + 1)];

          const request = {
            ...response,
            datosProceso:{
              "nombre":"MALLACURRICULARES",
              "idElemento": mallaCurricular.id
            },
            tipoOperacion:"M",
            mallaCurriculares: mallaCurricularesUpdate,
            actualiza: true
          };
          return request;
        }),
        concatMap(request =>
          iif(
            () => request.actualiza,
            this.maestroCursoService.setUpdateFormato(request),
            new Observable<any>(subscriber => {
              subscriber.next({ success: request.value.actualiza });
              subscriber.complete();
            })
          )
        ),
        tap(response => {
          this.crudSucces();
        }),
        catchError(error => {
          this.crudError(error);
          return throwError(error);
        })
      );
  }

  asyncFetchPage = (
    pageRequest: IDataGridPageRequest = {
      page: this.getState().source.page,
      pageSize: this.getState().source.pageSize,
      orderBy: this.getState().source.orderBy,
      orderDir: this.getState().source.orderDir,
    },
    filters = this.getState().form): Observable<any> => {
    this.crudBegin();
    const state = this.getState();
    return this.maestroCursoService.getFormatoByVersion(state.idVersion).pipe(
      tap(response => {
        const state = this.getState();
        const mallaCurricular = response.mallaCurriculares.find(item => item.id == state.idMallaCurricular);
        const cursos = mallaCurricular.cursos || [];
        const requisitos = mallaCurricular.cursosRequisitos || [];
        const requisitosCurso = requisitos.filter(x=>x.idCurso==state.idCurso);
        
        let items=[];
        requisitosCurso.forEach(req => {
          const cr = cursos.find(x=>x.id==req.idCursoRequisito);
          let item = {
            codigo: cr.codigo,
            nombre: cr.nombre,
            totalSemanas: cr.totalSemanas
          }
          items.push(item);
        });
        this.fetchPageSucces(items || [], items?items.length:0, pageRequest);
      }),
      catchError(error => {
        this.crudError(error);
        return throwError(error);
      })
    );
  }
  
  private fetchPageSucces = (items: any, total: number, pageRequest: IDataGridPageRequest) => {
    let elementos = (items || []).filter(item => !item.esEliminado);
    elementos = items.slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);
    const state = this.getState();
    
    const totalItems =(items || []).filter(item => !item.esEliminado).length; 
      const elementosPag = (items || []).filter(item => !item.esEliminado)
        .slice((pageRequest.page - 1) * pageRequest.pageSize, pageRequest.page * pageRequest.pageSize);

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
