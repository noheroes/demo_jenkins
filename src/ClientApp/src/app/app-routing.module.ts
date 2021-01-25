import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { HomeComponent } from './home/home.component';


// RouterModule.forRoot([
//   { path: '', component: HomeComponent, pathMatch: 'full' },
//   { path: 'counter', component: CounterComponent },
//   { path: 'fetch-data', component: FetchDataComponent },
// ]),

const routes: Routes = [
  { path: '', loadChildren: './home/home.module#HomeModule' },
  { path: '', loadChildren: './applications/applications.module#ApplicationsModule' },
  // { path: 'home', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }


