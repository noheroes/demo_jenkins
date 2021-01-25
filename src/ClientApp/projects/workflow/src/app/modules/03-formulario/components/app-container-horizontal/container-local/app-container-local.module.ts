import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunedu/shared';
import { AppContainerLocalComponent } from './app-container-local.component';
import { AppFormLocalComponent } from '../../app-form/app-form-local/app-form-local.component';

@NgModule({
  declarations: [
    AppContainerLocalComponent,
    AppFormLocalComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerLocalComponent],
  entryComponents:  [AppFormLocalComponent]
})
export class AppContainerLocalModule { }
