import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, ToastService, AlertService, FormModel, ISubmitOptions, Validators } from '@sunedu/shared';
import { MatDialogRef } from '@angular/material';
import { Observable, Subscription, from } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { IModalInfraestructura, IFormInfraestructura } from '../../../store/infraestructura/infraestructura.store.interface';
import { InfraestructuraStore } from '../../../store/infraestructura/infraestructura.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit, APP_CLOSE_MODAL } from '@lic/core';
const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR el registro de infraestructura?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de infraestructura?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};

@Component({
  selector: 'app-form-Infraestructura',
  templateUrl: './app-form-infraestructura.component.html',
  styleUrls: ['./app-form-infraestructura.component.scss']
})
export class AppFormInfraestructuraComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalInfraestructura>;
  store: InfraestructuraStore;
  state$: Observable<IModalInfraestructura>;
  subscriptions: Subscription[];
  validators: any;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    private dialogRef: MatDialogRef<AppFormInfraestructuraComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalInfraestructura), distinctUntilChanged());
    this.contextProcedimiento();
    this.modoTypeoModal();
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
  }

  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.infraestructuraModalActions.setInit(current.idVersionSolicitud);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs1 = this.store.state$.pipe(map(x => x.modalInfraestructura.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs1];
  }
  private buildForm = () => {
    const { form, type } = this.store.state.modalInfraestructura;
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
  beforeSubmit = () => {
  }
  handleSave = (formValue: any, options: ISubmitOptions): Observable<IFormInfraestructura> => {
    return from(new Promise((resolve, reject) => {
      const audit = new AppAudit(this.storeCurrent);
      formValue = audit.setInsert(formValue);
      this.store.infraestructuraModalActions.asynSaveInfraestructura(formValue)
        .pipe(tap(response => {
          this.dialogRef.close();
          this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
        }, error => {
          this.form.enable();          
        })).subscribe();
    }));
  }
  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormInfraestructura> => {
    return from(new Promise((resolve, reject) => {
      const audit = new AppAudit(this.storeCurrent);
      formValue = audit.setUpdate(formValue);
      this.store.infraestructuraModalActions.asynUpdateInfraestructura(formValue)
        .pipe(tap(response => {
          this.dialogRef.close();
          this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
        }, error => {
          this.form.enable();
        }))
        .subscribe();
    }));
  }
  private handleValidateOnSave = (): boolean => {
    this.form.validate();
    if (this.form.valid) {
      return true;
    }
    return false;
  };
  handleConfirmOnSave = () => {
    const { type } = this.store.state.modalInfraestructura;
    const MESSAGE =
      type === FormType.REGISTRAR
        ? MESSAGES.CONFIRM_SAVE
        : MESSAGES.CONFIRM_UPDATE;
    return this.alert.open(MESSAGE, null, {
      confirm: true
    });
  }
  modoTypeoModal = () => {
    const { type, codigoInfraestructura } = this.store.state.modalInfraestructura;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.infraestructuraModalActions.asynFetchInfraestructura(codigoInfraestructura)
        .pipe(tap(response => {
          this.store.infraestructuraModalActions.loadDataInfraestructura(response);
        })).subscribe();
    }
    if (type === FormType.REGISTRAR){
      this.store.infraestructuraModalActions.asynFetchLaboratorioTaller()
        .pipe(tap(response => {         
          this.store.infraestructuraModalActions.loadDataInfraestructura(response);
        })).subscribe();
    }
  }

  buildValidations = () => {
    return new Promise<void>(
      (resolve)=>{
        this.validators = {
          numeroLaboratorioComputo: [Validators.required, Validators.number],
          numeroLaboratorioEnsenanza: [Validators.required, Validators.number],
          numeroLaboratorioInvestigacion: [Validators.required, Validators.number],
          numeroTalleresEnsenanza: [Validators.required, Validators.number],
          numeroBibliotecas: [Validators.required, Validators.number],
          numeroAulas: [Validators.required, Validators.number],
          numeroAmbientesDocentes: [Validators.required, Validators.number],
          numeroTopicos: [Validators.required, Validators.number],
          denominacionAmbienteComplementario: [Validators.required],
          denominacionAmbienteServicio: [Validators.required, Validators.maxLength(250)],
          comentario: [Validators.maxLength(500)]
        };
        resolve();
    });
  }

  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalInfraestructura;
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
  handleInputChange = ({ name, value }) => {
  };
}
