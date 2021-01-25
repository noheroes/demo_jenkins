import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, ToastService, AlertService, FormModel, ISubmitOptions, Validators } from '@sunedu/shared';

import { Subscription, Observable, forkJoin } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { IFormCurso, IModalCurso } from '../../../store/curso/curso.store.interface';
import { CursoStore } from '../../../store/curso/curso.store';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit, APP_FORM_VALIDATOR, APP_CLOSE_MODAL  } from '@lic/core';
const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la información?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR la información?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};

@Component({
  selector: 'app-app-form-cursos',
  templateUrl: './app-form-cursos.component.html',
  styleUrls: ['./app-form-cursos.component.scss']
})
export class AppFormCursosComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalCurso>;
  store: CursoStore;
  state$: Observable<IModalCurso>;
  subscriptions: Subscription[];
  validators: any;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    private dialogRef: MatDialogRef<AppFormCursosComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeEnumerado: EnumeradoGeneralStore,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalCurso), distinctUntilChanged());
    this.contextProcedimiento();
    this.modoTypeoModal();
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    this.loadCombos();
  }
  private loadCombos = () => {
    forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENUM_IDTIPOPERIODOACADEMICO'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_TIPOESTUDIO'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_TIPOCURSO'),
    ).pipe(tap(enums => {
      this.store.cursoModalActions.asyncFetchCombos(enums);
    })).subscribe();
  }

  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.cursoModalActions.setInit(current.idVersionSolicitud);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs1 = this.store.state$.pipe(map(x => x.modalCurso.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs1];
  }
  private buildForm = () => {
    const { form, type } = this.store.state.modalCurso;
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
  handleSave = (formValue: any, options: ISubmitOptions): Observable<IFormCurso> => {
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setInsert(formValue);
    return this.store.cursoModalActions.asynSaveCurso(formValue)
      .pipe(tap(response => {
        if(response['success']){
          this.toast.success(response['message']?response['message']:MESSAGES.CONFIRM_SAVE_SUCCES);
        }else{
          this.toast.error(response['message']);
        }
        //console.log('CAYL handleSave',response);
        this.dialogRef.close();
      }));
  }
  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormCurso> => {
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setUpdate(formValue);
    return this.store.cursoModalActions.asynUpdateCurso(formValue)
      .pipe(tap(response => {
        this.dialogRef.close();
        this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
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
    const { type } = this.store.state.modalCurso;
    const MESSAGE =
      type === FormType.REGISTRAR
        ? MESSAGES.CONFIRM_SAVE
        : MESSAGES.CONFIRM_UPDATE;
    return this.alert.open(MESSAGE, null, {
      confirm: true
    });
  }
  modoTypeoModal = () => {
    const { type, codigoCurso } = this.store.state.modalCurso;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.cursoModalActions.asynFetchCurso(codigoCurso)
        .pipe(tap(response => {
          this.store.cursoModalActions.loadDataCurso(response);
        })).subscribe();
    }
  }
  buildValidations = () => {
    this.validators = {
      tipoPeriodoAcademico: [Validators.required],
      codigo: [Validators.required, Validators.maxLength(12), this.onlyCodeValidChars],
      nombre: [Validators.required, Validators.maxLength(500),Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NOMBRECURSO))],//, this.onlyLettersSpace
      tipoEstudioEnum: [Validators.required],
      tipoCursoEnum: [Validators.required],
      totalSemanas: [Validators.required, Validators.number, Validators.greaterThan(0)],
      creditosAcademicos: [Validators.required, Validators.number, Validators.greaterThan(0), this.isDecimal],
    };
  }
  isDecimal = (formValue, fieldName, value, fieldLabel, customMsg) => {
    return {
      msg: customMsg || `El campo ${fieldLabel || fieldName} no tiene formato decimal, ingrese un valor con el formato: ##.#`,
      valid: 
        value != null &&
        value != undefined && /^[0-9]{1,2}(?:\.[0-9]{1,1})?$/g.test(value)
    };
  }
  onlyLettersSpace = (formValue, fieldName, value, fieldLabel, customMsg) => {
    return {
      msg: customMsg || `El campo ${fieldLabel || fieldName} sólo permite caracteres`,
      valid:
        value != null &&
        value != undefined && /^[áéíóúÁÉÍÓÚA-Za-z\s]+$/.test(value)
    };
  }
  onlyCodeValidChars = (formValue, fieldName, value, fieldLabel, customMsg) => {
    return {
      msg: customMsg || `El campo ${fieldLabel || fieldName} contiene caracteres no permitidos`,
      valid:
        value != null &&
        value != undefined && /^[A-Za-z\d-_]+$/.test(value)
    };
  }
  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalCurso;
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
  handleInputChange = ({ name, selected }) => {
    switch (name) {
      case 'tipoEstudioEnum': {
        this.form.get('descripcionEstudio').setValue(selected.text);
        break;
      }
      case 'tipoCursoEnum': {
        this.form.get('descripcionTipoCurso').setValue(selected.text);
        break;
      }
    };
  }
}
