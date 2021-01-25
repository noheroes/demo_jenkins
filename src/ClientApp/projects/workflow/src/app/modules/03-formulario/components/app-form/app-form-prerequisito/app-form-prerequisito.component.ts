import { IModalPreRequisitoCurso } from './../../../store/curso/curso.store.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, AlertService, ToastService, ISubmitOptions, IDataGridButtonEvent, Validators,IDataGridEvent } from '@sunedu/shared';
import { Observable, Subscription, forkJoin, pipe } from 'rxjs';
import { CursoStore } from '../../../store/curso/curso.store';
import { IModalHoraLectivaCurso, IFormHoraLectivaCurso } from '../../../store/curso/curso.store.interface';
import { MatDialogRef } from '@angular/material';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { map } from 'rxjs/internal/operators/map';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { AppAudit, APP_CLOSE_MODAL } from '@lic/core';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR la información?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR la información?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};
@Component({                                        
  selector: 'app-form-prerequisito',
  templateUrl: './app-form-prerequisito.component.html',
  styleUrls: ['./app-form-prerequisito.component.scss']
})
export class AppFormPreRequisitoComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalPreRequisitoCurso>;
  store: CursoStore;
  state$: Observable<IModalPreRequisitoCurso>;   
  subscriptions: Subscription[];
  validators: any;
  readOnly:boolean;
  nombre_curso: string;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<AppFormPreRequisitoComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore, 
    private storeEnumerado: EnumeradoGeneralStore
  ) { }

 async ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalPrerequisitoCurso), distinctUntilChanged());

    this.contextProcedimiento();
    this.modoTypeoModal();
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    await this.loadCursos();
    
    //this.loadCombos();
    
  }
  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.prerequisitoModalActions.setInit(current.idVersionSolicitud);
    this.store.prerequisitoModalActions.setReadOnly(this.readOnly);
  }
  private loadCursos = () =>{
    return new Promise(
        async (resolve)=>{ 
            await this.store.prerequisitoModalActions.getCursos();
            await this.store.prerequisitoModalActions.asyncFetchCombos();
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
    this.store.prerequisitoModalActions.asyncFetchPage(pageRequest).subscribe();
  }


  private loadCombos = () => {
    forkJoin(
      this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_HORALECTIVA')
    ).pipe(tap(enums => {
      this.store.horariolectivaModalActions.asyncFetchCombos(enums);
    })).subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs = this.store.state$.pipe(map(x => x.modalPrerequisitoCurso.form), distinctUntilChanged())
      .subscribe(x => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs];
  }

  private buildForm = () => {
    const { form, type } = this.store.state.modalPrerequisitoCurso;
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
    const { type } = this.store.state.modalPrerequisitoCurso;
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

  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormHoraLectivaCurso> => {
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setInsert(formValue);
    return this.store.prerequisitoModalActions.asynUpdatePreRequisito(formValue).pipe(
      tap(response => {
        
        this.store.prerequisitoModalActions.resetModalPreRequisito();
        if (!response.success) {
          return this.alert.open('El curso pre-requisito ya esta agregada.', null, {
            confirm: false,
            icon: 'info'
          });
        }
        this.store.prerequisitoModalActions.asyncFetchPage().subscribe();
        this.loadCursos();
      }));
  }
  private handleValidateOnSave = (): boolean => {
    if (this.form.valid) {
      return true;
    }
    return false;
  }
  modoTypeoModal = () => {
    const { type } = this.store.state.modalPrerequisitoCurso;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.prerequisitoModalActions.asyncFetchPage().subscribe();
    }
  }
  buildValidations = () => {
    this.validators = {
      codigo: [Validators.required]
    };
  }
  handleSubmit = () => {
    this.form.submit();
  }
  handleClose = () => {
    const { type } = this.store.state.modalPrerequisitoCurso;
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

  handleDelete = (codigo: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {        
        this.store.prerequisitoModalActions.asyncDeletePreRequisito(codigo).subscribe(reponse => {
          this.alert.open('Registro eliminado', null, { icon: 'success' });
          this.store.prerequisitoModalActions.asyncFetchPage().subscribe();
          this.loadCursos();
        });
      }
    });
  }

  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'ELIMINAR':
        this.handleDelete(e.item.codigo);
        break;
    }
  }
  handleInputChange = (obj, val) => {
    // console.log('CAYL',obj);
    // this.form.get('codigo').value = obj.selected? obj.selected.text:null;
  }
}
