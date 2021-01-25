import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { CoreModule, States } from '@lic/core';
import { SharedModule } from '@sunedu/shared';
import { NgxsModule } from '@ngxs/store';
import { HomeModule } from './home/home.module';
import { HomePageModule } from './home/pages/home-page/home-page.module';
import { LoggingInModule } from './home/pages/logging-in/logging-in.module';
import { AppRoutingModule } from './app-routing.module';
import { ApplicationsModule } from './applications/applications.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoadingBarRouterModule,
    CoreModule,
    SharedModule,
    NgxsModule.forRoot(States),
    HomeModule,
    HomePageModule,
    LoggingInModule,
    ApplicationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
