import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutComponent } from './app-layout.component';
import { SharedModule } from '@sunedu/shared';


@NgModule({
  declarations: [AppLayoutComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [AppLayoutComponent]
})
export class AppLayoutModule { }
