import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/** Modules */
import { MaterialModule } from './material/material.module';
import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
/** Components */
import { AppComponent } from './app.component';
import {
  HomeComponent,
  SensorChartComponent,
  SignupComponent,
  LoginComponent,
  LogoutComponent,
  AccountComponent,
  AdminComponent,
  NotFoundComponent
} from './pages';
/** Services */
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { LogService } from "./services/log.service";
import { ChartsModule } from "ng2-charts";

const PAGES = [
  HomeComponent,
  SensorChartComponent,
  SignupComponent,
  LoginComponent,
  LogoutComponent,
  AccountComponent,
  AdminComponent,
  NotFoundComponent
];

@NgModule({
  declarations: [
    AppComponent,
    ...PAGES
  ],
  imports: [
    RoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    MaterialModule,
    ChartsModule
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    UserService,
    LogService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
