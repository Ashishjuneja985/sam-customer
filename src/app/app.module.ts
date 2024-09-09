import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { NgxSpinnerModule } from "ngx-spinner";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./login/login.component";
import { fakeBackendProvider } from "./helpers";
import { ToastrModule } from "ngx-toastr";

import { BasicAuthInterceptor, ErrorInterceptor } from "./helpers";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { ResetPasswordComponent } from "./login/reset-password/reset-password.component";
import { VerifyOptComponent } from "./login/verify-opt/verify-opt.component";
import { ChangePasswordComponent } from "./login/change-password/change-password.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxPaginationModule } from "ngx-pagination";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { NgApexchartsModule } from "ng-apexcharts";
import { ProjectComponent } from './project/project.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileChangePasswordComponent } from './profile-change-password/profile-change-password.component';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    NgApexchartsModule,
    NgbModule,
    NgxPaginationModule,
    NgxIntlTelInputModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    AnalyticsComponent,
    ResetPasswordComponent,
    VerifyOptComponent,
    ChangePasswordComponent,
    ProjectComponent,
    ProjectDetailComponent,
    ProfileComponent,
    ProfileChangePasswordComponent,
  ],
  providers: [
    /*  { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true }, */
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
