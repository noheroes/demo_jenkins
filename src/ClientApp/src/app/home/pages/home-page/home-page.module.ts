import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppLayoutModule } from '@lic/core';

import { HomePageRoutingModule } from './home-page-routing.module';
import { HomeComponent } from '../home-page/container/home/home.component';

import { SharedModule } from '@sunedu/shared';
import { WellcomeComponent } from './components/wellcome/wellcome.component';

@NgModule({
  declarations: [HomeComponent, WellcomeComponent],
  imports: [
    AppLayoutModule,
    CommonModule,
    HomePageRoutingModule,
    SharedModule
  ]
})
export class HomePageModule { }
