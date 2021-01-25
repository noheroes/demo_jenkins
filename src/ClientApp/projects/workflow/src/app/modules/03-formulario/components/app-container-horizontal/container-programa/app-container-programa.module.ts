import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerProgramaComponent } from './app-container-programa.component';
import { SharedModule } from '@sunedu/shared';
import { AppFormBuscarProgramaComponent } from '../../app-form/app-form-buscar-programa/app-form-buscar-programa.component';
import { AppFormProgramaComponent } from '../../app-form/app-form-programa/app-form-programa.component';

@NgModule({
  declarations: [AppContainerProgramaComponent,
    AppFormBuscarProgramaComponent,
    AppFormProgramaComponent
    ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerProgramaComponent],
  entryComponents:[]
})
export class AppContainerProgramaModule { } 
