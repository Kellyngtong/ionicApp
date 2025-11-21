import { Component } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
})
export class ProductModalComponent {
  product: any = {
    name: '',
    description: '',
    price: null,
    stock: null,
    image: '',
  };
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private modalCtrl: ModalController) {}

  onFileSelected(event: any) {
    const file: File = event.target.files && event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => (this.previewUrl = e.target.result);
    reader.readAsDataURL(file);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  create() {
    // Basic validation
    if (
      !this.product.name ||
      !this.product.description ||
      this.product.price == null ||
      this.product.stock == null
    ) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    // Return the product and (optionally) the selected file and preview URL.
    // The outer page can upload the file or use the preview as an image string.
    this.modalCtrl.dismiss({
      product: this.product,
      file: this.selectedFile,
      previewUrl: this.previewUrl,
    });
  }
}
