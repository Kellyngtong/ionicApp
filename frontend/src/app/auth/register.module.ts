import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterPage } from './register.page';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [IonicModule, RegisterPage, RouterModule.forChild([{ path: '', component: RegisterPage }])],
})
export class RegisterPageModule {}
