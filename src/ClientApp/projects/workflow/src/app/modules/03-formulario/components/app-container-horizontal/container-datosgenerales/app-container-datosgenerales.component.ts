import { DatosGenerales } from './../../../store/datosgenerales/datosgenerales.store.model';
import { Component, OnInit, Input } from '@angular/core';
import { APP_FORM_VALIDATOR, IFormularioModel } from '@lic/core';
import { DatosGeneralesStore } from '../../../store/datosgenerales/datosgenerales.store';
import { IDataGridButtonEvent, DialogService, AlertService, FormType, FormModel, Validators, IDataGridEvent, IComboList, ComboList, ISubmitOptions, isNullOrEmptyArray } from '@sunedu/shared';
import { AppFormRepesentantelegalComponent } from '../../app-form/app-form-repesentantelegal/app-form-repesentantelegal.component';
import { IDatosGenerales, IFormDatosGenerales, IGridBuscardorRepresentanteLegal } from '../../../store/datosgenerales/datosgenerales.store.interface';
import { Subscription, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { UbigeoGeneralStore } from '../../../store/external/ubigeo/ubigeo.store';
import { EnumeradoGeneralStore } from '../../../store/maestro/enumerado/enumerado.store';
import { ITrakingProcedimiento } from '@lic/workflow/app/modules/02-workflow/pages/inicio/store/inicio.store.interface';
import { isNullOrUndefined } from 'util';
import { IUbigeo } from '../../../store/external/ubigeo/ubigeo.interface';

import { AppAudit, AppCurrentFlowStore } from '@lic/core';

const MESSAGES = {
  CONFIRM_SAVE: '¿Está seguro de GUARDAR los Datos Generales?',
  CONFIRM_UPDATE: '¿Está seguro de ACTUALIZAR el registro de Datos Generales?',
  CONFIRM_SAVE_SUCCES: 'El registro se guardó correctamente',
  CONFIRM_UPDATE_SUCCES: 'El registro se actualizó correctamente'
};

const RegTelefono = {  
  telefono:['(',/[0-9]/, /[0-9]/,')',/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
  celular: [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
  provincia: ['(', /[0-9]/,/[0-9]/, /[0-9]/, ')', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]
}

@Component({
  selector: 'app-app-container-datosgenerales',
  templateUrl: './app-container-datosgenerales.component.html',
  styleUrls: ['./app-container-datosgenerales.component.scss']
})
export class AppContainerDatosgeneralesComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  @Input() readOnly:boolean=false;

  formType = FormType;
  form:  FormModel<any>;
  readonly state$ = this.store.state$;
  subscriptions: Subscription[]=[];
  validators: any;

  // Ubigeos
  departamentos= new ComboList([]);
  provincias= new ComboList([]);
  distritos= new ComboList([]);

  departamentosPromotora= new ComboList([]);
  provinciasPromotora= new ComboList([]);
  distritosPromotora= new ComboList([]);

  // Enumerados
  tipoGestiones=new ComboList([]); //tipoGestionEnum
  tipoModalidadCreaciones=new ComboList([]);//tipoModalidadCreacionEnum
  tipoDocumentos=new ComboList([]); //=new ComboList([]); //tipoDocumentoEnum

  tipoModalidadDisabled: boolean = true;
  esGestionPrivada: boolean = false;

  soloNumeros: boolean = false;
  cantidadMaximaCaracteresDocumentoPromotora: number = 11; //RUC
  max_date:any;
  mask_telefono: Array<string | RegExp> = RegTelefono.telefono;
  //urlRegex = (?:HTTP(S)?:(?:http(s)? /^(?:HTTP(S)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&\'\(\)\*\+,;=.]+$/;
  //urlRegex = /^\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
  //urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

  //urlRegex = /^((FTP|HTTP|HTTPS):\/\/)?(WWW.)?(?!.*(FTP|HTTP|HTTPS|WWW.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\W#]+)*(\/\W+\?[a-zA-Z0-9_]+=\W+(&[a-zA-Z0-9_]+=\W+)*)?$/;
  //urlRegex = /(:?(?:HTTPS?:\/\/)?(?:WWW\.)?)?[-a-z0-9]+\./;
  //urlRegex = /[(HTTP(S)?):\/\/(WWW\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

  urlRegex = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator


  mensaje_test="Test probando mensaje";

  //this.form.get('numeroDocumento').setValidator([Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_CE))])

  constructor(
    private store: DatosGeneralesStore,
    public dialog: DialogService,
    private alert: AlertService,
    private storeUbigeo: UbigeoGeneralStore,
    private storeEnumerado: EnumeradoGeneralStore,
    private storeCurrent: AppCurrentFlowStore
  ) { 
    this.max_date = new Date();    
    this.buildInitial();
    this.buildValidations();
    this.buildForm();    
    
  }

  async ngOnInit() {

    
     
    this.buildDepartamentos();
    this.buildEnumerados();    
    //this.getSolicitud();


    // this.getRepresentantesLegales();
    // this.getSolicitudMatch();
    

    this.subscribeToState();

    this.disabledForm();

    await this.loadConfiguracion();
  }

  private async loadConfiguracion() {

    this.store.state.datosGenerales.isLoading = true;
    let promises: any[] = [];
    
    //console.log('termino 1');
    
    // const action3 = await this.buildValidations();
    // promises.push(action3);
    // console.log('termino 3');
    // const action4 = await this.buildForm();
    // promises.push(action4);
    // console.log('termino 4');

    // const action2 = await this.buildInitial();
    // promises.push(action2);
    // console.log('termino 2');
    
    // const action0 = await this.buildDepartamentos();
    // promises.push(action0);
    // console.log('termino 0');
    // const action1 = await this.buildEnumerados();
    // promises.push(action1);

    

    const action6 = await this.getSolicitud();
    promises.push(action6);
    //console.log('termino 6');

    
    const action8 = await this.getRepresentantesLegales();
    promises.push(action8);
    //console.log('termino 8');


    const action7 = await this.getSolicitudMatch();
    promises.push(action7);
    //console.log('termino 7');


    
    
    // const action5 = await this.subscribeToState();
    // promises.push(action5);
    // console.log('termino 5');

    // const action9 = await this.disabledForm();
    // promises.push(action9);
    // console.log('termino 9');

    await Promise.all(promises).then(() => { this.store.state.datosGenerales.isLoading = false; });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
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

  //#region loadConfiguracion
  private buildDepartamentos = () => {
    return new Promise<void>(
      async (resolve) => {
        this.storeUbigeo.currentUbigeoActions.getDepartamentos().then(
          (info)=>{
            //console.log(info);
            if(info){
              this.departamentos = info['value'];
              this.departamentosPromotora = info['value'];
              resolve();
            }    
          }
        );
      }
    );
  }
  private buildEnumerados = () => {
    return new Promise<void>(
      async (resolve) => {
        await this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDTIPOGESTION')
          .then(info => {
            //console.log('CAYL Gestion',info);
            this.tipoGestiones = info;
            //console.log(info);
          });

        await this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDMODALIDADCONSTITUCION')
          .then(info => {
            //console.log('CAYL Modalidad',info);
            this.tipoModalidadCreaciones = info;
            //console.log(info);
          });

        await this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDTIPODOCUMENTO')
          .then(info => {
            //console.log('CAYL TipoDocumento',info);
            this.tipoDocumentos = info;
            //console.log(info);
          });
        resolve();
      });
  }
  private buildInitial = () => {
    return new Promise<void>(
      (resolve) => {
        this.store.actionDatoGenerales.setInit(this.modelData);
        //console.log('ReadOnly Datos generales CAYL',this.modelData.formulario.configuracionTabs.configuracionDatosGenerales.readOnly);
        //this.disabledAll = this.modelData.formulario.configuracionTabs.configuracionDatosGenerales.readOnly;
        //this.store.actionDatoGenerales.asynFetchDatosGenerales(this.modelData.solicitud.guid);
        resolve();
      });
  }
  buildValidations = () => {
    return new Promise<void>(
      (resolve) => {
        this.validators = {
          nombre: [Validators.required],
          ruc: [Validators.required],
          razonSocial: [Validators.required],
          numeroDocumentoCreacion: [Validators.required,Validators.maxLength(20),Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_NUM_RESOLUCION))],
          fechaDocumentoCreacion: [Validators.required],
          tipoGestionEnum: [Validators.required],
          //tipoModalidadCreacionEnum: [Validators.required],
          tipoModalidadCreacionEnum: [Validators.requiredIf({ tipoGestionEnum: 1 })], //Privada
          //modalidadConstitucion: [Validators.requiredIf({ tipoGestionEnum: 1 })], //Privada

          domicilio: [Validators.required],
          nombreDepartamento: [Validators.required],
          nombreProvincia: [Validators.required],
          nombreDistrito: [Validators.required],
          referencia:[Validators.required],
          telefono: [Validators.required],
          paginaWeb: [Validators.required, Validators.pattern(this.urlRegex)],

          nombrePromotora: [Validators.requiredIf({ tipoGestionEnum: 1 })],
          numeroDocumento: [Validators.requiredIf({ tipoGestionEnum: 1 }), Validators.pattern(new RegExp(APP_FORM_VALIDATOR.LIC_RE_RUC))],
          razonSocialPromotora: [Validators.requiredIf({ tipoGestionEnum: 1 })],
          oficinaRegitral: [Validators.requiredIf({ tipoGestionEnum: 1 })],
          numeroPartida: [Validators.requiredIf({ tipoGestionEnum: 1 })],
          asiento: [Validators.requiredIf({ tipoGestionEnum: 1 })],
          domicilioLegal: [Validators.requiredIf({ tipoGestionEnum: 1 })],
          nombreDepartamentoPromotora: [Validators.requiredIf({ tipoGestionEnum: 1 })],
          nombreProvinciaPromotora: [Validators.requiredIf({ tipoGestionEnum: 1 })],
          nombreDistritoPromotora: [Validators.requiredIf({ tipoGestionEnum: 1 })],
        };
        resolve();
      });
  }
  private buildForm = () => {
    return new Promise<void>(
      (resolve) => {
        const { form, type } = this.store.state.datosGenerales;
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
  beforeSubmit = () => {
  }
  private handleValidateOnSave = (): boolean => {
    this.setEnforceBusinessRules();
    //console.log('CAYL form',this.form);
    if (this.form.valid) {
      //console.log('CAYL handleValidateOnSave',true);
      return true;
    }
    //console.log('CAYL handleValidateOnSave',false);
    return false;
  };
  handleConfirmOnSave = () => {
    const { type } = this.store.state.datosGenerales;
    const MESSAGE =
      type === FormType.REGISTRAR
        ? MESSAGES.CONFIRM_SAVE
        : MESSAGES.CONFIRM_UPDATE;
    return this.alert.open(MESSAGE, null, {
      confirm: true
    });
  }

  subscribeToState = () => {
    return new Promise<void>(
      (resolve) => {
        const subs1 = this.store.state$.pipe(map(x => x.datosGenerales.form), distinctUntilChanged())
          .subscribe(x => {
            this.form.patchValue(x);
          });
        this.subscriptions = [subs1];
        resolve();
      });
  }
  private getSolicitud = () => {
    return new Promise<void>(
      (resolve) => {
        let current = this.storeCurrent.currentFlowAction.get();
        //console.log(current);
        this.store.actionDatoGenerales.asyncGetDatosGenerales(current.idVersionSolicitud).then(() => {
          resolve();
        });
      });
  }
  private getSolicitudMatch = () => {
    return new Promise<void>(
      (resolve) => {
        // GET BODY
        let body = this.store.actionDatoGenerales.getDatosGeneralesBody();

        // ENTIDAD
        this.form.get('nombre').setValue(body.entidad.nombre);
        this.form.get('ruc').setValue(body.entidad.ruc);
        this.form.get('razonSocial').setValue(body.entidad.razonSocial);
        this.form.get('numeroDocumentoCreacion').setValue(body.entidad.numeroDocumentoCreacion);
        this.form.get('fechaDocumentoCreacion').setValue(body.entidad.fechaDocumentoCreacion);

        // tipoGestionEnum
        //console.log('CAYL tipoGestiones',this.tipoGestiones);
        let tipoGestion = this.tipoGestiones.list.find(x => x.value == body.entidad.tipoGestionEnum);
        tipoGestion = isNullOrUndefined(tipoGestion) ? null : tipoGestion.value;

        this.form.get('tipoGestionEnum').setValue(tipoGestion);
        this.handleInputChange({ name: 'tipoGestionEnum', value: tipoGestion });

        // tipoModalidadCreacionEnum
        let tipoModalidad = this.tipoModalidadCreaciones.list.find(x => x.value == body.entidad.tipoModalidadCreacionEnum);
        tipoModalidad = isNullOrUndefined(tipoModalidad) ? null : tipoModalidad.value;
        this.form.get('tipoModalidadCreacionEnum').setValue(tipoModalidad);

        // DOMICILIO LEGAL
        this.form.get('domicilio').setValue(body.domicilioLegal.domicilio);
        this.form.get('referencia').setValue(body.domicilioLegal.referencia);
        this.form.get('telefono').setValue(body.domicilioLegal.telefono);
        this.form.get('paginaWeb').setValue(body.domicilioLegal.paginaWeb);

        // PROMOTORA
        this.form.get('numeroDocumento').setValue(body.promotora.numeroDocumento);
        this.form.get('nombrePromotora').setValue(body.promotora.nombreDenominacion);
        this.form.get('oficinaRegitral').setValue(body.promotora.oficinaRegitral);
        this.form.get('numeroPartida').setValue(body.promotora.numeroPartida);
        this.form.get('asiento').setValue(body.promotora.asiento);
        this.form.get('razonSocialPromotora').setValue(body.promotora.razonSocial);
        //this.form.get('rubro').setValue(body.promotora.rubro);
        this.form.get('domicilioLegal').setValue(body.promotora.domicilioLegal);

        // tipoDocumentoEnum
        let tipoDocumento = this.tipoDocumentos.list.find(x => x.value == body.promotora.tipoDocumentoEnum);
        if (tipoDocumento) {
          this.form.get('tipoDocumentoEnum').setValue(tipoDocumento.value);
        }

        // Buscar Ubigeo
        this.ubigeoMatch('general', body.domicilioLegal.ubigeo);
        this.ubigeoMatch('promotora', body.promotora.ubigeo);

        this.showTelefono();
        resolve();
      });
  }
  getRepresentantesLegales = () => {
    return new Promise<void>(
      (resolve) => {
        //console.log('CAYL representantesLegales', this.store.actionDatoGenerales.getDatosGeneralesBody());
        const rl = this.store.actionDatoGenerales.getDatosGeneralesBody().representantesLegales;
        let items: IGridBuscardorRepresentanteLegal[] = [];
        if (rl.length) {
          //this.store.representanteLegalBuscadorActions.resetBuscadorRepresentanteLegal();
          rl.forEach(rep => {
            let documento = this.tipoDocumentos.list.find(x => x.value == rep.tipoDocumentoEnum);
            let item: IGridBuscardorRepresentanteLegal = {
              nombresApellidos: `${rep.nombres} ${rep.apellidoPaterno} ${rep.apellidoMaterno}`,
              tipoDocumento: documento.text,
              numeroDocumento: rep.numeroDocumento,
              cargo: rep.cargo,
              esResponsable:(rep.esResponsable)?"Si":"No"
            }
            item.nombresApellidos = item.nombresApellidos.toUpperCase();
            item.esResponsable = item.esResponsable.toUpperCase();
            items.push(item);
          });

          this.store.representanteLegalBuscadorActions.setBuscadorRepresentanteLegal(items, this.readOnly);
          resolve();
        }
      });
  }
  //#endregion


  handleLoadData = (e: IDataGridEvent) => {
    //console.log(e);
  }


  ubigeoMatch = (model: string, ubigeo: string) => {
    return new Promise<void>(
      (resolve) => {
        if (!isNullOrUndefined(ubigeo)) {
          let modelDepartamento: string = model == "general" ? 'nombreDepartamento' : 'nombreDepartamentoPromotora';
          let modelProvincia: string = model == "general" ? 'nombreProvincia' : 'nombreProvinciaPromotora';
          let modelDistrito: string = model == "general" ? 'nombreDistrito' : 'nombreDistritoPromotora';

          // buscar el distrito;
          let distrito: IUbigeo;


          this.storeUbigeo.currentUbigeoActions.getInformacionUbigeoByCodigo(ubigeo)
            .subscribe(dist => {
              distrito = dist;
              //console.log(dist);
              if (distrito != null) {
                this.storeUbigeo.currentUbigeoActions.getInformacionUbigeoByCodigo(distrito.referencia)
                  .subscribe(provincia => {
                    //console.log(provincia);
                    this.storeUbigeo.currentUbigeoActions.getInformacionUbigeoByCodigo(provincia.referencia)
                      .subscribe(departamento => {
                        //console.log(departamento);
                        this.form.get(modelDepartamento).setValue(departamento.codigo);
                        this.storeUbigeo.currentUbigeoActions.getProvincias(departamento.codigo)
                          .subscribe(prov => {
                            switch (model) {
                              case 'general':
                                this.provincias = new ComboList([]);
                                this.distritos = new ComboList([]);
                                this.provincias = prov;
                                break;
                              case 'promotora':
                                this.provinciasPromotora = new ComboList([]);
                                this.distritosPromotora = new ComboList([]);
                                this.provinciasPromotora = prov;
                                break;
                              default:
                                break;
                            }
                            this.form.get(modelProvincia).setValue(provincia.codigo);
                            this.storeUbigeo.currentUbigeoActions.getDistritos(provincia.codigo)
                              .subscribe(dist => {
                                //this.distritos=[];
                                switch (model) {
                                  case 'general':
                                    this.distritos = new ComboList([]);
                                    this.distritos = dist;
                                    break;
                                  case 'promotora':
                                    this.distritosPromotora = new ComboList([]);
                                    this.distritosPromotora = dist;
                                    break;
                                  default:
                                    break;
                                }
                                this.form.get(modelDistrito).setValue(distrito.codigo);
                              });
                          });
                      });
                  });
              }
            });
        }
        resolve();
      });
  }


  handleInputChange = ({ name, value }) => {

    if (value == null) return;

    switch (name) {
      case "nombreDepartamento":
        {
          this.provincias = new ComboList([]);
          this.form.get('nombreProvincia').setValue(null);
          this.distritos = new ComboList([]);
          this.form.get('nombreDistrito').setValue(null);
          this.storeUbigeo.currentUbigeoActions.getProvincias(value)
            .subscribe(
              info => {
                this.provincias = !info? new ComboList([]) : info;
                //console.log(this.provincias);
              }
            )
          // this.provincias =  this.storeUbigeo.currentUbigeoActions.getProvincias(value)==null?[]:this.storeUbigeo.currentUbigeoActions.getProvincias(value);
          // console.log(this.provincias);
        }
        break;

      case "nombreProvincia":
        {
          this.distritos =new ComboList([]);
          this.form.get('nombreDistrito').setValue(null);
          if (value == null) return;
          this.storeUbigeo.currentUbigeoActions.getDistritos(value)
            .subscribe(
              info => {
                this.distritos = !info? new ComboList([]) : info;
                //console.log(this.distritos);
              })
          // this.distritos =  this.storeUbigeo.currentUbigeoActions.getDistritos(value)==null?[]:this.storeUbigeo.currentUbigeoActions.getDistritos(value);
          // console.log(this.distritos);
        }
        break;

      case "nombreDepartamentoPromotora":
        {
          this.provinciasPromotora =new ComboList([]);
          this.form.get('nombreProvinciaPromotora').setValue(null);
          this.distritosPromotora = new ComboList([]);
          this.form.get('nombreDistritoPromotora').setValue(null);
          this.storeUbigeo.currentUbigeoActions.getProvincias(value)
            .subscribe(
              info => {
                this.provinciasPromotora = !info? new ComboList([]) : info;
              });
          // this.provinciasPromotora =  this.storeUbigeo.currentUbigeoActions.getProvincias(value)==null?[]:this.storeUbigeo.currentUbigeoActions.getProvincias(value);
          // console.log(this.provinciasPromotora);
        }
        break;

      case "nombreProvinciaPromotora":
        {
          this.distritosPromotora = new ComboList([]);
          this.form.get('nombreDistritoPromotora').setValue(null);
          this.storeUbigeo.currentUbigeoActions.getDistritos(value)
            .subscribe(
              info => {
                this.distritosPromotora = !info? new ComboList([]) : info;
              });
          // this.distritosPromotora =  this.storeUbigeo.currentUbigeoActions.getDistritos(value)==null?[]:this.storeUbigeo.currentUbigeoActions.getDistritos(value);
          // console.log(this.distritosPromotora);
        }
        break;

      case "tipoModalidadCreacionEnum":
        {
          if (value == 3) { //OTROS
            this.tipoModalidadDisabled = false;
          } else {
            this.tipoModalidadDisabled = true;
          }
        }
        break;

      case "tipoGestionEnum":
        {
          if (value == 2) { //Gestión Pública
            this.esGestionPrivada = false;
          } else {//Gestión Privada
            this.esGestionPrivada = true;
          }
          this.setReloadModalidadConstitucionOCreacion();
        }
        break;

      default:
        break;
    }
  };

  private setReloadModalidadConstitucionOCreacion() {
    this.storeEnumerado.currentEnumeradoActions.getEnumeradoByNombre('ENU_IDMODALIDADCONSTITUCION')
      .then(info => {
        let tipoGestionEnum = this.form.get('tipoGestionEnum').value
        if (tipoGestionEnum == 1) { //Gestión Privada
          this.tipoModalidadCreaciones = info;
          this.handleInputChange({ name: 'tipoModalidadCreacionEnum', value: this.form.get('tipoModalidadCreacionEnum').value });
        } else if (tipoGestionEnum == 2) { //Gestión Pública
        
        }
      });
  };

  private setEnforceBusinessRules = () => {
    return new Promise<void>(
      (resolve) => {
        // GET BODY

        //1) Si TipoGestion=Pública, Limpiar datos de Promotora
        let tipoGestionEnum = this.form.get('tipoGestionEnum').value
        if (tipoGestionEnum == 2) { //Gestión Pública
          this.form.get('tipoDocumentoEnum').setValue(null);

          this.form.get('numeroDocumento').setValidator(null);
          this.form.clearErrors(['numeroDocumento']);
          this.form.get('numeroDocumento').setValue('');

          this.form.get('nombrePromotora').setValue('');
          this.form.get('oficinaRegitral').setValue('');
          this.form.get('numeroPartida').setValue('');
          this.form.get('asiento').setValue('');
          this.form.get('razonSocialPromotora').setValue('');
          this.form.get('rubro').setValue('');
          this.form.get('domicilioLegal').setValue('');
          this.form.get('nombreDepartamentoPromotora').setValue(null);
          this.form.get('nombreProvinciaPromotora').setValue(null);
          this.form.get('nombreDistritoPromotora').setValue(null);
        }
        resolve();
      });
  }
 
  private setSolicitudMatch = () => {
    return new Promise<void>(
      (resolve) => {
        // GET BODY
        let body = this.store.actionDatoGenerales.getDatosGeneralesBody();

        //const audit = new AppAudit(this.storeCurrent);
        //body = audit.setUpdate(body);

        //debugger;
        // ENTIDAD
        body.entidad.nombre = this.form.get('nombre').value;
        body.entidad.ruc = this.form.get('ruc').value;
        body.entidad.razonSocial = this.form.get('razonSocial').value;
        body.entidad.numeroDocumentoCreacion = this.form.get('numeroDocumentoCreacion').value;
        body.entidad.fechaDocumentoCreacion = this.form.get('fechaDocumentoCreacion').value;
        body.entidad.tipoGestionEnum = this.form.get('tipoGestionEnum').value;
        body.entidad.tipoModalidadCreacionEnum = this.form.get('tipoModalidadCreacionEnum').value;
        //body.entidad = audit.setUpdate(body.entidad);

        // DOMICILIO LEGAL
        body.domicilioLegal.domicilio = this.form.get('domicilio').value;
        body.domicilioLegal.referencia = this.form.get('referencia').value;
        body.domicilioLegal.telefono = this.form.get('telefono').value;
        body.domicilioLegal.paginaWeb = this.form.get('paginaWeb').value;
        body.domicilioLegal.ubigeo = this.form.get('nombreDistrito').value;
        //body.domicilioLegal = audit.setUpdate(body.domicilioLegal);

        // PROMOTORA
        body.promotora.tipoDocumentoEnum = "2";//RUC //this.form.get('tipoDocumentoEnum').value;
        body.promotora.numeroDocumento = this.form.get('numeroDocumento').value;
        body.promotora.nombreDenominacion = this.form.get('nombrePromotora').value;
        body.promotora.oficinaRegitral = this.form.get('oficinaRegitral').value;
        body.promotora.numeroPartida = this.form.get('numeroPartida').value;
        body.promotora.asiento = this.form.get('asiento').value;
        body.promotora.razonSocial = this.form.get('razonSocialPromotora').value;
        body.promotora.rubro = this.form.get('rubro').value;
        body.promotora.domicilioLegal = this.form.get('domicilioLegal').value;
        body.promotora.ubigeo = this.form.get('nombreDistritoPromotora').value;
        //body.promotora = audit.setUpdate(body.promotora);

        const audit = new AppAudit(this.storeCurrent);
        body = audit.setUpdate(body);

        //console.log('CAYL body',body);
        this.store.actionDatoGenerales.setDatosGeneralesBody(body);

        resolve();
      });
  }

  handleSubmit = () => {
    //this.setEnforceBusinessRules();
    this.form.submit();
  }

  handleSave = (formValue: any, options: ISubmitOptions): any => {
    //console.log('CAYL handleSave');
      this.setEnforceBusinessRules().then(() => {
        this.setSolicitudMatch().then(() => {
          this.store.actionDatoGenerales.asyncSetDatosGenerales().then((response: any) => {
            //this.dialogRef.close();
            //console.log(response);
            let traking: ITrakingProcedimiento = response;
            if (traking.success) {
              // Ir a bandeja
              this.alert.open(traking.message, 'Datos Generales', { icon: 'success' });
            } else {
              this.alert.open(traking.message, 'Datos Generales', { icon: 'warning' });
            }
            this.disabledForm();
          });
        })
      })
  }

  handleUpdate = (formValue: any, options: ISubmitOptions): any => {
    // return this.store.maestroPersonaModalActions.asynUpdateMaestroPersona(formValue)
    //   .pipe(tap(response => {
    //     this.dialogRef.close();
    //     this.toast.success(MESSAGES.CONFIRM_UPDATE_SUCCES);
    //   }));
  }

  // handleSaveDatosGenerales = () => {
  //   // Despues de actualizar los datos, mando a grabar.
  //   if (!this.form.valid) {
  //     return;
  //   }
  //   this.alert.open('¿Está seguro de que desea grabar los datos generales?', 'Confirmación', { confirm: true }).then(confirm => {
  //     if (confirm) {
  //       // Ejecutar el metodo del MATCH CAYL
  //       this.setEnforceBusinessRules().then(() => {
  //         this.setSolicitudMatch().then(() => {
  //           this.store.actionDatoGenerales.asyncSetDatosGenerales().then((response: any) => {
  //             //this.dialogRef.close();
  //             //console.log(response);
  //             let traking: ITrakingProcedimiento = response;
  //             if (traking.success) {
  //               // Ir a bandeja
  //               this.alert.open(traking.message, 'Datos Generales', { icon: 'success' });
  //             } else {
  //               this.alert.open(traking.message, 'Datos Generales', { icon: 'warning' });
  //             }
  //           });
  //         })
  //       })
  //     }
  //   });

  // }

  handleClickButton = (e: IDataGridButtonEvent) => {
    // console.log(e);
    // console.log(e.item.numeroDocumento);
    // PASAR EL NUMERODOCUMENTO!!
    switch (e.action) {
      case 'CONSULTAR':
        this.openModalConsultar(e.item.tipoDocumento, e.item.numeroDocumento);
        break;
      case 'EDITAR':
        this.openModalUpdate(e.item.tipoDocumento, e.item.numeroDocumento);
        break;
      case 'ELIMINAR':
        // this.deleteRepresentanteLegal(e.item._id);
        break;

    }
  }

  openModalConsultar = (tipoDocumento: string, numeroDocumento: string) => {
    this.store.representantenLegalModalActions.setModalReadOnly(tipoDocumento, numeroDocumento);
    const dialogRef = this.dialog.openMD(AppFormRepesentantelegalComponent, { disableClose: false });
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.storeUbigeo = this.storeUbigeo;
    dialogRef.componentInstance.provincias = new ComboList([]);
    dialogRef.componentInstance.distritos = new ComboList([]);
    //console.log(this.departamentos);
    dialogRef.componentInstance.departamentos = this.departamentos;
    // dialogRef.afterClosed().subscribe(() => {
    //   this.store.representantenLegalModalActions.resetModalRepresentanteLegal();
    // });
  }

  openModalUpdate = (tipoDocumento: string, numeroDocumento: string) => {
    this.store.representantenLegalModalActions.setModalEdit(tipoDocumento, numeroDocumento);
    const dialogRef = this.dialog.openMD(AppFormRepesentantelegalComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.storeUbigeo = this.storeUbigeo;
    dialogRef.componentInstance.departamentos = this.departamentos;
    dialogRef.componentInstance.provincias = new ComboList([]);
    dialogRef.componentInstance.distritos = new ComboList([]);
    dialogRef.componentInstance.succesEvent
      .subscribe(
        sucess => {
          if (!isNullOrUndefined(sucess)) {
            //console.log(valor);
            if (sucess == true) {
              // True;
              this.getRepresentantesLegales();
            }
          }
        }
      );

    // dialogRef.afterClosed().subscribe(() => {
    //   this.store.representantenLegalModalActions.resetModalRepresentanteLegal();
    // });
  }

  disabledForm=()=>{
    return new Promise<void>(
      (resolve)=>{
        if(this.readOnly){
          //console.log('CAYL','entro al disabledForm');
          this.form.disable();
        }else{
          this.form.enable();
        }
        this.form.get('nombre').disabled=true;
        this.form.get('ruc').disabled=true;
        this.form.get('razonSocial').disabled=true;

      resolve();
    });

  }




}
