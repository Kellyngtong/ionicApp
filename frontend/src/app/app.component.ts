import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnDestroy {
  user: any = null;
  sub: Subscription | null = null;
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

  constructor(private auth: AuthService, private router: Router, private toastCtrl: ToastController) {
    this.sub = this.auth.user$.subscribe((u) => (this.user = u));
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/welcome');
  }

  openAvatarPicker() {
    try {
      this.avatarInput.nativeElement.click();
    } catch (e) {
      console.error('Avatar input not ready', e);
    }
  }

  async onAvatarSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    // Client-side validation to prevent uploading too-large files
  const MAX = 30 * 1024 * 1024; // 30MB
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (file.size > MAX) {
      const t = await this.toastCtrl.create({ message: 'Imagen demasiado grande. Máx 5MB.', duration: 2500, color: 'warning' });
      await t.present();
      input.value = '';
      return;
    }
    if (!allowed.includes(file.type)) {
      const t = await this.toastCtrl.create({ message: 'Tipo de archivo no permitido. Usa PNG/JPG/WEBP/GIF.', duration: 2500, color: 'warning' });
      await t.present();
      input.value = '';
      return;
    }

    try {
      const resp: any = await this.auth.uploadAvatar(file).toPromise();
      if (resp && resp.imageUrl) {
        // Persist avatar URL in backend for the authenticated user
        try {
          await this.auth.updateAvatarUrl(resp.imageUrl).toPromise();
        } catch (uErr) {
          console.warn('Failed to persist avatar in backend:', uErr);
        }

        // update local user and notify
        const updated = { ...(this.user || {}), avatar: resp.imageUrl };
        localStorage.setItem('currentUser', JSON.stringify(updated));
        this.auth['userSubject']?.next(updated);
        const t = await this.toastCtrl.create({ message: 'Avatar actualizado', duration: 1500 });
        await t.present();
      }
    } catch (err: any) {
      console.error('Error uploading avatar', err);
      const serverMsg = err?.error?.error || err?.error?.message || err?.message || '';
      const t = await this.toastCtrl.create({ message: `Error subiendo avatar${serverMsg ? ': ' + serverMsg : ''}`, duration: 3000, color: 'danger' });
      await t.present();
    } finally {
      // reset input
      input.value = '';
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
