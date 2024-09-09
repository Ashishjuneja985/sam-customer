import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule, Router } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";

import { LoginComponent } from "../app/login/login.component";
import { ResetPasswordComponent } from "../app/login/reset-password/reset-password.component";
import { ChangePasswordComponent } from "../app/login/change-password/change-password.component";
import { VerifyOptComponent } from "../app/login/verify-opt/verify-opt.component";

import { AuthGuard } from "./helpers";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/admin-layout/admin-layout.module").then(
            (m) => m.AdminLayoutModule,
          ),
      },
    ],
  },
  { path: "login", component: LoginComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "verify-otp", component: VerifyOptComponent },
  { path: "change-password", component: ChangePasswordComponent },
  { path: "", component: LoginComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [],
})
export class AppRoutingModule {
  constructor(private router: Router){
  this.router.events.subscribe(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fcmToken = urlParams.get('fcm_token');
    if (fcmToken) {
      // this.tokenStorage.setToken(fcmToken);
      localStorage.setItem("fcmToken", JSON.stringify(fcmToken));
      
    }
  });
}
}
