import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularioComponent } from './formulario.component';


// const routes: Routes = [
//   {
//     path: '',
//     loadChildren: './pages/formulario/formulario.module#FormularioModule'
//     // canActivate: [ AuthGuard, ClaimsGuard ],
//     // data: {
//     //   claims: [
//     //     { type: ClaimTypeEnum.URL, path: '/formulario/idFlujo/idActividad', action: PUNKU_ACTIONS.ACCEDER }
//     //   ]
//     // }
//   },
// ];

// const routes: Routes = [
//   { path: ':idFlujo/:idActividad', component: FormularioComponent }
// ];

const routes: Routes = [
  { path: '', component: FormularioComponent, pathMatch: 'full'}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormularioRoutingModule { }
