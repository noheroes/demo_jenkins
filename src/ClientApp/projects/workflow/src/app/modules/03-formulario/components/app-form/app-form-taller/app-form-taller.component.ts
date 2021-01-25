import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators, ComboList } from '@sunedu/shared';
import { Subscription, Observable, from } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { IFormTaller, IEntidadTaller } from '../../../store/taller/taller.store.interface';
import { TallerStore } from '../../../store/taller/taller.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit, APP_CLOSE_MODAL } from '@lic/core';
const MESSAGES = {
    CONFIRM_SAVE: '¿Está seguro de GUARDAR el taller?',
    CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de taller?',
    CONFIRM_SAVE_SUCCES: 'El registro de taller se guardo correctamente',
    CONFIRM_UPDATE_SUCCES: 'El registro de taller se actualizó correctamente'
  };

@Component({
    selector: 'app-form-taller',
    templateUrl: './app-form-taller.component.html',
    styleUrls: ['./app-form-taller.component.scss']
})
export class AppFormTallerComponent implements  OnInit, OnDestroy {
    formType = FormType;
    form: FormModel<IFormTaller>;
    store: TallerStore;
    state$: Observable<IFormTaller>;
    subscriptions: Subscription[];
    validators: any;
    // Enumerados
    tipoTallerEnum= new ComboList([]);
    readonly CLOSE_MODAL = APP_CLOSE_MODAL;
    constructor(
      public dialogRef: MatDialogRef<AppFormTallerComponent>,
      private toast: ToastService,
      private alert: AlertService,
      private storeEnumerado:EnumeradoGeneralStore,
      private storeCurrent: AppCurrentFlowStore
    ) { }
    private async loadConfiguracion(){
      this.store.state.formTaller.isLoading=true;
      let promises: any[] = [];
      const action1 = await this.buildEnumerados();
      promises.push(action1);
      await Promise.all(promises).then(()=>{this.store.state.formTaller.isLoading=false;});
    }
    private buildEnumerados = () =>{
      return new Promise(
        (resolve)=>{
          this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENUM_IDTIPOTALLER')
            .then(info=>{
              this.tipoTallerEnum = info;
            });
          resolve();
        });
    }
    async ngOnInit() {
      this.state$ = this.store.state$.pipe(map(x => x.formTaller), distinctUntilChanged());
      this.buildValidations();
      this.buildForm();      
      this.contextProcedimiento();
      await this.loadConfiguracion();
      this.subscribeToState();
      this.modoTypeoModal();
    }

    private contextProcedimiento = () => {
      const current = this.storeCurrent.currentFlowAction.get();
      this.store.tallerFormActions.setInit(current.idVersionSolicitud);
    }


    ngOnDestroy(): void {
      this.subscriptions.forEach(x => {
        x.unsubscribe();
      });
    }
    subscribeToState = () => {
      const subs = this.store.state$.pipe(map(x => x.formTaller.form), distinctUntilChanged())
        .subscribe(x => {
          this.form.patchValue(x);
        });
      this.subscriptions = [subs];
    }
    private buildForm = () => {
      const { form, type } = this.store.state.formTaller;
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
      const { type } = this.store.state.formTaller;
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
    handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IEntidadTaller> => {
      return from(new Promise((resolve, reject) => {
        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setUpdate(formValue);
        this.store.tallerFormActions.asynUpdateTaller(formValue).pipe(tap(response => {
          this.dialogRef.close();
          this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
        }, errror => {
          this.form.enable();
        })).subscribe();
      }));
    }
    handleSave = (formValue: any, options: ISubmitOptions): Observable<IEntidadTaller> => {
      return from(new Promise((resolve, reject) => {
        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setInsert(formValue);
        this.store.tallerFormActions.asynSaveTaller(formValue)
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
      const { type, codigoTaller } = this.store.state.formTaller;
      this.form.get('codigoLocal').setValue(this.store.state.formTaller.codigoLocal);
      if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
        this.store.tallerFormActions.asynFetchTaller(codigoTaller)
          .pipe(
            tap(response => {
              this.form.get('codigo').disabled = true;
              this.store.tallerFormActions.loadDataTaller(response);
            })).subscribe();
      }
    }
    buildValidations = () => {
      this.validators = {
        nombre: [Validators.required],
        tipoLaboratorioTallerEnum: [Validators.required],
        aforo: [Validators.required],
        comentario: [Validators.maxLength(500)]
      };
    }
    handleSubmit = () => {
      this.form.submit();
    }

    handleClose = () => {
      const { type } = this.store.state.formTaller;
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
