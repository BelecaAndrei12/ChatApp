import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './components/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WelcomeComponent,
    RegisterComponent,
    LoginComponent,
  ],
  imports: [CommonModule, PublicRoutingModule,ReactiveFormsModule],
})
export class PublicModule {}
