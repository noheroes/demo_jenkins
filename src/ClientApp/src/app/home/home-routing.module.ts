import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '', loadChildren: './pages/home-page/home-page.module#HomePageModule'
  },
  {
    path: 'logging-in', loadChildren: './pages/logging-in/logging-in.module#LoggingInModule',
    // canActivate: [ GuestGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
