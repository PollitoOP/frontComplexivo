import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppSideLoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: AppSideLoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
