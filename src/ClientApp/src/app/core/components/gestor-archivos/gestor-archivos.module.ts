import { SharedModule } from '@sunedu/shared';
import { NgModule } from '@angular/core';
import { GestorArchivosComponent } from './gestor-archivos.component';
import { GestorArchivosButtonsComponent } from './gestor-archivos-buttons/gestor-archivos-buttons.component';
import { GestorArchivosProgressComponent } from './gestor-archivos-progress/gestor-archivos-progress.component';
import { GestorArchivosTagsComponent } from './gestor-archivos-tags/gestor-archivos-tags.component';
import { GestorArchivosHistorialComponent } from './gestor-archivos-historial/gestor-archivos-historial.component';

@NgModule({
  declarations: [
    GestorArchivosComponent,
    GestorArchivosButtonsComponent,
    GestorArchivosProgressComponent,
    GestorArchivosTagsComponent,
    GestorArchivosHistorialComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    GestorArchivosComponent
  ]
})
export class GestorArchivosModule { }
