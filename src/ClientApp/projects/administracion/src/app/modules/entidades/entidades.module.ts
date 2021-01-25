import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunedu/shared';
import { EntidadesComponent } from './container/entidades.component';
import { FormEntidadesComponent } from './components/form-entidades.component';
import { FormModalEntidadComponent } from './modals/form-modal-entidad.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [EntidadesComponent],
  declarations: [
    EntidadesComponent,
    FormEntidadesComponent,
    FormModalEntidadComponent,
  ],
  entryComponents: [FormModalEntidadComponent],
})
export class EntidadesModule {}
