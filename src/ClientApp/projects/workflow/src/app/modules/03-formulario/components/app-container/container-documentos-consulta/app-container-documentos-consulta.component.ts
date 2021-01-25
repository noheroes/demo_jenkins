import { DocumentosConsultaStore } from './../../../store/documentos-consulta/documentos-consulta.store';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { IFormularioModel } from '@lic/core';
import { ComboList, DialogService, FormType, IDataGridButtonEvent, IDataGridEvent, IMsgValidations } from '@sunedu/shared';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppFormDocumentoConsultaAddComponent } from '../../app-form/app-form-documentos-consulta-add/app-form-documentos-consulta-add.component';

@Component({
  selector: 'app-container-documentos-consulta',
  templateUrl: './app-container-documentos-consulta.component.html',
  styleUrls: ['./app-container-documentos-consulta.component.css', './app-container-documentos-consulta.component.scss'],
  providers: [
    DocumentosConsultaStore
  ]
})
export class AppContainerDocumentosConsultaComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  subscriptions: Subscription[];
  documentosFase: any[] = [];
  tipos = new ComboList([]);
  form: FormGroup;
  validators: IMsgValidations;
  hideRuleContent: boolean = false;
  formType = FormType;

  subTiposDocumentos = new ComboList([]);
  tiposBandeja = new ComboList([]);
  restringirDescarga:boolean=false;


  //readonly state$ = this.store.state$.pipe(map(x => x.documentosConsulta), distinctUntilChanged());
  readonly state$ = this.store.state$;
  categoria:string;
  //readonly state$ = this.documentoStore.state$;

  constructor(
    //private documentoStore: DocumentoStore,
    private formBuilder: FormBuilder,
    private store: DocumentosConsultaStore,
    public dialog: DialogService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }

  ngOnInit() {
    this.store.documentosConsultaActions.setInit(this.modelData);
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    this.handleLoadData();
    //this.loadCombos();
  }

  subscribeToState = () => {
    const subs2 = this.store.state$.pipe(map(x => x.documentosConsulta), distinctUntilChanged())
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

    const { form, type } = this.store.state.documentosConsulta;
    // this.form = this.formBuilder.group({
    //   descBandeja: [form.descBandeja],
    //   fechaRecepcionDesde: [form.fechaRecepcionDesde],
    //   fechaRecepcionHasta: [form.fechaRecepcionHasta],
    //   subTipoDocumentoDesc: [form.subTipoDocumentoDesc],
    //   fechaNotificacionDesde: [form.fechaNotificacionDesde],
    //   fechaNotificacionHasta: [form.fechaNotificacionHasta],
    //   archivoNombre: [form.archivoNombre],
    // });

    this.form = this.formBuilder.group({
      busqueda:[form.busqueda]
    });
    console.log(this.store.state.documentosConsulta.isLoading);
    console.log(this.store.state.documentosConsulta.type);
  }

  loadCombos = () => {
    this.store.documentosConsultaBuscadorActions.getTipoBandeja().subscribe(
      info => { this.tiposBandeja = info; console.log(info); }
    );

    this.store.documentosConsultaBuscadorActions.getSubtiposDocumento().subscribe(
      info => { this.subTiposDocumentos = info, console.log(info); }
    );
  }


  onAdd = () => { }

  downloadDocumento = (e: any) => {
    //console.log('CAYL downloadDocumento bandeja',e);
    // console.log(idArchivo);
    // console.log(version);    
    //this.store.documentoActions.asyncDownLoadDocumento(idArchivo, version);
    const idArchivo = e.item.idArchivo;
    this.store.documentosConsultaActions.asyncDownLoadDocumentoConsulta(idArchivo, 0);
  }

  eliminarDocumento = (x: any) => { }

  historialDocumento = (x: any, y: any) => { }

  onBuscar = () => {
    this.handleLoadData();
  }

  onLimpiar = () => {
    this.form.reset();
  }

  handleClickButton = (e: IDataGridButtonEvent) => {
    switch (e.action) {
      case 'DESCARGAR':
        this.downloadDocumento(e);
        break;
    }
  };

  handleLoadData = (e?: IDataGridEvent) => {
    //const current = this.storeCurrent.currentFlowAction.get();
    const pageRequest = {
      page: e ? e.page : 1,
      pageSize: e ? e.pageSize : 10,
      orderBy: e ? e.orderBy : null,
      orderDir: e ? e.orderDir : "asc",
      skip: e ? e.skip : 0,
    };

    const filters = {
      // tipoBandeja: this.form.get('descBandeja').value,
      // fechaRecepcionSuneduDesde: this.form.get('fechaRecepcionDesde').value,
      // fechaRecepcionSuneduHasta: this.form.get('fechaRecepcionHasta').value,
      // idsSubTiposDocumento: this.form.get('subTipoDocumentoDesc').value,
      // fechaNotificacionUniversidadDesde: this.form.get('fechaNotificacionDesde').value,
      // fechaNotificacionUniversidadHasta: this.form.get('fechaNotificacionHasta').value,
      // nombreArchivo: this.form.get('archivoNombre').value,
      busqueda: this.form.get('busqueda').value
    }

    //console.log('CAYL filters', filters);

    this.store.documentosConsultaBuscadorActions
      .asyncFetchPageDocumentosConsulta(pageRequest, filters)
      .subscribe(() => this.loadCombos());
  };


  toggle() {
    // toggle based on index
    this.hideRuleContent = !this.hideRuleContent;
  }

  handleRefresh = () => {
    this.handleLoadData();
  }

  handleAdd(){
    const dialogRef = this.dialog.openMD(AppFormDocumentoConsultaAddComponent);
    dialogRef.componentInstance.store = this.store;
    dialogRef.componentInstance.idDocumento = null;
    dialogRef.componentInstance.restringirDescarga = this.restringirDescarga;
    dialogRef.componentInstance.documentoEvent.subscribe(
      async (result)=>{
        //console.log(result);
        if(result){
          await this.handleLoadData();
        } 
      }
    )
  }

  handleSearch(){

  }

  handleCategoria(tipo:string){
    console.log(tipo);
    this.categoria=tipo;
    // switch(tipo){
    //   case "borrador":
    //     console.log("entro a borrador");
    //     break;
    //   case "revision":
    //     console.log("entro a revision");
    //     break;
    // }

  }

}
