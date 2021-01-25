import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators, ComboList } from '@sunedu/shared';
import { IModalSedeFilial, IFormSedeFilial } from '../../../store/sedefilial/sedefilial.store.interface';
import { SedeFilialStore } from '../../../store/sedefilial/sedefilial.store';
import { MatDialogRef } from '@angular/material';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { UbigeoGeneralStore } from '../../../store/external/ubigeo/ubigeo.store';
import { Subscription, Observable, from, fromEvent, of } from 'rxjs';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit, APP_CLOSE_MODAL } from '@lic/core';
const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR sede/filial?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de sede/filial?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};
@Component({
  selector: 'app-form-sedefilial',
  templateUrl: './app-form-sedefilial.component.html',
  styleUrls: ['./app-form-sedefilial.component.scss']
})
export class AppFormSedefilialComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalSedeFilial>;
  store: SedeFilialStore;
  state$: Observable<IModalSedeFilial>;
  subscriptions: Subscription[];
  validators: any;
  storeUbigeo:UbigeoGeneralStore

  // Ubigeos
  departamentos= new ComboList([]);
  provincias= new ComboList([]);
  descripcionDepartamento: any;
  descripcionProvincia: any;
  tipoOperacion: any;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<AppFormSedefilialComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore
  ) { 
    
  }
  async ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalSedeFilial), distinctUntilChanged());
    this.buildValidations();
    this.buildForm();
    this.buildDepartamentos();
    this.contextProcedimiento();    
    
    
    this.modoTypeoModal();
    this.subscribeToState();
    //await this.loadConfiguracion();    
  }

  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.sedeFilialModalActions.setInit(current.idVersionSolicitud);
  }

  private async loadConfiguracion(){
    this.store.state.modalSedeFilial.isLoading=true;
    let promises: any[] = [];

    // const action3 = await this.buildValidations();
    // promises.push(action3);
    // const action4 = await this.buildForm();
    // promises.push(action4);
    // const action5 = await this.subscribeToState();
    // promises.push(action5);
    // const action0 = await this.buildDepartamentos();
    // promises.push(action0);
    await Promise.all(promises).then(()=>{this.store.state.modalSedeFilial.isLoading=false;});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    return new Promise(
      (resolve)=>{
        const subs1 = this.store.state$.pipe(map(x => x.modalSedeFilial.form), distinctUntilChanged())
          .subscribe(x => {
            this.form.patchValue(x);
          });
        this.subscriptions = [subs1];
      resolve();
    });
  }
  private buildForm = () => {
    return new Promise(
      (resolve)=>{
        const { form, type } = this.store.state.modalSedeFilial;
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
        resolve();
      });
  }

  handleConfirmOnSave = () => {

    const { type } = this.store.state.modalSedeFilial;
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

  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<any> => {
    formValue.ubigeo = formValue.nombreProvincia.substr(0, 4);
    formValue['descripcionUbigeo'] = `${this.descripcionDepartamento}/${this.descripcionProvincia}`;
    //formValue['tipoOperacion'] = this.tipoOperacion;
    let resp:any = null;
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setUpdate(formValue);
    this.store.sedeFilialModalActions.asynValidateUpdateSedeFilial(this.store.state.modalSedeFilial.codigoSedeFilial, this.form.model.codigo.value, this.form.model.esSedeFilial.value)
    .subscribe(
        response => {          
          if (response != "") {
            this.toast.info(response);
            this.form.get('codigo').disabled = true;
            this.form.get('nombreDepartamento').disabled = false;
            this.form.get('nombreProvincia').disabled = false;
            this.form.get('esSedeFilial').disabled = false;
            resp=null;
          } else {
            this.store.sedeFilialModalActions.asynUpdateSedeFilial(formValue).
              subscribe(response => {
                if (response['success']){                
                  this.dialogRef.close();
                  //this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
                  this.alert.open(MESSAGES.CONFIRM_UPDATE_SUCCES, null, {
                    confirm: false,
                    icon: 'success'
                  });
              } else {
                this.alert.open(response['message'], null, { icon: 'error' });
              }
            });
          }
        });
      return resp;
  }

  handleSave = (formValue: any, options: ISubmitOptions): Observable<any> => {
    formValue['descripcionUbigeo'] = `${this.descripcionDepartamento}/${this.descripcionProvincia}`;
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setInsert(formValue);
    let resp:any = null;
    this.store.sedeFilialModalActions.asynValidateSedeFilial(this.form.model.codigo.value, this.form.model.esSedeFilial.value)
    .subscribe(
        response => {
          if (response != "") {
            this.toast.info(response);
            this.form.get('codigo').disabled = false;
            this.form.get('nombreDepartamento').disabled = false;
            this.form.get('nombreProvincia').disabled = false;
            this.form.get('esSedeFilial').disabled = false;
            resp=null;
          } else {
             this.store.sedeFilialModalActions.asynSaveSedeFilial(formValue)
                .subscribe(reponse => {                  
                  if (reponse['success']){
                  resp = response;
                  this.dialogRef.close();
                  //this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
                  if (formValue.esSedeFilial) {
                    this.alert.open(MESSAGES.CONFIRM_SAVE_SUCCES, null, {
                      confirm: false,
                      icon: 'success'
                    })
                  } else {
                  this.alert.open(`${MESSAGES.CONFIRM_SAVE_SUCCES}, con el siguiente código: ${reponse['formatoNumeracion']}`, null, {
                    confirm: false,
                    icon: 'success'
                  })}
                } else {
                  this.alert.open(reponse['message'], null, { icon: 'error' });
                }
                });
          }
        });
    return resp;
    
  }

  private handleValidateOnSave = (): boolean => {

    if (this.form.valid) {
      this.form['descripcionUbigeo'] = `${this.descripcionDepartamento}/${this.descripcionProvincia}`;      
      const sedesBaneja:[] = this.store.sedeFilialModalActions.getSedesBandeja();      
      if(sedesBaneja.findIndex(x=>x['descripcionUbigeo'] ==this.form['descripcionUbigeo'].toUpperCase())!=-1){
        this.alert.open(`Ya existe un registro con el mismo ubigeo`, null, {
          confirm: false,
          icon: 'warning'
        });
        return false;
      }else{
        return true;
      }
    }
    return false;
  };

  modoTypeoModal = () => {
    const { type, codigoSedeFilial } = this.store.state.modalSedeFilial;
    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      this.store.sedeFilialModalActions.asynFetchSedeFilial(codigoSedeFilial)
        .pipe(
          tap(response => {
            this.store.sedeFilialModalActions.loadDataSedeFilial(response);
            this.form.get('codigo').disabled = true;
            this.form.get('nombreDepartamento').setValue(response.ubigeo.substr(0,2).padEnd(6, '0'));

            this.storeUbigeo.currentUbigeoActions.getProvincias(response.ubigeo.substr(0,2).padEnd(6, '0'))
            .subscribe(
              info=>{
                this.provincias = !info? new ComboList([]):info;
              }
            )
            this.form.get('nombreProvincia').setValue(response.ubigeo.padEnd(6, '0'));
          })).subscribe();
    }
  }
  buildValidations = () => {
    return new Promise(
      (resolve)=>{
        this.validators = {
          nombreDepartamento: [Validators.required],
          nombreProvincia: [Validators.required],
          esSedeFilial: [Validators.required]
        };
    resolve();
    });
  }
  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalSedeFilial;
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

  private buildDepartamentos = () => {
    return new Promise(
      async (resolve) => {
        this.storeUbigeo.currentUbigeoActions.getDepartamentos().then(
          (info)=>{
            console.log(info);
            if(info){
              this.departamentos = info['value'];
              resolve();
            }    
          }
        );
      }
    );
  }

  handleInputChange = (event) => {   
    if(event.value==null) return;   

    switch (event.name) {
      case "nombreDepartamento":
      {
        this.descripcionDepartamento = event.selected.text;
        this.provincias =new ComboList([]);
        this.form.get('nombreProvincia').setValue(null);
        this.storeUbigeo.currentUbigeoActions.getProvincias(event.value)
        .subscribe(
          info=>{
            this.provincias = !info? new ComboList([]):info;
          }
        )        
      }
      case "nombreProvincia":
      {
        this.descripcionProvincia = event.selected.text;        
      }
      break;

      case "esSedeFilial":
      {
        //Es cambio de filial a sede o sede a filial
        this.tipoOperacion= event.value ? "EsSede" : "EsFilial";        
      }
      break;

      default:
        break;
    }
  };

}
