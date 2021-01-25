import { Component, OnInit, Input } from '@angular/core';
import { IFormularioModel } from '@lic/core';
import { SedeFilialLocalesStore } from './../../../store/sedefilial-locales/sedefilial-locales.store';
import { AppCurrentFlowStore } from 'src/app/core/store/app.currentFlow.store';

@Component({
  selector: 'app-container-formato',
  templateUrl: './app-container-formato.component.html',
  styleUrls: ['./app-container-formato.component.scss'],
  providers: [SedeFilialLocalesStore],
})
export class AppContainerFormatoComponent implements OnInit {
  @Input() configTab: any = null;
  @Input() modelData: IFormularioModel = null;
  readonly state$ = this.store.state$;

  sedes: any = [];
  locales: any = [];
  idSede: string;
  idLocal: string;
  tipoPresupuesto: any = ["10","20","30","40","51","52","60"];
  tipoPresupuestoNombre :any = [
    "CBC I. MODELO EDUCATIVO DE LA UNIVERSIDAD"
    ,"CBC II. CONSTITUCIÓN, GOBIERNO Y GESTIÓN DE LA UNIVERSIDAD"
    ,"CBC III. LA OFERTA ACADÉMICA, RECURSOS EDUCATIVOS Y DOCENCIA"
    ,"CBC IV. PROPUESTA EN INVESTIGACIÓN"
    ,"CBC V. RESPONSABILIDAD SOCIAL UNIVERSITARIA Y BIENESTAR UNIVERSITARIO"
    ,"CBC VI. TRANSPARENCIA"      
  ];
  codigoLocal: string;
  readOnly:boolean=false;

  constructor(
    private store: SedeFilialLocalesStore,
    private storeCurrent: AppCurrentFlowStore
  ) {}

  async ngOnInit() {
    await this.loadConfiguracion();
  }

  private async loadConfiguracion() {
    this.store.state.sedeFilialLocales.isLoading = true;
    this.readOnly=this.configTab.readOnly || this.modelData.formulario.subsanacionReadonly;
    let promises: any[] = [];
    const action0 = await this.getSedesFiliales();
    promises.push(action0);
    //console.log('termino 0');
    await Promise.all(promises).then(() => {
      this.store.state.sedeFilialLocales.isLoading = false;
    });
  }

  private getSedesFiliales = () => {
    return new Promise<void>((resolve) => {
      const current = this.storeCurrent.currentFlowAction.get();
      this.store.sedeFilialLocalesActions
        .asyncFetchSedesFiliales(current.idVersionSolicitud)
        .subscribe(() => {
          this.store.sedeFilialLocalesActions
            .getSedesFiliales()
            .subscribe((info) => {
              this.sedes = info;
              //console.log(this.sedes);
              resolve();
            });
        });
    });
  };

  handleInputChange = (event, tipo: string) => {
    // console.log(name);
    // console.log(event);
    // console.log(tipo);

    switch (tipo) {
      case 'sede':
        {
          if(event.value!=null){
            this.idSede = event.value;
            this.store.sedeFilialLocalesActions
              .getLocales(event.value)
              .subscribe((info) => {
                if(info){
                  this.locales = [];
                  this.idLocal = null;
                  this.locales = info;
                }
              });
          }else
          {
            this.locales =[];
            this.idLocal = null;
          }

        }
        break;
      case 'local':
        {
          this.idLocal = event.selected.value;
          this.codigoLocal = event.selected.text.split('-')[0].trim();
        }
        break;

      default:
        break;
    }
  };
}
