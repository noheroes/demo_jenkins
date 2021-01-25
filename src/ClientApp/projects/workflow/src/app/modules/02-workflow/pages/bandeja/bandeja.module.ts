import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BandejaRoutingModule } from './bandeja-routing.module';
import { BandejaComponent } from './container/bandeja.component';
// import { FormBusquedaBandejaComponent } from './components/forms/form-busqueda-bandeja/form-busqueda-bandeja.component';
import { SharedModule } from '@sunedu/shared';

@NgModule({
  declarations: [
    BandejaComponent,
    // Comentado, Se debe habilitar para el Rol de UACTD Evaluador
    // FormBusquedaBandejaComponent
  ],
  imports: [CommonModule, SharedModule, BandejaRoutingModule],
  entryComponents: [
    BandejaComponent,
    // FormBusquedaBandejaComponent
  ],
})
export class BandejaModule {}
