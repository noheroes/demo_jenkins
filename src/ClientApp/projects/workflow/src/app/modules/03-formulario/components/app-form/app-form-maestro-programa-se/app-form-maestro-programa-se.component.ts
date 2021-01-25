import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppAudit, AppCurrentFlowStore, APP_FORM_VALIDATOR, APP_CLOSE_MODAL } from '@lic/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators } from '@sunedu/shared';

import { Subscription, Observable, from, forkJoin } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
//import { ENU_Util } from '../../../store/maestroprogramase/maestroprogramasegunda.store.model';
import { MaestroProgramaSegundaStore } from '../../../store/maestroprogramasegunda/maestroprogramasegunda.store';
import { ENU_Util } from '../../../store/maestroprogramasegunda/maestroprogramasegunda.store.model';
import { IFormMaestroProgramaSegunda } from '../../../store/maestroprogramasegunda/maestroprogramasegunda.store.interface';
  
const MESSAGES = {
    CONFIRM_SAVE: '¿Está seguro de GUARDAR el programa?',
    CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de programa?',
    CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
    CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
  };
  
@Component({
    selector: 'app-form-maestro-programa-se',
    templateUrl: './app-form-maestro-programa-se.component.html',
    styleUrls: ['./app-form-maestro-programa-se.component.scss']
})
export class AppFormMaestroProgramaSeComponent implements  OnInit, OnDestroy {
    formType = FormType;
    form: FormModel<IFormMaestroProgramaSegunda>;
    store: MaestroProgramaSegundaStore;
    state$: Observable<IFormMaestroProgramaSegunda>;
    subscriptions: Subscription[];
    validators: any;
    desabilitar:boolean; 
    codigoHidden:boolean;
    esDisabled:boolean;
    max_date:any;
    readonly CLOSE_MODAL = APP_CLOSE_MODAL;
    constructor(
      public dialogRef: MatDialogRef<AppFormMaestroProgramaSeComponent>,
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
      return new Promise<void>(
        (resolve)=>{
        this.desabilitar=true;
        this.state$ = this.store.state$.pipe(map(x => x.formMaestroProgramaSegunda), distinctUntilChanged());
        resolve();
      });
    }
    private async loadConfiguracion(){
      this.store.segundaFormActions.setStateIsLoading(true);
      let promises: any[] = [];
      const action0 = await this.setInitilData();
      promises.push(action0);
      const action2 = await this.modoTypeoModal();
      promises.push(action2);
      // const action3 = await this.buildValidations();
      // promises.push(action3);
      // const action4 = await this.buildForm();
      // promises.push(action4);
     
      const action5 = await this.subscribeToState();
      promises.push(action5);
      const action6 = await this.loadCombos();
      promises.push(action6);

      await Promise.all(promises).then(() => { this.store.segundaFormActions.setStateIsLoading(false); });
    }

    
    private loadCombos = () => {
      return new Promise<void>(
        (resolve)=>{
          forkJoin(
            this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDREGIMENESTUDIO'),
            this.store.segundaFormActions.getExternalCINE()
          ).pipe(tap(enums => {
            //console.log('CAYL maestroProgramaSeFormActions storeCurrent',this.storeCurrent.currentFlowAction.get());
            this.store.segundaFormActions.asyncFetchCombos(enums,
              this.store.segundaFormActions.get().cine);
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
      return new Promise<void>(
        (resolve)=>{
        const subs = this.store.state$.pipe(map(x => x.formMaestroProgramaSegunda.form), distinctUntilChanged())
          .subscribe(x => {
            this.form.patchValue(x);
          });
        this.subscriptions = [subs];
        resolve();
      });
    } 
    private buildForm = () => {
      return new Promise<void>(
        (resolve)=>{
        const { form, type } = this.store.state.formMaestroProgramaSegunda;
        this.buildValidations();
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
      const { type } = this.store.state.formMaestroProgramaSegunda;
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
    handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormMaestroProgramaSegunda> => {
      return from(new Promise((resolve, reject) => {
        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setUpdate(formValue);
        this.store.segundaFormActions.asynUpdateMaestroProgramaSegunda(formValue).pipe(tap(response => {
          this.dialogRef.close();
          //this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
          this.alert.open(`${MESSAGES.CONFIRM_SAVE_SUCCES}`, null, {
            confirm: false,
            icon: 'success'
          });
        })).subscribe();
      }));
    }
    handleSave = (formValue: any, options: ISubmitOptions): Observable<IFormMaestroProgramaSegunda> => {
      return from(new Promise((resolve, reject) => {
        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setInsert(formValue);
        this.store.segundaFormActions.asynSaveMaestroProgramaSegunda(formValue)
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
      /*switch (name) {
        case "codigoCINE":
            if(value==-1){
              this.form.get('denominacionPrograma').setValue('');
              this.denominacionProgramaCineDisabled=false;
            }else{ 
              this.form.get('denominacionPrograma').setValue('');
              this.denominacionProgramaCineDisabled=true;
            }
            break;
        default:
          break;
      }*/
    };
    modoTypeoModal = () => {
      return new Promise<void>(
        (resolve)=>{
          const { type, id } = this.store.state.formMaestroProgramaSegunda;
          this.codigoHidden=false;
          this.esDisabled=true;
          if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
            this.store.segundaFormActions.asynFetchMaestroProgramaSegunda(id)
              .pipe(
                tap(response => {
                  this.store.segundaFormActions.loadDataMaestroProgramaSegunda(response);
                })).subscribe();
          }
          if(type === FormType.REGISTRAR){
            this.codigoHidden=true;
            this.store.segundaFormActions.loadCodigoMaestroProgramaSegunda(this.store.state.bandejaMaestroProgramaSegunda.codigoGenerado)

          }
        resolve();
      });
    }
    buildValidations = () => {
      return new Promise<void>(
        (resolve)=>{
          this.validators = {
            resolucionCreacion: [Validators.required, Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NUM_RESOLUCION))],
            fechaCreacionResolucion: [Validators.required],
            modalidadEstudioEnum: [Validators.required],
            resolucionCreacionModalidad: [Validators.required, Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NUM_RESOLUCION))],
            fechaCreacionModalidad: [Validators.required],
            idFacultad: [Validators.required],
            regimenEstudioEnum: [Validators.required],
            tipoGradoAcademicoEnum: [Validators.required],
            denominacionGradoAcademico: [Validators.required],
            denominacionTituloOtorgado: [Validators.required],
            codigoCINE: [Validators.required],
            denominacionPrograma:[Validators.requiredIf({codigoCINE: ENU_Util.ENU_CINE_OTRO})],
            comentario: [Validators.required],
          };
          resolve();
        });
    }
    handleSubmit = () => {
      this.form.submit();
    }
  
    handleClose = () => {
      const { type } = this.store.state.formMaestroProgramaSegunda;
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
  