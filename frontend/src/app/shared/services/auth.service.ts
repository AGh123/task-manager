import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/routes';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(API_ROUTES.AUTH.LOGIN, {
      email,
      password,
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired(token);
  }

  getDecodedToken(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode<any>(token);
      return decoded;
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

  getUserEmail(): string | null {
    const decodedToken = this.getDecodedToken();
    return (
      decodedToken?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ] || null
    );
  }

  getUserId(): number | null {
    const decodedToken = this.getDecodedToken();
    const id =
      decodedToken?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];
    return id ? Number(id) : null;
  }

  getUserRole(): string | null {
    return (
      this.getDecodedToken()?.[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] || null
    );
  }

  isManager(): boolean {
    return this.getUserRole()?.toLowerCase() === 'manager';
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  }
}
