import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './components/reset/reset.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    NavbarComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule 
  ],
  // providers: [ { provide: HTTP_INTERCEPTORS, useClass: tokenInterceptor, multi: true },],
  providers: [
    provideHttpClient(
      withInterceptors([tokenInterceptor])//Modifies my request header, this is where i set the token on the request header
    ),
    // other providers
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
