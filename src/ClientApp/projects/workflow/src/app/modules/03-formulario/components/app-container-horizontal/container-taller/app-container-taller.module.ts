import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerTallerComponent } from './app-container-taller.component';
import { SharedModule } from '@sunedu/shared';
import { AppFormTallerComponent } from '../../app-form/app-form-taller/app-form-taller.component';
import { AppFormTallerProgramaComponent } from '../../app-form/app-form-taller-programa/app-form-taller-programa.component';

@NgModule({
  declarations: [AppContainerTallerComponent,
    AppFormTallerComponent,
    AppFormTallerProgramaComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerTallerComponent],
  entryComponents:[AppFormTallerComponent,AppFormTallerProgramaComponent]
})
export class AppContainerTallerModule { } 
