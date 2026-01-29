import { Injectable } from '@angular/core';
import { ApiService } from './Api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  id_rol: number;
  rol_nombre: string;
  activo: boolean;
  verificado: boolean;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  id_rol: number;
}

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.checkAuthStatus();
  }

  // Registro
  register(data: RegisterData): Observable<any> {
    return this.apiService.post('/api/auth/register', data).pipe(
      tap((response: any) => {
        if (response.status === 'success') {
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  // Login
  login(data: LoginData): Observable<any> {
    return this.apiService.post('/api/auth/login', data).pipe(
      tap((response: any) => {
        if (response.status === 'success') {
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  // Logout
  logout(): Observable<any> {
    return this.apiService.post('/api/auth/logout', {}).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      })
    );
  }

  // Verificar estado de autenticación
  checkAuthStatus(): void {
    this.apiService.get<any>('/api/auth/me').subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.currentUserSubject.next(response.data.user);
        }
      },
      error: () => {
        this.currentUserSubject.next(null);
      }
    });
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}