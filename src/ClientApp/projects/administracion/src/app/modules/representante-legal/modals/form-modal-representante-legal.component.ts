import {
  StatusResponse,
  RepresentanteLegal,
  IEntidad,
} from './../../entidades/stores/entidad.store.interface';
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormType,
  FormModel,
  ToastService,
  AlertService,
  ISubmitOptions,
  IMsgValidations,
  ValidateFormFields,
  Validators as ValidatorsSunedu,
  Validators,
} from '@sunedu/shared';
import { ComboList } from '@sunedu/shared';
import { FormGroup, FormBuilder} from '@angular/forms';
import { Subscription, Observable, from } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { IModalRepresentante, TIPODOCUMENTO } from '../stores/representante.store.interface';
import { RepresentanteStore } from '../stores/representante.store';
import { APP_FORM_VALIDATOR, AppAudit, AppCurrentFlowStore, APP_CLOSE_MODAL } from '@lic/core';
import { EnumeradoGeneralStore } from '../../../../../../workflow/src/app/modules/03-formulario/store/maestro/enumerado/enumerado.store';



const MESSAGES = {
   CONFIRM_SAVE: '¿Está seguro de GUARDAR el Representante Legal?',
   CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de Representante Legal?',
   CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
   CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente',
};

const RegTelefono = {  
  telefono:['(',/[0-9]/, /[0-9]/,')',/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
  celular: [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
  provincia:['(',/[0-9]/, /[0-9]/,/[0-9]/,')',/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]
}
const tipoDocumentoCE = 2;

@Component({
  selector: 'form-modal-representante-legal',
  templateUrl: './form-modal-representante-legal.component.html',
  styleUrls: [],
})
export class FormModalRepresentanteLegalComponent implements OnInit, OnDestroy {
  formType = FormType;
  // form: FormGroup;
  // formCombo: FormModel<IModalRepresentante>;
  form:FormModel<any>

  store: RepresentanteStore;
  state$: Observable<IModalRepresentante>;
  subscriptions: Subscription[];
  validators: any;
  //validatorsCombo: any;
  mask_telefono: Array<string | RegExp> = RegTelefono.telefono;
  @Output() entidadEvent = new EventEmitter<IEntidad>();
  tipoDocumentoEnum: ComboList;

  disableDocumentoNumberOnly:boolean = false;
  documentoMaxlength = 0;

  readonly CLOSE_MODAL = APP_CLOSE_MODAL;

  constructor(
    public dialogRef: MatDialogRef<FormModalRepresentanteLegalComponent>,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private alert: AlertService,
    private storeCurrent: AppCurrentFlowStore,
    private storeEnumerado: EnumeradoGeneralStore
  ) {}
  ngOnInit() {
    this.state$ = this.store.state$.pipe(
      map((x) => x.modalRepresentante),
      distinctUntilChanged()
    );

    this.storeEnumerado.currentEnumeradoActions
      .getEnumeradoByNombre('ENU_IDTIPODOCUMENTO')
      .then(resp => {
        this.tipoDocumentoEnum = resp;
      });
      this.buildValidations();
      this.buildForm();
    this.modoTypeoModal();
   
    this.subscribeToState();
    this.showTelefono();
    this.onSetTipoDocumento();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => {
      x.unsubscribe();
    });
  }
  subscribeToState = () => {
    const subs1 = this.store.state$
      .pipe(
        map((x) => x.modalRepresentante.form),
        distinctUntilChanged()
      )
      .subscribe((x) => {
        this.form.patchValue(x);
      });
    this.subscriptions = [subs1];
  };

  onSetTipoDocumento=()=>{
    const tipo = this.form.get('tipoDocumentoEnum').value;
      this.disableDocumentoNumberOnly = true;
      this.documentoMaxlength = 12;
      //console.log(tipo);
      if (TIPODOCUMENTO.DNI == tipo) {
        this.disableDocumentoNumberOnly = false;
        this.documentoMaxlength = 8;  
        this.form.get('numeroDocumento').setValidator([Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_DNI))]);   
      } 
      if (TIPODOCUMENTO.CE == tipo) {
        this.disableDocumentoNumberOnly = true;
        this.documentoMaxlength = 12;  
        this.form.get('numeroDocumento').setValidator([Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_CE))]);   
      }
  }

  private buildForm = () => {
    return new Promise<void>(
      (resolve) => {
        const { form, type } = this.store.state.modalRepresentante;
        //console.log(form);
        if (type === FormType.REGISTRAR) {
          form.tipoDocumentoEnum = 1; // DNI por defecto
          form.version = 0;
        }

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

  private handleValidateOnSave = (): boolean => {
    //console.log('CAYL form',this.form);
    if (this.form.valid) {
      //console.log('CAYL handleValidateOnSave',true);
      return true;
    }
    //console.log('CAYL handleValidateOnSave',false);
    return false;
  };
  handleConfirmOnSave = () => {
    const { type } = this.store.state.modalRepresentante;
    const MESSAGE =
      type === FormType.REGISTRAR
        ? MESSAGES.CONFIRM_SAVE
        : MESSAGES.CONFIRM_UPDATE;
    return this.alert.open(MESSAGE, null, {
      confirm: true
    });
  }


  buildValidations = () => {
    return new Promise<void>(
      (resolve) => {
        this.validators = {
          tipoDocumentoEnum: [ValidatorsSunedu.required]
          ,
          numeroDocumento:[
            Validators.required,
            Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_DNI))
          ]
          ,
          nombres:
            [
              Validators.required,
              Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NOMBRES_APELLIDOS))
            ]
          ,
          apellidoPaterno:
            [
              Validators.required,
              Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NOMBRES_APELLIDOS))
            ]
          ,
          apellidoMaterno:
            [
              Validators.required,
              Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NOMBRES_APELLIDOS)),
            ]
            //,
          //telefono:[] 
           // [Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_TELEFONO))]
            ,
          casillaElectronica: 
            [Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_CASILLA))],
          correo: [Validators.required, Validators.email],
        };
        
        resolve();
      });
  }
  
  beforeSubmit = () => {};

  handleUpdate = (formValue: any): Observable<IEntidad> => {
    let resp:any = null;

    const { entidad } = this.store.state.modalRepresentante;

    const audit = new AppAudit(this.storeCurrent);
    formValue = audit.setUpdate(formValue);

    const updEntidad = this.updateEntidad(formValue, entidad);

    this.store.representanteModalActions.asynUpdateEntidad(updEntidad).subscribe(
      response => {
        this.dialogRef.close();
        const { gridSource } = this.store.state.buscadorRepresentante;
        
        if (response['success']){                
          this.dialogRef.close();
          this.toast.success(MESSAGES.CONFIRM_SAVE);

          this.store.representanteBuscadorActions.fetchPageRepresentanteLegal(
            this.tipoDocumentoEnum,
            entidad.representanteLegales,
            1,
            {
              page: 1,
              skip: 0,
              orderBy: gridSource.orderBy,
              orderDir: gridSource.orderDir,
              pageSize: gridSource.pageSize,
            }
          );
        } else {
          this.toast.warning(response['message']);
        }
    }, error => {
      this.form.enable();
      console.log(this.form);
    });
    return resp;
  }

  handleSave = (formValue: RepresentanteLegal): Observable<StatusResponse> => {
    return from(
      new Promise((resolve, reject) => {
        
        // Engordar representantes y pasar datos de la entidad
        const { entidad } = this.store.state.modalRepresentante;

        const audit = new AppAudit(this.storeCurrent);
        formValue = audit.setInsert(formValue, true);
        formValue.esEditable = true;
        entidad.representanteLegales.push(formValue);
        
        //this.entidadEvent.emit(entidad);
        return from(
          new Promise((resolve, reject) => {
            this.store.representanteModalActions.asynUpdateEntidad(entidad)
              .pipe(
                tap((response) => {
                  this.dialogRef.close();
                  const { gridSource } = this.store.state.buscadorRepresentante;
                  
                  if (response['success']){                
                    this.dialogRef.close();
                    this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
                    this.store.representanteBuscadorActions.fetchPageRepresentanteLegal(
                      this.tipoDocumentoEnum,
                      entidad.representanteLegales,
                      1,
                      {
                        page: 1,
                        skip: 0,
                        orderBy: gridSource.orderBy,
                        orderDir: gridSource.orderDir,
                        pageSize: gridSource.pageSize,
                      }
                    );
                  } else {
                    this.toast.warning(response['message']);
                  }
                })
              )
              .subscribe();
          })
        );
        
        // this.toast.success(MESSAGES.CONFIRM_SAVE_SUCCES);
        /*setTimeout(() => {
          this.dialogRef.close();
        }, 3000); // 3 seconds*/
      })
    );
  };

  
  handleInputChange = (e: any) => {
    this.form.patchValue({ numeroDocumento: null });

    if (e.value === tipoDocumentoCE) {
      this.form
        .get('numeroDocumento')
        .setValidator([
          Validators.required,
          Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_CE)),
        ]);
    } else {
      this.form
        .get('numeroDocumento')
        .setValidator([
          Validators.required,
          Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_DNI)),
        ]);
    }
    return;
  };

  handleSubmit = () => {
    this.form.submit();
  }
  // handleSubmit = () => {
  //   const { type } = this.store.state.modalRepresentante;

    

  //   // ValidateFormFields(this.form);
  //   // console.log(this.form);
  //   // if (!this.form.valid || !this.formCombo.valid) {
  //   //   return false;
  //   // }

  //   // // set Values
  //   // this.form.patchValue({
  //   //   tipoDocumentoEnum: this.formCombo.get('tipoDocumentoEnum').value,
  //   //   telefono: this.formCombo.get('telefono').value
  //   // });

  //   switch (type) {
  //     case FormType.EDITAR: {
  //       this.handleUpdate(this.form.value);
  //       break;
  //     }
  //     case FormType.REGISTRAR: {
  //       this.handleSave(this.form.value);
  //       break;
  //     }
  //   }
  // };

  handleClose = () => {
    const { type } = this.store.state.modalRepresentante;

    if (type !== FormType.CONSULTAR) {
      this.alert
        .open('¿Está seguro que deseas cerrar del formulario? \n Se perderán los datos si continua.', null, {
          confirm: true,
        })
        .then((confirm) => {
          if (confirm) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  };

  private updateEntidad(
    itemObj: RepresentanteLegal,
    entidad: IEntidad
  ): IEntidad {
    const updateItem = entidad.representanteLegales.find(
      (x) => x.id === itemObj.id
    );
    const index = entidad.representanteLegales.indexOf(updateItem);
    entidad.representanteLegales[index] = itemObj;

    return entidad;
  }

  modoTypeoModal = () => {
    const { type, entidad, codigo } = this.store.state.modalRepresentante;

    if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
      const oneRepresentante = entidad.representanteLegales.find(
        (x) => x.id === codigo
      );
      this.store.representanteModalActions.loadDataRepresentanteLegal(
        oneRepresentante
      );
    }
  }

  showTelefono = () =>{
    const tel = this.form.get('telefono').value;
    //console.log('CAYL telefono',tel);
    if(tel){
      this.form.get('telefono').setValidator(null);
      this.form.clearErrors(['telefono']);
      const inicio = tel.substring(0,1);
      const inicio2 = tel.substring(0,2);
      const inicio3 = tel.substring(0,3);
      const inicio4 = tel.substring(0,4);
      
      if(inicio=="9"|| inicio2=="(9"){
        //console.log('CAYL celular');
        this.form.get('telefono').setValidator([Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_TELEFONO_CELULAR))]);
        this.mask_telefono = RegTelefono.celular;
        return;
      }
      if(inicio3=="(01" || inicio4=="(01)"){
        this.form.get('telefono').setValidator([Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_TELEFONO_FIJO_LIMA))]);
        this.mask_telefono = RegTelefono.telefono;
        return;
      }else{
       //console.log('CAYL provincia');
       this.form.get('telefono').setValidator([Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_TELEFONO_FIJO_PROVINCIA))]);
       this.mask_telefono = RegTelefono.provincia;
       return;
      }
    }else{
      this.form.get('telefono').setValidator(null);
      this.form.clearErrors(['telefono']);
    }
  }

  handleInputChangeTipoDocumento = (obj, val) => {    
    //this.form.get('descripcionTipoDocumento').value = obj.selected.text;
    this.form.get('numeroDocumento').value = '';
    this.disableDocumentoNumberOnly = true;
    this.documentoMaxlength = 12;
    console.log(obj);
    //console.log('CAYL obj', obj);
    if (TIPODOCUMENTO.DNI == obj.selected.value) {
      this.disableDocumentoNumberOnly = false;
      this.documentoMaxlength = 8;  
      this.form.get('numeroDocumento').setValidator([Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_DNI))]);   
    } 
    if (TIPODOCUMENTO.CE == obj.selected.value) {
      this.disableDocumentoNumberOnly = true;
      this.documentoMaxlength = 12;  
      this.form.get('numeroDocumento').setValidator([Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_CE))]);   
    }
  }

}
