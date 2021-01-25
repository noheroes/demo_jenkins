import { isNullOrUndefined } from 'util';
import { ICurrentFlow } from './../../../../../../../../../src/app/core/store/app.state.interface';
import { ITreeNode, IContenido, IComentario } from './../../../store/mediosverificacion/mediosverificacion.store.interface';
import { MediosVerificacionComentariosStore } from './../../../store/mediosverificacion/mediosverificacion-comentarios.store';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService, AlertService, FormType } from '@sunedu/shared';
import { IMediosVerificacionComentarios } from '@lic/workflow/app/modules/03-formulario/store/mediosverificacion/mediosverificacion-comentarios.store.interface';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { APP_CLOSE_MODAL } from '@lic/core';

@Component({
  selector:'app-form-mediosverificacion-comentarios',
  templateUrl:'./app-form-mediosverificacion-comentarios.component.html',
  styleUrls:['./app-form-mediosverificacion-comentarios.component.css'],
  providers:[MediosVerificacionComentariosStore]
})

export class AppFormMediosVerificacionComentariosComponent implements OnInit{
  state$: Observable<IMediosVerificacionComentarios>;
  //subscriptions: Subscription[];

  node:ITreeNode;
  contenido:IContenido;

  comentarios:IComentario[]=[];
  currentUserProcedimiento:ICurrentFlow;
  message:string='';
  permitirComentario:boolean;

  readOnly:boolean;

  @Output() cantidadMensajesEvent = new EventEmitter<number>();

  form: FormGroup;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;
  
  constructor(
    public dialogRef: MatDialogRef<AppFormMediosVerificacionComentariosComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private store: MediosVerificacionComentariosStore,
    private formBuilder: FormBuilder,
    //public changeDetection: ChangeDetectorRef
  ) { }

  async ngOnInit() {

    


    this.state$ = this.store.state$.pipe(
      map((x) => x.mediosVerificacionComentarios),
      distinctUntilChanged()
    );

    this.store.state.mediosVerificacionComentarios.type=FormType.CONSULTAR;
    this.store.state.mediosVerificacionComentarios.isLoading = false;
    this.store.state.mediosVerificacionComentarios.error = null;

    this.form = this.formBuilder.group({
      message: [''],
    })
    // console.log(this.node);
    // console.log(this.contenido);

    await this.getComentarios();

    
    //console.log(this.readOnly);
  }

  handleClose(){
    this.alert.open('¿Está seguro que deseas cerrar del formulario? \n Se perderán los datos si continua.', null, { confirm: true })
      .then(confirm => {
        if (confirm) {
          this.setCantidadMensajes(this.comentarios);
          this.dialogRef.close();
        }
      });
  }

  getComentarios(){
    return new Promise<void>(
      (resolve)=>{
        this.store.mediosVerificacionComentariosActions.asyncFetchGetByContenidoId(this.contenido.id).subscribe(async()=>{
          this.permitirComentario=this.readOnly?false:true;
          this.comentarios = this.store.mediosVerificacionComentariosActions.getComentarios();
          // console.log(this.comentarios);
          await this.setStyleComentarios(this.comentarios);
          await this.setCantidadMensajes(this.comentarios);
          resolve();
        });
    });
  }

  setCantidadMensajes(comentarios:IComentario[]){
    return new Promise<void>(
      (resolve)=>{ 
        if(Array.isArray(comentarios)){
          //console.log(comentarios.length);
          this.cantidadMensajesEvent.emit(comentarios.length);
          resolve();
        }
    });
    
  }


  setStyleComentarios(comentarios:IComentario[]){
    return new Promise<void>(
      (resolve)=>{ 

        if(comentarios){
          if(comentarios.length>0){
            // console.log(this.currentUserProcedimiento);
            let cantidad = comentarios.length;
            for (let index = 0; index < comentarios.length; index++) {
              const comment = comentarios[index];
              if((this.currentUserProcedimiento.idUsuario.toLowerCase()==comment.idUsuarioAutor.toLowerCase()) && (this.currentUserProcedimiento.idProceso.toLowerCase()==comment.idProceso.toLowerCase())){
                comment.derecha=true;
                comment.clase="comentario_derecha";
                if(index+1==cantidad){
                  comment.allowDelete=this.readOnly?false:true;
                  this.permitirComentario=false;
                  resolve();
                }
              }else{
                comment.derecha=false;
                comment.clase="comentario_izquierda";
                resolve();
              }
            }
          }
        }
      
    });
  }

  setComentarioAdd(){
    if(!isNullOrUndefined(this.message)){
      if(this.message!=''){
        if(this.message.length<=100){
          let comment = {
            idContenido: this.contenido.id,
            idProceso: this.currentUserProcedimiento.idProceso,
            idUsuarioAutor: this.currentUserProcedimiento.idUsuario,
            idRolAutor: this.currentUserProcedimiento.idRol,
            usuarioAutorDescripcion:this.currentUserProcedimiento.usuarioFullName,
            rolAutorDescripcion:this.currentUserProcedimiento.rolDescripcion,
            esRolAdministrado:true, // OJO VER
            mensaje:this.message
          }
          this.setMessageTemp(comment);

          //console.log('CAYL message', comment);
          //this.comentarios.push(comment);

          this.store.mediosVerificacionComentariosActions.asyncSetComentarioAdd(comment)
          .subscribe(async (response)=>{
            if(response.success){
              //console.log('CAYL message', response);
              this.toast.success('Se grabó satisfactoriamente el mensaje');
              
              this.permitirComentario=false;
              await this.getComentarios();
            }
          })
        }
      }
    }
  }

  setMessageTemp(comment:any){
    this.comentarios.push(comment);
    this.permitirComentario=false;
    this.setStyleComentarios(this.comentarios);
  }

  setComentarioDelete(comentario:IComentario){
    this.alert.open('Está seguro de que desea eliminar el comentario ¿Continuar?', null, { confirm: true })
      .then(confirm => {
        if (confirm) {
          let comment={
            idComentario:comentario.idComentario,
            idProceso:comentario.idProceso,
            idContenido:this.contenido.id,
            idUsuario: comentario.idUsuarioAutor
          }
          // this.getComentarios();
          // this.message='';
          // this.esUltimoComentario=false;
          this.store.mediosVerificacionComentariosActions.asyncSetComentarioDelete(comment)
          .subscribe(response=>{
            if(response.success){
              this.toast.success('Se eliminó satisfactoriamente el mensaje');
              this.message='';
              this.permitirComentario=this.readOnly?false:true;
              this.getComentarios();
            }
          })
        }
      });
  }


}
