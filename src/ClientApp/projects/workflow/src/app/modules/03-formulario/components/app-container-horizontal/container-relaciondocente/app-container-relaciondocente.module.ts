import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerRelaciondocenteComponent } from './app-container-relaciondocente.component';
import { SharedModule } from '@sunedu/shared';
import { AppFormAgregarDocenteComponent } from '../../app-form/app-form-agregar-docente/app-form-agregar-docente.component';

@NgModule({
  declarations: [AppContainerRelaciondocenteComponent,
                 AppFormAgregarDocenteComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerRelaciondocenteComponent]
})
export class AppContainerRelaciondocenteModule { }
