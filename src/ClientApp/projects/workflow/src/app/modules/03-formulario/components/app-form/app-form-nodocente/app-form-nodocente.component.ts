import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators } from '@sunedu/shared';
import { IFormMaestroPersona, IModalMaestroNoDocente, NIVELPROGRAMA, TIPODOCUMENTO } from '../../../store/maestropersona/maestropersona.store.interface';
import { MaestroPersonaStore } from '../../../store/maestropersona/maestropersona.store';
import { Observable, Subscription, from, forkJoin } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { PaisGeneralStore } from '../../../store/external/pais/pais.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { APP_FORM_VALIDATOR, APP_CLOSE_MODAL } from '@lic/core';
const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la información?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de la información?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};

@Component({
  selector: 'app-app-form-nodocente',
  templateUrl: './app-form-nodocente.component.html',
  styleUrls: ['./app-form-nodocente.component.scss']
})
export class AppFormNodocenteComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalMaestroNoDocente>;
  store: MaestroPersonaStore;
  state$: Observable<IModalMaestroNoDocente>;
  subscriptions: Subscription[];
  validators: any;
  documentoMaxlength = 0;
  disableDocumentoNumberOnly = false;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<AppFormNodocenteComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeEnumerado: EnumeradoGeneralStore,
    private paisGeneralStore: PaisGeneralStore,
    private storeCurrent: AppCurrentFlowStore
  ) { }


  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalMaestroNoDocente), distinctUntilChanged());
    this.contextProcedimiento();
    this.modoTypeoModal();
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    this.loadCombos();
  }
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.maestroNoDocenteModalActions.setInit(current.idVersionSolicitud);
  }
  private loadCombos = () => {
    forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDSEXO'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDTIPODOCUMENTO'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDGRADOACADEMICO_NODOCENTE'),
      this.paisGeneralStore.paisActions.asyncGetPaisTodos()
    ).pipe(tap(enums => {
      this.store.maestroNoDocenteModalActions.asyncFetchCombos(enums);
    })).subscribe();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs = this.store.state$.pipe(map(x => x.modalMaestroNoDocente.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs];
  }
  private buildForm = () => {
    const { form, type } = this.store.state.modalMaestroNoDocente;
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
    const { type } = this.store.state.modalMaestroNoDocente;
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
  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormMaestroPersona> => {
    return this.store.maestroNoDocenteModalActions.asynUpdate(formValue).pipe(tap(response => {
      this.dialogRef.close();
      this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
    }));
  }
  handleSave = (formValue: any, options: ISubmitOptions): Observable<IFormMaestroPersona> => {
    return this.store.maestroNoDocenteModalActions.asynSave(formValue)
      .pipe(tap(reponse => {
        this.dialogRef.close();
        this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
      }));
  }
  private handleValidateOnSave = (): boolean => {
    if (this.form.valid) {
      return true;
    }
    return false;
  };
  handleInputChange = (obj, val) => {

  };
  // handleInputChangeTipoDocumento = (obj, val) => {
  //   //this.form.get('descripcionTipoDocumento').value = obj.selected.text;
  //   this.form.get('numeroDocumento').value = '';
  //   this.disableDocumentoNumberOnly = true;
  //   this.documentoMaxlength = 11;
  //   if (TIPODOCUMENTO.DNI == obj.selected.value) {
  //     this.disableDocumentoNumberOnly = false;
  //     this.documentoMaxlength = 8;
  //   }
  // }

  handleInputChangeTipoDocumento = (obj, val) => {    
    //this.form.get('descripcionTipoDocumento').value = obj.selected.text;
    this.form.get('numeroDocumento').value = '';
    this.disableDocumentoNumberOnly = true;
    this.documentoMaxlength = 12;
    if (TIPODOCUMENTO.DNI == obj.selected.value) {
      this.disableDocumentoNumberOnly = false;
      this.documentoMaxlength = 8;  
      this.form.get('numeroDocumento').setValidator([Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_DNI))]);   
    } 
    if (TIPODOCUMENTO.CE == obj.selected.value) {
      this.disableDocumentoNumberOnly = true;
      this.documentoMaxlength = 12;  
      this.form.get('numeroDocumento').setValidator([Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_CE))]);   
    }
  }
  handleInputChangeMayorGrado = (obj, val) => {
    this.form.get('noDocente.descripcionGradoAcademicoMayor').value = obj.selected.text;
  }
  modoTypeoModal = () => {
    const { type, codigoMaestroPersona } = this.store.state.modalMaestroNoDocente;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.maestroNoDocenteModalActions.asynFetch(codigoMaestroPersona)
        .pipe(
          tap(response => {
            this.store.maestroNoDocenteModalActions.loadDataEdit(response);
            const tipo = this.form.get('tipoDocumentoEnum').value;
            this.disableDocumentoNumberOnly = true;
            this.documentoMaxlength = 12;
            if (TIPODOCUMENTO.DNI == tipo) {
              this.disableDocumentoNumberOnly = false;
              this.documentoMaxlength = 8;  
              this.form.get('numeroDocumento').setValidator([Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_DNI))]);   
            } 
            if (TIPODOCUMENTO.CE == tipo) {
              this.disableDocumentoNumberOnly = true;
              this.documentoMaxlength = 12;  
              this.form.get('numeroDocumento').setValidator([Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_CE))]);   
            }
          })).subscribe();
    }
  }
  buildValidations = () => {
    this.validators = {
      apellidoMaterno: [Validators.required, Validators.maxLength(250), Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NOMBRES_APELLIDOS))],
      apellidoPaterno: [Validators.required, Validators.maxLength(250), Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NOMBRES_APELLIDOS))],
      nombres: [Validators.required, Validators.maxLength(250), Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NOMBRES_APELLIDOS))],
      tipoSexoEnum: [Validators.required],
      tipoDocumentoEnum: [Validators.required],
      numeroDocumento: [Validators.required],
      codigoNacionalidad: [Validators.required],
      ['noDocente.denominacionPuesto']: [Validators.required],
      ['noDocente.tipoGradoAcademicoMayorEnum']: [Validators.required]
    };
  }
  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalMaestroNoDocente;
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
  get connectionResult() { return NIVELPROGRAMA; }
  handleInputNivelesProgramaChange = (obj, val) => {
    const elementos: Array<number> = this.form.get('noDocente.idNivelProgramas').value;
    this.form.get('noDocente.idNivelProgramas').setValue(obj.value ? [...elementos, val] : elementos.filter(item => item != val));
  }
}
