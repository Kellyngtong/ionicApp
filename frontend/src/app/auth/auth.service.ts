import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API_HOST = `${window.location.protocol}//${window.location.hostname}:4800`;
  private base = `${this.API_HOST}/api/auth`;

  private userSubject = new BehaviorSubject<any>(this._loadUser());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // If we have a token but no cached user, try to fetch the profile
    const token = this.getToken();
    if (token && !this.userSubject.value) {
      this.getProfile().subscribe({ next: () => {}, error: () => {} });
    }
  }

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

  updateAvatarUrl(avatarUrl: string) {
    const token = this.getToken();
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return this.http.put(`${this.API_HOST}/api/users/avatar`, { avatar: avatarUrl }, { headers }).pipe(
      tap((res: any) => {
        // if server returns updated user, update local storage and subject
        if (res) {
          const user = res;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.userSubject.next(user);
        }
      })
    );
  }

  getProfile() {
    const token = this.getToken();
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return this.http.get(`${this.API_HOST}/api/users/me`, { headers }).pipe(
      tap((res: any) => {
        if (res) {
          localStorage.setItem('currentUser', JSON.stringify(res));
          this.userSubject.next(res);
        }
      })
    );
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
