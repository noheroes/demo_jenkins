import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@sunedu/shared';

import { AppContainerMaestroProgramaSegundaComponent } from './app-container-maestro-programa-segunda.component';
import { AppFormMaestroProgramaComponent } from '../../app-form/app-form-maestro-programa/app-form-maestro-programa.component';
import { AppFormMaestroProgramaSeComponent } from '../../app-form/app-form-maestro-programa-se/app-form-maestro-programa-se.component';
import { AppFormMaestroProgramaVinComponent } from '../../app-form/app-form-maestro-programa-vin/app-form-maestro-programa-vin.component';

@NgModule({
  declarations: [AppContainerMaestroProgramaSegundaComponent,
    AppFormMaestroProgramaComponent,
    AppFormMaestroProgramaSeComponent,
    AppFormMaestroProgramaVinComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerMaestroProgramaSegundaComponent,AppFormMaestroProgramaComponent,AppFormMaestroProgramaSeComponent,AppFormMaestroProgramaVinComponent],
  entryComponents:[AppFormMaestroProgramaComponent,AppFormMaestroProgramaSeComponent,AppFormMaestroProgramaVinComponent]
})
export class AppContainerMaestroProgramaSegundaModule { } 
