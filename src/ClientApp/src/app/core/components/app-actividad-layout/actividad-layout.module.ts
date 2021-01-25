import { SharedModule } from '@sunedu/shared';
import { ActividadLayoutComponent } from './actividad-layout.component';
import { NgModule } from '@angular/core';
import { ActividadHeaderComponent } from './actividad-header/actividad-header.component';
import { ActividadFooterComponent } from './actividad-footer/actividad-footer.component';
import { ActividadGridErrorsComponent } from './actividad-grid-errors/actividad-grid-errors.component';

@NgModule({
  declarations: [
    ActividadLayoutComponent,
    ActividadHeaderComponent,
    ActividadFooterComponent,
    ActividadGridErrorsComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    ActividadLayoutComponent
  ],
  entryComponents: [
    ActividadGridErrorsComponent
  ]
})
export class ActividadLayoutModule { }
