import { AppContainerSolicitudTrazabilidadComponent } from './components/container/app-container-solicitud.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: AppContainerSolicitudTrazabilidadComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrazabilidadRoutingModule { }