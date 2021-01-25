import { DocumentosOperacionStore } from './../../../store/documentos-operacion/documentos-operacion.store';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { IFormularioModel, AppCurrentFlowStore } from '@lic/core';
import { AlertService, ComboList, DialogService, IMsgValidations, ValidateFormFields } from '@sunedu/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppFormDocumentoAddComponent } from '../../app-form/app-form-documentos-add/app-form-documentos-add.component';
import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material';
import { ModalFirmaComponent, StatusFirma } from 'src/app/core/components/app-modal/app-modal-firma/app-modal-firma.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-container-documentos-operacion',
  templateUrl: './app-container-documentos-operacion.component.html',
  styleUrls:['./app-container-documentos-operacion.component.css','./app-container-documentos-operacion.component.scss'],
  providers: [
    DocumentosOperacionStore
  ]
})
export class AppContainerDocumentosOperacionComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  subscriptions: Subscription[];
  documentosFase:any[]=[];
  tipos=new ComboList([]);
  form: FormGroup;
  validators: IMsgValidations;
  permitirDuplicado:boolean=false;
  readOnly:boolean=false;
  inProcess: boolean = false;
  items: any = [];
  current: any;
  requestReplicate: any;

  readonly state$ = this.store.state$.pipe(map(x => x.documentosOperacion), distinctUntilChanged());

  //readonly state$ = this.documentoStore.state$;
  versiones:any=[];
  idArchivo:string="";
  showButton:boolean=false;
  restringirDescarga:boolean=false;
  subTiposFiltered:number[];
  

  constructor(
    //private documentoStore: DocumentoStore,
    private formBuilder: FormBuilder,
    private store: DocumentosOperacionStore,
    private storeCurrent: AppCurrentFlowStore,
    public dialog: DialogService,
    private alert: AlertService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }

  ngOnInit() {
    // console.log(this.configTab);
    // this.configTab.name='Medios de Verificación'; // Corrigiendo error de acento "�"
    // console.log(this.configTab);
    const current = this.storeCurrent.currentFlowAction.get();
    this.store.documentosOperacionActions.setInit(this.modelData);
    this.readOnly = this.configTab.readOnly || this.modelData.formulario.subsanacionReadonly;
    console.log('CAYL configtab', this.configTab);
    console.log(current);
    this.restringirDescarga = current.documento.restringirDescargaDePlantillas;
    console.log(this.restringirDescarga);
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    this.getTiposDocumentos();
    this.loadDocumentosOperacion();
    
  }

  subscribeToState = () => {
    const subs2 = this.store.state$.pipe(map(x => x.documentosOperacion), distinctUntilChanged())
      .subscribe(x => {
        // this.form.get('formDatosGenerales').patchValue(x.formDatosGenerales);
        // this.form.get('formDomicilioLegal').patchValue(x.formDomicilioLegal);
        // this.form.get('formPromotora').patchValue(x.formPromotora);
      });
    this.subscriptions = [subs2];
  }

  buildValidations = () => {
    this.validators = {
      tipoDocumento: [
        { name: 'required', message: 'El campo es Tipo Documento es requerido' },
      ]
    };
  }
  private buildForm = () => {

    const { form, type } = this.store.state.documentosOperacion;
    this.form = this.formBuilder.group({
      descActividad:[form.descActividad],
      archivoNombre:[form.archivoNombre],
      subTipoDocumentoDesc:[form.subTipoDocumentoDesc],
      fechaCargaDesde:[form.fechaCargaDesde],
      numeroDocumento:[form.numeroDocumento],
      fechaCargaHasta:[form.fechaCargaHasta],
      estadoDocumento:[form.estadoDocumento],


      //tipoDocumento: [form.tipoDocumento,[Validators.required]],
      tipoDocumento: [form.tipoDocumento, [Validators.required]],

    });
  }

  getTiposDocumentos=()=>{
    return new Promise<void>(
      (resolve)=>{ 
        const current = this.storeCurrent.currentFlowAction.get();
        //console.log(current);
        //const subtipos = [13002,13003,17005,17004];
        const subtipos = current.documento.registrarSubtipos;
        const multiples = current.documento.registrarSubtiposMulti;
        let juntos = [];

        if(multiples){
          juntos = subtipos.concat(multiples);
        }else{
          juntos = subtipos;
        }
        
        const filteredArray = juntos.filter(function(item, pos){
          return juntos.indexOf(item)== pos; 
        });
        
        this.subTiposFiltered = filteredArray;
        console.log( filteredArray );

        //console.log(subtipos);
        this.store.documentosOperacionActions.asyncFetchTipoDocumentosByid(this.subTiposFiltered)
        .subscribe(()=>{
            this.store.documentosOperacionActions.getTipoDocumentos().subscribe(
              info => {
                info.list.forEach((element) => {
                  element.text = element.text.toUpperCase();
                });
                this.tipos = info;
                resolve();
              }
            );
        })
    });
  }

  loadDocumentosOperacion=()=>{
    const current = this.storeCurrent.currentFlowAction.get();
    //console.log('CAYL current',current);
    const parametros = {
      idSolicitudVersion:current.idVersionSolicitud,
      idsSubtiposDocumento: this.subTiposFiltered, //current.documento.listarSubtipos,
      idsEstadosDocumento:current.documento.listarEstados
  }
    this.store.documentosOperacionActions.asyncFetchDocumentosOperacion(parametros).subscribe(
      info=>{ 
        //console.log(info);
        info.documentos.forEach((element) => {
          element.estadoDocumento = element.estadoDocumento.toUpperCase();
          element.subtipoEspecializacion = element.subtipoEspecializacion.toUpperCase();
          element.metadataArchivo.archivoNombre = element.metadataArchivo.archivoNombre.toUpperCase();
        });
        this.documentosFase=info.documentos;
      }
    )
  }

  handleChange=(e:any)=>{
    //console.log(e);
  }

  onAdd = () =>{
    ValidateFormFields(this.form);
    if (!this.form.valid) {
      return false;
    }
    const valor = this.form.controls['tipoDocumento'].value;
    const tipo = this.tipos.list.find(x=>x.value==valor);

    //console.log('CAYL onAdd',tipo);

    const current = this.storeCurrent.currentFlowAction.get();
    const multiples = current.documento.registrarSubtiposMulti;
    if(multiples){
      const find = multiples.includes(tipo.value);
      if(!find){
        const doc = this.documentosFase.find(x=>x.subTipoDocumento==tipo.value);
        if(doc){
          if(!this.permitirDuplicado){
            this.alert.open(`No se permiten documentos duplicados (${tipo.text})`, null, { icon: 'warning' });
            return;
          }
        }
      }
    }else{
      const doc = this.documentosFase.find(x=>x.subTipoDocumento==tipo.value);
      if(doc){
        if(!this.permitirDuplicado){
          this.alert.open(`No se permiten documentos duplicados (${tipo.text})`, null, { icon: 'warning' });
          return;
        }
      }
    }

 
    this.store.documentosOperacionModalActions.setModalAdd(tipo);
    if(tipo){
      const dialogRef = this.dialog.openMD(AppFormDocumentoAddComponent);
      dialogRef.componentInstance.store = this.store;
      dialogRef.componentInstance.idDocumento = null;
      dialogRef.componentInstance.restringirDescarga = this.restringirDescarga;
      dialogRef.componentInstance.documentoEvent.subscribe(
        async (result)=>{
          //console.log(result);
          if(result){
            await this.loadDocumentosOperacion();
          } 
        }
      )
    }
  }

  downloadDocumentoOperacion = (idArchivo:string, version:number)=>{
    // console.log(idArchivo);
    // console.log(version);    
    this.store.documentosOperacionActions.asyncDownLoadDocumentoOperacion(idArchivo, version);
  }

  eliminarDocumentoOperacion = (documento:any) =>{
    //console.log(documento);
    
    this.alert
      .open('¿Está seguro de eliminar el archivo?', null, { confirm: true })
      .then((confirm) => {
        if (confirm) {
          //let idUsuario = contenido.contenidoArchivoFileInfo.usuarioCreacion?contenido.contenidoArchivoFileInfo.usuarioCreacion:null;
          const current = this.storeCurrent.currentFlowAction.get();

          const parametros = {
            trackingNumber: documento.metadataArchivo.trackingNumber,
            idDocumento:documento.id,
            idUsuario: current.idUsuario,
            invocarEliminacionArchivo: true,
            idAplicacion: current.idAplicacion
          }

          this.store.documentosOperacionActions
            .asyncDeleteDocumentoOperacion(parametros)
            .subscribe(async (reponse) => {
              if (reponse.success) {
                await this.loadDocumentosOperacion();
                //await this.refreshExpand();
                this.alert.open(reponse.message, null, { icon: 'success' });                
              } else {
                this.alert.open(reponse.message, null, { icon: 'warning' });
              }
            });
        }
      });
  }

  historialDocumento=(documento:any)=>{
    //console.log(documento);
    //console.log(node);
    this.idArchivo = null;
    this.store.documentosOperacionActions.asyncGetFileInfo(documento.idArchivo, 0)
    .subscribe(
      info=>{
        // console.log(info);
        // console.log(info.data['historialVersiones']);
        this.versiones = [];
        this.versiones = info.data?info.data['historialVersiones']:null;
        this.versiones.forEach(element => {
          element.metadata = JSON.parse(element.metadata);
        });
        
        this.idArchivo= documento?documento.idArchivo:null;
      });
  }

  editarDocumentoOperacion=(x:any)=>{
    console.log('CAYL edit',x);
    const valor = this.form.controls['tipoDocumento'].value;
    // const tipo = this.tipos.list.find(x=>x.value==valor)
    const tipo = {
      value:x.subTipoDocumento,
      text:x.subtipoEspecializacion 
    }
    const nombre = x.metadataArchivo.archivoNombre;
    console.log(nombre);
    console.log(tipo);

    const nombreOficial = '';// 'TEST'; // x.nombreOficial;
    const numero = ''; //'9898989898'; // x.numeroDocumento;
    const fechaEmision = '';// x.fechaEmision;
    const descripcion = '';//'PROBANDO TEST'; //x.descripcion;


    this.store.documentosOperacionModalActions
      .asyncFetchDocumentosGetById(x.id)
      .subscribe(async (response) => {
        if (response.success) {
          //await this.refreshExpand();
          // this.alert.open(reponse.message, null, { icon: 'success' });
          const documento = response['documento'];
          console.log(documento);
          
          const nombreOficial = documento.nombreOficial?response.documento.nombreOficial:null;// 'TEST'; // x.nombreOficial;
          const numero = documento.numeroDocumento?response.documento.numeroDocumento:null; //'9898989898'; // x.numeroDocumento;
          const fechaEmision = documento.fechaEmision!='0001-01-01T00:00:00Z'?documento.fechaEmision:null;// x.fechaEmision;
          const descripcion = documento.descripcion?response.documento.descripcion:null;//'PROBANDO TEST'; //x.descripcion;

          console.log(nombreOficial);
          console.log(numero);
          console.log(fechaEmision);
          console.log(descripcion);
          
          this.store.documentosOperacionModalActions.setModalEdit(tipo, nombreOficial, numero, fechaEmision, descripcion);
          if(tipo){
            const dialogRef = this.dialog.openMD(AppFormDocumentoAddComponent);
            dialogRef.componentInstance.store = this.store;
            dialogRef.componentInstance.idDocumento = x.id;
            dialogRef.componentInstance.fileName = nombre;
            dialogRef.componentInstance.restringirDescarga = this.restringirDescarga;
            dialogRef.componentInstance.documentoEvent.subscribe(
              async (result)=>{
                //console.log(result);
                if(result){
                  await this.loadDocumentosOperacion();
                } 
              }
            )
          }
        } else {
          this.alert.open(response.message, null, { icon: 'warning' });
        }
      });
  
  }

  downloadVersion = (version:number)=>{
    // console.log(this.idArchivo);
    // console.log(version);
    
    this.store.documentosOperacionActions.asyncDownLoadDocumentoOperacion(this.idArchivo, version);
  }

  refreshLoad=async()=>{
    await this.loadDocumentosOperacion();
  }

  onBuscar=()=>{}
  onLimpiar=()=>{}

  handleClickFirma= async ()=>{    
    this.current = this.storeCurrent.currentFlowAction.get();
    console.log(this.current);
    this.inProcess = true;    
    this.items = [];
    this.requestReplicate = {
      idVersionSolicitud: this.current.idVersionSolicitud,
      numeroDocumento: this.current.usuarioNumeroDocumento,
      idUsuario: this.current.idUsuario,
      idsSubtiposDocumento: this.current.documento.listarSubtipos,
      idsEstadosDocumento: this.current.documento.listarEstados,
      excluirYaFirmados: true,
      idProcesoOrigen:this.current.idProcesoOrigen,
      idProcesoBandejaOrigen: this.current.idProcesoBandejaOrigen
    }   
    this.store.documentosOperacionActions
      .asyncReplicateToFtp(this.requestReplicate)
      .subscribe((reponse) => {
        this.items = reponse.items;

        //this.inProcess = false;
        if (reponse.success) {
          this.callModalFirma(this.current.usuarioNumeroDocumento);
        } else {
          this.inProcess = false;
          this.alert.open(reponse.message, null, { icon: 'warning' });
        }
      });
  }

  callModalFirma(idEntidad: string) {
    const dialogRef = this.dialog.openMD(ModalFirmaComponent);

    dialogRef.componentInstance.model = {
      nroDocumento: '', // para busqueda de certificado
      rutaOrigen: idEntidad + '/', //  '41053336/' =>  carpeta de usuario en el servidor de firmas
      rutaDestino: idEntidad + '/', // '41053336/' =>  carpeta de usuario en el servidor de firmas
      nombreArchivos: '',
    };

    dialogRef.componentInstance.succesEvent.subscribe((status: StatusFirma) => {
      if (status.success === true) {
        this.inProcess = true;
        const cloneCurrent = Object.assign({}, this.requestReplicate);
        cloneCurrent.items = this.items;
        cloneCurrent.idRolAutor = this.current.idRol;
        cloneCurrent.rolAutorDescripcion = this.current.rolDescripcion;
        cloneCurrent.usuarioAutorDescripcion = this.current.usuarioFullName;
        cloneCurrent.esRolAdministrado = this.current.usuarioEsRolAdministrado;

        this.store.documentosOperacionActions
          .asyncReplicateFromFtp(cloneCurrent)
          .subscribe((reponse) => {
            this.inProcess = false;

            if (reponse.success) {
              this.alert.open(reponse.message, null, { icon: 'success' });
              
            } else {
              this.alert.open(reponse.message, null, { icon: 'warning' });
            }
          });
      } else {
        this.alert.open(status.message, null, { icon: 'warning' });
      }
      dialogRef.close();
    });

    // dialogRef.afterClosed().subscribe(() => {});
  }

  handleRefresh = () => {
    this.loadDocumentosOperacion();
  }
}
