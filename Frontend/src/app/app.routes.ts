import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { PreciosComponent } from './pages/ui-components/servicios/precios/precios.component';
import { authGuard } from './guards/auth.guard'; // ← Importar desde guards/

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'planes',
    component: PreciosComponent,
  },
  {
    path: 'dashboard',
    component: FullComponent,
    canActivate: [authGuard], // ← Usar el guard correcto
    children: [
      {
        path: '',
        redirectTo: 'starter',
        pathMatch: 'full',
      },
      {
        path: 'starter',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/login',
  },
];