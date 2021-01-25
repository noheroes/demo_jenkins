import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppAudit, AppCurrentFlowStore, APP_FORM_VALIDATOR, APP_CLOSE_MODAL } from '@lic/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators } from '@sunedu/shared';
import { Subscription, Observable, from, forkJoin } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { MaestroProgramaSegundaStore } from '../../../store/maestroprogramasegunda/maestroprogramasegunda.store';
import { IEntidadMaestroPrograma, IFormMaestroPrograma } from '../../../store/maestroprogramasegunda/maestroprogramasegunda.store.interface';
//import { Validators } from '@angular/forms';
 
const MESSAGES = { 
    CONFIRM_SAVE: '¿Está seguro de GUARDAR el programa?',
    CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de programa?',
    CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
    CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
  };
   
@Component({
    selector: 'app-form-maestro-programa',
    templateUrl: './app-form-maestro-programa.component.html',
    styleUrls: ['./app-form-maestro-programa.component.scss']
})
export class AppFormMaestroProgramaComponent implements  OnInit, OnDestroy {
    formType = FormType;
    form: FormModel<IFormMaestroPrograma>;
    store: MaestroProgramaSegundaStore;
    state$: Observable<IFormMaestroPrograma>;
    subscriptions: Subscription[];
    validators: any;
    desabilitar:boolean; 
    codigoHidden:boolean;
    esDisabled:boolean;
    max_date:any;
    esGradoAcademicoBachiller: boolean = true;
    readonly CLOSE_MODAL = APP_CLOSE_MODAL;
    constructor(
      public dialogRef: MatDialogRef<AppFormMaestroProgramaComponent>,
      private toast: ToastService,
      private alert: AlertService,
      private storeEnumerado: EnumeradoGeneralStore,
      private storeCurrent: AppCurrentFlowStore,
    ) { }
  
    async ngOnInit() {
      this.max_date=new Date();
      this.buildValidations();
      this.buildForm();
      await this.loadConfiguracion();
      
      
    }
    private setInitilData = () => {
      return new Promise(
        (resolve)=>{
          this.desabilitar=true;
          this.state$ = this.store.state$.pipe(map(x => x.formMaestroPrograma), distinctUntilChanged());
        resolve();
        });
    }
    private async loadConfiguracion(){
      this.store.programaFormActions.setStateIsLoading(true);
      let promises: any[] = [];
      const action2 = await this.modoTypeoModal();
      promises.push(action2);
      const action0 = await this.setInitilData();
      promises.push(action0);
      // const action3 = await this.buildValidations();
      // promises.push(action3);
      // const action4 = await this.buildForm();
      // promises.push(action4);
      const action5 = await this.subscribeToState();
      promises.push(action5);
      const action6 = await this.loadCombos();
      promises.push(action6);

      await Promise.all(promises).then(() => { this.store.programaFormActions.setStateIsLoading(false); });
    }
    private loadCombos = () => {
      return new Promise(
        (resolve)=>{
          forkJoin( 
            this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDMODALIDADESTUDIO'),
            this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDREGIMENESTUDIO'),
            this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDGRADOACADEMICOPROGRAMA'),
          ).pipe(tap(enums => {
            enums.push();
            //console.log('CAYL maestroProgramaFormActions storeCurrent',this.storeCurrent.currentFlowAction.get());
            this.store.programaFormActions.asyncFetchCombos(enums,
              this.storeCurrent.currentFlowAction.get().programaOne
              );
          })).subscribe();
        resolve();
      });
    }
    ngOnDestroy(): void {
      this.subscriptions.forEach(x => {
        x.unsubscribe();
      });
    }
    subscribeToState = () => {
      return new Promise(
        (resolve)=>{
        const subs = this.store.state$.pipe(map(x => x.formMaestroPrograma.form), distinctUntilChanged())
          .subscribe(x => {
            this.form.patchValue(x);
          });
        this.subscriptions = [subs];
        resolve();
      });
    } 
    private buildForm = () => {
      return new Promise(
        (resolve)=>{
        const { form, type } = this.store.state.formMaestroPrograma;
        this.form = new FormModel<any>(
          type,
          form,
          this.validators,
          { 
            beforeSubmit: this.beforeSubmit,
            onSave: this.handleSave,
            onUpdate: this.handleUpdate,
            validateOnSave: this.handleValidateOnSave,
            confirmOnSave: this.handleConfirmOnSave,
          }
        );
        resolve();
      });
    }
    handleConfirmOnSave = () => {
      const { type } = this.store.state.formMaestroPrograma;
      const MESSAGE =
        type === FormType.REGISTRAR
          ? MESSAGES.CONFIRM_SAVE
          : MESSAGES.CONFIRM_UPDATE;
      return this.alert.open(MESSAGE, null, {
        confirm: true
      });
    }
    beforeSubmit = () => {
    }
    handleUpdate = (formValue: IEntidadMaestroPrograma, options: ISubmitOptions): Observable<IFormMaestroPrograma> => {
      return from(new Promise((resolve, reject) => {
        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setUpdate(formValue);
        this.store.programaFormActions.asynUpdateMaestroPrograma(formValue).pipe(tap(response => {
          this.dialogRef.close();
          //this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
          this.alert.open(`${MESSAGES.CONFIRM_SAVE_SUCCES}`, null, {
            confirm: false,
            icon: 'success'
          });
        })).subscribe();
      }));
    }
    handleSave = (formValue: IEntidadMaestroPrograma, options: ISubmitOptions): Observable<IFormMaestroPrograma> => {
      return from(new Promise((resolve, reject) => {
        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setInsert(formValue);
        this.store.programaFormActions.asynSaveMaestroPrograma(formValue)
          .pipe(tap(reponse => {
            this.dialogRef.close();
            //this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
            this.alert.open(`${MESSAGES.CONFIRM_SAVE_SUCCES}, con el siguiente código: ${reponse['formatoNumeracion']}`, null, {
              confirm: false,
              icon: 'success'
            });
          }))
          .subscribe();
      }));
    }
    private handleValidateOnSave = (): boolean => {
      if (this.form.valid) {
        return true;
      } 
      return false;
    };
    handleInputChange = ({ name, value }) => {
      switch (name) {
        case "tipoGradoAcademicoEnum":
            if(value==3){
              this.esGradoAcademicoBachiller = false;
              this.form.get('denominacionTituloOtorgado').setValidator([Validators.required, Validators.maxLength(250)]);              
              this.form.get('denominacionTituloOtorgado').setValue('');
            }else{ 
              this.esGradoAcademicoBachiller = true;
              this.form.get('denominacionTituloOtorgado').setValidator(null);
              this.form.get('denominacionTituloOtorgado').setValue('');
              this.form.clearErrors(['denominacionTituloOtorgado']);
            }
          break;
        case "codigoCINE":
            /*if(value==-1){
              this.form.get('denominacionPrograma').setValue('');
              this.denominacionProgramaCineDisabled=false;
            }else{ 
              this.form.get('denominacionPrograma').setValue('');
              this.denominacionProgramaCineDisabled=true;
            }*/
            break;
        default:
          break;
      }
    };
    modoTypeoModal = () => {
      return new Promise(
        (resolve)=>{
        const { type, id } = this.store.state.formMaestroPrograma;
        this.esDisabled = true;
        this.codigoHidden = false;
        if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
          this.store.programaFormActions.asynFetchMaestroPrograma(id)
            .pipe(
              tap(response => {
                this.store.programaFormActions.loadDataMaestroPrograma(response);              
              })).subscribe();
        }
        if(type === FormType.REGISTRAR){
          this.store.programaFormActions.loadCodigoMaestroPrograma(this.store.state.bandejaMaestroPrograma.codigoGenerado)
          this.codigoHidden = true;
        }
        resolve();
      });
    }
    buildValidations = () => {
      return new Promise(
        (resolve)=>{
        this.validators = {
          resolucionCreacion: [Validators.required, Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NUM_RESOLUCION)), Validators.maxLength(20)],
          fechaCreacionResolucion: [Validators.required],
          modalidadEstudioEnum: [Validators.required],
          resolucionCreacionModalidad: [Validators.required, Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NUM_RESOLUCION)), Validators.maxLength(20)],
          fechaCreacionModalidad: [Validators.required],
          idFacultad: [Validators.required],
          regimenEstudioEnum: [Validators.required],
          tipoGradoAcademicoEnum: [Validators.required],
          denominacionGradoAcademico: [Validators.required],
          //denominacionTituloOtorgado: [Validators.required],
          codigoCINE: [Validators.required],
          denominacionPrograma:[Validators.required], 
        };
        resolve();
      });
    }
    
    handleSubmit = () => {
      this.form.submit();
    }
  
    handleClose = () => {
      const { type } = this.store.state.formMaestroPrograma;
      if (type !== FormType.CONSULTAR) {
        this.alert.open('¿Está seguro que deseas cerrar del formulario? \n Se perderán los datos si continua.', null, { confirm: true }).then(confirm => {
          if (confirm) {
            this.dialogRef.close();
          }
        });
      } else {
        this.dialogRef.close();
      }
    }
  }
  