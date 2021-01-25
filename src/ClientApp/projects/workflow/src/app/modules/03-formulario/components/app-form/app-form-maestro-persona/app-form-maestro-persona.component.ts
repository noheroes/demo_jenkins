import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators, NoWhitespaceValidator } from '@sunedu/shared';
import { IModalMaestroPersona, IFormMaestroPersona, NIVELPROGRAMA, TIPODOCUMENTO } from '../../../store/maestropersona/maestropersona.store.interface';
import { MaestroPersonaStore } from '../../../store/maestropersona/maestropersona.store';
import { Subscription, Observable, from, forkJoin } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { PaisGeneralStore } from '../../../store/external/pais/pais.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit, APP_FORM_VALIDATOR, APP_CLOSE_MODAL } from '@lic/core';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la persona?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de la persona?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};

@Component({
  selector: 'app-form-maestro-persona',
  templateUrl: './app-form-maestro-persona.component.html',
  styleUrls: ['./app-form-maestro-persona.component.scss']
})
export class AppFormMaestroPersonaComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalMaestroPersona>;
  store: MaestroPersonaStore;
  state$: Observable<IModalMaestroPersona>;
  subscriptions: Subscription[];
  validators: any;
  documentoMaxlength = 0;
  disableDocumentoNumberOnly = false;
  fechaInicioContratacion_MinDate : any;
  fechaInicioContratacion_MaxDate : any;
  fechaFinContratacion_MinDate : any;
  fechaFinContratacion_MaxDate : any;
  conRENACYTno:boolean;
  nivelRENACYTDisabled:boolean;
  clasificacionRENACYTDisabled:boolean;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;
  constructor(
    public dialogRef: MatDialogRef<AppFormMaestroPersonaComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeEnumerado: EnumeradoGeneralStore,
    private paisGeneralStore: PaisGeneralStore,
    private storeCurrent: AppCurrentFlowStore

  ) { }
  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalMaestroPersona), distinctUntilChanged());
    this.contextProcedimiento();
    this.buildForm();
    this.modoTypeoModal();
    this.buildValidations();
    this.subscribeToState();
    this.loadCombos();
    this.initControlesFechasContratacion();
  }
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.maestroPersonaModalActions.setInit(current.idVersionSolicitud);
  }

  private loadCombos = () => {
    forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDSEXO'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDTIPODOCUMENTO'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDTIPOCATEGORIADOCENTE'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENUM_IDTIPOREGIMENDEDICACION'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENUM_IDTIPORESPUESTA'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDGRADOACADEMICO'),
      this.paisGeneralStore.paisActions.asyncGetPaisTodos(),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_RENACYT_GRUPO'),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_RENACYT_NIVEL'),
    ).pipe(tap(enums => {
      this.store.maestroPersonaModalActions.asyncFetchCombos(enums);
    })).subscribe();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  initControlesFechasContratacion(): void {
    let hoy = new Date();
    let anioActual = hoy.getFullYear();
    let fechaActualMenos100Anios = new Date();
    fechaActualMenos100Anios.setFullYear(anioActual - 100);
    this.fechaInicioContratacion_MinDate = fechaActualMenos100Anios;
    this.fechaInicioContratacion_MaxDate = new Date();
  }
  handleChangeInput = (e) => {
    if (e.name == "docente.fechaInicioContrato") {
      this.form.get('docente.fechaFinContrato').setValue('');
      this.form.get('docente.fechaFinContrato').disabled = false;
      let fechaInicioContrato = new Date(e.value);
      this.fechaFinContratacion_MinDate = new Date(fechaInicioContrato.getFullYear(), fechaInicioContrato.getMonth(), fechaInicioContrato.getDate() + 1);
      this.fechaFinContratacion_MaxDate = new Date(fechaInicioContrato.getFullYear()+100, fechaInicioContrato.getMonth(), fechaInicioContrato.getDate() + 1);

    }

  }
  subscribeToState = () => {
    const subs = this.store.state$.pipe(map(x => x.modalMaestroPersona.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs];
  }
  private buildForm = () => {
    const { form, type } = this.store.state.modalMaestroPersona;
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
    const { type } = this.store.state.modalMaestroPersona;
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
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setUpdate(formValue);
    return this.store.maestroPersonaModalActions.asynUpdateMaestroPersona(formValue)
      .pipe(tap(response => {
        this.dialogRef.close();
        this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
      }));
  }
  handleSave = (formValue: any, options: ISubmitOptions): Observable<IFormMaestroPersona> => {
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setInsert(formValue);
    
    return this.store.maestroPersonaModalActions.asynSaveMaestroPersona(formValue)
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
  handleInputChange = ({ name, value }) => {
    switch (name) {
      case "docente.conRENACYTEnum":        
        if(value==2){
          this.conRENACYTno = true;
          this.form.get('docente.grupoRENACYTEnum').setValue('');
          this.form.get('docente.nivelRENACYTEnum') .setValue('');
          this.clasificacionRENACYTDisabled=true;
          this.form.get('docente.grupoRENACYTEnum').setValidator([Validators.requiredIf({ 'docente.conRENACYTEnum': 1 })]);
          this.form.get('docente.nivelRENACYTEnum').setValidator([Validators.requiredIf({ 'docente.conRENACYTEnum': 1 })]);
        }else{
          this.conRENACYTno = false;
          this.form.get('docente.grupoRENACYTEnum').setValue('');
          this.form.get('docente.nivelRENACYTEnum').setValue('');
          this.form.get('docente.grupoRENACYTEnum').setValidator([Validators.required]);
          this.form.get('docente.nivelRENACYTEnum').setValidator([Validators.required]);
          this.clasificacionRENACYTDisabled=false;
        }
        break;
      case "docente.grupoRENACYTEnum":
        this.form.get('docente.nivelRENACYTEnum').setValue('');
        this.nivelRENACYTDisabled=false;
        
        this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_RENACYT_NIVEL').then(
          values=>{
            this.store.maestroPersonaModalActions.SetNivelRENACYT(
              this.form.get('docente.grupoRENACYTEnum').value,
              values
              );
          });
        break;
      default:
        break;
    }
  }
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
    this.form.get('docente.descripcionGradoAcademicoMayor').value = obj.selected.text;
  }
  handleInputNivelesProgramaChange = (obj, val) => {
    const elementos: Array<number> = this.form.get('docente.idNivelProgramas').value;
    this.form.get('docente.idNivelProgramas').setValue(obj.value ? [...elementos, val] : elementos.filter(item => item != val));
  }
  modoTypeoModal = () => {
    
    const { type, codigoMaestroPersona } = this.store.state.modalMaestroPersona;
    this.form.get('docente.fechaFinContrato').disabled = true;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.maestroPersonaModalActions.asynFetchMaestroPersona(codigoMaestroPersona)
        .pipe(
          tap(response => {
            this.store.maestroPersonaModalActions.loadDataEdit(response);
            if(response.docente.conRENACYTEnum == "1")
              {
                this.conRENACYTno = false;
                this.nivelRENACYTDisabled=false;
              }
            else
            {
              this.conRENACYTno = true;
              this.nivelRENACYTDisabled=false;
            }
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
      ['docente.anioCategoria']: [Validators.number],
      ['docente.tipoGradoAcademicoMayorEnum']: [Validators.required],
      ['docente.tipoCategoriaDocenteEnum']: [Validators.required],
      ['docente.tipoRegimenDedicatoriaEnum']: [Validators.required],
      ['docente.conActividadInvestigacionEnum']: [Validators.required],
      ['docente.conRENACYTEnum']: [Validators.required],
      ['docente.grupoRENACYT']: [Validators.requiredIf({ '[docente].[conRENACYTEnum]': 1 })],
      ['docente.nivelRENACYT']: [Validators.requiredIf({ "docente.conRENACYTEnum": 1 })],
      ['docente.comentario']: [Validators.maxLength(500)],

    };
  }
  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalMaestroPersona;
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
  onlyLettersSpace = (formValue, fieldName, value, fieldLabel, customMsg) => {
    return {
      msg: customMsg || `El campo ${fieldLabel || fieldName} sólo permite caracteres`,
      valid:
        value != null &&
        value != undefined && /^[áéíóúÁÉÍÓÚA-Za-z\s]+$/.test(value)
    };
  }
}


