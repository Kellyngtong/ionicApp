import { Component } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { ProductModalComponent } from '../product-modal/product-modal.component';

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

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loadProducts();
  }

  async openCreateModal() {
    const modal = await this.modalCtrl.create({
      component: ProductModalComponent,
      backdropDismiss: true,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (!data || !data.product) return;

    const product = data.product;

    const loading = await this.loadingCtrl.create({
      message: 'Creando producto...'
    });
    await loading.present();

    try {
      // If the modal returned a File object, upload it first to our backend
      if (data.file) {
        const formData = new FormData();
        formData.append('image', data.file);

        try {
    const upResp = await fetch(`${window.location.protocol}//${window.location.hostname}:4800/api/upload`, {
            method: 'POST',
            body: formData,
          });

          if (!upResp.ok) {
            console.error('Upload failed:', upResp.statusText);
            const t = await this.toastCtrl.create({ message: 'Error subiendo la imagen; se intentará crear sin imagen.', duration: 2500, color: 'warning' });
            await t.present();
          } else {
            const upJson = await upResp.json();
            // Use the returned public URL as the product image
            product.image = upJson.imageUrl;
          }
        } catch (err) {
          console.error('Error uploading image:', err);
          const t = await this.toastCtrl.create({ message: 'Error subiendo la imagen; se intentará crear sin imagen.', duration: 2500, color: 'warning' });
          await t.present();
        }
      } else if (!product.image && data.previewUrl) {
        // Fallback: if no file was uploaded but a preview (base64) exists, use it
        product.image = data.previewUrl;
      }

      const token = localStorage.getItem('accessToken');
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${window.location.protocol}//${window.location.hostname}:4800/api/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const t = await this.toastCtrl.create({ message: 'Producto creado correctamente', duration: 2000, color: 'success' });
        await t.present();
        this.loadProducts(); // Recargar la lista
      } else {
        const text = await response.text();
        console.error('Create product failed:', text);
        const t = await this.toastCtrl.create({ message: 'Error al crear el producto', duration: 2500, color: 'danger' });
        await t.present();
      }
    } catch (error) {
      console.error('Error creating product:', error);
      const t = await this.toastCtrl.create({ message: 'Error al crear el producto', duration: 2500, color: 'danger' });
      await t.present();
    } finally {
      await loading.dismiss();
    }
  }

  async loadProducts() {
    try {
  const response = await fetch(`${window.location.protocol}//${window.location.hostname}:4800/api/products`);
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
      const token = localStorage.getItem('accessToken');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${window.location.protocol}//${window.location.hostname}:4800/api/products/${id}`, {
        method: 'DELETE',
        headers,
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
      const token = localStorage.getItem('accessToken');
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(
        `${window.location.protocol}//${window.location.hostname}:4800/api/products/${product.id}`,
        {
          method: 'PUT',
          headers,
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
  const response = await fetch(`${window.location.protocol}//${window.location.hostname}:4800/api/products`, {
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
