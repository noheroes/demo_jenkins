import { AppLayoutModule } from '@lic/core';
import { SharedModule } from '@sunedu/shared';
import { ApplicationsComponent } from './applications.component';
import { NgModule } from '@angular/core';

import { ApplicationsRoutingModule } from './applications-routing.module';

@NgModule({
  declarations: [ ApplicationsComponent ],
  imports: [
    SharedModule,
    ApplicationsRoutingModule,
    AppLayoutModule
  ]
})
export class ApplicationsModule { }
