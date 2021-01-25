import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './container/inicio.component';
import { SharedModule } from '@sunedu/shared';
import { FormIniciarProcedimientoComponent } from './components/form-iniciar-procedimiento/form-iniciar-procedimiento.component';


@NgModule({
  declarations: [InicioComponent, FormIniciarProcedimientoComponent],
  imports: [
    CommonModule,
    InicioRoutingModule,
    SharedModule,
  ],
  entryComponents: [FormIniciarProcedimientoComponent]
})
export class InicioModule { }
