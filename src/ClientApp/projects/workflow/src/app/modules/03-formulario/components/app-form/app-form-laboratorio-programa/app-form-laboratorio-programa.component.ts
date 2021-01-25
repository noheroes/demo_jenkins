import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ISubmitOptions, IDataGridButtonEvent, IDataGridEvent, AlertService, ToastService, Validators } from '@sunedu/shared';
import { MatDialogRef } from '@angular/material';
import { Subscription, Observable, from } from 'rxjs';
import { map, distinctUntilChanged, tap, concatMap } from 'rxjs/operators';
import { LaboratorioStore } from '../../../store/laboratorio/laboratorio.store';
import { IFormLaboratorioPrograma, IEntidadLaboratorioPrograma } from '../../../store/laboratorio/laboratorio.store.interface';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit, APP_CLOSE_MODAL } from '@lic/core';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la información?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR la información?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};

@Component({
  selector: 'app-form-laboratorio-programa',
  templateUrl: './app-form-laboratorio-programa.component.html',
  styleUrls: ['./app-form-laboratorio-programa.component.scss']
})
export class AppFormLaboratorioProgramaComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IFormLaboratorioPrograma>;
  store: LaboratorioStore;
  state$: Observable<IFormLaboratorioPrograma>;
  subscriptions: Subscription[];
  validators: any;
  readOnly:boolean;
  nombre_laboratorio: string;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<AppFormLaboratorioProgramaComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore

  ) { }

  async ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.formLaboratorioPrograma), distinctUntilChanged());
    this.buildValidations();
    this.buildForm();
    await this.loadConfiguracion();
    // this.contextProcedimiento();
    // this.loadPage();
    // this.buildValidations();
    // this.buildForm();
    // this.subscribeToState();
    //this.loadCombos();
  }

  loadConfiguracion = async () =>{
    this.store.state.formLaboratorioPrograma.isLoading = true;
    let promises: any[] = [];
    const action0 = await this.contextProcedimiento();
    promises.push(action0);
    const action1 = await this.loadPage();
    promises.push(action1);
    // const action2 = await this.buildValidations();
    // promises.push(action2);
    // const action3 = await this.buildForm();
    // promises.push(action3);
    const action4 = await this.subscribeToState();
    promises.push(action4);
    await Promise.all(promises).then(() => { this.store.state.formLaboratorioPrograma.isLoading = false; });
  }
  ngOnDestroy(): void {

  }
  private contextProcedimiento = () => {
    return new Promise(
      (resolve)=>{ 
        const current = this.storeCurrent.currentFlowAction.get();
        this.store.laboratorioProgramaFormActions.setInit(current.idVersionSolicitud);    
        this.store.laboratorioProgramaFormActions.setReadOnly(this.readOnly);
      resolve();
    });
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
    this.store.laboratorioProgramaFormActions.asyncFetchPage(pageRequest).subscribe();
  }

  private loadCombos = () => {
    this.store.laboratorioProgramaFormActions.asyncFetchProgramas().subscribe();
  };
  loadPage = () => {
    return new Promise(
      (resolve)=>{ 
        this.store.laboratorioProgramaFormActions.asyncFetchPage().subscribe(response => {
          this.store.laboratorioProgramaFormActions.asyncFetchProgramas().subscribe(info=>{
          });
          resolve();
        });
    });
  }
  subscribeToState = () => {
    return new Promise(
      (resolve)=>{ 
        const subs = this.store.state$.pipe(map(x => x.formLaboratorioPrograma.form), distinctUntilChanged())
        .subscribe(x => {
          this.form.patchValue(x);
        });
      this.subscriptions = [subs];  
      resolve();
    });
  }
  private buildForm = () => {
    return new Promise(
      async (resolve)=>{ 
        const { form, type } = this.store.state.formLaboratorioPrograma;
        await this.buildValidations();
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
      resolve();
    });
  }
  handleConfirmOnSave = () => {
    const { type } = this.store.state.formLaboratorioPrograma;
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
    return this.store.laboratorioProgramaFormActions.asynSaveLaboratorioPrograma(formValue)
      .pipe(
        tap(response => {
          this.store.laboratorioProgramaFormActions.resetForm();
          this.store.laboratorioBandejaActions.asyncFetchPageLaboratorio().subscribe(response => {
          });
          if (!response.success) {
            return this.alert.open('El programa ya fue agregado.', null, {
              confirm: false,
              icon: 'info'
            });
          }
          this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
          this.loadPage();
          //this.store.laboratorioProgramaFormActions.asyncFetchProgramas().subscribe();
        })
        //concatMap(response => this.store.laboratorioProgramaFormActions.asyncFetchPage())
      );
  }

  private handleValidateOnSave = (): boolean => {
    if (this.form.valid) {
      return true;
    }
    return false;
  };
  buildValidations = () => {
    return new Promise(
      (resolve)=>{ 
        this.validators = {
          codigoProgramaVinculado: [Validators.required]
        };
      resolve();
    });
  }

  handleInputChange = ({ name, value }) => {
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
          this.store.laboratorioProgramaFormActions.asynDeleteLaboratorioPrograma(id)
            .pipe(
              concatMap(response => this.store.laboratorioProgramaFormActions.asyncFetchPage()),
              tap(response => 
                {
                  this.store.laboratorioProgramaFormActions.asyncFetchProgramas().subscribe();
                  this.store.laboratorioBandejaActions.asyncFetchPageLaboratorio().subscribe(response => {
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
