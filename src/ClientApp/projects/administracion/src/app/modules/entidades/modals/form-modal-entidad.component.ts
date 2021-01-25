import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  ToastService,
  AlertService,
  FormType,
  FormModel,
  ISubmitOptions,
  Validators,
} from '@sunedu/shared';
import { Observable, Subscription, from } from 'rxjs';

import { MatDialogRef } from '@angular/material/dialog';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import {
  IModalEntidad,
  IEntidad,
  StatusResponse,
} from '../stores/entidad.store.interface';
import { EntidadStore } from '../stores/entidad.store';
import { AppAudit, AppCurrentFlowStore, APP_CLOSE_MODAL } from '@lic/core';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la Universidad?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de la Universidad?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente',
  CONFIRM_VALIDATE_BEFORE_SUCCESS: 'Ya existe una Universidad con el mismo ruc',
};
@Component({
  selector: 'form-modal-entidad',
  templateUrl: './form-modal-entidad.component.html',
  styleUrls: [],
})
export class FormModalEntidadComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalEntidad>;
  store: EntidadStore;
  state$: Observable<IModalEntidad>;
  subscriptions: Subscription[];
  validators: any;

  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  @Output() succesEvent = new EventEmitter<boolean>();

  constructor(
    private storeCurrent: AppCurrentFlowStore,
    public dialogRef: MatDialogRef<FormModalEntidadComponent>,
    private toast: ToastService,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.state$ = this.store.state$.pipe(
      map((x) => x.modalEntidad),
      distinctUntilChanged()
    );
    this.modoTypeoModal();
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    // this.loadCombos();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs1 = this.store.state$
      .pipe(
        map((x) => x.modalEntidad.form),
        distinctUntilChanged()
      )
      .subscribe((x) => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs1];
  };
  private buildForm = () => {
    const { form, type } = this.store.state.modalEntidad;
    this.buildValidations();
    this.form = new FormModel<any>(type, form, this.validators, {
      beforeSubmit: this.beforeSubmit,
      onSave: this.handleSave,
      onUpdate: this.handleUpdate,
      validateOnSave: this.handleValidateOnSave,
      confirmOnSave: this.handleConfirmOnSave,
    });
  };
  handleConfirmOnSave = () => {
    const { type } = this.store.state.modalEntidad;
    const MESSAGE =
      type === FormType.REGISTRAR
        ? MESSAGES.CONFIRM_SAVE
        : MESSAGES.CONFIRM_UPDATE;
    return this.alert.open(MESSAGE, null, {
      confirm: true,
    });
  };
  beforeSubmit = () => {};

  handleUpdate = (
    formValue: IEntidad,
    options: ISubmitOptions
  ): Observable<StatusResponse> => {
    return from(
      new Promise((resolve, reject) => {
        // if (formValue.fechaCreacion == null) {
        //   formValue.fechaCreacion = new Date().toISOString();
        // }
        // formValue.usuarioModificacion = this.current.idUsuario;
        // formValue.fechaModificacion = new Date().toISOString();

        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setUpdate(formValue);

        this.store.entidadModalActions
          .asynUpdateEntidad(formValue)
          .pipe(
            tap((response) => {
              // this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
              if (response.success) {
                this.succesEvent.emit(true);
                this.toast.success(response.message);
              } else {
                this.toast.warning(response.message);
              }
              this.dialogRef.close();
            })
          )
          .subscribe();
      })
    );
  };

  handleSave = (
    formValue: IEntidad,
    options: ISubmitOptions
  ): Observable<StatusResponse> => {
    // formValue.usuarioCreacion = this.current.idUsuario;
    // formValue.fechaCreacion = new Date().toISOString();
    // formValue.fechaModificacion = null;

    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setInsert(formValue, true);
    formValue.esEditable = true;

    return from(
      new Promise((resolve, reject) => {
        this.store.entidadModalActions
          .asynSaveEntidad(formValue)
          .pipe(
            tap((response) => {
              // this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
              if (response.success) {
                this.succesEvent.emit(true);
                this.toast.success(response.message);
              } else {
                this.toast.warning(response.message);
              }
              this.dialogRef.close();
            })
          )
          .subscribe();
      })
    );
  };

  private handleValidateOnSave = (): boolean => {
    if (this.form.valid) {
      return true;
    }
    return false;
  };
  handleInputChange = ({ name, value }) => {};
  modoTypeoModal = () => {
    const { type, id } = this.store.state.modalEntidad;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      const item = this.store.state.buscadorEntidad.gridSource.items.find(
        (x) => x.id === id
      ) as IEntidad;
      // Se pasa el Row Completo
      this.store.entidadModalActions.loadDataEntidad(item);
      /*
      this.store.universidadModalActions.asynFetchEntidad(id)
        .pipe(
          tap(response => {
            this.store.universidadModalActions.loadDataEntidad(response);
          })).subscribe();
      */
    }
  };
  buildValidations = () => {
    this.validators = {
      nombre: [Validators.required],
      razonSocial: [Validators.required],
      ruc: [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.number,
      ],
    };
  };
  handleSubmit = () => {
    this.form.submit();
  };

  handleClose = () => {
    const { type } = this.store.state.modalEntidad;
    if (type !== FormType.CONSULTAR) {
      this.alert
        .open('¿Está seguro que deseas cerrar del formulario? \n Se perderán los datos si continua.', null, {
          confirm: true,
        })
        .then((confirm) => {
          if (confirm) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  };
}
