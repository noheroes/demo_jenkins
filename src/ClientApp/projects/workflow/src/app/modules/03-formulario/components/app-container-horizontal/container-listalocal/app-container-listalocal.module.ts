import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerListaLocalComponent } from './app-container-listalocal.component';
import { SharedModule } from '@sunedu/shared';

@NgModule({
  declarations: [AppContainerListaLocalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerListaLocalComponent],
  //entryComponents:[AppFormLaboratorioComponent,AppFormLaboratorioProgramaComponent]
})
export class AppContainerListaLocalModule { } 
