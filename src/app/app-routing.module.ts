import { DeliveryReportsComponent } from './_views/delivery-reports/delivery-reports.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// VIEWS
import { LoginComponent } from "./_views/login/login.component";
import { HomeComponent } from './_views/home/home.component';
import { DashboardComponent } from './_views/dashboard/dashboard.component';

// @GUARDS
import { GuardiaInicio } from './_guards/guardia-inicio';
import { GuardiaSession } from './_guards/guardia-session';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [GuardiaInicio]
  },
  {
    path: "dashboard",
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: "inicio",
        component: DashboardComponent
      },
      {
        path: "reporte",
        component: DeliveryReportsComponent
      }
    ],
    canActivate: [GuardiaSession]
  },
  {
    path: "",
    redirectTo: 'dashboard/inicio',
    canActivate: [GuardiaSession],
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }]
})
export class AppRoutingModule {}
