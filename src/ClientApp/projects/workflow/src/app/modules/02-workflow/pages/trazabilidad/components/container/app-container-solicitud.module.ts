import { TrazabilidadService } from './../../service/trazabilidad.service';
import { AppContainerTrazabilidadComponent } from './../container-trazabilidad/app-container-trazabilidad.component';
import { AppContainerSolicitudTrazabilidadComponent } from './app-container-solicitud.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunedu/shared';


@NgModule({
  declarations: [AppContainerSolicitudTrazabilidadComponent,
    AppContainerTrazabilidadComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
        AppContainerSolicitudTrazabilidadComponent
    ],
  entryComponents:[AppContainerTrazabilidadComponent],
})
export class AppContainerSolicitudTrazabilidadModule { } 
