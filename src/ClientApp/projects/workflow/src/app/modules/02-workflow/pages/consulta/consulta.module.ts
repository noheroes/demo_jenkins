import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaRoutingModule } from './consulta-routing.module';
import { ConsultaComponent, SafePipe } from './container/consulta.component';


@NgModule({
  declarations: [ConsultaComponent, SafePipe],
  imports: [
    CommonModule,
    ConsultaRoutingModule
  ]
})
export class ConsultaModule { }
