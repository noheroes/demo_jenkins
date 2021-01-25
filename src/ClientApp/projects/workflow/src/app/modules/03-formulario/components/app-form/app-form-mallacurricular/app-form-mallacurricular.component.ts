import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, ToastService, AlertService, FormModel, ISubmitOptions, Validators } from '@sunedu/shared';
import { MatDialogRef } from '@angular/material';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { IModalMallaCurricular, IFormMallaCurricular, ENU_IDREGIMENESTUDIO } from '../../../store/mallacurricular/mallacurricular.store.interface';
import { MallaCurricularStore } from '../../../store/mallacurricular/mallacurricular.store';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit, APP_CLOSE_MODAL } from '@lic/core';
import { isNullOrUndefined } from 'util';
//import { currentId } from 'async_hooks';
const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la malla curricular?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de la malla curricular?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};

@Component({
  selector: 'app-form-mallacurricular',
  templateUrl: './app-form-mallacurricular.component.html',
  styleUrls: ['./app-form-mallacurricular.component.scss']
})
export class AppFormMallacurricularComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalMallaCurricular>;
  store: MallaCurricularStore;
  state$: Observable<IModalMallaCurricular>;
  subscriptions: Subscription[];
  validators: any;
  modalidadEstudioVisible: boolean = false;
  max_date:any;  
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    private dialogRef: MatDialogRef<AppFormMallacurricularComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeEnumerado: EnumeradoGeneralStore,
    private storeCurrent: AppCurrentFlowStore
  ) { }

  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalMallaCurricular), distinctUntilChanged());
    this.max_date=new Date();
    this.buildForm();
    this.contextProcedimiento();
    this.modoTypeoModal();
    this.loadConfiguracion();
  }
  private async loadConfiguracion() {
    this.store.state.modalMallaCurricular.isLoading = true;
    let promises: any[] = [];
    // const action2 = await this.buildForm();
    // promises.push(action2);
    const action4 = await this.subscribeToState();
    promises.push(action4);
    await Promise.all(promises).then(() => {
      this.loadCombos();
    }).then(() => {
      this.store.state.modalMallaCurricular.isLoading = false;
    });
  }
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.mallaCurricularModalActions.setInit(current.idVersionSolicitud);
  }
  private loadCombos = () => {
    forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDMODALIDADESTUDIO'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDREGIMENESTUDIO'),
      this.store.mallaCurricularModalActions.asyncFetchAllProgramas()
    ).pipe(tap(enums => {
      this.store.mallaCurricularModalActions.asyncFetchCombos(enums);
      this.handleInputChange({ name: 'idPrograma', selectedItem: null });
    })).subscribe();

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    return new Promise((resolve) => {
      const subs1 = this.store.state$.pipe(map(x => x.modalMallaCurricular.form), distinctUntilChanged())
        .subscribe(x => {
          this.form.patchValue(x);
        });
      this.subscriptions = [subs1];
      resolve();
    });
  }
  private buildForm = () => {
    return new Promise((resolve) => {
      const { form, type } = this.store.state.modalMallaCurricular;
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
      resolve();
    });
  }
  beforeSubmit = () => {
  }
  handleSave = (formValue: any, options: ISubmitOptions): Observable<IFormMallaCurricular> => {
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setInsert(formValue);
    return this.store.mallaCurricularModalActions.asynSaveMallaCurricular(formValue)
      .pipe(tap(response => {
        this.dialogRef.close();
        this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
      }));
  }
  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormMallaCurricular> => {
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setUpdate(formValue);
    return this.store.mallaCurricularModalActions.asynUpdateMallaCurricular(formValue)
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
    const { type } = this.store.state.modalMallaCurricular;
    const MESSAGE =
      type === FormType.REGISTRAR
        ? MESSAGES.CONFIRM_SAVE
        : MESSAGES.CONFIRM_UPDATE;
    return this.alert.open(MESSAGE, null, {
      confirm: true
    });
  }
  modoTypeoModal = () => {
    const { type, codigoMallaCurricular } = this.store.state.modalMallaCurricular;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.mallaCurricularModalActions.asynFetchMallaCurricular(codigoMallaCurricular)
        .pipe(tap(response => {
          this.store.mallaCurricularModalActions.loadDataMallaCurricular(response);
        })).subscribe();
    }
  }
  buildValidations = () => {
    return new Promise((resolve) => {
      this.validators = {
        idPrograma: [Validators.required],
        numeroPeriodo: [Validators.required, , Validators.number, Validators.greaterThan(0), Validators.lessThan(10)],
        duracionProgramaAnios: [Validators.required, Validators.number, Validators.greaterThan(0), Validators.lessThan(10)],
        duracionProgramaSemanas: [Validators.required, Validators.number, Validators.greaterThan(0), Validators.lessThan(540)],
        valorCreditoTeorica: [Validators.required, Validators.number, this.isDecimal],
        valorCreditoPractica: [Validators.required, Validators.number, this.isDecimal],
      };

      resolve();
    });
  }
  isDecimal = (formValue, fieldName, value, fieldLabel, customMsg) => {
    return {
      msg: customMsg || `El campo ${fieldLabel || fieldName} no tiene formato decimal, ingrese un valor con el formato: ##.##`,
      valid: 
        value != null &&
        value != undefined && /^[0-9]{1,6}(?:\.[0-9]{1,2})?$/g.test(value)
    };
  }
  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalMallaCurricular;
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
  handleInputChange = ({ name, selectedItem }) => {
    switch (name) {      
      case 'idPrograma': {
        let currentIdPrograma = this.form.get('idPrograma').value;
        if (isNullOrUndefined(currentIdPrograma) || currentIdPrograma == "") currentIdPrograma = this.store.state.modalMallaCurricular.idPrograma;
        if (isNullOrUndefined(currentIdPrograma) || currentIdPrograma == "") return;
        let currentPrograma = this.store.state.modalMallaCurricular.comboLists.programas.list
          .filter(item => { return item.value == currentIdPrograma })[0];

        let currentModalidadEstudioEnum = currentPrograma.extra.modalidadEstudioEnum;
        this.modalidadEstudioVisible = !isNullOrUndefined(currentModalidadEstudioEnum);
        this.form.get('modalidadEstudioEnum').setValue(currentModalidadEstudioEnum);
        let currentRegimenEstudioEnum = currentPrograma.extra.regimenEstudioEnum;
        if (currentRegimenEstudioEnum) {
          this.form.get('tipoRegimenEstudioEnum').setValue(currentRegimenEstudioEnum);
        }
        break;
      }      
    }
  };
}
