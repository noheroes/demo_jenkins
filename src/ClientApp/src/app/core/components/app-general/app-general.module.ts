import { SharedModule } from '@sunedu/shared';
// import { ActividadLayoutComponent } from './actividad-layout.component';
import { NgModule } from '@angular/core';
// import { ActividadHeaderComponent } from './actividad-header/actividad-header.component';
// import { ActividadFooterComponent } from './actividad-footer/actividad-footer.component';
// import { ActividadGridErrorsComponent } from './actividad-grid-errors/actividad-grid-errors.component';
import { AppGeneralCabeceraComponent } from './app-general-cabecera/app-general-cabecera.component';
import { AppGeneralContenedorPrincipalComponent } from './app-general-contenedor-principal/app-general-contenedor-principal.component';
import { AppGeneralFooterComponent } from './app-general-footer/app-general-footer.component';
import { CommonModule } from '@angular/common';
import { ModalValidarFinalizarComponent } from '../app-modal/app-modal-validar-finalizar/app-modal-validar-finalizar.component';

@NgModule({
    declarations: [
        // ActividadLayoutComponent,
        // ActividadHeaderComponent,
        // ActividadFooterComponent,
        // ActividadGridErrorsComponent,
        AppGeneralCabeceraComponent,
        AppGeneralContenedorPrincipalComponent,
        AppGeneralFooterComponent,
        ModalValidarFinalizarComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        // ActividadLayoutComponent
        AppGeneralCabeceraComponent,
        AppGeneralContenedorPrincipalComponent,
        AppGeneralFooterComponent
    ],
    entryComponents: [
        ModalValidarFinalizarComponent,
        // ActividadGridErrorsComponent
    ]
})
export class AppGeneralModule { }
