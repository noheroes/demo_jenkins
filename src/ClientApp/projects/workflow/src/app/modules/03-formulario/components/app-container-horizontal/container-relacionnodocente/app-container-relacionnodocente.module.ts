import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunedu/shared';
import { AppContainerRelacionnodocenteComponent } from './app-container-relacionnodocente.component';
import { AppFormAgregarNodocenteComponent } from '../../app-form/app-form-agregar-nodocente/app-form-agregar-nodocente.component';

@NgModule({
  declarations: [AppContainerRelacionnodocenteComponent,
    AppFormAgregarNodocenteComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerRelacionnodocenteComponent]
})
export class AppContainerRelacionnodocenteModule { }

