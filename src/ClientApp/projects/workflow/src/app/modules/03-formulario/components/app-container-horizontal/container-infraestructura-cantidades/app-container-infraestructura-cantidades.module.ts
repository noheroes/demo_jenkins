import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunedu/shared';
import { AppContainerInfraestructuraCantidadesComponent } from './app-container-infraestructura-cantidades.component';


@NgModule({
  declarations: [AppContainerInfraestructuraCantidadesComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerInfraestructuraCantidadesComponent],
})
export class AppContainerInfraestructuraCantidadesModule { }
