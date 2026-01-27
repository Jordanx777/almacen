import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppFormsProductoComponent } from './forms/forms.component';
import { AppTablesComponent } from './tables/tables.component';
import { FormPedidosComponent } from './forms/form-pedidos.component';
import { AppFormVentasComponent } from './forms/form-ventas.component';
import { AppBlogCardsComponent } from 'src/app/components/blog-card/blog-card.component';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { AppTotalIncomeComponent } from 'src/app/components/total-income/total-income.component';
import { AppEarningReportsComponent } from 'src/app/components/earning-reports/earning-reports.component';
import { TablaProductosComponent } from './tables/tabla-productos.component';
import { TablaPedidosComponent } from './tables/tabla-pedidos.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { TablaAdministracionComponent } from './tables/tabla-administracion.component';
import { MyProfileComponent } from './profile/my-profile.component';
import { AuthGuard } from '../authentication/auth.guard';
import { H } from '@angular/cdk/keycodes';
import { HistorialComisionesComponent } from './tables/historial-comisiones/historial-comisiones.component';
import { ReporteVentasComponent } from './tables/historial-comisiones/reporte-ventas/reporte-ventas.component';

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
        canActivate: [AuthGuard]
      },
      {
        path: 'estadisticas',
        component: EstadisticasComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-profile',
        component: MyProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'administracion',
        component: TablaAdministracionComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'chips',
        component: AppChipsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tabla-productos',
        component: TablaProductosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tabla-pedidos',
        component: TablaPedidosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'lists',
        component: AppListsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'menu',
        component: AppMenuComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'form-producto',
        component: AppFormsProductoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'editar-taxista/:cedula',
        component: AppFormsProductoComponent,
        canActivate: [AuthGuard]
      },

      {
        path: 'form-pedidos',
        component: FormPedidosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'editar-pedidos/:cedula',
        component: FormPedidosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'add-comisiones/:cedula',
        component: AppFormVentasComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'form-ventas',
        component: AppFormVentasComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'historial-comisiones/:cedula',
        component: HistorialComisionesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'editar-comisiones/:cedula',
        component: AppFormVentasComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tables',
        component: AppTablesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'listado-taxistas',
        component: AppBlogCardsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'registro-salidas',
        component: AppTotalIncomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'reporte-ventas',
        component: ReporteVentasComponent,
        canActivate: [AuthGuard]
      },
    ],
  },
];
// export const landingRoutes: Routes = [
//   {
//     path: '',
//     children: [
//       {
//         path: 'landing-page',
//         component: AppBadgeComponent,
//       },
//     ],
//   },
// ];