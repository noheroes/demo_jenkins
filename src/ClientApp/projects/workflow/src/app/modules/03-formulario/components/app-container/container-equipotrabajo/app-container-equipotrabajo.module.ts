import { AppFormEquipoTrabajoComponent } from '../../app-form/app-form-equipotrabajo-asignar/app-form-equipotrabajo-asignar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerEquipoTrabajoComponent } from './app-container-equipotrabajo.component';
import { SharedModule } from '@sunedu/shared';
import { MatIconModule } from '@angular/material';
import { GestorArchivosModule as GaModule } from '@lic/core';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    GaModule
  ],
  exports: [
    AppContainerEquipoTrabajoComponent
  ],
  declarations: [
    AppContainerEquipoTrabajoComponent,
    AppFormEquipoTrabajoComponent
  ],
  entryComponents: [
  ]
})
export class AppContainerEquipoTrabajoModule { }
