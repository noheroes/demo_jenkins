import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunedu/shared';
import { AppContainerInfraestructuraComponent } from './app-container-infraestructura.component';
import { AppFormInfraestructuraComponent } from '../../app-form/app-form-infraestructura/app-form-infraestructura.component';
import { AppFormBuscarInfraestructuraComponent } from '../../app-form/app-form-buscar-infraestructura/app-form-buscar-infraestructura.component';

@NgModule({
  declarations: [AppContainerInfraestructuraComponent,
                 AppFormInfraestructuraComponent,
                 AppFormBuscarInfraestructuraComponent
                 ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerInfraestructuraComponent],
  entryComponents:[
    AppFormInfraestructuraComponent
  ]
})
export class AppContainerInfraestructuraModule { }
