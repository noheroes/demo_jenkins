import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ISubmitOptions, IDataGridButtonEvent, AlertService, ToastService, Validators, IDataGridEvent } from '@sunedu/shared';
import { MatDialogRef } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { map, distinctUntilChanged, tap, concatMap } from 'rxjs/operators';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { IFormTallerPrograma } from '../../../store/taller/taller.store.interface';
import { TallerStore } from '../../../store/taller/taller.store';
import { AppAudit, APP_CLOSE_MODAL } from '@lic/core';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la información?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR la información?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};

@Component({
  selector: 'app-form-taller-programa',
  templateUrl: './app-form-taller-programa.component.html',
  styleUrls: ['./app-form-taller-programa.component.scss']
})
export class AppFormTallerProgramaComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IFormTallerPrograma>;
  store: TallerStore;
  state$: Observable<IFormTallerPrograma>;
  subscriptions: Subscription[];
  validators: any;
  //Datos de programas seleccionados
  idPrograma: string;
  nombrePrograma: string;
  readOnly:boolean;
  nombre_taller: string;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;
  constructor(
    public dialogRef: MatDialogRef<AppFormTallerProgramaComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore

  ) { }

  ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.formTallerPrograma), distinctUntilChanged());
    this.contextProcedimiento();
    this.loadPage();
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();    
  }

  ngOnDestroy(): void {
  }
  
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.tallerProgramaFormActions.setInit(current.idVersionSolicitud);
    this.store.tallerProgramaFormActions.setReadOnly(this.readOnly);
  }

  loadPage = () => {
    this.store.tallerProgramaFormActions.asyncFetchPageTallerPrograma().subscribe(response => {
      this.store.tallerProgramaFormActions.asyncFetchProgramas().subscribe();
    });
  }
  subscribeToState = () => {
    const subs = this.store.state$.pipe(map(x => x.formTallerPrograma.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs];
  }

  handleLoadData = (e: IDataGridEvent) => {
    const current = this.storeCurrent.currentFlowAction.get();
    const pageRequest = {
      page: e.page,
      pageSize: e.pageSize,
      orderBy: e.orderBy,
      orderDir: e.orderDir,
      skip: e.skip
    };
    this.store.tallerProgramaFormActions.asyncFetchPageTallerPrograma(pageRequest).subscribe();
  }

  
  private buildForm = () => {
    const { form, type } = this.store.state.formTallerPrograma;
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
    const { type } = this.store.state.formTallerPrograma;
    const MESSAGE =
      type === FormType.REGISTRAR
        ? MESSAGES.CONFIRM_SAVE
        : MESSAGES.CONFIRM_UPDATE;
    return this.alert.open(MESSAGE, null, {
      confirm: true
    });
  }
  handleSubmit = () => {
    this.form.submit();
  }
  
  beforeSubmit = () => {
  }

  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<any> => {   
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setInsert(formValue); 
    return this.store.tallerProgramaFormActions.asynSavetallerPrograma(formValue)
      .pipe(
        tap(response => {
          this.store.tallerProgramaFormActions.resetForm();
          this.store.tallerBandejaActions.asyncFetchPageTaller().subscribe(response => {
          });
          if (!response.success) {
            return this.alert.open('El programa ya fue agregado.', null, {
              confirm: false,
              icon: 'info'
            });
          }
          this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);          
          //this.store.tallerProgramaFormActions.asyncFetchProgramas().subscribe();
          this.loadPage();
        })
        //concatMap(response => this.store.tallerProgramaFormActions.asyncFetchPageTallerPrograma())
      );
  }

  private handleValidateOnSave = (): boolean => {
    if (this.form.valid) {     
      return true;
    }
    return false;
  };
  buildValidations = () => {
    this.validators = {
      codigoProgramaVinculado: [Validators.required]
    };
  }

  handleInputChange = (event) => {
    if(event.value==null) return;
    this.idPrograma = event.selected.value;
    this.nombrePrograma = event.selected.text;
    if (typeof(this.idPrograma) != 'undefined'){
      this.store.tallerProgramaFormActions.setIdPrograma(this.idPrograma);
     // this.store.tallerProgramaFormActions.asyncFetchPageTallerPrograma().subscribe();
    }
  };

  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'ELIMINAR':
        this.deletePrograma(e.item.id);
        break;
    }
  };
  deletePrograma = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true })
      .then(confirm => {
        if (confirm) {
          this.store.tallerProgramaFormActions.asynDeleteTallerPrograma(id)
            .pipe(
              concatMap(response => this.store.tallerProgramaFormActions.asyncFetchPageTallerPrograma()),
              tap(response => 
                {
                  this.store.tallerProgramaFormActions.asyncFetchProgramas().subscribe();
                  this.store.tallerBandejaActions.asyncFetchPageTaller().subscribe(response => {
                  });
                  this.alert.open('Registro eliminado', null, { icon: 'success' });
                })
            ).subscribe();
        }
      });
  };

  handleClose = () => {
    this.dialogRef.close();
  }
}
