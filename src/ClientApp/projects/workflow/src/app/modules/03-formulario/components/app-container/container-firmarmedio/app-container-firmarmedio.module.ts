import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerFirmarMedioComponent } from './app-container-firmarmedio.component';
import { SharedModule } from '@sunedu/shared';
import { ModalFirmaComponent } from '../../../../../../../../../src/app/core/components/app-modal/app-modal-firma/app-modal-firma.component';
import { AppFormFirmarMediosverificacionComponent } from '../../app-form/app-form-firmarmediosverificacion/app-form-firmarmediosverificacion.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [AppContainerFirmarMedioComponent],
  declarations: [
    AppContainerFirmarMedioComponent,
    AppFormFirmarMediosverificacionComponent,
    ModalFirmaComponent,
  ],
  entryComponents: [ModalFirmaComponent],
})
export class AppContainerFirmarMedioModule {}
