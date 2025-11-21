import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Build API host dynamically so requests work from device/browser when served via ionic serve --external
  private API_HOST = `${window.location.protocol}//${window.location.hostname}:4800`;
  private base = `${this.API_HOST}/api/auth`;

  private userSubject = new BehaviorSubject<any>(this._loadUser());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(payload: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.base}/register`, payload);
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.base}/login`, payload).pipe(
      tap((res: any) => {
        if (res && res.accessToken) {
          localStorage.setItem('accessToken', res.accessToken);
          if (res.user) {
            localStorage.setItem('currentUser', JSON.stringify(res.user));
            this.userSubject.next(res.user);
          }
        }
      })
    );
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('image', file);
  return this.http.post(`${this.API_HOST}/api/upload`, formData);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  isLogged() {
    return !!this.getToken();
  }

  private _loadUser() {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
}
