//import { AppFormDocumentoAddComponent } from './../../app-form/app-form-documentos-add/app-form-documentos-add.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerDocumentosConsultaComponent } from './app-container-documentos-consulta.component';
import { SharedModule } from '@sunedu/shared';
import { MatIconModule } from '@angular/material';
import { GestorArchivosModule as GaModule } from '@lic/core';
import { MdePopoverModule } from '@material-extended/mde';
import { AppFormDocumentoConsultaAddComponent } from '../../app-form/app-form-documentos-consulta-add/app-form-documentos-consulta-add.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    GaModule,
    MdePopoverModule
  ],
  exports: [
    AppContainerDocumentosConsultaComponent
  ],
  declarations: [
    AppContainerDocumentosConsultaComponent,
    AppFormDocumentoConsultaAddComponent
  ],
  entryComponents: [
    AppFormDocumentoConsultaAddComponent
  ]
})
export class AppContainerDocumentosConsultaModule { }
