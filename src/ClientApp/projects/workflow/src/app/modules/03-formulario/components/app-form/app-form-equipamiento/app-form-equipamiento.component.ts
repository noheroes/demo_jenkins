import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, ToastService, AlertService, FormModel, ISubmitOptions, Validators, IDataGridEvent, IDataGridButtonEvent } from '@sunedu/shared';
import { MatDialogRef } from '@angular/material';
import { Observable, Subscription, from, forkJoin } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { IModalEquipamiento, IFormEquipamiento, IFormBuscardorEquipamiento } from '../../../store/equipamiento/equipamiento.store.interface';
import { EquipamientoStore } from '../../../store/equipamiento/equipamiento.store';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit, APP_CLOSE_MODAL } from '@lic/core';
const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR el registro de equipamiento?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de equipamiento?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};

@Component({
  selector: 'app-form-Equipamiento',
  templateUrl: './app-form-equipamiento.component.html',
  styleUrls: ['./app-form-equipamiento.component.scss']
})
export class AppFormEquipamientoComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalEquipamiento>;
  store: EquipamientoStore;
  state$: Observable<IModalEquipamiento>;
  subscriptions: Subscription[];
  validators: any;
  readOnly:boolean;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  //Lista de laboratorio
  listLaboratorio: any;
  id: string = '';


  // Enumerados
  tipoEquipoMobiliarioEnum:any;
  constructor(
    private dialogRef: MatDialogRef<AppFormEquipamientoComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeEnumerado:EnumeradoGeneralStore,
    private storeCurrent: AppCurrentFlowStore,
    //private getState: () => IModalEquipamiento,
    //private setState: (newState: IModalEquipamiento) => void
  ) { }

  async ngOnInit() {
      this.state$ = this.store.state$.pipe(map(x => x.modalEquipamiento), distinctUntilChanged());
      this.buildValidations();
      this.buildForm();      
      await this.buildEnumerados("");
      this.contextProcedimiento();
      await this.loadConfiguracion();
      
  }

  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();    
    this.store.equipamientoModalActions.setInit(current.idVersionSolicitud, this.tipoEquipoMobiliarioEnum);
    this.store.equipamientoModalActions.setReadOnly(this.readOnly);
  }

  private async loadConfiguracion(){
    this.store.state.modalEquipamiento.isLoading=true;
    let promises: any[] = [];
    
    
    // const action2 = await this.buildValidations();
    // promises.push(action2);

    // const action3 = await this.buildForm();
    // promises.push(action3);
    
    const action4 = await this.modoTypeoModal();
    promises.push(action4);
    const action5 = await this.subscribeToState();
    promises.push(action5);
    
    await Promise.all(promises).then(()=>{this.store.state.modalEquipamiento.isLoading=false;});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }

  subscribeToState = () => {
    return new Promise<void>(
      (resolve)=>{
        const subs1 = this.store.state$.pipe(map(x => x.modalEquipamiento.form), distinctUntilChanged())
        .subscribe(x => {
          this.form.patchValue(x);
        });
      this.subscriptions = [subs1];
      resolve();
    });
  }

  private buildForm = () => {
    return new Promise<void>(
      (resolve)=>{
        const { form, type } = this.store.state.modalEquipamiento;
        this.buildValidations();
        this.form = new FormModel<any>(
          type,
          form,
          this.validators,
          {
            beforeSubmit: this.beforeSubmit,
            onSave: this.handleSave,            
            validateOnSave: this.handleValidateOnSave,
            confirmOnSave: this.handleConfirmOnSave,
          }
        );
        
        this.store.state.modalEquipamiento.gridDefinition.columns.forEach(item=>{
          if(item.field=="codigoLaboratorioTaller"){
            if(this.store.state.modalEquipamiento.tipoEquipamiento == "L")
              item.label = "Código laboratorio";
            if(this.store.state.modalEquipamiento.tipoEquipamiento == "T")
              item.label = "Código taller";
          }
          if(item.field=="nombreEqMobSoft"){
            if(this.store.state.modalEquipamiento.tipoEquipamiento == "L")
              item.label = "Nombre de Laboratorio";
            if(this.store.state.modalEquipamiento.tipoEquipamiento == "T")
              item.label = "Nombre de Taller";
          }
        }); 

      resolve();
    });
  }
  beforeSubmit = () => {
  }
  handleSave = (formValue: any, options: ISubmitOptions): Observable<IFormEquipamiento> => {
    return from(new Promise((resolve, reject) => {
      if (this.id == '') {        
        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setInsert(formValue);
        this.store.equipamientoModalActions.asynSaveEquipamiento(formValue)
        .pipe(tap(response => {          
          this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);          
          this.store.equipamientoModalActions.asyncFetchPageEquipamiento().subscribe();
          this.limpiarFormularioEquipamiento();
        }, error => {         
          this.habilitarControles();
        })).subscribe();
      } else {
        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setUpdate(formValue);
        this.store.equipamientoModalActions.asynUpdateAmbiente(formValue)
        .pipe(tap(response => {          
          this.store.equipamientoModalActions.asyncFetchPageEquipamiento().subscribe();
          this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
          this.limpiarFormularioEquipamiento();
        }, error => {         
          this.habilitarControles();
        }))
        .subscribe();
      }     
      this.habilitarControles();  
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
    const { type } = this.store.state.modalEquipamiento;
    const MESSAGE =
      type === FormType.REGISTRAR
        ? MESSAGES.CONFIRM_SAVE
        : MESSAGES.CONFIRM_UPDATE;
    return this.alert.open(MESSAGE, null, {
      confirm: true
    });
  }
  modoTypeoModal = () => {
    return new Promise<void>(
      (resolve)=>{
        const { type, codigoEquipamiento } = this.store.state.modalEquipamiento;       
          this.store.equipamientoModalActions.asynFetchEquipamiento(codigoEquipamiento)
          .pipe(tap(response => {                          
            this.form.get('codigoLaboratorioTaller').setValue(this.store.state.modalEquipamiento.codigoLaboratorioTaller);
            this.store.equipamientoModalActions.asyncFetchPageEquipamiento().subscribe();
          })).subscribe();       
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
    this.store.equipamientoModalActions.asyncFetchPageEquipamiento(pageRequest).subscribe();
  }

  buildValidations = () => {
    return new Promise<void>(
      (resolve)=>{
        this.validators = {
          //numeroEqMobSoft: [Validators.required, Validators.number],
          //tipoEquipoMobiliarioEnum: [Validators.required],
          nombreEqMobSoft: [Validators.required],
          //valorizacion: [Validators.required, Validators.number],
          comentario: [Validators.maxLength(500)]
        };
      resolve();
    });
  }

  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalEquipamiento;
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

  private buildEnumerados = (string: string) =>{
    return new Promise<void>(
      (resolve)=>{
        this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDTIPOEQUIPOMOBILIARIO')
          .then(info=>{
            this.tipoEquipoMobiliarioEnum = info;                  
          });
          
        resolve();
      });
  }

  handleInputChange = ({ name, value }) => {
    if(value==null) return;
  };


  //CONTROLES DE GRILLA
  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultar(e.item);
        break;
      case 'EDITAR':
        this.openModalUpdate(e.item);
        break;
      case 'ELIMINAR':
         this.deleteEquipamiento(e.item.id);
        break;
    }
  }

  limpiarFormularioEquipamiento = () => {
    this.form.get('numeroEqMobSoft').setValue('');   
    this.form.get('tipoEquipoMobiliarioEnum').setValue(0);    
    this.form.get('nombreEqMobSoft').setValue('');
    this.form.get('valorizacion').setValue('');    
    this.form.get('comentario').setValue('');
  }

  setValoresEquipamiento = (event: any) => {
    this.form.get('numeroEqMobSoft').setValue(event.numeroEqMobSoft);
    this.form.get('tipoEquipoMobiliarioEnum').setValue(Number(event.tipoEquipoMobiliarioEnum));    
    this.form.get('nombreEqMobSoft').setValue(event.nombreEqMobSoft);
    this.form.get('valorizacion').setValue(event.valorizacion);    
    this.form.get('comentario').setValue(event.comentario);
  }

  openModalConsultar = (event: any) => {    
    this.deshabilitarControles();
    this.setValoresEquipamiento(event); 
  }

  openModalUpdate = (event: any) => {
    this.habilitarControles();
    this.setValoresEquipamiento(event);
    this.form.get('idLocal').setValue(event.idLocal);
    this.form.get('id').setValue(event.id);
    this.id = event.id;
  }

  private deshabilitarControles = () =>{  
    this.form.get('numeroEqMobSoft').disabled = true;
    this.form.get('tipoEquipoMobiliarioEnum').disabled = true;
    this.form.get('nombreEqMobSoft').disabled = true;
    this.form.get('valorizacion').disabled = true;
    this.form.get('comentario').disabled = true;
  }

  private habilitarControles = () =>{  
    this.form.get('numeroEqMobSoft').disabled = false;
    this.form.get('tipoEquipoMobiliarioEnum').disabled = false;
    this.form.get('nombreEqMobSoft').disabled = false;
    this.form.get('valorizacion').disabled = false;
    this.form.get('comentario').disabled = false;
  }

  deleteEquipamiento = (id: string) => {
    this.alert.open('¿Está seguro de eliminar el registro?', null, { confirm: true }).then(confirm => {
      if (confirm) {       
        this.store.equipamientoModalActions.asynDeleteEquipamiento(id)
          .subscribe(reponse => {
            this.alert.open('Registro eliminado', null, { icon: 'success' });
            this.store.equipamientoModalActions.asyncFetchPageEquipamiento().subscribe(response => {
            });
          });
      }
    });
  }
}
