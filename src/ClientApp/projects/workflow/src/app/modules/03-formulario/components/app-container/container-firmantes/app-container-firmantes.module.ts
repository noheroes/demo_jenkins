import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerFirmantesComponent } from './app-container-firmantes.component';
import { SharedModule } from '@sunedu/shared';
const IMPORTS_COMPONENTES_TAB = [];
@NgModule({
  declarations: [AppContainerFirmantesComponent],
  imports: [
    CommonModule,
    SharedModule,
    ...IMPORTS_COMPONENTES_TAB
  ],
  exports: [AppContainerFirmantesComponent]
})
export class AppContainerFirmantesModule { }
