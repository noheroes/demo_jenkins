import { NgModule, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContainerSolicitudComponent } from './app-container-solicitud.component';
import { SharedModule } from '@sunedu/shared';

@NgModule({
  declarations: [AppContainerSolicitudComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    AppContainerSolicitudComponent
  ]
})
export class AppContainerSolicitudModule implements OnInit { 
  @Input() modelData: any = null;
  /**
   *
   */
  constructor() {
  }

  ngOnInit() {
  }
}
