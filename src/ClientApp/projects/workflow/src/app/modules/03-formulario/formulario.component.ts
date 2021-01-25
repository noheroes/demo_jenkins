import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AlertService,
  DialogService,
  ToastService,
  FormModel,
  FormType,
  IComboList,
  ComboList,
} from '@sunedu/shared';
import { FormularioStore } from '../03-formulario/store/formulario/formulario.store';
import { Observable } from 'rxjs';
import {
  WorkflowService,
  IFormularioModel,
  IFormularioRequest,
} from '@lic/core';
import { ModalValidarFinalizarComponent } from 'src/app/core/components/app-modal/app-modal-validar-finalizar/app-modal-validar-finalizar.component';
import { SolicitudStore } from './store/solicitud/solicitud.store';
import { SolicitudStoreModel } from './store/solicitud/solicitud.store.model';
import { FormularioStoreModel } from './store/formulario/formulario.store.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { UbigeoGeneralStore } from './store/external/ubigeo/ubigeo.store';
import { EnumeradoGeneralStore } from './store/maestro/enumerado/enumerado.store';
import { PaisGeneralStore } from './store/external/pais/pais.store';
import { EntidadGeneralStore } from './store/external/entidad/entidad.store';
import { MaestroProgramaService } from './service/maestroprograma.service';
import { IExternalPrograma } from './store/maestroprogramasegunda/maestroprogramasegunda.store.interface';


const MESSAGES = {
  VALIDACION_SUCCESS: 'Se validó correctamente',
  FINALIZAR_SUCCESS: 'Se finalizó la actividad correctamente',
};

@Component({
  selector: 'app-formularios',
  templateUrl: './formulario.component.html',
  providers: [
    FormularioStore,
    SolicitudStore,
    UbigeoGeneralStore,
    PaisGeneralStore,
    EntidadGeneralStore
  ],
})
export class FormularioComponent implements OnInit {
  //idFlujo: string;
  // idActividad: string;
  // idProceso: string;
  // idProcesoBandeja: string;
  // idVersionSolicitud: string;
  listadoVersion: any = [];
  flagPersonalDilic: boolean=false;
  fechaAdmisibilidad: Date;
  headerData: any = {
    numero: '',
    fechaCreacion: null,
    // fechaSolicitud: null,
  };

  headerDefinition = {
    fields: [
      // {
      //   label: 'Actividad',
      //   field: 'actividad',
      // },
      {
        label: 'N° de solicitud',
        field: 'numero',
      },
      {
        label: 'Universidad',
        field: 'universidad',
      },
      {
        label: 'RUC',
        field: 'rucUniversidad',
      },
      {
        label: 'Fecha de creación',
        field: 'fechaCreacion',
        dateTimeFormat: 'DD/MM/YYYY hh:mm A',
        isDatetime: true,
      },
      {
        label: 'Fecha de presentación',
        field: 'fechaPresentacion',
        dateTimeFormat: 'DD/MM/YYYY hh:mm A',
        isDatetime: true,
      }, 
      {
        label: null,
        field: null,
        isDatetime: true,
        custom: 'admisibilidad-template'
      },
      /*{
        label: null,
        field: null,
        custom: 'admisibilidad-template',
      },*/
      {
        label: null,
        field: null,
        custom: 'version-template',
      },
    ],
  };

  modelData: IFormularioModel = null;
  seleccionFirmantes: Array<any> = [];
  title: string;
  // formularioSource: any = null;
  contentSource: any = null;
  loading: boolean = false;
  rutaBandeja: string = '/workflow/bandeja';

  fallaCarga: boolean = false;
  mensajesFalla: string[] = [];

  programaOne: IExternalPrograma[] = [];
  programaTwo: IExternalPrograma[] = [];

  frontSettings: any;

  public readonly state$: Observable<FormularioStoreModel> = this
    .formularioStore.state$;
  public readonly stateSolicitud$: Observable<SolicitudStoreModel> = this
    .solicitudStore.state$;

  form: FormModel<any>;
  disabledFinalizar:boolean;
  esModoConsulta:boolean;
  esConsultaSolicitud:boolean;

  currentVersion:any;
  tab:number;

  //@Output() modoConsulta: EventEmitter<boolean> = new EventEmitter();
  //finalizar:boolean=false;

  constructor(
    private workflowService: WorkflowService,
    private formularioStore: FormularioStore,
    private solicitudStore: SolicitudStore,
    private dialogService: DialogService,
    private toastService: ToastService,
    private alert: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private storeCurrent: AppCurrentFlowStore,
    private storeUbigeo: UbigeoGeneralStore,
    private storeEnumerado: EnumeradoGeneralStore,
    private maestroProgramaService: MaestroProgramaService
  ) {
    // if (this.route.snapshot.paramMap.get('idFlujo')) {
    //   this.idFlujo = this.route.snapshot.paramMap.get('idFlujo');
    //   this.idActividad = this.route.snapshot.paramMap.get('idActividad');

    //   this.idProceso = this.route.snapshot.queryParams.idProceso;
    //   this.esModoConsulta = this.route.snapshot.queryParams.esModoConsulta;
    //   if(!this.esModoConsulta){
    //     this.idProcesoBandeja = this.route.snapshot.queryParams.idProcesoBandeja;
    //     this.idVersionSolicitud = this.route.snapshot.queryParams.idVersionSolicitud;  
    //   }
      
    // } else {
    //   this.OperacionNoPermitida('No se puede acceder a esta pagina');
    // }
    const current = this.storeCurrent.currentFlowAction.get();
    this.esModoConsulta = current.esModoConsulta;
    console.log(current.esModoConsulta);

    if(!current.idProceso){
      this.OperacionNoPermitida('No se puede acceder a esta pagina');
    }  

    console.log('CAYL entro a formulario');
  }

  async ngOnInit() {
    // this.state$ = this.formularioStore.state$.pipe(
    //   map(x => x.actividadFormularioModel),
    //   distinctUntilChanged()
    // );
    this.buildForm();
    // const formularioRequest = { idProceso: this.idProceso, idProcesoBandeja: this.idProcesoBandeja, nombreActividad: this.idActividad };
    // this.formularioStore.actionActividadFormulario.asyncGetFormularioModel(formularioRequest);
    await this.loadConfiguracion();
  }

  // return new Promise(
  //   (resolve)=>{

  //   });

  buildForm = () => {
    return new Promise<void>((resolve) => {
      const defaultModel = { id: '1' };
      this.form = new FormModel<any>(FormType.CONSULTAR, defaultModel, null);
      resolve();
    });
  };

  handleInputChange(obj): void { 
    console.log(obj);
    this.loading=true;
    this.alert
    .open('¿Está seguro de cambiar de versión de la solicitud?', null, { confirm: true })
    .then((confirm) => {
      if (confirm) {
        console.log('CAYL entro a la version');
        this.currentVersion = obj.value;
        this.form.get("id").setValue(this.currentVersion);

        this.storeCurrent.currentFlowAction.setChangeVersionSolicitud(this.currentVersion.toUpperCase());
        console.log(this.storeCurrent.currentFlowAction.get());
        this.loadFormulario();
        
        this.loading=false;

      }else{
        this.loading=false;
        this.form.get("id").setValue(this.currentVersion.value);
      }
    });
  }



  private OperacionNoPermitida = (message: string) => {
    this.alert.open(message, null, { icon: 'warning' }).then(() => {
      this.router.navigate(['/workflow/bandeja']);
    });
  };

  private async loadConfiguracion() {
    this.loading = true;
    const promises: any[] = [];

    // console.log('termino 1');
    const action2 = await this.loadUbigeo();
    promises.push(action2);
    // console.log('termino 2');
    const action3 = await this.loadEnumerado();
    promises.push(action3);

    const action3C = await this.loadFrontSettings();
    promises.push(action3C);

    const action3A = await this.loadExternalPrograma(true);
    promises.push(action3A);

    const action3B = await this.loadExternalPrograma(false);
    promises.push(action3B);

    // console.log('termino 3');
    // const action4 = await this.buildForm();
    // promises.push(action4);
    // console.log('termino 4');

    const action1 = await this.loadFormulario();
      promises.push(action1); 

    // if(!this.esModoConsulta){
    //   const action1 = await this.loadFormularioModel();
    //   promises.push(action1);  
    // }else{
    //   const action1A = await this.loadFormularioModelConsulta();
    //   promises.push(action1A);
    // }



    // const action5 = await this.loadFinalizar();
    // promises.push(action5);


    await Promise.all(promises).then(() => {
      this.loading = false;
    });
  }

  async loadFrontSettings() {
    return new Promise<void>((resolve) => {
      // Trayendo Front Settings
      this.formularioStore.actionActividadFormulario.asyncGetFrontSettings().then(info => {
        this.frontSettings = info;
        //console.log('CAYL sets',this.frontSettings);
        resolve();
      }
      );
    });
  }


  private async loadFormulario(){
    return new Promise<void>((resolve) => {
      const current = this.storeCurrent.currentFlowAction.get();
      let proceso={};

      if(!this.esModoConsulta){
        proceso = {
          idProceso: current.idProceso,
          idProcesoBandeja: current.idProcesoBandeja,
          idUsuario: current.idUsuario,
          idVersion: current.idVersionSolicitud
        };
      }else{
        proceso = {
          idProceso: current.idProceso,
          idVersion: current.idVersionSolicitud
        }
      }

      if(!this.esModoConsulta){
        this.workflowService.getFormaluarioModel(proceso).subscribe(
          async (response: IFormularioModel) => {
            
            //this.esModoConsulta = response.formulario.esConsultaSolicitud;
            this.esConsultaSolicitud =  response.formulario.esConsultaSolicitud;
            console.log('CAYL NO esModoConsulta',response, this.esModoConsulta, this.esConsultaSolicitud);
            await this.setFormularioModel(response, this.esModoConsulta);
            resolve();
          },
          (err) => {
            // console.log(err);
            this.loading = false;
          }
        );
      }else{
        this.workflowService.getFormaluarioModelConsulta(proceso).subscribe(
          async (response: IFormularioModel) => {
            console.log('CAYL SI esModoConsulta',response);
           this.setFormularioModel(response,false)
           resolve();
          },
          (err) => {
            // console.log(err);
            this.loading = false;
          }
        );
      }
    }); 
  }

  setFormularioModel=(response:IFormularioModel, vieneDeModel:boolean)=>{
    return new Promise<void>(
      (resolve)=>{ 
        //console.log(response);
        const current = this.storeCurrent.currentFlowAction.get();
        //console.log(current);
        const { configuracionDocumentosOperacion } = response.formulario.configuracionTabs;
    
        if (configuracionDocumentosOperacion) {
          const settings = configuracionDocumentosOperacion.settings;
          if (settings) {
            const porRoles = settings['configuracionPorRoles'];
            if (porRoles) {
              const rol = porRoles.find(r => r.roles.includes(current.rolDescripcion.toUpperCase()));
              console.log(rol);
              const documento = {
                listarEstados: rol.listarEstados,
                listarSubtipos: rol.listarSubtipos,
                listadoAccionesPermitidas: rol.listadoAccionesPermitidas,
                operacion: rol.operacion,
                estadoOrigenDocumento: rol.estadoOrigenDocumento,
                estadoDestinoDocumento: rol.estadoDestinoDocumento,
                registrarSubtipos: rol.registrarSubtipos,
                registrarSubtiposMulti: rol.registrarSubtiposMulti,
                registrarCategoriaDocumento: rol.registrarCategoriaDocumento,
                registrarExtensionesPermitidasArchivos: rol.registrarExtensionesPermitidasArchivos,
                registrarPesoMaximoMBArchivos: rol.registrarPesoMaximoMBArchivos,
                restringirDescargaDePlantillas: rol.restringirDescargaDePlantillas,
                registrarInformacionComplementaria: rol.registrarInformacionComplementaria
              }
              current.documento = documento;
            }
          }
        }else{
          
          const  configDoc  = response.formulario.configuracionDocumento;
          if(configDoc){
            const documento = {
              listarEstados :  configDoc.listarEstados,
              listarSubtipos: configDoc.listarSubtipos,
              estadoDestinoDocumento: configDoc.estadoDestinoDocumento
            }
            current.documento = documento;
            }
        }
    
        const { configuracionFirmaMedioVerificacion } = response.formulario.configuracionTabs;
        if(configuracionFirmaMedioVerificacion){
          const setting  = configuracionFirmaMedioVerificacion.settings;
          if(setting){
            current.esFirmadoDocumento = setting.esFirmaDocumento;
            current.esFirmaAT = setting.esFirmaAT;  
          }
        }
    
        current.subsanacionReadonly = response.formulario.subsanacionReadonly;
        this.disabledFinalizar = current.subsanacionReadonly;
        current.conActualizacionColaboradores = response.formulario.conActualizacionColaboradores;
    
        const { detalleBandeja } = response;
        const metaData = detalleBandeja['metaData'];
        if(this.esModoConsulta && !vieneDeModel){
          current.idVersionSolicitud = metaData.idVersionSolicitud;
        }
                    
        //current.esModoConsulta = this.esModoConsulta;
        current.codigoActividad = response.formulario.codigo;
        current.idVersionFlujo = response.formulario.idVersionFlujo;
    
        current.idFlujo = response.formulario.idFlujo;
        current.conFinalizacionFirma = response.formulario.conFinalizacionFirma;
        current.cabecera = response.cabecera;

        const cVersiones=response.cabecera.versiones
        console.log(current.idVersionSolicitud);
        console.log(cVersiones);

        this.listadoVersion = new ComboList(cVersiones);

        if (cVersiones.length > 0) {
          this.currentVersion = cVersiones.find(x=>x.value.toLowerCase() == current.idVersionSolicitud.toLowerCase())
          console.log(this.currentVersion);
          //this.currentVersion = response.cabecera.versiones[0].value;
          this.form.get("id").setValue(this.currentVersion.value);  
        }
      
        this.storeCurrent.currentFlowAction.set(current);
        //console.log(current);
        this.storeCurrent.currentFlowAction.setExternalPrograma(this.programaOne, this.programaTwo);
    
        this.storeCurrent.currentFlowAction.setFrontSettings(this.frontSettings);
        if(current.idRol.toUpperCase() == this.frontSettings.codigoRolPersonalDILIC){
          this.flagPersonalDilic = true;
          this.fechaAdmisibilidad = response.cabecera.fechaAdmisibilidad;
        }
        else{
          this.flagPersonalDilic = false;// false;
        }

        // console.log(current);
        // console.log(this.flagPersonalDilic);
        // response.formulario.configuracionTabs.configuracionSolicitud.visible = false;
        // response.formulario.configuracionTabs.configuracionRecibidos.visible = false;
    
        this.modelData = { ...this.modelData, ...response };
        //console.log('CAYL modeldata', this.modelData);
        this.setTitle();
        this.setHeaderData();
        this.setContentSource();
      resolve();
    });
    
  }

  private async loadUbigeo() {
    return new Promise<void>((resolve) => {
      this.storeUbigeo.currentUbigeoActions.asyncGetUbigeoTodos().then(() => {
        let todo = this.storeUbigeo.currentUbigeoActions.getUbigeos();
        //console.log(todo);
        if (!todo) {
          this.fallaCarga = true;
          this.mensajesFalla.push(
            `No es posible obtener informacion de los ubigeos [UBIGEO]. Favor consulte al administrador del sistema.`
          );
          // console.log('mensajes Falla UBIGEO CAYL');
          // console.log(this.mensajesFalla);
        }
        resolve();
      });
    });
  }

  private async loadEnumerado() {
    return new Promise<void>((resolve) => {
      this.storeEnumerado.currentEnumeradoActions
        .asyncGetEnumeradosTodos()
        .then(() => {
          let todo = this.storeEnumerado.currentEnumeradoActions.getEnumerados();
          // console.log(todo);
          if (!todo) {
            this.fallaCarga = true;
            this.mensajesFalla.push(
              `\nNo es posible obtener informacion de los tipos [ENUM]. Favor consulte al administrador del sistema.`
            );
            // console.log('mensajes Falla ENUM CAYL');
            // console.log(this.mensajesFalla);
          }
          resolve();
        });
    });
  }

  private async loadExternalPrograma(one: boolean) {
    return new Promise<void>(
      (resolve) => {
        this.maestroProgramaService.getCINE(one ? "1" : "2", one ? "1" : "2").subscribe(
          programa => {
            if (programa) {
              //console.log('CAYL programa',programa);
              if (one) { this.programaOne = programa; } else { this.programaTwo = programa; }
              resolve();
            }
          }
        )
      });
  }

  private setTitle = () => {
    this.title = this.modelData.detalleBandeja.actividad.nombre;
  };

  private setHeaderData = () => {
    const current = this.storeCurrent.currentFlowAction.get();
    if (current.cabecera) {
      this.headerData.numero = current.cabecera.numeroSolicitud;
      this.headerData.fechaCreacion = current.cabecera.fechaInicio;
      this.headerData.fechaPresentacion =  current.cabecera.fechaPresentacion;
      this.headerData.universidad = current.cabecera.nombreEntidad;
      this.headerData.rucUniversidad = current.cabecera.rucEntidad;
      this.headerData.fechaAdmisibilidad = current.cabecera.fechaAdmisibilidad;
    }
    // this.headerData.actividad = this.title;
    /*if (current.expediente) {
      this.headerData.numero = current.expediente.codigo;
      this.headerData.fechaCreacion = current.expediente.fechaCreacion;
      // this.headerData.fechaSolicitud = current.expediente.fechaSolicitud;
    }*/
  };

  private setContentSource = () => {
    this.contentSource = Object.entries(
      this.modelData.formulario.configuracionTabs
    ).map((k: [string, any]) => ({
      key: k[0],
      ...k[1],
    }));
  };

  get showTareas() {
    return (
      this.modelData &&
      this.modelData.tareas &&
      this.modelData.tareas.length > 0
    );
  }

  handleIrBandeja = (e) => {
    this.router.navigate([this.rutaBandeja]);
  };

  onFirmantes=(e)=>{
    //console.log('CAYL onFimantes',e);
    this.seleccionFirmantes=e;
  }

  handleValidar = (e) => {
    this.loading = true;
    this.workflowService.validarActividad().subscribe(
      (resp) => {
        this.loading = false;
        this.toastService.success(MESSAGES.VALIDACION_SUCCESS);
      },
      (err) => {
        this.loading = false;
        this.dialogService.openLG(ModalValidarFinalizarComponent, {
          data: {
            errors: err.errors,
          },
        });
      }
    );
  };

  private MappingRequest = (e): any => {
    const procedimiento = this.storeCurrent.currentFlowAction.get();
    let request = {
      idVersion: procedimiento.idVersionSolicitud,
      idProceso: procedimiento.idProceso,
      idProcesoBandeja: procedimiento.idProcesoBandeja,
      idUsuario: procedimiento.idUsuario.toUpperCase(),
      idTipoUsuario: procedimiento.idTipoUsuario,
      idAplicacion: procedimiento.idAplicacion,
      CodigoRolUsuarioAutor: procedimiento.idRol,
      idEntidad: procedimiento.idEntidad,
      idFlujo:procedimiento.idFlujo,
      codigoActividad:procedimiento.codigoActividad,
      idVersionFlujo: procedimiento.idVersionFlujo,
      idProcesoFinalizacion:"",
      idProcesoBandejaFinalizacion:procedimiento.conFinalizacionFirma?null:procedimiento.idProcesoBandeja,
      conActualizacionColaboradores: procedimiento.conActualizacionColaboradores,
      idSolicitudVersion:procedimiento.idVersionSolicitud,
      idSolicitud:procedimiento.cabecera.idSolicitud,
      formulario: {
        ...this.modelData.formulario,
        ConDecesion: this.modelData.formulario.decision.conDecision,
        Seleccion: e.seleccion,
        colaboradores: this.seleccionFirmantes.filter(
          (item) => item.seleccionado == true
        )
      }
    };
    if (this.modelData.formulario.conFinalizacionElaboracionDocumento) {
      request = {
        ...request,
        formulario: {
          ...request.formulario,
          listarEstados: procedimiento.documento.listarEstados,
          listarSubtipos: procedimiento.documento.listarSubtipos,
          descUsuarioAutor: procedimiento.usuarioFullName,
          idRolUsuarioAutor: procedimiento.idRol,
          descRolUsuarioAutor: procedimiento.rolDescripcion,
          categoriaDocumentoEnum: procedimiento.documento.registrarCategoriaDocumento,
          subTipoDocumento: 0,//tipo?tipo.value:null,
          estadoOrigenDocumento: procedimiento.documento.estadoOrigenDocumento,
          estadoDestinoDocumento: procedimiento.documento.estadoDestinoDocumento,
          idAplicacion: procedimiento.idAplicacion.toUpperCase(),
        }
      };
    }

    return request;
  };

  private validateFinalizacion = (request: any): [boolean, string] => {
    const configuracionTabs = this.modelData.formulario.configuracionTabs;
    if (
      configuracionTabs.hasOwnProperty('configuracionFirmantes') &&
      this.modelData.formulario.configuracionTabs.configuracionFirmantes.visible
    ) {
      return this.validateSeleccionFirmantes(request);
    }

    // if(!this.finalizar){
    //   return [false, 'No existe ningún archivo cargado en Medios de Verificación'];
    // }
    return [true, null];
  };

  private validateSeleccionFirmantes = (request: any): [boolean, string] => {
    const resultado =
      request.formulario.colaboradores.filter((item) => item.seleccionado)
        .length === 0
        ? false
        : true;
    return [resultado, 'Debe seleccionar un representante legal'];
  };

  handleFinalizar = async (e) => {
    //await this.loadFinalizar();
    const request = this.MappingRequest(e);
    // console.log(request);
 //  return;
    const [validate, mesaje] = this.validateFinalizacion(request);
    console.log(request);
    if (!validate) {
      this.alert.open(mesaje, null, { confirm: false, icon: 'info' });
      return;
    }
    this.loading = true;
    this.workflowService.finalizarActividadOrquestador(request).subscribe(
      (resp) => {
        if (resp.success) {
          this.toastService.success(MESSAGES.FINALIZAR_SUCCESS);

          setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl('/').then(() => {
              this.router.navigated = false;
              this.router.navigate([this.router.url]);
            });
          }, 2500);
        } else {
          this.loading = false;
          this.alert.open(resp.message, null, { confirm: false, icon: 'warning' });
          return;
        }

      },
      (err) => {
        this.loading = false;
        this.dialogService.openLG(ModalValidarFinalizarComponent, {
          data: {
            errors: err.errors,
          },
        });
      }
    );
  };

  handleRetry = () => {
    window.location.href = window.location.origin;
  };

}
