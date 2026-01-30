import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppFormsProductoComponent } from './forms/forms.component';
import { AppTablesComponent } from './tables/tables.component';
import { FormAddReservaComponent } from './forms/form-add-reserva.component';
import { AppFormComisionesComponent } from './forms/form-comisiones.component';
import { AppBlogCardsComponent } from 'src/app/components/blog-card/blog-card.component';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { AppTotalIncomeComponent } from 'src/app/components/total-income/total-income.component';
import { AppEarningReportsComponent } from 'src/app/components/earning-reports/earning-reports.component';
import { TablaProductosComponent } from './tables/tabla-productos.component';
import { TablaReservasComponent } from './tables/tabla-reservas.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { TablaAdministracionComponent } from './tables/tabla-administracion.component';
import { MyProfileComponent } from './profile/my-profile.component';
import { authGuard } from '../../guards/auth.guard';
import { H } from '@angular/cdk/keycodes';
import { HistorialComisionesComponent } from './tables/historial-comisiones/historial-comisiones.component';
import { ReportePagosComponent } from './tables/historial-comisiones/reporte-pago/reporte-pago.component';

// landing
export const landingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'landing-page',
        component: LandingPageComponent,
      },
    ],
  },
];


export const UiComponentsRoutes: Routes = [
  {
    path: 'view',
    children: [
      {
        path: 'badge',
        component: AppBadgeComponent,
        canActivate: [authGuard]
      },
      {
        path: 'estadisticas',
        component: EstadisticasComponent,
        canActivate: [authGuard]
      },
      {
        path: 'my-profile',
        component: MyProfileComponent,
        canActivate: [authGuard]
      },
      {
        path: 'administracion',
        component: TablaAdministracionComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'chips',
        component: AppChipsComponent,
        canActivate: [authGuard]
      },
      {
        path: 'tabla-productos',
        component: TablaProductosComponent,
        canActivate: [authGuard]
      },
      {
        path: 'tabla-reservas',
        component: TablaReservasComponent,
        canActivate: [authGuard]
      },
      {
        path: 'lists',
        component: AppListsComponent,
        canActivate: [authGuard]
      },
      {
        path: 'menu',
        component: AppMenuComponent,
        canActivate: [authGuard]
      },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
        canActivate: [authGuard]
      },
      {
        path: 'form-producto',
        component: AppFormsProductoComponent,
        canActivate: [authGuard]
      },
      {
        path: 'editar-taxista/:cedula',
        component: AppFormsProductoComponent,
        canActivate: [authGuard]
      },

      {
        path: 'form-reserva',
        component: FormAddReservaComponent,
        canActivate: [authGuard]
      },
      {
        path: 'editar-reserva/:cedula',
        component: FormAddReservaComponent,
        canActivate: [authGuard]
      },
      {
        path: 'add-comisiones/:cedula',
        component: AppFormComisionesComponent,
        canActivate: [authGuard]
      },
      {
        path: 'form-comisiones',
        component: AppFormComisionesComponent,
        canActivate: [authGuard]
      },
      {
        path: 'historial-comisiones/:cedula',
        component: HistorialComisionesComponent,
        canActivate: [authGuard]
      },
      {
        path: 'editar-comisiones/:cedula',
        component: AppFormComisionesComponent,
        canActivate: [authGuard]
      },
      {
        path: 'tables',
        component: AppTablesComponent,
        canActivate: [authGuard]
      },
      {
        path: 'listado-taxistas',
        component: AppBlogCardsComponent,
        canActivate: [authGuard]
      },
      {
        path: 'registro-salidas',
        component: AppTotalIncomeComponent,
        canActivate: [authGuard]
      },
      {
        path: 'reporte-comisiones',
        component: ReportePagosComponent,
        canActivate: [authGuard]
      },
    ],
  },
];