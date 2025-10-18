import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: false,
})
export class ProductCardComponent {
  @Input() product: any;
  @Output() addToCart = new EventEmitter<any>();
  @Output() goToDetail = new EventEmitter<any>();
  @Output() editProduct = new EventEmitter<any>();
  @Output() deleteProduct = new EventEmitter<number>();
}
