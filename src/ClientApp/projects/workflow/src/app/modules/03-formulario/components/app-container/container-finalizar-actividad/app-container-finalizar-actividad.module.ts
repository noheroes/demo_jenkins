import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerFinalizarActividadComponent } from './app-container-finalizar-actividad.component';
import { SharedModule } from '@sunedu/shared';
const IMPORTS_COMPONENTES_TAB = [];
@NgModule({
  declarations: [AppContainerFinalizarActividadComponent],
  imports: [
    CommonModule,
    SharedModule,
    ...IMPORTS_COMPONENTES_TAB
  ]
})
export class AppContainerFinalizarActividadModule { }
