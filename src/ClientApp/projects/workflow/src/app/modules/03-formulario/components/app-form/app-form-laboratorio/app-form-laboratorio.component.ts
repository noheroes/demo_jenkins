import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators, ComboList } from '@sunedu/shared';
import { Subscription, Observable, from } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { IFormLaboratorio, IEntidadLaboratorio } from '../../../store/laboratorio/laboratorio.store.interface';
import { LaboratorioStore } from '../../../store/laboratorio/laboratorio.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit, APP_CLOSE_MODAL } from '@lic/core';
const MESSAGES = {
    CONFIRM_SAVE: '¿Está seguro de GUARDAR el laboratorio?',
    CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de laboratorio?',
    CONFIRM_SAVE_SUCCES: 'El registro de laboratorio se guardo correctamente',
    CONFIRM_UPDATE_SUCCES: 'El registro de laboratorio se actualizó correctamente'
  };

@Component({
    selector: 'app-form-laboratorio',
    templateUrl: './app-form-laboratorio.component.html',
    styleUrls: ['./app-form-laboratorio.component.scss']
})
export class AppFormLaboratorioComponent implements  OnInit, OnDestroy {
    formType = FormType;
    form: FormModel<IFormLaboratorio>;
    store: LaboratorioStore;
    state$: Observable<IFormLaboratorio>;
    subscriptions: Subscription[];
    validators: any;
    readonly CLOSE_MODAL = APP_CLOSE_MODAL;
    // Enumerados
    tipoLaboratorios= new ComboList([]); //tipoLaboratorioEnum
    constructor(
      public dialogRef: MatDialogRef<AppFormLaboratorioComponent>,
      private toast: ToastService,
      private alert: AlertService,
      private storeEnumerado:EnumeradoGeneralStore,
      private storeCurrent: AppCurrentFlowStore
    ) { }

    private async loadConfiguracion(){
      this.store.state.bandejaLaboratorio.isLoading=true;
      let promises: any[] = [];
      const action1 = await this.buildEnumerados();
      promises.push(action1);
      await Promise.all(promises).then(()=>{this.store.state.bandejaLaboratorio.isLoading=false;});
    }
    private buildEnumerados = () =>{
      return new Promise<void>(
        (resolve)=>{
          this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENUM_IDTIPOLABORATORIO')
            .then(info=>{
              this.tipoLaboratorios = info;
              //console.log(info);
            });
          resolve();
        });
    }
    async ngOnInit() {
      this.state$ = this.store.state$.pipe(map(x => x.formLaboratorio), distinctUntilChanged());

      this.contextProcedimiento();
      this.buildForm();
      this.buildValidations();
      await this.loadConfiguracion();
      this.subscribeToState();
      this.modoTypeoModal();
    }

    private contextProcedimiento = () => {
      const current = this.storeCurrent.currentFlowAction.get();
      this.store.laboratorioFormActions.setInit(current.idVersionSolicitud);
    }

    ngOnDestroy(): void {
      this.subscriptions.forEach(x => {
        x.unsubscribe();
      });
    }
    subscribeToState = () => {
      const subs = this.store.state$.pipe(map(x => x.formLaboratorio.form), distinctUntilChanged())
        .subscribe(x => {
          this.form.patchValue(x);
        });
      this.subscriptions = [subs];
    }
    private buildForm = () => {
      const { form, type } = this.store.state.formLaboratorio;
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
      const { type } = this.store.state.formLaboratorio;
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
    handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IEntidadLaboratorio> => {
      return from(new Promise((resolve, reject) => {
        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setUpdate(formValue);
        this.store.laboratorioFormActions.asynUpdateLaboratorio(formValue).pipe(tap(response => {
          this.dialogRef.close();
          this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
        }, error => {
          this.form.enable();
        })).subscribe();
      }));
    }
    handleSave = (formValue: any, options: ISubmitOptions): Observable<IEntidadLaboratorio> => {
      return from(new Promise((resolve, reject) => {
        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setInsert(formValue);
        this.store.laboratorioFormActions.asynSaveLaboratorio(formValue)
          .pipe(tap(reponse => {
            this.dialogRef.close();
            this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
          }, error => {
            this.form.enable();
          }))
          .subscribe();
      }));
    }
    private handleValidateOnSave = (): boolean => {
      if (this.form.valid) {
        return true;
      }
      return false;
    };
    handleInputChange = ({ name, value }) => {
    };
    modoTypeoModal = () => {
      const { type, codigoLaboratorio } = this.store.state.formLaboratorio;
      this.form.get('codigoLocal').setValue(this.store.state.formLaboratorio.codigoLocal);
      if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
        this.store.laboratorioFormActions.asynFetchLaboratorio(codigoLaboratorio)
          .pipe(
            tap(response => {
              this.form.get('codigo').disabled = true;
              this.store.laboratorioFormActions.loadDataLaboratorio(response);
            })).subscribe();
      }
    }
    buildValidations = () => {
      this.validators = {
        nombre: [Validators.required],
        tipoLaboratorioTallerEnum: [Validators.required],
        aforo: [Validators.required, Validators.number],
        comentario: [Validators.maxLength(500)]
      };
    }
    handleSubmit = () => {
      this.form.submit();
    }

    handleClose = () => {
      const { type } = this.store.state.formLaboratorio;
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
  }
