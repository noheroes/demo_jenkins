import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators, IDataGridButtonEvent, ComboList } from '@sunedu/shared';
import { IModalGradoAcademico, IFormGradoAcademico, IFormMaestroPersona, TIPO_AUTPORIZACION_ENTIDAD, ESTADO_VIGENCIA_ENTIDAD } from '../../../store/maestropersona/maestropersona.store.interface';
import { MaestroPersonaStore } from '../../../store/maestropersona/maestropersona.store';
import { Observable, Subscription, from, forkJoin } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { map, distinctUntilChanged, tap, concatMap } from 'rxjs/operators';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { PaisGeneralStore } from '../../../store/external/pais/pais.store';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { EntidadGeneralStore } from '../../../store/external/entidad/entidad.store';
import { APP_FORM_VALIDATOR, APP_CLOSE_MODAL } from '@lic/core';
const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR el grado académico?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro del grado académico?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};

@Component({
  selector: 'app-app-form-gradoacademico',
  templateUrl: './app-form-gradoacademico.component.html',
  styleUrls: ['./app-form-gradoacademico.component.scss']
})
export class AppFormGradoacademicoComponent implements OnInit, OnDestroy {

  formType = FormType;
  form: FormModel<IModalGradoAcademico>;
  store: MaestroPersonaStore;
  state$: Observable<IModalGradoAcademico>;
  subscriptions: Subscription[];
  validators: any;
  esBachiller: boolean = true;
  esGradoNacional: boolean = true;
  mostrarUnivGrado: boolean = true;
  esTitulado: boolean = true;
  esTituloNacional: boolean = true;
  mostrarUnivTitulo: boolean = true;
  nombre_docente : string;
  gradoSeleccionado: boolean = true;
  textoCodigoPaisGrado:string;
  textoMencion:string;
  //get diagnostic() { return JSON.stringify(this.form.model); }
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<AppFormGradoacademicoComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore,
    private paisGeneralStore: PaisGeneralStore,
    private storeEnumerado: EnumeradoGeneralStore,
    private entidadGeneralStore: EntidadGeneralStore
  ) { }

  async ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalGradoAcademico), distinctUntilChanged());
    this.contextProcedimiento();
    this.buildValidations();
    this.buildForm();
    await this.loadConfiguracion();
  }


  private async loadConfiguracion() {
    this.store.state.modalGradoAcademico.isLoading = true;
    let promises: any[] = [];

    // const action3 = await this.buildValidations();
    // promises.push(action3);
    // const action4 = await this.buildForm();
    // promises.push(action4);    
    const action7 = await this.loadCombos();
    promises.push(action7);
    const action0 = await this.modoTypeoModal();
    promises.push(action0);
    const action5 = await this.subscribeToState();
    promises.push(action5);

    await Promise.all(promises).then(() => { this.store.state.modalGradoAcademico.isLoading = false; });
  }

  private loadCombos = () => {
    forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_TIPOGRADO'),
      this.entidadGeneralStore.entidadActions.asyncGetEntidad(TIPO_AUTPORIZACION_ENTIDAD.VIGENTES, ESTADO_VIGENCIA_ENTIDAD.LICENCIADA),
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENUM_IDTIPORESPUESTA'),
      this.paisGeneralStore.paisActions.asyncGetPaisTodos()
    ).pipe(
      tap(enums => {
        this.store.gradoAcademicoModalActions.asyncFetchCombos(enums);
      })
    ).subscribe();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs = this.store.state$.pipe(map(x => x.modalGradoAcademico.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs];
  }
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.gradoAcademicoModalActions.setInit(current.idVersionSolicitud);
  }

  private buildForm = () => {
    const { form, type } = this.store.state.modalGradoAcademico;
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
    const { type } = this.store.state.modalGradoAcademico;
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
  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormGradoAcademico> => {
    formValue['esTitulado'] = (formValue.esTitulado == '' || formValue.esTitulado == null) ? '' : formValue.esTitulado == '1' ? true : false;
    return this.store.gradoAcademicoModalActions.asynUpdate(formValue)
      .pipe(tap(response => {
        this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
        this.dialogRef.close();
      }));

  }
  handleSave = (formValue: any, options: ISubmitOptions): Observable<IFormGradoAcademico> => {
    formValue['esTitulado'] = (formValue.esTitulado == '' || formValue.esTitulado == null) ? '' : formValue.esTitulado == '1' ? true : false;
    return this.store.gradoAcademicoModalActions.asynUpdate(formValue)
      .pipe(tap(reponse => {
        this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
        this.dialogRef.close();
      }));
  }
  private handleValidateOnSave = (): boolean => {
    if (this.form.valid) {
      return true;
    }
    return false;
  }
  handleInputChange = (event) => {
    if (event.value == null) return;
    const current = this.storeCurrent.currentFlowAction.get();
    switch (event.name) {
      case "tipoMencionEnum":
        {
          if (event.selected.value != 1) {
            this.esBachiller = true;
            this.form.get('esTitulado').setValue('');
            this.form.get('denominacionTitulo').setValue('');
            this.form.get('codigoPaisTitulo').setValue('');
            this.form.get('institucionTitulo').setValue('');
            this.form.get('codigoUniversidadTitulo').setValue('');
            this.form.get('esTitulado').setValidator(null);
            this.form.clearErrors(['esTitulado']);
          } else { 
            this.esBachiller = false; 
            this.form.get('esTitulado').setValidator([Validators.required]);
          }
          this.gradoSeleccionado = false;
          if(event.selected.value == 4){
            this.textoCodigoPaisGrado = "País en el que se otorgó el título";
            this.textoMencion = "Denominación del título"
          }else{
            this.textoCodigoPaisGrado = "País en el que se otorgó el grado";
            this.textoMencion = "Denominación del grado"
          }
        }
        break;
      case "codigoPaisGrado":
        {
          if (event.selected.value == current.frontSettings.codigoPais) {
            this.esGradoNacional = true;
            this.mostrarUnivGrado = false;
            this.form.get('institucionGrado').setValidator(null);
            this.form.get('resolucionSunedu').setValidator(null);
            this.form.clearErrors(['institucionGrado', 'resolucionSunedu']);
            this.form.get('codigoUniversidadGrado').setValue('');
          } else {
            this.esGradoNacional = false;
            this.mostrarUnivGrado = true;
            this.form.get('institucionGrado').setValidator([Validators.required, Validators.maxLength(100)]);
            this.form.get('resolucionSunedu').setValidator([Validators.required, Validators.maxLength(100),Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NUM_RESOLUCION))]);
            this.form.get('institucionGrado').setValue('');
            this.form.get('resolucionSunedu').setValue('');
          }
        }
        break;
      case "esTitulado":
        {
          if (event.selected.value == "1") {
            this.esTitulado = false;
            this.esTituloNacional = true;
            this.form.get('denominacionTitulo').setValidator([Validators.required, Validators.maxLength(100)]);
            this.form.get('codigoPaisTitulo').setValidator([Validators.required]);
          } else {
            this.esTitulado = true;
            this.form.get('denominacionTitulo').setValue('');
            this.form.get('codigoPaisTitulo').setValue('');
            this.form.get('institucionTitulo').setValue('');
            this.form.get('codigoUniversidadTitulo').setValue('');
            this.form.get('denominacionTitulo').setValidator(null);
            this.form.get('codigoPaisTitulo').setValidator(null);
            this.form.clearErrors(['codigoPaisTitulo', 'denominacionTitulo']);
          }
        }
        break;
      case "codigoPaisTitulo":
        {
          if (event.selected.value == current.frontSettings.codigoPais) {
            this.esTituloNacional = true;
            this.mostrarUnivTitulo = false;
            this.form.get('institucionTitulo').setValidator(null);
            this.form.clearErrors(['institucionTitulo']);
            this.form.get('institucionTitulo').setValue('');
          } else {
            this.esTituloNacional = false;
            this.mostrarUnivTitulo = true;
            this.form.get('institucionTitulo').setValidator([Validators.required, Validators.maxLength(100)]);
            this.form.get('codigoUniversidadTitulo').setValue('');
          }
        }
        break;
      default:
        break;
    }
  }

  modoTypeoModal = () => {
    const { type, gradoAcademico } = this.store.state.modalGradoAcademico;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.gradoAcademicoModalActions.asynFetch(gradoAcademico)
        .pipe(
          tap(response => {
            this.store.gradoAcademicoModalActions.loadData(response);
            this.handleEditar(gradoAcademico);
            //this.store.gradoAcademicoModalActions.asyncFetchPage().subscribe();
          })).subscribe();
    }
  }
  buildValidations = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    return new Promise(
      (resolve) => {
        this.validators = {
          tipoMencionEnum: [Validators.required],
          mencion: [Validators.required, Validators.maxLength(100)],
          codigoPaisGrado: [Validators.required],
          institucionGrado: [],
          codigoUniversidadGrado: [Validators.requiredIf({ codigoPaisGrado: current.frontSettings.codigoPais })],
          resolucionSunedu: [Validators.maxLength(20), Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NUM_RESOLUCION))],
          denominacionTitulo: [Validators.maxLength(100)],
          institucionTitulo: [],
          codigoUniversidadTitulo: [Validators.requiredIf({ codigoPaisTitulo: current.frontSettings.codigoPais })],

        };
        resolve();
      });
  }
  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalGradoAcademico;
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

  handleEditar = (item: any) => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.form.get('id').setValue(item.id);
    this.form.get('tipoMencionEnum').setValue(item.tipoMencionEnum);
    if (item.tipoMencionEnum != 1) {
      this.esBachiller = true;
    } else { this.esBachiller = false; }
    this.form.get('mencion').setValue(item.mencion);
    this.form.get('codigoPaisGrado').setValue(item.codigoPaisGrado);
    if (item.codigoPaisGrado == current.frontSettings.codigoPais) {
      this.esGradoNacional = true;
      this.mostrarUnivGrado = false;
    } else {
      this.esGradoNacional = false;
      this.mostrarUnivGrado = true;
    }
    this.form.get('codigoUniversidadGrado').setValue(item.codigoUniversidadGrado);
    this.form.get('institucionGrado').setValue(item.institucionGrado);
    this.form.get('resolucionSunedu').setValue(item.resolucionSunedu);
    this.form.get('esTitulado').setValue(item.esTitulado ? 1 : typeof (item.esTitulado) == 'undefined' ? 0 : 2);
    if (item.esTitulado == "1") {
      this.esTitulado = false;
    } else {
      this.esTitulado = true;
    }
    this.form.get('denominacionTitulo').setValue(item.denominacionTitulo);
    this.form.get('codigoPaisTitulo').setValue(item.codigoPaisTitulo);
    if (item.codigoPaisTitulo == current.frontSettings.codigoPais) {
      this.esTituloNacional = true;
      this.mostrarUnivTitulo = false;
    } else {
      this.esTituloNacional = false;
      this.mostrarUnivTitulo = true;
    }
    this.form.get('codigoUniversidadTitulo').setValue(item.codigoUniversidadTitulo);
    this.form.get('institucionTitulo').setValue(item.institucionTitulo);
  }


  limpiarControles = () => {
    this.form.get('tipoMencionEnum').setValue('');
    this.form.get('mencion').setValue('');
    this.form.get('codigoPaisGrado').setValue('');
    this.form.get('codigoUniversidadGrado').setValue('');
    this.form.get('institucionGrado').setValue('');
    this.form.get('resolucionSunedu').setValue('');
    this.form.get('esTitulado').setValue('');
    this.form.get('denominacionTitulo').setValue('');
    this.form.get('codigoPaisTitulo').setValue('');
    this.form.get('institucionTitulo').setValue('');
  }
}



