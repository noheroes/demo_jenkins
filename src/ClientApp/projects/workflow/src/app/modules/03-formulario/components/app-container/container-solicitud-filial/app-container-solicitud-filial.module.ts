import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerSolicitudFilialComponent } from './app-container-solicitud-filial.component';
import { SharedModule } from '@sunedu/shared';

@NgModule({
  declarations: [AppContainerSolicitudFilialComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    AppContainerSolicitudFilialComponent
  ]
})
export class AppContainerSolicitudFilialModule { }
