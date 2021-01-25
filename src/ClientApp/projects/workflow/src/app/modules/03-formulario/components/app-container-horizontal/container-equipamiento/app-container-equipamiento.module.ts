import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunedu/shared';
import { AppContainerEquipamientoComponent } from './app-container-equipamiento.component';
import { AppFormEquipamientoComponent } from '../../app-form/app-form-equipamiento/app-form-equipamiento.component';
import { AppFormBuscarEquipamientoComponent } from '../../app-form/app-form-buscar-equipamiento/app-form-buscar-equipamiento.component';



@NgModule({
  declarations: [AppContainerEquipamientoComponent,
                 AppFormEquipamientoComponent,
                 AppFormBuscarEquipamientoComponent
                 ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerEquipamientoComponent],
  entryComponents:[
    AppFormEquipamientoComponent
  ]
})
export class AppContainerEquipamientoModule { }
