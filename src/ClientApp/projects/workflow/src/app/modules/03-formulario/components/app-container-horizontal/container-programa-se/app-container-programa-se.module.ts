import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerProgramaSeComponent } from './app-container-programa-se.component';
import { SharedModule } from '@sunedu/shared';
import { AppFormBuscarProgramaSeComponent } from '../../app-form/app-form-buscar-programa-se/app-form-buscar-programa-se.component';
import { AppFormProgramaSeComponent } from '../../app-form/app-form-programa-se/app-form-programa-se.component';

@NgModule({
  declarations: [AppContainerProgramaSeComponent,
    AppFormBuscarProgramaSeComponent,
    AppFormProgramaSeComponent
    ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerProgramaSeComponent],
  entryComponents:[]
})
export class AppContainerProgramaSeModule { } 
