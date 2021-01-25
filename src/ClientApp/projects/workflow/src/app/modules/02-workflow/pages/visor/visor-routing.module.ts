import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisorComponent } from './container/visor.component';


const routes: Routes = [
  { path: '', component: VisorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisorRoutingModule { }
