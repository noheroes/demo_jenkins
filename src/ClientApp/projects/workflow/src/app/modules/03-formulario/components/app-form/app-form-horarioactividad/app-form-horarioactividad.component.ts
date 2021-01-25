import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators, IDataGridButtonEvent } from '@sunedu/shared';
import { MaestroPersonaStore } from '../../../store/maestropersona/maestropersona.store';
import {
  IModalHoraAsignadaDocente,
  IFormHoraAsignadaDocente,
  IFormMaestroPersona
} from '../../../store/maestropersona/maestropersona.store.interface';
import { Observable, Subscription, from, iif, of } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { map } from 'rxjs/internal/operators/map';
import { distinctUntilChanged, tap, concatMap } from 'rxjs/operators';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { APP_CLOSE_MODAL } from '@lic/core';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la información?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR la información?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};
@Component({
  selector: 'app-app-form-horarioactividad',
  templateUrl: './app-form-horarioactividad.component.html',
  styleUrls: ['./app-form-horarioactividad.component.scss']
})
export class AppFormHorarioactividadComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalHoraAsignadaDocente>;
  store: MaestroPersonaStore;
  state$: Observable<IModalHoraAsignadaDocente>;
  subscriptions: Subscription[];
  validators: any;
  nombre_docente: string;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<AppFormHorarioactividadComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeEnumerado: EnumeradoGeneralStore,
    private storeCurrent: AppCurrentFlowStore
  ) { }
  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalHoraAsignadaDocente), distinctUntilChanged());
    this.contextProcedimiento();
    this.modoTypeoModal();
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    this.loadCombos();
  }
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.horaActividadModalActions.setInit(current.idVersionSolicitud);
  }

  private loadCombos = () => {
    this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDHORASACTIVIDAD')
      .then(enums => {
        this.store.horaActividadModalActions.asyncFetchCombos(enums);
      });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs = this.store.state$.pipe(map(x => x.modalHoraAsignadaDocente.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs];
  }
  private buildForm = () => {
    const { form, type } = this.store.state.modalHoraAsignadaDocente;
    this.buildValidations();
    this.form = new FormModel<any>(
      type,
      form,
      this.validators,
      {
        beforeSubmit: this.beforeSubmit,
        onSave: null,
        onUpdate: this.handleUpdate,
        validateOnSave: this.handleValidateOnSave,
        confirmOnSave: this.handleConfirmOnSave,
      }
    );
  }
  handleConfirmOnSave = () => {
    const { type } = this.store.state.modalHoraAsignadaDocente;
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
  handleUpdate = (form: IFormHoraAsignadaDocente, options: ISubmitOptions): Observable<IFormMaestroPersona> => {
    return this.store.horaActividadModalActions.asynUpdate(form)
      .pipe(
        tap(response => {
          this.store.horaActividadModalActions.resetForm();
          if (!response.success) {
            return this.alert.open('La hora de actividad ya esta agregada.', null, {
              confirm: false,
              icon: 'info'
            });
          }
        }),
        concatMap(response => this.store.horaActividadModalActions.asyncFetchPage())
      );
  }

  private handleValidateOnSave = (): boolean => {
    if (this.form.valid) {
      return true;
    }
    return false;
  }
  handleInputChange = (obj, val) => {
    this.form.get('descripcionHoraActividad').value = obj.selected.text;
  }
  modoTypeoModal = () => {
    const { type, codigoMaestroPersona } = this.store.state.modalHoraAsignadaDocente;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.horaActividadModalActions.asyncFetchPage().subscribe();
    }
  }
  buildValidations = () => {
    this.validators = {
      tipoHoraActividadEnum: [Validators.required],
      cantidad: [Validators.required, Validators.number],
    };
  }
  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalHoraAsignadaDocente;
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
  deleteHorarioActividad = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.store.horaActividadModalActions.asynDeleteHoraAsignada(id)
          .pipe(
            tap(resonse => this.alert.open('Registro eliminado', null, { icon: 'success' })),
            concatMap(response => this.store.horaActividadModalActions.asyncFetchPage())
          ).subscribe();
      }
    });
  }

  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'ELIMINAR':
        this.deleteHorarioActividad(e.item.id);
        break;
    }
  }
}
