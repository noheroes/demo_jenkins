import { AppCurrentFlowStore } from './../../../../../../../../../src/app/core/store/app.currentFlow.store';
import { AppCurrentFlow } from './../../../../../../../../../src/app/core/store/app.state';
//import { IFormularioModel } from 'src/app/core/interfaces/formulario-model.interface';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
//import { IFormularioModel } from '@lic/core';

@Component({
  selector: 'app-container-firmarmedio',
  templateUrl: './app-container-firmarmedio.component.html',
})
export class AppContainerFirmarMedioComponent implements OnInit, OnDestroy {
  @Input() configTab: any;
  @Input() modelData: any;

  titulo:string;
  constructor(private storeCurrent:AppCurrentFlowStore) {}

  ngOnDestroy(): void {}

  ngOnInit() {
    // console.log('CAYL AppContainerFirmarMedioComponent configTab', this.configTab);
    // console.log('CAYL AppContainerFirmarMedioComponent modelData', this.modelData);
    const current = this.storeCurrent.currentFlowAction.get();
    if(current){
      if(current.esFirmadoDocumento){
        const {configuracionFirmaMedioVerificacion } = this.modelData.formulario.configuracionTabs;
        if(configuracionFirmaMedioVerificacion){
          this.titulo = configuracionFirmaMedioVerificacion.name;
        }
      }else{
        this.titulo = "Firmar medios de verificación y archivo testigo";
      }
    }
  }
}
