import { AppContainerSolicitudTrazabilidadModule } from './components/container/app-container-solicitud.module';
import { TrazabilidadService } from './service/trazabilidad.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunedu/shared';
import { TrazabilidadRoutingModule } from './trazabilidad-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TrazabilidadRoutingModule,
    SharedModule,
    AppContainerSolicitudTrazabilidadModule
  ],
  providers: [
    TrazabilidadService
  ]
})
export class TrazabilidadModule { }
