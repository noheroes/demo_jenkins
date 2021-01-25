import { MediosVerificacionService } from './../../../service/mediosverificacion.service';
import { IMediosVerificacionComentarios } from './../mediosverificacion-comentarios.store.interface';
import update from 'immutability-helper';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { IComentario } from '../mediosverificacion.store.interface';

export class MediosVerificacionComentariosActions {
  constructor(
    private getState: () => IMediosVerificacionComentarios,
    private setState: (newState: IMediosVerificacionComentarios) => void,
    private mediosVerificacionService: MediosVerificacionService
  ) { }

  setInit = () => {
    const state = this.getState();
    this.setState({
      ...state,
      isLoading: true,
      comentarios:[]
    });
  }

  setComentarios= (comentarios:IComentario[]) => {
    const state = this.getState();
    if(comentarios.length){
      comentarios.forEach(element => {
        element.derecha=false;
      });
    }
    this.setState({
      ...state,
      isLoading: true,
      comentarios:comentarios
    });
  }

  getComentarios=()=>{
    const state = this.getState();
    return state.comentarios;
  }

  //====================================================
  // ACCIONES ASINCRONAS
  //====================================================

  private fetchBegin = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: true }
      })
    );
  }

  private fetchSucces = () => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false }
      })
    );
  }

  private fetchError = (error: any) => {
    this.setState(
      update(this.getState(), {
        isLoading: { $set: false },
        error: { $set: error }
      })
    );
  }


  asyncFetchGetByContenidoId=(idContenido:string)=>{
    this.fetchBegin();
    return this.mediosVerificacionService.getByContenidoId(idContenido).pipe(
      tap(response => {
        // console.log(idContenido);
         //console.log(response);
        // console.log(response.comentarios);
        this.setComentarios(response.comentarios);
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }

  asyncSetComentarioAdd=(comment:any)=>{
    this.fetchBegin();
    return this.mediosVerificacionService.setCommentAdd(comment).pipe(
      tap(response => {
        // console.log(comment);
        // console.log(response);
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }

  asyncSetComentarioDelete=(comment:any)=>{
    this.fetchBegin();
    return this.mediosVerificacionService.setCommentDelete(comment).pipe(
      tap(response => {
        // console.log(comment);
        // console.log(response);
        this.fetchSucces();
      }),
      catchError(error => {
        this.fetchError(error);
        return throwError(error);
      })
    );
  }



}
