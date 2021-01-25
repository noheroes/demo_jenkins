import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators, IDataGridButtonEvent, IDataGridEvent, IDataGridPageRequest } from '@sunedu/shared';
import { IModalProgramaDocente, IFormProgramaDocente } from '../../../store/maestropersona/maestropersona.store.interface';
import { MaestroPersonaStore } from '../../../store/maestropersona/maestropersona.store';
import { Observable, Subscription, from, forkJoin, pipe } from 'rxjs';
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
  selector: 'app-app-form-programadocente',
  templateUrl: './app-form-programadocente.component.html',
  styleUrls: ['./app-form-programadocente.component.scss']
})
export class AppFormProgramadocenteComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalProgramaDocente>;
  store: MaestroPersonaStore;
  state$: Observable<IModalProgramaDocente>;
  subscriptions: Subscription[];
  validators: any;
  nombre_docente: string;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;
  
  constructor(
    public dialogRef: MatDialogRef<AppFormProgramadocenteComponent>,
    // private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalProgramaDocente), distinctUntilChanged());
    this.contextProcedimiento();
    this.modoTypeoModal();
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    this.loadCombos();
  }
  handleLoadData = (e: IDataGridEvent) => {
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip,
    };
    this.store.programaDocenteModalActions.asyncFetchPage(pageRequest).subscribe();
  };
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.programaDocenteModalActions.setInit(current.idVersionSolicitud);
  }
  private loadCombos = () => {
    const { codigoMaestroPersona } = this.store.state.modalProgramaDocente;
    //console.log('CAYL loadCombos',codigoMaestroPersona);
    forkJoin(
      this.store.programaDocenteModalActions.asynFetch(codigoMaestroPersona)
    ).pipe(tap(enums => {
      this.store.programaDocenteModalActions.asyncFetchCombos(enums);
    })).subscribe();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs = this.store.state$.pipe(map(x => x.modalProgramaDocente.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs];
  }
  private buildForm = () => {
    const { form, type } = this.store.state.modalProgramaDocente;
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
    const { type } = this.store.state.modalProgramaDocente;
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
  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormProgramaDocente> => {
    return this.store.programaDocenteModalActions.asynUpdate(formValue).pipe(tap(response => {
      /*if (!response.success) {
        return this.alert.open('El programa ya está agregado.', null, {
          confirm: false,
          icon: 'info'
        });
      }*/      
      this.store.maestroPersonaBuscadorActions
      .asyncFetchPageMaestroPersona()
      .subscribe();
      this.store.programaDocenteModalActions.asyncFetchPage().subscribe(response =>{
        this.store.programaDocenteModalActions.resetForm();
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
    const { type } = this.store.state.modalProgramaDocente;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.programaDocenteModalActions.asyncFetchPage().subscribe();
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
    const { type } = this.store.state.modalProgramaDocente;
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
        this.store.programaDocenteModalActions.asynDelete(id)
          .pipe(
            tap(responose => this.alert.open('Registro eliminado', null, { icon: 'success' })),
          concatMap(response => this.store.programaDocenteModalActions.asyncFetchPage()),
          tap(response =>
            {
              this.store.maestroPersonaBuscadorActions
              .asyncFetchPageMaestroPersona()
              .subscribe();
              this.store.programaDocenteModalActions.resetForm();
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
}
