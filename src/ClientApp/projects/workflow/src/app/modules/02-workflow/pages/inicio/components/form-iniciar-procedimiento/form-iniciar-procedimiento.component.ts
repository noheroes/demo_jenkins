import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ɵConsole, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { FormType, ToastService, AlertService, DialogService, IMsgValidations, ValidateFormFields, FormModel, Validators } from '@sunedu/shared';
import { AppCurrentFlowStore, APP_CLOSE_MODAL } from '@lic/core';

import { InicioStore } from '../../store/inicio.store';
import { IModalIniciarProcedimiento } from '../../store/inicio.store.interface';
import { IInicioProcedimiento } from '../../../../interfaces/inicio.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-iniciar-procedimiento',
  templateUrl: './form-iniciar-procedimiento.component.html',
  styleUrls: ['./form-iniciar-procedimiento.component.scss']
})
export class FormIniciarProcedimientoComponent implements OnInit, OnDestroy {

  formType = FormType;
  //form: FormGroup;
  form:FormModel<any>

  inicioStore: InicioStore;
  state$: Observable<IModalIniciarProcedimiento>;

  subscriptions: Subscription[] = [];
  msgValidations: IMsgValidations;
  storeCurrent: AppCurrentFlowStore;
  //tieneSubFlujo:boolean;

  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<FormIniciarProcedimientoComponent>,
    //private formBuilder: FormBuilder,
    private toast: ToastService,
    public dialog: DialogService,
    private alert: AlertService,
    private router: Router,
    
  ) { 
    //this.tieneSubFlujo=false;
  }

  ngOnInit() {
    this.state$ = this.inicioStore.state$.pipe(map(x => x.modalIniciarProcedimiento), distinctUntilChanged());
    this.buildForm();
    this.loadCombos();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  private loadCombos() {
    const current = this.storeCurrent.currentFlowAction.get();
    const parametros = {  
      codApp: current.idAplicacion,
      codArea: current.idEntidad,
      userName: current.idUsuario,
      idTipoUsuario:current.idTipoUsuario,
      codRol: current.idRol,
      dsRol: current.rolDescripcion
    }
    this.inicioStore.actionModalInicioProcedimiento.asyncFetchListarEntidadInicio(parametros);
    //this.inicioStore.actionModalInicioProcedimiento.asyncFetchListarProcedimientos();
  }
  buildForm = () => {
    const defaultModel = {
      idEntidad: null,
      idSolicitud: null,
      idProcedimiento: null,
      idSubFlujo:null
    };

    const validators = {
      idEntidad: [
        Validators.required
      ],
      idSolicitud: [
        Validators.required
      ],
      idProcedimiento: [Validators.required]
    };

    this.form = new FormModel<any>(
      FormType.REGISTRAR,
      defaultModel,
      validators,
      {
       
      }
	/*  //otras propiedades 
	{
            beforeSubmit: this.beforeSubmit,
            onSave: this.handleSave,
            onUpdate: this.handleUpdate,
            validateOnSave: this.handleValidateOnSave,
            confirmOnSave: this.handleConfirmOnSave,
          }
*/
    );
    console.log(this.form);
 
  }




  private validarReglas(inicioProcedimiento: IInicioProcedimiento): any[] {
    let errorsModal = [];
    let validarfechas = true;
    return errorsModal;
  }

  private cleanErrors() {
    this.inicioStore.actionModalInicioProcedimiento.setModalErrors(null);
  }

  handleSubmit = () => {
    // this.cleanErrors();
    //ValidateFormFields(this.form);
    if (!this.form.valid) {
      return false;
    }
    /*
    this.inicioStore.actionModalInicioProcedimiento.asyncIniciarProcedimiento(this.form.value).then((response: any) => {
      // this.inicioStore.actionBuscadorPersonas.asyncFetchPersons();
      this.toast.success('Se inicio el procedimiento!');
      this.dialogRef.close();
      // console.log(response);
      this.router.navigate([response.data.actividad.formulario], {
        queryParams: {'idProceso': response.data.proceso.idProceso, 'idProcesoBandeja': response.data.idProcesoBandeja}
      });
    });
    */

   const current = this.storeCurrent.currentFlowAction.get();
   const parametros = {
     codArea: this.form.get('idEntidad').value,
     idSolicitud: this.form.get('idSolicitud').value,
     idFlujo:this.form.get('idProcedimiento').value,
     idSubFlujo:this.form.get('idSubFlujo').value, 
     codApp: current.idAplicacion,
     userName: current.idUsuario,
     idTipoUsuario:current.idTipoUsuario,
     codRol: current.idRol,
     dsRol: current.rolDescripcion,
     esResponsable : current.esResponsable
   }
   
   this.inicioStore.actionModalInicioProcedimiento.asyncFetchInicioFlujoSeleccionado(parametros).then(
     resp=> {
       //console.log(resp);
       if(resp){
         if(resp['success']){
          this.toast.success(resp['message']);
           this.dialogRef.close();
          this.router.navigate(['/workflow/bandeja']);
         }
         else{
          this.toast.warning(resp['message']);
         }
       }
     }
   )
 


  }
  handleClose = () => {
    if (this.inicioStore.state.modalIniciarProcedimiento.type !== FormType.CONSULTAR) {
      this.alert.open('¿Está seguro que deseas cerrar del formulario? \n Se perderán los datos si continua.', null, { confirm: true }).then(confirm => {
        if (confirm) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  handleChangeInput=(e:any)=>{
    console.log(e);
    this.inicioStore.actionModalInicioProcedimiento.asyncFetchCleanListar(e.name);
    switch (e.name) {
      case "idEntidad":{
        this.form.get('idSolicitud').setValue(null);
        this.form.get('idProcedimiento').setValue(null);
        this.form.get('idSubFlujo').setValue(null);
        const current = this.storeCurrent.currentFlowAction.get();
        const parametros = {  
          codArea: this.form.get('idEntidad').value,
          codApp: current.idAplicacion,
          userName: current.idUsuario,
          idTipoUsuario:current.idTipoUsuario,
          codRol: current.idRol,
          dsRol: current.rolDescripcion
        }
        this.inicioStore.actionModalInicioProcedimiento.asyncFetchListarSolicitudInicio(parametros);
        break;
      }
        
      case "idSolicitud":{
        this.form.get('idProcedimiento').setValue(null);
        this.form.get('idSubFlujo').setValue(null);
        const current = this.storeCurrent.currentFlowAction.get();
        const parametros = {  
          codArea: this.form.get('idEntidad').value,
          idSolicitud: this.form.get('idSolicitud').value,
          codApp: current.idAplicacion,
          userName: current.idUsuario,
          idTipoUsuario:current.idTipoUsuario,
          codRol: current.idRol,
          dsRol: current.rolDescripcion
        }
        this.inicioStore.actionModalInicioProcedimiento.asyncFetchListarProcedimientoInicio(parametros);
        break;
      }

      case "idProcedimiento":{
        this.form.get('idSubFlujo').setValue(null);
        const current = this.storeCurrent.currentFlowAction.get();
        const parametros = {  
          codArea: this.form.get('idEntidad').value,
          idSolicitud: this.form.get('idSolicitud').value,
          idFlujo:this.form.get('idProcedimiento').value, 
          codApp: current.idAplicacion,
          userName: current.idUsuario,
          idTipoUsuario:current.idTipoUsuario,
          codRol: current.idRol,
          dsRol: current.rolDescripcion
        }
        this.inicioStore.actionModalInicioProcedimiento.asyncFetchListarSubFlujoInicio(parametros);
        break;
      }
        
      default:
        break;
    }
  }
}
