import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggingInComponent } from './container/logging-in/logging-in.component';

const routes: Routes = [ { path: '', component: LoggingInComponent } ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoggingInRoutingModule { }
