import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CheckoutPage } from './checkout.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: CheckoutPage }]),
  ],
  declarations: [CheckoutPage],
})
export class CheckoutPageModule {}
