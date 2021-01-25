import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerMaestroFacultadComponent} from './app-container-maestro-facultad.component';
import { SharedModule } from '@sunedu/shared';
import { AppFormMaestroFacultadComponent } from '../../app-form/app-form-maestro-facultad/app-form-maestro-facultad.component';

@NgModule({
  declarations: [AppContainerMaestroFacultadComponent,
    AppFormMaestroFacultadComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppContainerMaestroFacultadComponent],
  entryComponents:[AppFormMaestroFacultadComponent]
})
export class AppContainerMaestroFacultadModule { } 
