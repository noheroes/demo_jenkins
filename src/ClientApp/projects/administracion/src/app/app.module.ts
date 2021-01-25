import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from '@sunedu/shared';
import { AppGeneralModule } from '@lic/core';
import { EntidadesModule } from './modules/entidades/entidades.module';
import { RepresentanteLegalModule } from './modules/representante-legal/representante-legal.module';

import { EntidadService } from './modules/entidades/services/entidad.service';

const IMPORTS_COMPONENTES_CORE = [AppGeneralModule];
const IMPORTS_COMPONENTES_TAB = [
  EntidadesModule,
  RepresentanteLegalModule
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    ...IMPORTS_COMPONENTES_CORE,
    ...IMPORTS_COMPONENTES_TAB,
  ],
  providers: [EntidadService],
  bootstrap: [AppComponent],
})
export class AppModule {}
