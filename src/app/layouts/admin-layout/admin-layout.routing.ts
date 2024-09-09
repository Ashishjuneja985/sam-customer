import { Routes } from "@angular/router";

import { DashboardComponent } from "../../dashboard/dashboard.component";
import { ProjectComponent } from "app/project/project.component";
import { ProjectDetailComponent } from "app/project/project-detail/project-detail.component";
import { ProfileComponent } from "app/profile/profile.component";
import { ProfileChangePasswordComponent } from "app/profile-change-password/profile-change-password.component";


export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  {
    path:"project", component:ProjectComponent
  },
  {
    path:'profile',component:ProfileComponent
  },
  {
    path:'profile/profile-change-password',component:ProfileChangePasswordComponent
  },
  {
    path:'project/project-details/:id', component:ProjectDetailComponent
  },
];
