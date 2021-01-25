import { AppContainerInfraestructuraCantidadesModule } from './../../app-container-horizontal/container-infraestructura-cantidades/app-container-infraestructura-cantidades.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerFormatoComponent } from './app-container-formato.component';
import { SharedModule } from '@sunedu/shared';
import { AppContainerAmbienteModule } from '../../app-container-horizontal/container-ambiente/app-container-ambiente.module';
import { AppContainerRelaciondocenteModule } from '../../app-container-horizontal/container-relaciondocente/app-container-relaciondocente.module';
import { AppContainerProgramaModule } from '../../app-container-horizontal/container-programa/app-container-programa.module';
import { AppContainerProgramaSeModule } from '../../app-container-horizontal/container-programa-se/app-container-programa-se.module';
import { AppContainerInfraestructuraModule } from '../../app-container-horizontal/container-infraestructura/app-container-infraestructura.module';
import { AppContainerEquipamientoModule } from '../../app-container-horizontal/container-equipamiento/app-container-equipamiento.module';

import { AppContainerListaLocalModule } from '../../app-container-horizontal/container-listalocal/app-container-listalocal.module';
import { AppContainerLaboratorioModule } from '../../app-container-horizontal/container-laboratorio/app-container-laboratorio.module';
import { AppContainerTallerModule } from '../../app-container-horizontal/container-taller/app-container-taller.module';

import { AppContainerPresupuestoModule } from '../../app-container-horizontal/container-presupuesto/app-container-presupuesto.module';
import { AppContainerRelacionnodocenteModule } from '../../app-container-horizontal/container-relacionnodocente/app-container-relacionnodocente.module';
const IMPORTS_COMPONENTES_TAB = [
  AppContainerAmbienteModule,
  AppContainerRelaciondocenteModule,
  AppContainerRelacionnodocenteModule,
  AppContainerProgramaModule,
  AppContainerProgramaSeModule,
  AppContainerInfraestructuraModule,
  AppContainerInfraestructuraCantidadesModule,
  AppContainerPresupuestoModule,
  AppContainerEquipamientoModule,
  AppContainerListaLocalModule,
  AppContainerLaboratorioModule,
  AppContainerTallerModule,
];
@NgModule({
  declarations: [AppContainerFormatoComponent],
  imports: [
    CommonModule,
    SharedModule,
    ...IMPORTS_COMPONENTES_TAB
  ],
  exports: [AppContainerFormatoComponent]
})
export class AppContainerFormatoModule { }

