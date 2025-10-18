import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ProductDetailPage } from './product-detail.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: ProductDetailPage }]),
  ],
  declarations: [ProductDetailPage],
})
export class ProductDetailPageModule {}
