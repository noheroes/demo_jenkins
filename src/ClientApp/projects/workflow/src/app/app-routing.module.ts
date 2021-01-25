import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: './modules/02-workflow/workflow.module#WorkflowModule',
  },
  {
    path: 'formularios',
    loadChildren: './modules/03-formulario/formulario.module#FormularioModule',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
