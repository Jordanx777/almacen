// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
// import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate(): boolean {
    const session = this.sessionService.checkSession();
    if (!session.loggedIn) {
      this.router.navigate(['/authentication/side-login']);
      return false;
    }
    return true;
  }
}
