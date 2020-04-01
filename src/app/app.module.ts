// IMPORTS ANGULAR
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// @MODULS
import { MaterialModule } from "./_views/material.module";
import { AppRoutingModule } from "./app-routing.module";

//@VIEWS
import { DashboardComponent } from "./_views/dashboard/dashboard.component";
import { HomeComponent } from "./_views/home/home.component";
import { LoginComponent } from "./_views/login/login.component";

// @COMPONENTS
import { AppComponent } from "./app.component";
import { SidenavComponent } from "./_components/sidenav/sidenav.component";
import { FooterComponent } from "./_components/footer/footer.component";
import { HeaderComponent } from "./_components/header/header.component";

// @Guards
import { GuardiaSession } from './_guards/guardia-session';
import { GuardiaInicio } from './_guards/guardia-inicio';

// @GOOGLE MAPS MODULE
import { AgmCoreModule } from "@agm/core";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: ""
    }),
  ],
  providers: [GuardiaSession, GuardiaInicio],
  bootstrap: [AppComponent]
})
export class AppModule {
}
