import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module'; // Asegúrate de que tienes el módulo Material importado
import { AuthenticationRoutingModule } from './authentication.routing';
import { AppSideLoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppSideLoginComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AuthenticationRoutingModule,
  ]
})
export class AuthenticationModule {}
