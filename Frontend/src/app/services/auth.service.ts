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
    // console.log('🔧 AuthService - Inicializando...');
    this.checkAuthStatus();
  }

  // Registro
  register(data: RegisterData): Observable<any> {
    return this.apiService.post('/api/auth/register', data).pipe(
      tap((response: any) => {
        // console.log('📝 AuthService - Respuesta de registro:', response);
        if (response.status === 'success') {
          // console.log('✅ AuthService - Usuario registrado:', response.data.user);
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  // Login
  login(data: LoginData): Observable<any> {
    return this.apiService.post('/api/auth/login', data).pipe(
      tap((response: any) => {
        // console.log('🔐 AuthService - Respuesta de login:', response);
        if (response.status === 'success') {
          // console.log('✅ AuthService - Actualizando usuario actual:', response.data.user);
          this.currentUserSubject.next(response.data.user);
          // console.log('✅ AuthService - Usuario actualizado en BehaviorSubject');
        }
      })
    );
  }

  // Logout
  logout(): Observable<any> {
    return this.apiService.post('/api/auth/logout', {}).pipe(
      tap(() => {
        // console.log('👋 AuthService - Cerrando sesión...');
        this.currentUserSubject.next(null);
      })
    );
  }

  // Verificar estado de autenticación
  checkAuthStatus(): void {
    // console.log('🔍 AuthService - Verificando sesión en el servidor...');
    this.apiService.get<any>('/api/auth/me').subscribe({
      next: (response) => {
        // console.log('📥 AuthService - Respuesta de /me:', response);
        if (response.status === 'success') {
          // console.log('✅ AuthService - Sesión activa:', response.data.user);
          this.currentUserSubject.next(response.data.user);
        } else {
          // console.log('❌ AuthService - No hay sesión activa');
          this.currentUserSubject.next(null);
        }
      },
      error: (error) => {
        console.error('❌ AuthService - Error al verificar sesión:', error);
        this.currentUserSubject.next(null);
      }
    });
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    const user = this.currentUserSubject.value;
    // console.log('👤 AuthService - Usuario actual:', user);
    return user;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    const isAuth = this.currentUserSubject.value !== null;
    // console.log('🔒 AuthService - ¿Está autenticado?', isAuth);
    return isAuth;
  }
}
