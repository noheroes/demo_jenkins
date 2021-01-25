import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'formularios',
    loadChildren:'../03-formulario/formulario.module#FormularioModule',
  },
  {
    path: 'bandeja',
    loadChildren: './pages/bandeja/bandeja.module#BandejaModule'
    // canActivate: [ AuthGuard, ClaimsGuard ],
    // data: {
    //   claims: [
    //     { type: ClaimTypeEnum.URL, path: '/workflow/bandeja', action: PUNKU_ACTIONS.ACCEDER }
    //   ]
    // }
  },{
    path: 'trazabilidad',
    loadChildren: './pages/trazabilidad/trazabilidad.module#TrazabilidadModule'
    // canActivate: [ AuthGuard, ClaimsGuard ],
    // data: {
    //   claims: [
    //     { type: ClaimTypeEnum.URL, path: '/workflow/consulta', action: PUNKU_ACTIONS.ACCEDER }
    //   ]
    // }
  },
  {
    path: 'visor',
    loadChildren: './pages/visor/visor.module#VisorModule'
    // canActivate: [ AuthGuard, ClaimsGuard ],
    // data: {
    //   claims: [
    //     { type: ClaimTypeEnum.URL, path: '/workflow/consulta', action: PUNKU_ACTIONS.ACCEDER }
    //   ]
    // }
  },
  {
    path: '',
    loadChildren: './pages/inicio/inicio.module#InicioModule'
    // canActivate: [ AuthGuard, ClaimsGuard ],
    // data: {
    //   claims: [
    //     { type: ClaimTypeEnum.URL, path: '/workflow/inicio', action: PUNKU_ACTIONS.ACCEDER }
    //   ]
    // }
  },
  // {
  //   path: 'consulta',
  //   loadChildren: './pages/consulta/consulta.module#ConsultaModule'
  //   // canActivate: [ AuthGuard, ClaimsGuard ],
  //   // data: {
  //   //   claims: [
  //   //     { type: ClaimTypeEnum.URL, path: '/workflow/consulta', action: PUNKU_ACTIONS.ACCEDER }
  //   //   ]
  //   // }
  // },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
