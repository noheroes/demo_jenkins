import { AppFormDocumentoAddComponent } from './../../app-form/app-form-documentos-add/app-form-documentos-add.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerDocumentosOperacionComponent } from './app-container-documentos-operacion.component';
import { SharedModule } from '@sunedu/shared';
import { MatIconModule } from '@angular/material';
import { GestorArchivosModule as GaModule } from '@lic/core';
import { MdePopoverModule } from '@material-extended/mde';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    GaModule,
    MdePopoverModule
  ],
  exports: [
    AppContainerDocumentosOperacionComponent
  ],
  declarations: [
    AppContainerDocumentosOperacionComponent,
    AppFormDocumentoAddComponent
    //AppFormDocumentosComponent,
    //AppFormDocumentoAddComponent
  ],
  entryComponents: [
    AppFormDocumentoAddComponent
  ]
})
export class AppContainerDocumentosOperacionModule { }
