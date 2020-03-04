import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// VIEWS
import { LoginComponent } from "./_views/login/login.component";
import { HomeComponent } from './_views/home/home.component';
import { DashboardComponent } from './_views/dashboard/dashboard.component';

// @GUARDS
import { GuardiaInicio } from './_guards/guardia-inicio';
import { GuardiaSession } from './_guards/guardia-session';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [GuardiaInicio]
  },
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "inicio",
        component: DashboardComponent
      }
    ],
    canActivate: [GuardiaSession]
  },
  // {
  //   path: "home",
  //   redirectTo: "home/inicio",
  //   pathMatch: 'full'
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
