import { JsonFormatterModule } from './container/json-formatter/json-formatter.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '@sunedu/shared';
import { VisorComponent } from './container/visor.component';
import { GestorArchivosModule as GaModule } from '@lic/core';
import { VisorRoutingModule } from './visor-routing.module';


@NgModule({
  declarations: [VisorComponent],
  imports: [
    CommonModule,
    VisorRoutingModule,
    SharedModule,
    GaModule,
    JsonFormatterModule
  ],
  entryComponents: [VisorComponent]
})
export class VisorModule { }
