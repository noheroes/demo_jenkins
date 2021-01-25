import { AppFormDocumentoAddComponent } from './../../app-form/app-form-documentos-add/app-form-documentos-add.component';
import { AppFormDocumentosComponent } from '../../app-form/app-form-documentos/app-form-documentos.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerEnviadosComponent } from './app-container-enviados.component';
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
    AppContainerEnviadosComponent
  ],
  declarations: [
    AppContainerEnviadosComponent,
    //AppFormDocumentosComponent,
    //AppFormDocumentoAddComponent
  ],
  entryComponents: [
    AppFormDocumentoAddComponent
  ]
})
export class AppContainerEnviadosModule { }
