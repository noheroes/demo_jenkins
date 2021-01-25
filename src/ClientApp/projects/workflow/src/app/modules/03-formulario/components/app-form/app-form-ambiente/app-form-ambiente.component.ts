import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService, AlertService, FormType, FormModel, ISubmitOptions, Validators } from '@sunedu/shared';
import { AmbienteStore } from '../../../store/ambiente/ambiente.store';
import { Observable, Subscription, from } from 'rxjs';
import { IModalAmbiente, IFormAmbiente } from '../../../store/ambiente/ambiente.store.interface';
import { MatDialogRef } from '@angular/material/dialog';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { APP_CLOSE_MODAL } from '@lic/core';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR el ambiente?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de ambiente?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};
@Component({
  selector: 'app-form-ambiente',
  templateUrl: './app-form-ambiente.component.html',
  styleUrls: ['./app-form-ambiente.component.scss']
})
export class AppFormAmbienteComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalAmbiente>;
  store: AmbienteStore;
  state$: Observable<IModalAmbiente>;
  subscriptions: Subscription[];
  validators: any;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<AppFormAmbienteComponent>,
    private toast: ToastService,
    private alert: AlertService
  ) { }
  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalAmbiente), distinctUntilChanged());
    this.modoTypeoModal();
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    this.loadCombos();
  }
  private loadCombos = () => {
    const { ambienteModalActions } = this.store;
    ambienteModalActions.asyncFetchLocal();

  };
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs1 = this.store.state$.pipe(map(x => x.modalAmbiente.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs1];
  }
  private buildForm = () => {
    const { form, type } = this.store.state.modalAmbiente;
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
    const { type } = this.store.state.modalAmbiente;
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
  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormAmbiente> => {
    return from(new Promise((resolve, reject) => {
      this.store.ambienteModalActions.asynSaveAmbiente(formValue).pipe(tap(response => {
        this.dialogRef.close();
        this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
      })).subscribe();
    }));
  }
  handleSave = (formValue: any, options: ISubmitOptions): Observable<IFormAmbiente> => {
    return from(new Promise((resolve, reject) => {
      this.store.ambienteModalActions.asynSaveAmbiente(formValue)
        .pipe(tap(reponse => {
          this.dialogRef.close();
          this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
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
    const { type, codigoAmbiente } = this.store.state.modalAmbiente;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.ambienteModalActions.asynFetchAmbiente(codigoAmbiente)
        .pipe(
          tap(response => {
            this.store.ambienteModalActions.loadDataAmbiente(response);
          })).subscribe();
    }
  }
  buildValidations = () => {
    this.validators = {
      codigoLocalRef: [Validators.required],
      codigo: [Validators.required],
      ubicacion: [Validators.required],
      aforo: [Validators.required],
      cantidadDocente: [Validators.required],
      tieneInternet: [Validators.required],
      cantidadSillas: [Validators.required],
      cantidadMesas: [Validators.required],
      tipoRegimenDedicacionEnum: [Validators.required],
      otroEquipamentoMobiliario: [Validators.required],
      comentario: [Validators.required]
    };
  }
  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalAmbiente;
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
