import { AppAudit, AppCurrentFlowStore } from '@lic/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators } from '@sunedu/shared';

import { Subscription, Observable, from } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

import { IFormPresupuesto, IEntidadPresupuesto } from '../../../store/presupuesto/presupuesto.store.interface';
import { PresupuestoStore } from '../../../store/presupuesto/presupuesto.store';
import { APP_CLOSE_MODAL } from '@lic/core';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR el Presupuesto?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de Presupuesto?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};

@Component({
  selector: 'app-form-presupuesto',
  templateUrl: './app-form-presupuesto.component.html',
  styleUrls: []
})
export class AppFormPresupuestoComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IFormPresupuesto>;
  store: PresupuestoStore;
  state$: Observable<IFormPresupuesto>;
  subscriptions: Subscription[];
  validators: any;
  esDisabled:boolean;
  esDisabledCodigo:boolean;
  codigoHidden:boolean;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;
  constructor(
    public dialogRef: MatDialogRef<AppFormPresupuestoComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore,
  ) { }
  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.formPresupuesto), distinctUntilChanged());
    this.modoTypeoModal();
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    this.loadCombos();
  }
  private loadCombos = () => {
    const { presupuestoFormActions } = this.store;
    //presupuestoFormActions.asyncFetchLocales();
  };
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs1 = this.store.state$.pipe(map(x => x.formPresupuesto.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs1];
  }
  private buildForm = () => {
    const { form, type } = this.store.state.formPresupuesto;
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
  }
  handleConfirmOnSave = () => {
    const { type } = this.store.state.formPresupuesto;
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
  handleUpdate = (formValue: IEntidadPresupuesto, options: ISubmitOptions): Observable<IFormPresupuesto> => {
    return from(new Promise((resolve, reject) => {
      const audit = new AppAudit(this.storeCurrent);
      formValue = audit.setUpdate(formValue);
      this.store.presupuestoFormActions.asynUpdate(formValue,this.store.state.formPresupuesto.requestValues).pipe(tap(response => {
        this.dialogRef.close();
        //this.store.presupuestoFormActions.asyncFetch();
        this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
      })).subscribe();
    }));
  }
  handleSave = (formValue: IEntidadPresupuesto, options: ISubmitOptions): Observable<IFormPresupuesto> => {
    return from(new Promise((resolve, reject) => { 
      const audit = new AppAudit(this.storeCurrent);
      formValue = audit.setInsert(formValue);
        
      this.store.presupuestoFormActions.asynSave(formValue,this.store.state.formPresupuesto.requestValues)
        .pipe(tap(reponse => {
          this.dialogRef.close();
          //this.store.presupuestoBandejaActions.asyncFetchPresupuesto();
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
  };
  modoTypeoModal = () => {
    const { type, requestValues } = this.store.state.formPresupuesto;
    this.esDisabledCodigo = true;
    this.codigoHidden = false;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.presupuestoFormActions.asyncFetch(requestValues.id,requestValues.idVersion,requestValues.idSedeFilial)
        .pipe(
          tap(response => {
            this.store.presupuestoFormActions.loadDataPresupuesto(response);
            if(response.esOtroconcepto)
              this.esDisabled = false;
            else
              this.esDisabled = true;//response.esOtroconcepto;*/
          })).subscribe();
    }else {
      this.esDisabled = false;
      this.codigoHidden = true;
    }
    
  }
  buildValidations = () => {
    this.validators = {
      concepto:[Validators.required],
      anioUnoPresupuesto:[Validators.required],
      anioUnoEjecucion:[Validators.required],
      anioDosPresupuesto:[Validators.required],
      anioTresPresupuesto:[Validators.required],
      anioCuatroPresupuesto:[Validators.required],
      anioCincoPresupuesto:[Validators.required],
      anioSeisPresupuesto:[Validators.required]
    };
  }
  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.formPresupuesto;
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
