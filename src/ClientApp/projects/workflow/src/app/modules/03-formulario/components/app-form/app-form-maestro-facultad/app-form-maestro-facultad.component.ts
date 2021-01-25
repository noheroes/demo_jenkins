import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {FormType, FormModel,ToastService, ISubmitOptions,AlertService ,Validators} from '@sunedu/shared';
import { Subscription, Observable, from } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { MaestroFacultadStore } from '../../../store/maestrofacultad/maestrofacultad.store';
import { IBandejaMaestroFacultad,IEntidadMaestroFacultad,IFormMaestroFacultad,IRequestSolicitudVersion } from '../../../store/maestrofacultad/maestrofacultad.store.interface';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { AppAudit, APP_FORM_VALIDATOR,AppCurrentFlowStore, APP_CLOSE_MODAL } from '@lic/core';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la facultad?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de facultad?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};

@Component({
    selector: 'app-form-maestro-facultad',
    templateUrl: './app-form-maestro-facultad.component.html',
    styleUrls: ['./app-form-maestro-facultad.component.scss'],
})
export class AppFormMaestroFacultadComponent implements  OnInit,OnDestroy {
  formType = FormType;
  form: FormModel<IFormMaestroFacultad>;
  store: MaestroFacultadStore;
  state$: Observable<IFormMaestroFacultad>;
  subscriptions: Subscription[];
  validators: any;
  desabilitar:boolean;
  codigoHidden:boolean;
  esDisabled:boolean;
  max_date:any;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<AppFormMaestroFacultadComponent>,
      private toast: ToastService,
      private alert: AlertService,
      private storeEnumerado: EnumeradoGeneralStore,
      private storeCurrent: AppCurrentFlowStore,
  ) {
    this.max_date = new Date();
    }
  async ngOnInit() {
    await this.loadConfiguracion();
  }
  private setInitilData = () => {
    return new Promise<void>(
      (resolve)=>{
        this.desabilitar=true;
        this.state$ = this.store.state$.pipe(map(x => x.formMaestroFacultad), distinctUntilChanged());
      resolve();
      });
  }
  private async loadConfiguracion(){
    this.store.maestroFacultadFormActions.setStateIsLoading(true);
    let promises: any[] = [];
    const action2 = await this.modoTypeoModal();
    promises.push(action2);
    const action0 = await this.setInitilData();
    promises.push(action0);
    const action3 = await this.buildValidations();
    promises.push(action3);
    const action4 = await this.buildForm();
    promises.push(action4);
    const action5 = await this.subscribeToState();
    promises.push(action5);

    await Promise.all(promises).then(() => { this.store.maestroFacultadFormActions.setStateIsLoading(false); });
  }
  modoTypeoModal = () => {
    return new Promise<void>(
      (resolve)=>{
      const { type, formRequest } = this.store.state.formMaestroFacultad;
      this.esDisabled = true;
      this.codigoHidden = false;
      if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
        this.store.maestroFacultadFormActions.asyncFetchMaestroFacultad(formRequest.idElemento).pipe(
          tap(response => {
            this.store.maestroFacultadFormActions.loadDataMaestroFacultad(response);
          })).subscribe();
      }
      if(type === FormType.REGISTRAR){
        this.codigoHidden = true;
      }
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
      const subs = this.store.state$.pipe(map(x => x.formMaestroFacultad.form), distinctUntilChanged())
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
      const { form, type } = this.store.state.formMaestroFacultad;
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
  beforeSubmit = () => {
  };
  handleUpdate = (formValue: IEntidadMaestroFacultad, options: ISubmitOptions): Observable<IFormMaestroFacultad> => {
    return from(new Promise((resolve, reject) => {
      const audit = new AppAudit(this.storeCurrent);
      formValue = audit.setUpdate(formValue);
      this.store.maestroFacultadFormActions.asyncUpdateMaestroFacultad(formValue).pipe(tap(response => {
        this.dialogRef.close();
        //this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
        this.alert.open(`${MESSAGES.CONFIRM_SAVE_SUCCES}`, null, {
          confirm: false,
          icon: 'success'
        });
      })).subscribe();
    }));
  }
  handleSave = (formValue: IEntidadMaestroFacultad, options: ISubmitOptions): Observable<IFormMaestroFacultad> => {
    return from(new Promise((resolve, reject) => {
      const audit = new AppAudit(this.storeCurrent);
      formValue = audit.setInsert(formValue);
      this.store.maestroFacultadFormActions.asynSaveMaestroFacultad(formValue)
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
  handleConfirmOnSave = () => {
    const { type } = this.store.state.formMaestroFacultad;
    const MESSAGE =
      type === FormType.REGISTRAR
        ? MESSAGES.CONFIRM_SAVE
        : MESSAGES.CONFIRM_UPDATE;
    return this.alert.open(MESSAGE, null, {
      confirm: true
    });
  };
  buildValidations = () => {
  return new Promise<void>(
    (resolve)=>{
    this.validators = {
      nombre: [Validators.required, Validators.maxLength(500)],
      fechaCreacionFacultad: [Validators.required],
      numeroResolucion: [Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NUM_RESOLUCION))],
      organoCreacion: [Validators.required],
    };
    resolve();
      });
  };
  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.formMaestroFacultad;
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
