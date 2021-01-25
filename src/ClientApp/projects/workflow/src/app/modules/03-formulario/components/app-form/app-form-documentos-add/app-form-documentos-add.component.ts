import { DocumentoModal } from './../../../store/documento/documento.store.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IModalDocumento } from './../../../store/documento/documento.store.interface';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormType, FormModel, IMsgValidations, ToastService, AlertService, ValidateFormFields} from '@sunedu/shared';
import { Observable, Subscription, from } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { AppCurrentFlowStore, APP_FORM_VALIDATOR, APP_CLOSE_MODAL } from '@lic/core';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { StatusResponse } from '@lic/administracion/app/modules/entidades/stores/entidad.store.interface';
import { DocumentosOperacionStore } from '../../../store/documentos-operacion/documentos-operacion.store';
import { GestorArchivosComponent } from 'src/app/core/components/gestor-archivos/gestor-archivos.component';
import { formatDate } from '@angular/common';
import { IModalDocumentosOperacion } from '../../../store/documentos-operacion/documentos-operacion.store.interface';

const MESSAGES = {
    CONFIRM_SAVE: '¿Está seguro de GUARDAR el documento?',
    CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro del documento?',
    CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
    CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
  };

@Component({
    selector: 'app-form-documentos-add',
    templateUrl: './app-form-documentos-add.component.html',
    styleUrls: ['./app-form-documentos-add.component.css']
  })
export class AppFormDocumentoAddComponent implements OnInit{
    formType = FormType;
    form: FormGroup;
    store: DocumentosOperacionStore;
    state$: Observable<IModalDocumentosOperacion>;
    subscriptions: Subscription[];
    validators: IMsgValidations;
    tipoDocumento:any;
    show:boolean;
    readonly CLOSE_MODAL = APP_CLOSE_MODAL;
    idDocumento:string;
    fileName:string;
    restringirDescarga:boolean;
    max_date:any;
    registrarInformacion:boolean;
    tieneArchivo:boolean;

    configFile: any = {
      tiposPermitidos: '.pdf,.xlsx,.xls',
      pesoMaximoEnMB: 50,
      puedeCargarArchivo: true,
      puedeSubirArchivo:false,
      puedeDescargarArchivo: false,
      puedeVerHistorialArchivo: false,
      usarBorradores: false,
      preservarNombreArchivo: false,
      puedeEliminarArchivo: false,
      puedeVerTags: false,
      puedeEditarTags: false,
      version: 0 // OJO CAYL version de archivo verificar.
    };

    origenEnum:string;

    @Output() documentoEvent = new EventEmitter<boolean>();

    @ViewChild(GestorArchivosComponent) gestor: GestorArchivosComponent;

    constructor(
        public dialogRef: MatDialogRef<AppFormDocumentoAddComponent>,
        private formBuilder: FormBuilder,
        private toast: ToastService,
        private alert: AlertService,
        private storeCurrent: AppCurrentFlowStore
      ) {
        this.origenEnum="2";
        this.max_date = new Date();
        this.tieneArchivo = false;
      }

    ngOnInit() {
        this.state$ = this.store.state$.pipe(
            map((x) => x.documentosOperacionModal),
            distinctUntilChanged()
        );
        this.show=true;

        // this.modoTypeoModal();
        this.buildValidations();
        this.buildForms();
        this.subscribeToState();

        // const { type} = this.store.state.documentosOperacionModal;
 
        // if (type === FormType.EDITAR) {
        //   if(this.fileName){
        //     console.log(this.fileName);
        //     this.gestor.paramsExtra = this.getParametros();
        //   }            
        // }

        // this.configFile = {
        //   ...this.configFile,
        //   fileName:this.fileName
        // }
    }

    // modoTypeoModal = () => {
    //     const { type, entidad, codigo } = this.store.state.modalRepresentante;
    
    //     if (type === FormType.EDITAR || type === FormType.CONSULTAR) {
    //       const oneRepresentante = entidad.representanteLegales.find(
    //         (x) => x.id === codigo
    //       );
    
    //       this.store.representanteModalActions.loadDataRepresentanteLegal(
    //         oneRepresentante
    //       );
    //     }
    // };

    buildValidations = () => {
        this.validators = {
          
          tipo: [
            { name: 'required', message: 'El campo es requerido' },
          ],          
          // nombreOficial: [
          //   { name: 'required', message: 'El campo es requerido' },
          //   { name: 'pattern', message: 'Formato no válido' },
          // ],
          fechaEmision: [
            { name: 'required', message: 'El campo es requerido' },
          ],
          // numero: [
          //   { name: 'required', message: 'El campo es requerido' },
          //   { name: 'pattern', message: 'Sólo se permite números' },
          // ]
        };
    };

    private buildForms = () => {
        const { form, type, tipo } = this.store.state.documentosOperacionModal;
        
        form.tipo = tipo?tipo.text:null; 
        // if (type === FormType.REGISTRAR) {
        // }
    
        this.form = this.formBuilder.group({
        //   id: [form.id, []],
        //   esActivo: [form.esActivo, []],
        //   esEliminado: [form.esEliminado, []],
        //   fechaCreacion: [form.fechaCreacion, []],
        //   fechaModificacion: [form.fechaModificacion, []],
        //   usuarioCreacion: [form.usuarioCreacion, []],
        //   usuarioModificacion: [form.usuarioModificacion, []],
        //   version: [form.version, []],
        //   addedAtUtc: [form.addedAtUtc, []],
        //   tipoDocumentoEnum: [form.tipoDocumentoEnum, []],
    
          tipo: [
            form.tipo,
            [
              //Validators.required,
            //   Validators.pattern(
            //     form.tipoDocumento === 'ARCHIVO PNG'
            //       ? APP_FORM_VALIDATOR.LIC_RE_CE
            //       : APP_FORM_VALIDATOR.LIC_RE_DNI
            //   ),
            ],
          ],
          nombreOficial: [
            form.nombreOficial,
            [
              //Validators.required,
              //Validators.pattern(APP_FORM_VALIDATOR.LIC_RE_LETRAS),
            ],
          ],
          fechaEmision: [
            form.fechaEmision,
            [
              Validators.required
            ],
          ],
          numero: [
            form.numero,
            [
              // Validators.required,
              // Validators.pattern(APP_FORM_VALIDATOR.LIC_RE_NUMERO),
            ],
          ],
          descripcion:[
            form.descripcion,[]
          ]
        });

        // documentos
        const current = this.storeCurrent.currentFlowAction.get();
        this.configFile= {
          ...this.configFile,
          tiposPermitidos: current.documento.registrarExtensionesPermitidasArchivos,
          pesoMaximoEnMB: current.documento.registrarPesoMaximoMBArchivos,
          fileName:this.fileName
        }
        this.registrarInformacion = current.documento.registrarInformacionComplementaria;

        //console.log('CAYL configFile', this.configFile);
    };

    subscribeToState = () => {
    const subs1 = this.store.state$
        .pipe(
        map((x) => x.documentosOperacionModal.form),
        distinctUntilChanged()
        )
        .subscribe((x) => {
        this.form.patchValue(x);
        });
    this.subscriptions = [subs1];
    };

    onClearValidationsInfo=()=>{
      this.form.get('fechaEmision').clearValidators();
      this.form.get('fechaEmision').updateValueAndValidity();
    }

    setTieneArchivo=(e)=>{
      console.log('CAYL setTieneArchivo',e);
      this.tieneArchivo=e;
    }

    handleSubmit = () => {
        const { type } = this.store.state.documentosOperacionModal;

        if(!this.registrarInformacion){
          this.onClearValidationsInfo();
        }
    
        ValidateFormFields(this.form);

        console.log(this.form);
    
        if (!this.form.valid) {
          console.log('Existe un error en la validacion');
          return false;
        }

        //this.gestor.handleUploadFile();
    
        // set Values
        // this.form.patchValue({
        //   tipoDocumentoEnum: this.formCombo.get('tipoDocumentoEnum').value,
        // });

        //const { type } = this.store.state.documentosOperacionModal;
        const MESSAGE =
          type === FormType.REGISTRAR
            ? MESSAGES.CONFIRM_SAVE
            : MESSAGES.CONFIRM_UPDATE;

        this.alert
        .open(MESSAGE, null, {
          confirm: true,
        })
        .then((confirm) => {
          if (confirm) {

            // Si es registrar => es IC => has file => all to GA
            // Si es registrar => es IC => hasn't file => error GA
            // Si es registrar => no IC => has file => all to GA
            // Si es registrar => no IC => hasn't file => error GA

            // Si es editar    => no IC => has file => all to GA
            // Si es editar    => no IC => hasn't file => error GA

            // Si es editar    => es IC => has file => all to GA
            // Si es editar    => es IC => hasn't file => only camps RTD

            if(type === FormType.EDITAR && this.registrarInformacion && !this.tieneArchivo){
              const nombreOficial = this.form.get('nombreOficial').value;
              const numeroDocumento = this.form.get('numero').value;
              const fechaEmision = this.form.get('fechaEmision').value;
              const descripcion = this.form.get('descripcion').value;

              const current = this.storeCurrent.currentFlowAction.get();

              const parametros = {
                idDocumento: this.idDocumento,
                idUsuario:current.idUsuario,
                nombreOficial:nombreOficial?nombreOficial.toUpperCase():null,
                numeroDocumento:numeroDocumento?numeroDocumento.toUpperCase():null,
                fechaEmision:fechaEmision?formatDate(fechaEmision, 'dd/MM/yyyy', 'en-US'):null,
                descripcion:descripcion?descripcion.toUpperCase():null
              }

              this.store.documentosOperacionModalActions.asyncFetchRegistrarRTD(parametros)
              .subscribe((response) =>{
                if (response.success) {
                  this.alert.open(response.message, null, { icon: 'success' });
                  
                } else {
                  this.alert.open(response.message, null, { icon: 'warning' });
                }
              });
              this.dialogRef.close();
            }else{
              this.gestor.paramsExtra = this.getParametros();
              this.gestor.handleUploadFile();  
            }
          }
        });

        // return this.alert.open(MESSAGE, null, {
        //   confirm: true
        // });


        // if(this.handleConfirmOnSave()){
          
        // }
    
        // switch (type) {
        //   case FormType.EDITAR: {
        //       if(this.handleConfirmOnSave()){
        //         this.handleUpdate(this.form.value);
        //       }
        //     break;
        //   }
        //   case FormType.REGISTRAR: {
        //     if(this.handleConfirmOnSave()){
        //         this.handleSave(this.form.value);
        //     }
        //     break;
        //   }
        // }
    };

    handleConfirmOnSave = () => {
        const { type } = this.store.state.documentosOperacionModal;
        const MESSAGE =
          type === FormType.REGISTRAR
            ? MESSAGES.CONFIRM_SAVE
            : MESSAGES.CONFIRM_UPDATE;
        return this.alert.open(MESSAGE, null, {
          confirm: true
        });
      }
    
    handleClose = () => {
        const { type } = this.store.state.documentosOperacionModal;
    
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

    handleUpdate = (
        formValue: DocumentoModal
      ): Observable<StatusResponse> => {
        return from(
          new Promise((resolve, reject) => {
            // Actualizar representantes y pasar datos de la entidad
    
            // const audit = new AppAudit(this.storeCurrent);
            // formValue = audit.setUpdate(formValue);
    
        //     this.store.actionDatoGenerales.setUpdateRepresentanteLegal(formValue).then(()=>{
        //         this.store.actionDatoGenerales.asyncSetDatosGenerales().then((response: any) => {
        //           //this.dialogRef.close();
        //           // console.log(response);
        //           let traking:ITrakingProcedimiento = response;
        //           if(traking.success){
        //             // Ir a bandeja
        //             this.alert.open(traking.message, 'Representante Legal', { icon: 'success'});
        //             this.succesEvent.emit(true);
        //             this.dialogRef.close();
        //           }else{
        //             this.alert.open(traking.message, 'Representante Legal', { icon: 'warning'});
        //             this.succesEvent.emit(false);
        //             this.dialogRef.close();
        //           }
        //           resolve();
        //           setTimeout(() => {
        //             this.dialogRef.close();
        //           }, 3000); // 3 seconds
        //         });
        //   });
        })
    )};

    handleSave = (formValue: DocumentoModal): Observable<StatusResponse> => {
        return from(
            new Promise((resolve, reject) => {
              // Actualizar representantes y pasar datos de la entidad
      
              // const audit = new AppAudit(this.storeCurrent);
              // formValue = audit.setUpdate(formValue);
      
          //     this.store.actionDatoGenerales.setUpdateRepresentanteLegal(formValue).then(()=>{
          //         this.store.actionDatoGenerales.asyncSetDatosGenerales().then((response: any) => {
          //           //this.dialogRef.close();
          //           // console.log(response);
          //           let traking:ITrakingProcedimiento = response;
          //           if(traking.success){
          //             // Ir a bandeja
          //             this.alert.open(traking.message, 'Representante Legal', { icon: 'success'});
          //             this.succesEvent.emit(true);
          //             this.dialogRef.close();
          //           }else{
          //             this.alert.open(traking.message, 'Representante Legal', { icon: 'warning'});
          //             this.succesEvent.emit(false);
          //             this.dialogRef.close();
          //           }
          //           resolve();
          //           setTimeout(() => {
          //             this.dialogRef.close();
          //           }, 3000); // 3 seconds
          //         });
          //   });
          })
    )};

    getParametros():any {
      const current = this.storeCurrent.currentFlowAction.get();
      const { tipo } = this.store.state.documentosOperacionModal;

      const nombreOficial = this.form.get('nombreOficial').value;
      const numeroDocumento = this.form.get('numero').value;
      const fechaEmision = this.form.get('fechaEmision').value;
      const descripcion = this.form.get('descripcion').value;

      let parametros = {
        idDocumento: this.idDocumento,
        idSolicitudVersion: current.idVersionSolicitud,
        idSolicitud:current.cabecera.idSolicitud,
        idProcesoOrigen: current.idProcesoOrigen,
        idProcesoBandejaOrigen: current.idProcesoBandejaOrigen,
        idUsuarioAutor: current.idUsuario,
        descUsuarioAutor: current.usuarioFullName,
        idRolUsuarioAutor: current.idRol,
        descRolUsuarioAutor: current.rolDescripcion,
        usuarioAutorEsRolAdministrado:current.idTipoRolSIU==1?true:false,
        categoriaDocumentoEnum:current.documento.registrarCategoriaDocumento,
        subTipoDocumento: tipo?tipo.value:null,
        estadoOrigenDocumento:current.documento.estadoOrigenDocumento,
        estadoDestinoDocumento:current.documento.estadoDestinoDocumento,
        idAplicacion:current.idAplicacion.toUpperCase(),
        origenEnum:"2",
        fileName:this.fileName,
        
        nombreOficial:nombreOficial?nombreOficial.toUpperCase():null,
        numeroDocumento:numeroDocumento?numeroDocumento.toUpperCase():null,
        fechaEmision:fechaEmision?formatDate(fechaEmision, 'dd/MM/yyyy', 'en-US'):null,
        descripcion:descripcion?descripcion.toUpperCase():null
      } 
      console.log(parametros);     
      return parametros;
    }

    getInfoFile=(e: any)=>{
      console.log(e);
      if(e){
        if(e.success)
        {
          this.documentoEvent.emit(true);
          this.dialogRef.close();
        }
      }
    } 

    onPlantilla=async ()=>{
      const { tipo } = this.store.state.documentosOperacionModal;
      const respuesta:any = await this.store.documentosOperacionActions.asyncDownLoadPlantilla(tipo.value); // tipo.value
      // .subscribe(
        
      // );
      //console.log('CAYL onPlantilla respuesta',respuesta);
      if(respuesta){
        if(respuesta.message){
          this.alert.open(`${respuesta.message} (${tipo.text})`, null, { icon: 'warning' });
        }
      }
    }


    
}