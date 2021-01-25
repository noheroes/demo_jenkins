import { Component, OnInit } from '@angular/core';

import { DialogService, AlertService, ToastService } from '@sunedu/shared';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';
import { VisorStore} from '../store/visor.store';

//import JsonViewer from './jsonViewer';
import { JsonFormatterModule } from './json-formatter/json-formatter.module';

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.scss', './style.css'],
  providers: [VisorStore],
})
export class VisorComponent implements OnInit {
  readonly state$ = this.visorStore.state$;
  hasInfo:boolean=false;
  firmas:any[]=[];
  jsonFile:any={};

  configFile: any = {
    tiposPermitidos: '.signnet,.json',
    pesoMaximoEnMB: 50,
    puedeCargarArchivo: true,
    puedeSubirArchivo:true,
    puedeDescargarArchivo: false,
    puedeVerHistorialArchivo: false,
    usarBorradores: false,
    preservarNombreArchivo: false,
    puedeEliminarArchivo: false,
    puedeVerTags: false,
    puedeEditarTags: false,
    version: 0 // OJO CAYL version de archivo verificar.
  };

  constructor(
    public dialog: DialogService,
    private alert: AlertService,
    private toast: ToastService,
    private storeCurrent: AppCurrentFlowStore,
    private visorStore: VisorStore
  ) {}

  async ngOnInit() {
    
  }

  getParametros():any {
    let parametros = {
      origenEnum:"3", // VISOR
    }
    return parametros;
  }


  getInfoFile=(e: any)=>{
    //console.log('CAYL getInfoFile visor',e);
    //console.log('entro a getFile',e);
    this.hasInfo=false;
    this.firmas=[];
    if(e){
      if(e.success)
      {
        const js = [{
          nombre: "CESAR YENQUE",
          edad: 41,
          sexo: "cada 2 dias",
          telefono: 993393622
        },{
          nombre: "CESAR YENQUE",
          edad: 41,
          sexo: "cada 2 dias",
          telefono: 993393622
        }]
        this.hasInfo=true;
        this.firmas = e.messages? e.messages:[];
        this.jsonFile = e.data;
        //new JsonViewer({container: document.bodt , data: JSON.parse(e.data), theme: 'light', expand: true})
      }
    }
  }

  getClean=(e)=>{
    //console.log(e);
    if(e){
      this.firmas=[];
      this.jsonFile = null;
      this.hasInfo=false;
    }
  }

}
