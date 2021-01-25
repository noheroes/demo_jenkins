import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, AlertService, ToastService, ISubmitOptions, IDataGridButtonEvent, Validators } from '@sunedu/shared';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { CursoStore } from '../../../store/curso/curso.store';
import { IModalHoraLectivaCurso, IFormHoraLectivaCurso } from '../../../store/curso/curso.store.interface';
import { MatDialogRef } from '@angular/material';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { map } from 'rxjs/internal/operators/map';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { AppAudit, APP_CLOSE_MODAL } from '@lic/core';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la información?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR la información?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};
@Component({
  selector: 'app-form-horariolectivo',
  templateUrl: './app-form-horariolectivo.component.html',
  styleUrls: ['./app-form-horariolectivo.component.scss']
})
export class AppFormHorariolectivoComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalHoraLectivaCurso>;
  store: CursoStore;
  state$: Observable<IModalHoraLectivaCurso>;
  subscriptions: Subscription[];
  validators: any;
  readOnly:boolean;
  nombre_curso: string;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<AppFormHorariolectivoComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore, 
    private storeEnumerado: EnumeradoGeneralStore
  ) { }

  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalHoraLectivaCurso), distinctUntilChanged());
    this.contextProcedimiento();
    this.modoTypeoModal();
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    this.loadCombos();
  }
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.horariolectivaModalActions.setInit(current.idVersionSolicitud);
    this.store.horariolectivaModalActions.setReadOnly(this.readOnly);
  }
  private loadCombos = () => {
    forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_HORALECTIVA')
    ).pipe(tap(enums => {
      this.store.horariolectivaModalActions.asyncFetchCombos(enums);
    })).subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs = this.store.state$.pipe(map(x => x.modalHoraLectivaCurso.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs];
  }

  private buildForm = () => {
    const { form, type } = this.store.state.modalHoraLectivaCurso;
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
    const { type } = this.store.state.modalHoraLectivaCurso;
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

  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormHoraLectivaCurso> => {
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setInsert(formValue);
    return this.store.horariolectivaModalActions.asynUpdateHoraLectiva(formValue).pipe(
      tap(response => {
        this.store.horariolectivaModalActions.resetModalHoraLectiva();
        if (!response.success) {
          return this.alert.open('La hora lectiva ya esta agregada.', null, {
            confirm: false,
            icon: 'info'
          });
        }
        this.store.horariolectivaModalActions.asyncFetchPage().subscribe();
      }));
  }
  private handleValidateOnSave = (): boolean => {
    if (this.form.valid) {
      return true;
    }
    return false;
  }
  modoTypeoModal = () => {
    const { type } = this.store.state.modalHoraLectivaCurso;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.horariolectivaModalActions.asyncFetchPage().subscribe();
    }
  }
  buildValidations = () => {
    this.validators = {
      tipoHoraLectivaEnum: [Validators.required],
      cantidad: [Validators.required, Validators.pattern(new RegExp(/[1-999]/))]
    };
  }
  handleSubmit = () => {
    this.form.submit();
  }
  handleClose = () => {
    const { type } = this.store.state.modalHoraLectivaCurso;
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
        this.store.horariolectivaModalActions.asynDeleteHoraAsignada(id).subscribe(reponse => {
          this.alert.open('Registro eliminado', null, { icon: 'success' });
          this.store.horariolectivaModalActions.asyncFetchPage().subscribe();
        });
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
  handleInputChange = (obj, val) => {
    this.form.get('descripcionHoraLectiva').value = obj.selected.text;
  }
}
