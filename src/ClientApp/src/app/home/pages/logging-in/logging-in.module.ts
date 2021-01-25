import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggingInRoutingModule } from './logging-in-routing.module';
import { LoggingInComponent } from './container/logging-in/logging-in.component';
import { LoginErrorComponent } from './components/login-error/login-error.component';
import { SharedModule } from '@sunedu/shared';


@NgModule({
  declarations: [LoggingInComponent, LoginErrorComponent],
  imports: [
    CommonModule,
    LoggingInRoutingModule,
    SharedModule
  ]
})
export class LoggingInModule { }
