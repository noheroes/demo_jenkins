import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators, IDataGridButtonEvent, IDataGridEvent } from '@sunedu/shared';
import { IFormProgramaNoDocente, IModalProgramaNoDocente } from '../../../store/maestropersona/maestropersona.store.interface';
import { MaestroPersonaStore } from '../../../store/maestropersona/maestropersona.store';
import { Observable, Subscription, from, forkJoin } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { map, distinctUntilChanged, tap, concatMap } from 'rxjs/operators';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { APP_CLOSE_MODAL } from '@lic/core';
const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la información?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR la información?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};
@Component({
  selector: 'app-form-programanodocente',
  templateUrl: './app-form-programanodocente.component.html',
  styleUrls: ['./app-form-programanodocente.component.scss']
})
export class AppFormProgramanodocenteComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalProgramaNoDocente>;
  store: MaestroPersonaStore;
  state$: Observable<IModalProgramaNoDocente>;
  subscriptions: Subscription[];
  validators: any;
  nombre_nodocente: string;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;
  constructor(
    public dialogRef: MatDialogRef<AppFormProgramanodocenteComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalProgramaNoDocente), distinctUntilChanged());
    this.contextProcedimiento();
    this.modoTypeoModal();
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    this.loadCombos();
  }
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.programaNoDocenteModalActions.setInit(current.idVersionSolicitud);
  }
  private loadCombos = () => {
    const { codigoMaestroPersona } = this.store.state.modalProgramaNoDocente;
    forkJoin(
      this.store.programaNoDocenteModalActions.asynFetch(codigoMaestroPersona)
    ).pipe(tap(enums => {
      this.store.programaNoDocenteModalActions.asyncFetchCombos(enums);
    })).subscribe();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs = this.store.state$.pipe(map(x => x.modalProgramaNoDocente.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs];
  }
  private buildForm = () => {
    const { form, type } = this.store.state.modalProgramaNoDocente;
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
    const { type } = this.store.state.modalProgramaNoDocente;
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
  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormProgramaNoDocente> => {
    return this.store.programaNoDocenteModalActions.asynUpdate(formValue).pipe(tap(response => {
      if (!response.success) {
        return this.alert.open('El programa ya esta agregada.', null, {
          confirm: false,
          icon: 'info'
        });
      }
      this.store.maestroNoDocenteBuscadorActions.asyncFetchPageMaestroNoDocente().subscribe();
      this.store.programaNoDocenteModalActions.asyncFetchPage().subscribe(response => {
        this.store.programaNoDocenteModalActions.resetForm();
        this.buildForm();
        this.loadCombos();
      });
    }));
  }

  private handleValidateOnSave = (): boolean => {
    if (this.form.valid) {
      return true;
    }
    return false;
  }
  handleInputChange = (obj, val) => {

  }
  modoTypeoModal = () => {
    const { type, codigoMaestroPersona } = this.store.state.modalProgramaNoDocente;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.programaNoDocenteModalActions.asyncFetchPage().subscribe();
    }
  }
  buildValidations = () => {
    this.validators = {
      idPrograma: [Validators.required]
    };
  }
  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalProgramaNoDocente;
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

  handleDelete = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {
        this.store.programaNoDocenteModalActions.asynDelete(id)
          .pipe(
            tap(response => this.alert.open('Registro eliminado', null, { icon: 'success' })),
            concatMap(response => this.store.programaNoDocenteModalActions.asyncFetchPage()),
            tap(response => {
              this.store.maestroNoDocenteBuscadorActions.asyncFetchPageMaestroNoDocente().subscribe();
              this.store.programaNoDocenteModalActions.resetForm();
              this.buildForm();
              this.loadCombos();
            }))
          .subscribe();
      }
    });
  }

  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'ELIMINAR':
        this.handleDelete(e.item.id);
        break;
    }
  }
  handleLoadData = (e: IDataGridEvent) => {
    const current = this.storeCurrent.currentFlowAction.get();
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip
    };
    this.store.programaNoDocenteModalActions.asyncFetchPage(pageRequest).subscribe();
  };
}
