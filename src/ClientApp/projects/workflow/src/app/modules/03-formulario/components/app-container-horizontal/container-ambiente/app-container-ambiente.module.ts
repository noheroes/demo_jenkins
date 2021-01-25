import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerAmbienteComponent } from './app-container-ambiente.component';
import { SharedModule } from '@sunedu/shared';
import { AppFormAmbienteComponent } from '../../app-form/app-form-ambiente/app-form-ambiente.component';

@NgModule({
  declarations: [AppContainerAmbienteComponent,
    AppFormAmbienteComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerAmbienteComponent],
  entryComponents:[AppFormAmbienteComponent]
})
export class AppContainerAmbienteModule { }
