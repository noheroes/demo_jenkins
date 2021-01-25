import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunedu/shared';

import { AppContainerDatosgeneralesComponent } from './app-container-datosgenerales.component';
import { AppFormRepesentantelegalComponent } from '../../app-form/app-form-repesentantelegal/app-form-repesentantelegal.component';
import { AppFormDatosGeneralesComponent } from '../../app-form/app-form-datos-generales/app-form-datos-generales.component';
import { AppFormDatosGeneralesDomicilioLegalComponent } from '../../app-form/app-form-datos-generales-domicilio-legal/app-form-datos-generales-domicilio-legal.component';
import { AppFormDatosGeneralesPromotoraComponent } from '../../app-form/app-form-datos-generales-promotora/app-form-datos-generales-promotora.component';

@NgModule({
  declarations: [
    AppContainerDatosgeneralesComponent,
    AppFormRepesentantelegalComponent,
    // Ojo BORRAR CAYL
    AppFormDatosGeneralesComponent,
    AppFormDatosGeneralesDomicilioLegalComponent,
    AppFormDatosGeneralesPromotoraComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerDatosgeneralesComponent],
  entryComponents: [AppFormRepesentantelegalComponent]
})
export class AppContainerDatosGeneralesModule { }
