import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false,
})
export class CartPage {
  updateQuantity(index: number, delta: number) {
    if (this.cart[index].quantity + delta > 0) {
      this.cart[index].quantity += delta;
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    if (this.cart[index].quantity === 0) {
      this.removeItem(index);
    }
  }

  removeItem(index: number) {
    this.cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
  cart: any[] = [];

  constructor() {
    this.loadCart();
  }

  loadCart() {
    const cartData = localStorage.getItem('cart');
    this.cart = cartData ? JSON.parse(cartData) : [];
  }

  getTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
