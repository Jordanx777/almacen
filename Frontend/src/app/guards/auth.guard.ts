import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      // console.log('🔒 AuthGuard - Usuario actual:', user);
      
      if (user) {
        // Usuario autenticado, permitir acceso
        // console.log('✅ AuthGuard - Acceso permitido');
        return true;
      } else {
        // No autenticado, redirigir al login
        // console.log('❌ AuthGuard - Redirigiendo a login');
        router.navigate(['/authentication/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    })
  );
};