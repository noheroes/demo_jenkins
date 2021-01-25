import { AppFormMediosVerificacionComentariosComponent } from './../../app-form/app-form-mediosverificacion-comentarios/app-form-mediosverificacion-comentarios.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppContainerMedioComponent } from './app-container-medio.component';
import { SharedModule } from '@sunedu/shared';
import { MatIconModule } from '@angular/material';
import { AppFormMediosverificacionComponent } from '../../app-form/app-form-mediosverificacion/app-form-mediosverificacion.component';
import { MediosVerificacionFilterPipe } from '../../../store/mediosverificacion/mediosverificacion-filter.pipe';
import { GestorArchivosModule as GaModule } from '@lic/core';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    GaModule
  ],
  exports:[
    AppContainerMedioComponent
  ],
  declarations: [
    AppContainerMedioComponent,
    AppFormMediosverificacionComponent,
    AppFormMediosVerificacionComentariosComponent,
    MediosVerificacionFilterPipe,
  ],
  entryComponents:[
    AppFormMediosVerificacionComentariosComponent
  ],
  // providers:[
  //   DatePipe
  // ]
})
export class AppContainerMedioModule { }
