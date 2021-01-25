import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunedu/shared';
import { AppContainerCargamasivaComponent } from './app-container-cargamasiva.component';
import { AppFormActividadComponent } from '../../app-form/app-form-actividad/app-form-actividad.component';
import { GestorArchivosCargaMasivaModule } from 'src/app/core/components/gestor-archivos-carga-masiva/gestor-archivos-carga-masiva.module';
// import { GestorArchivosCargaMasivaModule as GaModule } from '@lic/core';
const IMPORTS_COMPONENTES_TAB = [

];
@NgModule({
  declarations: [AppContainerCargamasivaComponent, AppFormActividadComponent],
  imports: [
    CommonModule,    
    SharedModule,    
    ...IMPORTS_COMPONENTES_TAB,
    GestorArchivosCargaMasivaModule
    //GaModule,
  ],
  exports: [AppContainerCargamasivaComponent],
  entryComponents: [AppFormActividadComponent]
})
export class AppContainerCargamasivaModule { }
