import { Component, OnInit, Input } from '@angular/core';
import { CargaMasivaStore } from './../../../store/cargamasiva/cargamasiva.store';
import { IFormularioModel } from '@lic/core';
import {
  IDataGridButtonEvent,
  FormModel,
  Validators,
  FormType,
  ISubmitOptions,
  AlertService,
  DialogService,
} from '@sunedu/shared';
import { IBuscardorCargaMasiva } from '../../../store/cargamasiva/cargamasiva.store.interface';
import { Observable, of, from, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppFormActividadComponent } from '../../app-form/app-form-actividad/app-form-actividad.component';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la información?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR la información?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente',
  ERROR_SAVE_SUCCES: 'Ocurrio un problema al registrar',
};
@Component({
  selector: 'app-container-cargamasiva',
  templateUrl: './app-container-cargamasiva.component.html',
  styleUrls: ['./app-container-cargamasiva.component.scss'],
  providers: [CargaMasivaStore],
})
export class AppContainerCargamasivaComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  readonly state$ = this.store.state$;
  form: FormModel<IBuscardorCargaMasiva>;
  validators: any;
  formType = FormType;
  idArchivo: string = '';
  nombreArchivo: string;
  tipoCargaEnum: string = '';
  tipoCargaDescripcion: string;
  ocultarDescarga: boolean = true;

  constructor(
    private store: CargaMasivaStore,
    private alert: AlertService,
    private dialog: DialogService,
    private storeCurrent: AppCurrentFlowStore,
    private storeEnumerado: EnumeradoGeneralStore
  ) {}

  ngOnInit() {
    this.buildForm();
    const current = this.storeCurrent.currentFlowAction.get();
    this.contextProcedimiento();
    this.store.cargaMasivaBuscadorActions.asyncFetchPageCargaMasiva();
    this.loadCombos();
  }

  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.cargaMasivaBuscadorActions.setInit(current.idVersionSolicitud);
  };

  private loadCombos = () => {
    forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDTIPOCARGAMASIVA')
    ).pipe(tap(enums => {
      this.store.cargaMasivaBuscadorActions.asyncFetchCombos(enums);
    })).subscribe();
  }

  private openModalConsultar = (idTarea: string) => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.cargaMasivaActividadBuscadorActions.setModalConsultar(
      current.idVersionSolicitud,
      idTarea
    );
    const dialogRef = this.dialog.openMD(AppFormActividadComponent);
    dialogRef.componentInstance.store = this.store;
    this.store.cargaMasivaActividadBuscadorActions
      .asyncFetchPageActividad()
      .subscribe();
    dialogRef
      .afterClosed()
      .pipe(
        tap((resonponse) =>
          this.store.cargaMasivaActividadBuscadorActions.resetModal()
        )
      )
      .subscribe();
  };

  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'DESCARGAR':
        this.store.cargaMasivaBuscadorActions.asyncDownLoadFile(
          `${e.item.nombreArchivo}`,
          false,
          `${e.item.idArchivoTemporal}`
        );
        break;
    }
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultar(e.item.id);
        break;
    }
  };
  private buildForm = () => {
    const { formBuscar, type } = this.store.state.buscadorCargaMasiva;
    this.buildValidations();
    this.form = new FormModel<any>(type, formBuscar, this.validators, {
      beforeSubmit: this.beforeSubmit,
      onSave: this.handleSave,
      disableOnGet: true,
      disableOnSave: false,
      validateOnSave: this.handleValidateOnSave,
      confirmOnSave: this.handleConfirmOnSave,
    });
  };
  
  buildValidations = () => {
    this.validators = {
      tipo: [Validators.required],
    };
  };

  handleInputChange = (obj, val) => {
    if (obj.value == null) {
      this.tipoCargaEnum = '';
      this.tipoCargaDescripcion = '';
      this.ocultarDescarga = true;
      return;
    }
    this.tipoCargaEnum = obj.selected.value;
    this.tipoCargaDescripcion = obj.selected.text;
    this.ocultarDescarga = false;
  };

  handleConfirmOnSave = () => {
    const { type } = this.store.state.buscadorCargaMasiva;
    const MESSAGE =
      type === FormType.REGISTRAR
        ? MESSAGES.CONFIRM_SAVE
        : MESSAGES.CONFIRM_UPDATE;
    return this.alert.open(MESSAGE, null, {
      confirm: true,
    });
  };

  handleSubmit = () => {
    this.form.submit();
  };

  beforeSubmit = () => {};

  handleSave = (form: any, options: ISubmitOptions): Observable<any> => {
    return of();
  };

  validateSaveCargaMasiva = (): boolean => {
    var resp = true;
    var mensajeValidacion = '';

    if (this.tipoCargaEnum == '') {
      mensajeValidacion =
        mensajeValidacion + `Ingrese el tipo de carga masiva a procesar.`;
      resp = false;
    }
    if (this.idArchivo == '') {
      mensajeValidacion =
        mensajeValidacion + `\nNo cargo el archivo a procesar.`;
      resp = false;
    }
    if (!resp) {
      this.alert.open(mensajeValidacion, 'Mensaje de validación', {
        confirm: false,
        icon: 'warning',
      });
    }
    return resp;
  };

  handleSaveCargaMasiva = () => {
    
    if (this.validateSaveCargaMasiva()) {
      this.alert
        .open(
          '¿Está seguro de que desea grabar los datos generales?',
          'Confirmación',
          { confirm: true }
        )
        .then((confirm) => {
          if (confirm) {
            var formValue = {};
            formValue['tipoCargaEnum'] = this.tipoCargaEnum;
            formValue['tipoCargaDescripcion'] = this.tipoCargaDescripcion;
            formValue['idArchivoTemporal'] = this.idArchivo;
            formValue['nombreArchivo'] = this.nombreArchivo;
            this.store.cargaMasivaBuscadorActions
              .asynSaveTarea(formValue)
              .then((response: any) => {
                if (response.success) {
                  this.store.cargaMasivaBuscadorActions.asyncFetchPageCargaMasiva();
                  this.limpiarControles();
                  this.alert.open(MESSAGES.CONFIRM_SAVE_SUCCES, null, {
                    icon: 'success',
                  });
                } else {
                  this.alert.open(MESSAGES.ERROR_SAVE_SUCCES, null, {
                    icon: 'warning',
                  });
                }
              });
          }
        });
    }
  };  

  limpiarControles = () => {
    this.form.get('tipo').setValue(0);
    this.store.cargaMasivaBuscadorActions.clearDataArchivo();
    this.idArchivo = '';
    this.ocultarDescarga = true;
  }

  handleRefrescarGrilla = () => {
    this.store.cargaMasivaBuscadorActions.asyncFetchPageCargaMasiva();
  };

  handleSubmitDownload = () => {
    this.store.cargaMasivaBuscadorActions.asyncDownLoadFile(
      `${this.tipoCargaDescripcion}.xlsx`,
      true,
      ''
    );
  };

  private handleValidateOnSave = (): boolean => {
    if (this.form.valid) {
      return true;
    }
    return false;
  };

  //Gestor de archivos
  configFile: any = {
    tiposPermitidos: '.xlsx,.xls',
    pesoMaximoEnMB: 50,
    puedeCargarArchivo: true,
    puedeDescargarArchivo: false,
    puedeVerHistorialArchivo: false,
    usarBorradores: false,
    preservarNombreArchivo: false,
    puedeEliminarArchivo: false,
    puedeVerTags: false,
    puedeEditarTags: false,
    version: 0, // OJO CAYL version de archivo verificar.
  };

  archivo(e) {
    this.idArchivo = e.idArchivo;
    this.nombreArchivo = e.nombreArchivo;
  }
}
