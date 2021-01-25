import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, Inject, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { IDocumento, IFaseOrigenDocumento, IDocumentoConsultaGeneral, ITipoDocumentos } from '../../../store/documento/documento.store.interface';
import { ISubmitOptions, AlertService, DialogService, isNullOrEmptyArray, ValidateFormFields, IMsgValidations, FormModel, ComboList, IComboList,Validators as ValidatorsSunedu, } from '@sunedu/shared';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { DocumentoStore } from '../../../store/documento/documento.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { HttpEventType } from '@angular/common/http';
import { AppFormDocumentoAddComponent } from '../app-form-documentos-add/app-form-documentos-add.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-documentos',
  templateUrl: './app-form-documentos.component.html',
  styleUrls: ['./app-form-documentos.component.css', './app-form-documentos.component.scss']
})
export class AppFormDocumentosComponent implements OnInit {
  readonly state$ = this.store.state$.pipe(map(x => x.documentosPorFasesOrigen), distinctUntilChanged());

  isAllExpand: boolean;
  documentsTotalCount: number;
  fasesOrigen: IFaseOrigenDocumento[] = [];
  tipos:IComboList;
  documento:any;
  form: FormGroup;
  validators: IMsgValidations;
  versiones:any=[];
  idArchivo:string="";
  retornar:boolean=false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private storeCurrent: AppCurrentFlowStore,
    private store: DocumentoStore,
    public dialog: DialogService,
    private formBuilder: FormBuilder,
    private alert: AlertService
  ) {
    this.documentsTotalCount = 0;
    this.isAllExpand = true;
    this.tipos = new ComboList([]);
  }

  async ngOnInit() {
    await this.loadConfiguracion();
  }

  async loadConfiguracion() {
    this.store.state.documentosPorFasesOrigen.isLoading = true;
    let promises: any[] = [];

    this.buildValidations();
    this.buildForm();

    const action1 = await this.getTiposDocumentos();
    promises.push(action1);
    
    
    const action0 = await this.getFasesOrigen();
    promises.push(action0);
    
    
    await Promise.all(promises).then(() => { this.store.state.documentosPorFasesOrigen.isLoading = false; });
  }

  private buildForm = () => {

    const { form, type } = this.store.state.documentosPorFasesOrigen;
    this.form = this.formBuilder.group({

      tipoDocumento: [
        form.tipoDocumento,
        [
          Validators.required
        ],
      ]
    });
  }

  buildValidations = () => {
    this.validators = {
      tipoDocumento: [
        { name: 'required', message: 'El campo es Tipo Documento es requerido' },
      ]
    };
  }

  getTiposDocumentos=()=>{
    return new Promise<void>(
      (resolve)=>{ 
        const current = this.storeCurrent.currentFlowAction.get();
        //console.log('CAYL getTiposDocumentos current',current);
        //const subtipos = [13002,13003,17005,17004];
        const subtipos = current.documento.registrarSubtipos;
        //console.log('CAYL getTiposDocumentos subtipos',subtipos);
        this.store.documentoActions.asyncFetchTipoDocumentosByid(subtipos)
        .subscribe(()=>{
            this.store.documentoActions.getTipoDocumentos().subscribe(
              info => {
                this.tipos = info;
                resolve();
              }
            );
        })
    });
  }

  getFasesOrigen = () => {
    return new Promise<void>(
      (resolve) => {
        const current = this.storeCurrent.currentFlowAction.get();
        console.log(this.retornar);
        this.store.documentoActions.asyncFetchDocumentosByFaseOrigen(current.idVersionSolicitud, null, this.retornar)
          .subscribe(() => {
            this.fasesOrigen = this.store.documentoActions.getFasesOrigen();
            console.log(this.fasesOrigen);
            this.recountDocuments();
            resolve();
          })
      });
  }

  recountDocuments(): void {
    this.documentsTotalCount = 0;
    if (isNullOrEmptyArray(this.fasesOrigen)) return;

    for (let f = 0; f < this.fasesOrigen.length; f++) {
      let currentFaseOrigen = this.fasesOrigen[f];
      currentFaseOrigen.documentsCount = 0;
      if (isNullOrEmptyArray(currentFaseOrigen.documentosFase)) continue;
      currentFaseOrigen.documentsCount = currentFaseOrigen.documentosFase.length;
      this.documentsTotalCount += currentFaseOrigen.documentsCount;
    }
  };

  onExpand(): void {
    for (let n1 = 0; n1 < this.fasesOrigen.length; n1++) {
      const nodoFaseOrigenItem = this.fasesOrigen[n1];
      nodoFaseOrigenItem.isExpanded = this.isAllExpand;
    }
    this.isAllExpand = !this.isAllExpand;
  }

  //getParametros(node: ITreeNode) {
  //  const current = this.storeCurrent.currentFlowAction.get();
  //  const idCatalogo = this.store.sedesFilialesActions.getIdCatalogoByIdSedeFilial(this.currentSede);
  //  let parametros = {
  //    idUsuario: current.idUsuario,
  //    idAplicacion: current.idAplicacion.toUpperCase(), //'01E002E4-2794-45AB-A9E3-94FEAC502550',
  //    idCatalogo: idCatalogo,
  //    idCondicion: node.idCondicion,
  //    idComponente: node.idComponente,
  //    idIndicador: node.idIndicador,
  //    idMedioVerificacion: node.idMedioVerificacion
  //  }
  //  return parametros;
  //}

  // refreshExpand=()=>{
  //   return new Promise(
  //     (resolve)=>{ 
  //       const current = this.storeCurrent.currentFlowAction.get();
  //       const fase = current.documento.registroFaseOrigenDocumento;
  //       for (let n1 = 0; n1 < this.fasesOrigen.length; n1++) {
  //         const nodoFaseOrigenItem = this.fasesOrigen[n1];
  //         if(nodoFaseOrigenItem.idFase==fase){
  //           nodoFaseOrigenItem.isExpanded = true;
  //           resolve();
  //           break;  
  //         }
  //       }
      
  //   });

  // }


  onAdd = () =>{
    ValidateFormFields(this.form);
    if (!this.form.valid) {
      return false;
    }
    const valor = this.form.controls['tipoDocumento'].value;
    this.documento = this.tipos.list.find(x=>x.value==valor)
    
    this.store.documentoModalActions.setModalAdd(this.documento);
    if(this.documento){
      // const dialogRef = this.dialog.openMD(AppFormDocumentoAddComponent);
      // dialogRef.componentInstance.store = this.store;
      // dialogRef.componentInstance.documentoEvent.subscribe(
      //   async (result)=>{
      //     console.log(result);
      //     if(result){
      //       await this.getFasesOrigen();
      //       await this.refreshExpand();
      //     } 
      //   }
      // )
    }
  }

  

  handleChange=(e:any)=>{
    console.log(e);
  }

  downloadDocumento = (idArchivo:string, version:number)=>{
    console.log(idArchivo);
    console.log(version);    
    this.store.documentoActions.asyncDownLoadDocumento(idArchivo, version);
  }

  eliminarDocumento = (documento:IDocumento)=>{
    console.log(documento);
    this.alert
      .open('¿Está seguro de eliminar el archivo?', null, { confirm: true })
      .then((confirm) => {
        if (confirm) {
          //let idUsuario = contenido.contenidoArchivoFileInfo.usuarioCreacion?contenido.contenidoArchivoFileInfo.usuarioCreacion:null;
          const current = this.storeCurrent.currentFlowAction.get();

          this.store.documentoActions
            .asyncDeleteDocumento(
              documento.metadataArchivo.trackingNumber,
              current.idUsuario,
              current.idAplicacion)
            .subscribe(async (reponse) => {
              if (reponse.success) {
                await this.getFasesOrigen();
                //await this.refreshExpand();
                this.alert.open(reponse.message, null, { icon: 'success' });
              } else {
                this.alert.open(reponse.message, null, { icon: 'warning' });
              }
            });
        }
      });
  }

  historialDocumento = (documento:IDocumento, node:any)=>{  
    console.log(documento);
    console.log(node);
    this.idArchivo = null;
    this.store.documentoActions.asyncGetFileInfo(documento.idArchivo, 0)
    .subscribe(
      info=>{
        console.log(info);
        console.log(info.data['historialVersiones']);
        this.versiones = [];
        this.versiones = info.data?info.data['historialVersiones']:null;
        this.versiones.forEach(element => {
          element.metadata = JSON.parse(element.metadata);
        });
        
        this.idArchivo= documento?documento.idArchivo:null;
      });
  }

  downloadVersion = (version:number)=>{
    console.log(this.idArchivo);
    console.log(version);
    
    this.store.documentoActions.asyncDownLoadDocumento(this.idArchivo, version);
  }

  handleCheck=(event:any) =>{
    console.log(event);
    if(event){
      this.retornar = event.value;
      this.getFasesOrigen();
      //this.refreshExpand();
    }
  }
  
}
