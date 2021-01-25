import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormType, FormModel, ToastService, AlertService, ISubmitOptions, Validators, ComboList } from '@sunedu/shared';
import { Subscription, Observable, from } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { IModalLocal, IFormLocal } from '../../../store/local/local.store.interface';
import { LocalStore } from '../../../store/local/local.store';
import { UbigeoGeneralStore } from '../../../store/external/ubigeo/ubigeo.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { AppAudit, APP_FORM_VALIDATOR, APP_CLOSE_MODAL } from '@lic/core';
import { SedeFilialStore } from '../../../store/sedefilial/sedefilial.store';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR el local?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de local?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};
const RegTelefono = {  
  telefono:['(',/[0-9]/, /[0-9]/,')',/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
  celular: [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
  provincia: ['(', /[0-9]/,/[0-9]/, /[0-9]/, ')', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]
}
@Component({
  selector: 'app-form-local',
  templateUrl: './app-form-local.component.html',
  styleUrls: ['./app-form-local.component.scss']
})
export class AppFormLocalComponent implements OnInit, OnDestroy {
  formType = FormType;
  form: FormModel<IModalLocal>;
  store: LocalStore;
  //storeSedeFilial: SedeFilialStore;
  state$: Observable<IModalLocal>;
  subscriptions: Subscription[];
  validators: any;
  storeUbigeo:UbigeoGeneralStore;
  readonly CLOSE_MODAL = APP_CLOSE_MODAL;
  
  // Ubigeos
  departamentos= new ComboList([]);
  provincias= new ComboList([]);
  distritos= new ComboList([]);
  descripcionDepartamento:any;
  descripcionProvincia:any;
  descripcionDistrito:any = '';
  otroServicioDisabled:boolean;
  telefonoMaxLength: any = 9;
  mostrarServicioAcademico: boolean = true;
  max_date:any;
  mask_telefono: Array<string | RegExp> = RegTelefono.telefono;
  constructor(
    public dialogRef: MatDialogRef<AppFormLocalComponent>,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore,
    //private storeSedeFilial: SedeFilialStore
  ) { }

  async ngOnInit() {
    this.state$ = this.store.state$.pipe(map(x => x.modalLocal), distinctUntilChanged());
    this.max_date = new Date();
    this.contextProcedimiento();
    this.buildValidations();
    this.buildForm();
    await this.modoTypeoModal();
    await this.loadConfiguracion();
  }

  private contextProcedimiento = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.localModalActions.setInit(current.idVersionSolicitud);
  }

  private async loadConfiguracion(){
    this.store.state.modalLocal.isLoading=true;
    let promises: any[] = [];

    // const action3 = await this.buildValidations();
    // promises.push(action3);
    // const action4 = await this.buildForm();
    // promises.push(action4);
    const action5 = await this.subscribeToState();
    promises.push(action5);
    const action0 = await this.buildDepartamentos();
    promises.push(action0);
    const action7 = await this.disableUbigeo();
    promises.push(action0);

    await Promise.all(promises).then(()=>{this.store.state.modalLocal.isLoading=false;});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }

  subscribeToState = () => {
    return new Promise(
      (resolve)=>{
        const subs1 = this.store.state$.pipe(map(x => x.modalLocal.form), distinctUntilChanged())
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
        const { form, type } = this.store.state.modalLocal;
        //console.log(form);
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
    const { type } = this.store.state.modalLocal;
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

  enableControlsForm = () => {
    this.form.get('codigo').disabled = false;
    this.form.get('esServicioEducativo').disabled = false;
    this.form.get('esServicioEducativoComplementario').disabled = false;
    this.form.get('esOtroServicio').disabled = false;
    this.form.get('otroServicio').disabled = false;
    this.form.get('resolucionAutorizacion').disabled = false;
    this.form.get('fechaAutorizacion').disabled = false;
    this.form.get('nombreDistrito').disabled = false;
    this.form.get('direccion').disabled = false;
    this.form.get('referencia').disabled = false;
    this.form.get('areaTerreno').disabled = false;
    this.form.get('areaConstruida').disabled = false;
    this.form.get('aforo').disabled = false;
    this.form.get('telefono').disabled = false;
    this.form.get('cantidadEstudiantes').disabled = false;
    this.form.get('comentarios').disabled = false;
  }

  handleUpdate = (formValue: any, options: ISubmitOptions): Observable<IFormLocal> => {
    formValue.ubigeo = formValue.nombreDistrito;
    this.descripcionDepartamento = formValue.descripcionUbigeo.split('/')[0];
    this.descripcionProvincia = formValue.descripcionUbigeo.split('/')[1];
    this.descripcionDistrito = this.descripcionDistrito == '' ? formValue.descripcionUbigeo.split('/')[2] : this.descripcionDistrito;
    formValue['descripcionUbigeo'] = `${this.descripcionDepartamento}/${this.descripcionProvincia}/${this.descripcionDistrito}`;
    let resp:any = null;
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setUpdate(formValue);
    //validar el tipo de servicio
    let tipoServicio = formValue.esServicioEducativo || formValue.esServicioEducativoComplementario || formValue.esOtroServicio;
    if (!tipoServicio) {
      this.toast.error("Seleccione al menos un tipo de servicio.");
      this.enableControlsForm();
    } else {
      //Validar si es otro servicio
      if (formValue.esOtroServicio && formValue.otroServicio == ""){
        this.toast.error("Registre el otro tipo de servicio.");
        this.enableControlsForm();
      } else {
        this.store.localModalActions.asynUpdateLocal(formValue).subscribe(response => {
          this.dialogRef.close();
          //this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
          this.alert.open(MESSAGES.CONFIRM_UPDATE_SUCCES, null, {
            confirm: false,
            icon: 'success'
          });
        }, error => {
          this.form.enable();
          this.form.get('codigoSedeFilial').disabled = true;
          this.form.get('nombreDepartamento').disabled = true;
          this.form.get('nombreProvincia').disabled = true;
        });
      }
    }
    return resp;
  }

  handleSave = (formValue: any, options: ISubmitOptions): Observable<IFormLocal> => {
    formValue.ubigeo = formValue.nombreDistrito;
    formValue.descripcionUbigeo = `${this.descripcionDepartamento}/${this.descripcionProvincia}/${this.descripcionDistrito}`;
    let resp:any = null;
    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setInsert(formValue);
    //validar el tipo de servicio
    let tipoServicio = formValue.esServicioEducativo || formValue.esServicioEducativoComplementario || formValue.esOtroServicio;
    if (!tipoServicio) {
      this.toast.error("Seleccione al menos un tipo de servicio.");
      this.enableControlsForm();
    } else {
      //Validar si es otro servicio
      if (formValue.esOtroServicio && formValue.otroServicio == ""){
        this.toast.error("Registre el otro tipo de servicio.");
        this.enableControlsForm();
      } else {
        this.store.localModalActions.asynSaveLocal(formValue)
        .subscribe(reponse => {
          this.dialogRef.close();
          if (reponse['success']) {
            this.alert.open(`${MESSAGES.CONFIRM_SAVE_SUCCES}, con el siguiente código: ${reponse['formatoNumeracion']}`, null, {
              confirm: false,
              icon: 'success'
            });
          } else {
            this.alert.open(`Ocurrió un error en el durante el proceso de la operación, comuníquese con el administrador del sistema.`, null, {
              confirm: false,
              icon: 'error'
            });
          }
        }, error => {
          this.form.enable();
          this.form.get('codigoSedeFilial').disabled = true;
          this.form.get('nombreDepartamento').disabled = true;
          this.form.get('nombreProvincia').disabled = true;          
        });
      }
    }
    return resp;
  }

  private handleValidateOnSave = (): boolean => {
    if (this.form.valid) {
      return true;
    }
    return false;
  };

  disableUbigeo = () => {
    return new Promise(
      (resolve)=>{
        const { type, codigoLocal } = this.store.state.modalLocal;
        if (type === FormType.REGISTRAR){
          let state = this.store.state.modalLocal;
          this.form.get('codigoSedeFilial').setValue(state.codigo);
          this.form.get('codigoSedeFilial').disabled = true;
          this.form.get('nombreDepartamento').disabled = true;
          this.otroServicioDisabled=true;
          this.form.get('nombreDepartamento').setValue(state.ubigeo.substr(0,2).padEnd(6, '0'));
          this.descripcionDepartamento = this.departamentos.list.find(x => x.value == state.ubigeo.substr(0,2).padEnd(6, '0')).text;
          this.storeUbigeo.currentUbigeoActions.getProvincias(state.ubigeo.substr(0,2).padEnd(6, '0'))
          .subscribe(
            info=>{
              this.provincias = !info?new ComboList([]):info;
            }
          )
          this.form.get('nombreProvincia').setValue(state.ubigeo.padEnd(6, '0'));
          this.form.get('nombreProvincia').disabled = true;
          if(this.provincias){
            const descripcion = this.provincias.list.find(x => x.value == state.ubigeo.padEnd(6, '0'));
            this.descripcionProvincia = descripcion?descripcion.text:"";
            this.storeUbigeo.currentUbigeoActions.getDistritos(state.ubigeo.padEnd(6, '0'))
                    .subscribe(
                      info=>{
                        this.distritos = !info?new ComboList([]):info;
                        resolve();
                      })
          }else{
            resolve();
          }
        }
    });
  }

  modoTypeoModal = () => {
    return new Promise(
      (resolve)=>{
          const { type, codigoLocal } = this.store.state.modalLocal;
          if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
            this.store.localModalActions.asynFetchLocal(codigoLocal)
              .pipe(
                tap(response => {
                  this.store.localModalActions.loadDataLocal(response);                  
                  this.form.get('nombreDepartamento').setValue(response.ubigeo.substr(0,2).padEnd(6, '0'));
                  this.form.get('nombreDepartamento').disabled = true;
                  this.form.get('codigoSedeFilial').disabled = true;
                  this.form.get('codigo').disabled = true;
                  this.storeUbigeo.currentUbigeoActions.getProvincias(response.ubigeo.substr(0,2).padEnd(6, '0'))
                  .subscribe(
                    info=>{
                      this.provincias = !info?new ComboList([]):info;
                    }
                  )
                  this.form.get('nombreProvincia').setValue(response.ubigeo.substring(0, 4).padEnd(6, '0'));
                  this.form.get('nombreProvincia').disabled = true;
                  this.storeUbigeo.currentUbigeoActions.getDistritos(response.ubigeo.substring(0, 4).padEnd(6, '0'))
                  .subscribe(
                    info=>{
                      this.distritos = !info?new ComboList([]):info;
                    })
                  this.form.get('nombreDistrito').setValue(response.ubigeo);

                  this.mostrarServicioAcademico = !response.esServicioEducativo;

                  if (type === FormType.EDITAR){
                    if (response.esOtroServicio) {
                      this.otroServicioDisabled=false;
                    } else {
                      this.otroServicioDisabled=true;
                    }
                  } else {
                    this.form.get('esServicioEducativo').disabled = true;
                    this.form.get('esServicioEducativoComplementario').disabled = true;
                    this.form.get('esOtroServicio').disabled = true;
                    this.form.get('otroServicio').disabled = true;
                    this.form.get('telefono').disabled = true;
                  }
                  this.showTelefono();

                })).subscribe();
          }
      resolve();
    });
  }

  buildValidations = () => {
    return new Promise(
      (resolve)=>{
        this.validators = {
          codigoSedeFilial: [Validators.required],
          nombreDepartamento: [Validators.required],
          nombreProvincia: [Validators.required],
          nombreDistrito: [Validators.required],
          otroServicio: [Validators.maxLength(200)],
          resolucionAutorizacion: [Validators.maxLength(20), Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NUM_RESOLUCION))],          
          direccion: [Validators.required,Validators.maxLength(250)],
          referencia: [Validators.maxLength(250)],
          areaTerreno: [Validators.required, Validators.number, Validators.lessThan(1000000)],
          areaConstruida: [Validators.required, Validators.number, Validators.lessThan(1000000)],
          aforo: [Validators.required, Validators.number],
          telefono: [Validators.required],
          cantidadEstudiantes: [Validators.required, Validators.number],
          comentarios: [Validators.maxLength(500)]
        };
        resolve();
    });
  }

  handleSubmit = () => {
    this.form.submit();
  }

  handleClose = () => {
    const { type } = this.store.state.modalLocal;
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

  handleInputChange = (event) => {
    if(event.value==null) return;    
    switch (event.name) {
      case "nombreDepartamento":
      {
        this.descripcionDepartamento = event.selected.text;
        this.provincias = new ComboList([]);
        this.form.get('nombreProvincia').setValue(null);
        this.distritos = new ComboList([]);
        this.form.get('nombreDistrito').setValue(null);
        this.storeUbigeo.currentUbigeoActions.getProvincias(event.value)
        .subscribe(
          info=>{
            this.provincias = !info?new ComboList([]):info;
          }
        )
      }
      break;

      case "nombreProvincia":
      {
        this.descripcionProvincia = event.selected.text;
        this.distritos =new ComboList([]);
        this.form.get('nombreDistrito').setValue(null);
        if(event.value==null) return;
        this.storeUbigeo.currentUbigeoActions.getDistritos(event.value)
        .subscribe(
          info=>{
            this.distritos = !info?new ComboList([]):info;
          })
      }
      break;

      case "nombreDistrito": {
        this.descripcionDistrito = event.selected.text;
      }
      break;

      case "esOtroServicio": {
        if (event.value) {
          this.otroServicioDisabled=false;
          this.form.get('otroServicio').setValidator([Validators.requiredIf(!this.otroServicioDisabled)]);
        } else {
          this.form.get('otroServicio').setValidator(null);
          this.otroServicioDisabled=true;
          this.form.get('otroServicio').setValue('');
          this.form.clearErrors(['otroServicio']);
        }
      }
      break;

      case "esServicioEducativo": {        
        if (event.value) {
          this.mostrarServicioAcademico = false;          
          this.form.get('resolucionAutorizacion').setValidator([Validators.required,Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NUM_RESOLUCION))]);
          this.form.get('fechaAutorizacion').setValidator([Validators.required]);
        } else {
          this.form.get('fechaAutorizacion').setValidator(null);
          this.form.get('resolucionAutorizacion').setValidator(null);
          this.form.get('fechaAutorizacion').setValue('');
          this.form.get('resolucionAutorizacion').setValue('');
          this.mostrarServicioAcademico = true;          
          this.form.clearErrors(['resolucionAutorizacion','fechaAutorizacion']);          
        }
      }
      break;

      default:
        break;
    }
  };

  private buildDepartamentos = ()=>{
    return new Promise(
      (resolve)=>{
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

  keyPress(event: KeyboardEvent) {
    const pattern = /[(),0-9]/;
    const patternAux = /[()]/;
    const inputChar = String.fromCharCode(event.charCode);
    var text = this.form.get('telefono').value;

    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }

    if (patternAux.test(inputChar)) {
      if (((text.indexOf('(') != -1) || (text.length != 0))  &&
        ((text.indexOf(')') != -1) || (text.length != 3))) {
          event.preventDefault();
      }
    }

    if (pattern.test(inputChar)){
      if ((inputChar == '(') && (text.length == 0)){
        this.telefonoMaxLength = 11;
      }
      if ((inputChar == '9') && (text.length == 0)){
        this.telefonoMaxLength = 9;
      }
    }
  }

  // showTelefono = () =>{
  //   const tel = this.form.get('telefono').value;
  //   //console.log('CAYL telefono',tel);
  //   if(tel){
  //     const inicio = tel.substring(0,1);
  //     const inicio2 = tel.substring(0,2);
  //     const inicio3 = tel.substring(0,3);
  //     const inicio4 = tel.substring(0,4);
  //     if(inicio=="9"|| inicio2=="(9"){
  //       //console.log('CAYL celular');
  //       this.mask_telefono = RegTelefono.celular;
  //       return;
  //     }
  //     if(inicio3!="(01" || inicio4!="(01)"){
  //       //console.log('CAYL provincia');
  //       this.mask_telefono = RegTelefono.provincia;
  //       return;
  //     }else{
  //       this.mask_telefono = RegTelefono.telefono;
  //       return;
  //     }
  //   }
  // }

  showTelefono = () =>{
    const tel = this.form.get('telefono').value;
    //console.log('CAYL telefono',tel);
    if(tel){
      this.form.get('telefono').setValidator(null);
      this.form.clearErrors(['telefono']);
      this.form.get('telefono').setValidator([Validators.required]);
      const inicio = tel.substring(0,1);
      const inicio2 = tel.substring(0,2);
      const inicio3 = tel.substring(0,3);
      const inicio4 = tel.substring(0,4);
      if(inicio=="9"|| inicio2=="(9"){
        //console.log('CAYL celular');
        this.form.get('telefono').setValidator([Validators.required,Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_TELEFONO_CELULAR))]);
        this.mask_telefono = RegTelefono.celular;
        return;
      }
      if(inicio3=="(01" || inicio4=="(01)"){
        this.form.get('telefono').setValidator([Validators.required,Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_TELEFONO_FIJO_LIMA))]);
        this.mask_telefono = RegTelefono.telefono;
        return;
      }else{
        //console.log('CAYL provincia');
        this.form.get('telefono').setValidator([Validators.required,Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_TELEFONO_FIJO_PROVINCIA))]);
        this.mask_telefono = RegTelefono.provincia;
        return;
      }
    }else{
      this.form.get('telefono').setValidator(null);
      this.form.clearErrors(['telefono']);
      this.form.get('telefono').setValidator([Validators.required]);
    }
  }


}
