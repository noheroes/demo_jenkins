import { EnviadoStore } from './../../../store/ennviado/enviado.store';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { IFormularioModel } from '@lic/core';
import { ComboList, IMsgValidations } from '@sunedu/shared';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-container-enviados',
  templateUrl: './app-container-enviados.component.html',
  styleUrls:['./app-container-enviados.component.css','./app-container-enviados.component.scss'],
  providers: [
    EnviadoStore
  ]
})
export class AppContainerEnviadosComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  subscriptions: Subscription[];
  documentosFase:any[]=[];
  tipos=new ComboList([]);
  form: FormGroup;
  validators: IMsgValidations;

  readonly state$ = this.store.state$.pipe(map(x => x.enviado), distinctUntilChanged());

  //readonly state$ = this.documentoStore.state$;

  constructor(
    //private documentoStore: DocumentoStore,
    private formBuilder: FormBuilder,
    private store: EnviadoStore,
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
    this.store.enviadoActions.setInit(this.modelData);
    this.buildValidations();
    this.buildForm();
    this.subscribeToState();
    this.loadEnviados();
    // this.documentosFase = [
    //   {
    //     actividad: 'Revisión preliminar UACTD',
    //     especializacion: 'Informe de observaciones',
    //     numeroDocumento:'PCM 001-2020',
    //     nombreArchivo:'Informe2020-01.docx',
    //     version:'V1',
    //     fechaCarga:'19/10/2020',
    //     autor:'María Lionza',
    //     estadoDocumento:'Elaborado',
    //     fechaEmision:'-'
    //   },
    //   {
    //     actividad: 'Revisión preliminar UACTD',
    //     especializacion: 'Informe de observaciones',
    //     numeroDocumento:'PCM 001-2020',
    //     nombreArchivo:'Informe2020-01.docx',
    //     version:'V2',
    //     fechaCarga:'19/10/2020',
    //     autor:'María Lionza',
    //     estadoDocumento:'Elaborado',
    //     fechaEmision:'-'
    //   },
    //   {
    //     actividad: 'Revisión preliminar UACTD',
    //     especializacion: 'Informe de observaciones',
    //     numeroDocumento:'PCM 001-2020',
    //     nombreArchivo:'Informe2020-01.docx',
    //     version:'V3',
    //     fechaCarga:'19/10/2020',
    //     autor:'María Lionza',
    //     estadoDocumento:'Elaborado',
    //     fechaEmision:'-'
    //   }
    // ]
    
  }

  subscribeToState = () => {
    const subs2 = this.store.state$.pipe(map(x => x.enviado), distinctUntilChanged())
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

    const { form, type } = this.store.state.enviado;
    this.form = this.formBuilder.group({
      descActividad:[form.descActividad],
      archivoNombre:[form.archivoNombre],
      subTipoDocumentoDesc:[form.subTipoDocumentoDesc],
      fechaCargaDesde:[form.fechaCargaDesde],
      numeroDocumento:[form.numeroDocumento],
      fechaCargaHasta:[form.fechaCargaHasta],
      estadoDocumento:[form.estadoDocumento],


      //tipoDocumento: [form.tipoDocumento,[Validators.required]],
      tipoDocumento: [form.tipoDocumento],

    });
  }

  loadEnviados=()=>{
    debugger;
    this.store.enviadoActions.asyncFetchDocumentoEnviado().subscribe(
      info=>{ 
        console.log(info);
        this.documentosFase=info.documentos;
      }
    )
  }

  onAdd=()=>{}

  downloadDocumento = (idArchivo:string, version:number)=>{
    console.log(idArchivo);
    console.log(version);    
    //this.store.documentoActions.asyncDownLoadDocumento(idArchivo, version);
  }

  eliminarDocumento = (x:any) =>{}

  historialDocumento=(x:any,y:any)=>{}

  onBuscar=()=>{}
  onLimpiar=()=>{}
}
