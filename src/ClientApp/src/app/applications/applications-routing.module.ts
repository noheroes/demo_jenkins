import { ApplicationsComponent } from './applications.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
    children: [
      {
        path: 'workflow',
        loadChildren: '@lic/workflow/app/app.module#AppModule'
      },
      {
        path: 'administracion',
        loadChildren: '@lic/administracion/app/app.module#AppModule'
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationsRoutingModule {}
