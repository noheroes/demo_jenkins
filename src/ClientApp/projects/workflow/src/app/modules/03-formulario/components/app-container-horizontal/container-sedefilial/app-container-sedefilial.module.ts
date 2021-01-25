import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunedu/shared';
import { AppContainerSedefilialComponent } from './app-container-sedefilial.component';
import { AppFormSedefilialComponent } from '../../app-form/app-form-sedefilial/app-form-sedefilial.component';
// import { AppFormLocalComponent } from '../../app-form/app-form-local/app-form-local.component';
import { AppContainerLocalModule } from '../container-local/app-container-local.module';

@NgModule({
  declarations: [
    AppContainerSedefilialComponent,
    AppFormSedefilialComponent,
    // AppFormLocalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppContainerLocalModule
  ],
  exports: [AppContainerSedefilialComponent],
  entryComponents:  [AppFormSedefilialComponent/*, AppFormLocalComponent*/]
})
export class AppContainerSedeFilialModule { }
