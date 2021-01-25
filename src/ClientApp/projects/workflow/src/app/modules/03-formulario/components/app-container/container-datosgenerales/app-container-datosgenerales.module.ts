import { NgModule, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerDatosgeneralesComponent } from './app-container-datosgenerales.component';
import { SharedModule } from '@sunedu/shared';
import { AppFormDatosGeneralesComponent } from '../../app-form/app-form-datos-generales/app-form-datos-generales.component';
import { AppFormDatosGeneralesDomicilioLegalComponent } from '../../app-form/app-form-datos-generales-domicilio-legal/app-form-datos-generales-domicilio-legal.component';
import { AppFormDatosGeneralesPromotoraComponent } from '../../app-form/app-form-datos-generales-promotora/app-form-datos-generales-promotora.component';
import { AppFormRepesentantelegalComponent } from '../../app-form/app-form-repesentantelegal/app-form-repesentantelegal.component';
import { AppContainerSedeFilialModule } from '../../app-container-horizontal/container-sedefilial/app-container-sedefilial.module';
import { AppContainerMaestropersonaModule } from '../../app-container-horizontal/container-maestropersona/app-container-maestropersona.module';
import { AppContainerMaestroFacultadModule } from '../../app-container-horizontal/container-maestro-facultad/app-container-maestro-facultad.module';
import { AppContainerMallacurricularModule } from '../../app-container-horizontal/container-mallacurricular/app-container-mallacurricular.module';
import { AppContainerDatosGeneralesModule } from '../../app-container-horizontal/container-datosgenerales/app-container-datosgenerales.module';
import { AppContainerMaestroProgramaSegundaModule } from '../../app-container-horizontal/container-maestro-programa-segunda/app-container-maestro-programa-segunda.module';

const IMPORTS_COMPONENTES_TAB = [
  AppContainerDatosGeneralesModule,
  AppContainerSedeFilialModule,
  AppContainerMaestropersonaModule,
  //AppContainerMaestroProgramaModule,
  //AppContainerMaestroProgramaSeModule,
  AppContainerMaestroProgramaSegundaModule,
  AppContainerMaestroFacultadModule,
  AppContainerMallacurricularModule
];

@NgModule({
  declarations: [
    AppContainerDatosgeneralesComponent,
    // AppFormDatosGeneralesComponent,
    // AppFormDatosGeneralesDomicilioLegalComponent,
    // AppFormDatosGeneralesPromotoraComponent,
    // AppFormRepesentantelegalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ...IMPORTS_COMPONENTES_TAB
  ],
  exports: [
    AppContainerDatosgeneralesComponent
  ],
  entryComponents:[]
})
export class AppContainerDatosgeneralesModule { }
