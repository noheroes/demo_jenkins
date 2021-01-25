import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@sunedu/shared';


import { AppContainerPresupuestoComponent } from './app-container-presupuesto.component';
import { AppFormPresupuestoComponent } from '../../app-form/app-form-presupuesto/app-form-presupuesto.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerPresupuestoComponent],
  declarations: [
                  AppContainerPresupuestoComponent,
                  AppFormPresupuestoComponent
               ],
  entryComponents:[ AppFormPresupuestoComponent]
})
export class AppContainerPresupuestoModule { }
