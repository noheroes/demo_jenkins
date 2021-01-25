import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerLaboratorioComponent } from './app-container-laboratorio.component';
import { SharedModule } from '@sunedu/shared';
import { AppFormLaboratorioComponent } from '../../app-form/app-form-laboratorio/app-form-laboratorio.component';
import { AppFormLaboratorioProgramaComponent } from '../../app-form/app-form-laboratorio-programa/app-form-laboratorio-programa.component';

@NgModule({
  declarations: [AppContainerLaboratorioComponent,
    AppFormLaboratorioComponent,
    AppFormLaboratorioProgramaComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerLaboratorioComponent],
  entryComponents:[AppFormLaboratorioComponent,AppFormLaboratorioProgramaComponent]
})
export class AppContainerLaboratorioModule { } 
