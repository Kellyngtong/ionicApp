import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  goToDetail(id: any) {
    window.location.href = `/product/${id}`;
  }

  products: any[] = [];

  constructor() {
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const response = await fetch('http://localhost:4800/api/products');
      this.products = await response.json();
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  addToCart(product: any) {
    let cart = localStorage.getItem('cart');
    let cartArr = cart ? JSON.parse(cart) : [];
    const idx = cartArr.findIndex((item: any) => item.id === product.id);
    if (idx > -1) {
      cartArr[idx].quantity += 1;
    } else {
      cartArr.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cartArr));
    alert('Producto añadido al carrito');
  }

  async deleteProduct(id: number) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4800/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Producto eliminado correctamente');
        this.loadProducts(); // Recargar la lista
      } else {
        alert('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  }

  async editProduct(product: any) {
    const newName = prompt('Nombre del producto:', product.name);
    if (!newName) return;

    const newPrice = prompt('Precio del producto:', product.price.toString());
    if (!newPrice) return;

    const newStock = prompt('Stock del producto:', product.stock.toString());
    if (!newStock) return;

    const updatedProduct = {
      ...product,
      name: newName,
      price: parseFloat(newPrice),
      stock: parseInt(newStock),
    };

    try {
      const response = await fetch(
        `http://localhost:4800/api/products/${product.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (response.ok) {
        alert('Producto actualizado correctamente');
        this.loadProducts(); // Recargar la lista
      } else {
        alert('Error al actualizar el producto');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto');
    }
  }

  async createProduct() {
    const name = prompt('Nombre del producto:');
    if (!name) return;

    const description = prompt('Descripción del producto:');
    if (!description) return;

    const price = prompt('Precio del producto:');
    if (!price) return;

    const stock = prompt('Stock del producto:');
    if (!stock) return;

    const image =
      prompt('URL de la imagen (opcional):') ||
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format';

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      image,
    };

    try {
      const response = await fetch('http://localhost:4800/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        alert('Producto creado correctamente');
        this.loadProducts(); // Recargar la lista
      } else {
        alert('Error al crear el producto');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto');
    }
  }
}
