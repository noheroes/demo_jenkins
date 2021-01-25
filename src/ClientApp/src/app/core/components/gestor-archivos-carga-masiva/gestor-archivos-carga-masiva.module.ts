import { SharedModule } from '@sunedu/shared';
import { NgModule } from '@angular/core';
import { GestorArchivosCargaMasivaComponent } from './gestor-archivos-carga-masiva.component';
import { GestorArchivosButtonsComponent } from './gestor-archivos-buttons/gestor-archivos-buttons.component';
import { GestorArchivosProgressComponent } from './gestor-archivos-progress/gestor-archivos-progress.component';
import { GestorArchivosTagsComponent } from './gestor-archivos-tags/gestor-archivos-tags.component';

@NgModule({
  declarations: [
    GestorArchivosCargaMasivaComponent,
    GestorArchivosButtonsComponent,
    GestorArchivosProgressComponent,
    GestorArchivosTagsComponent    
  ],
  imports: [
    SharedModule
  ],
  exports: [
    GestorArchivosCargaMasivaComponent
  ]
})
export class GestorArchivosCargaMasivaModule { }
