import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginPage } from './login.page';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [IonicModule, LoginPage, RouterModule.forChild([{ path: '', component: LoginPage }])],
})
export class LoginPageModule {}
