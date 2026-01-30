// starter.component.ts
import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppTotalFollowersComponent } from '../../components/total-followers/total-followers.component';
import { AppTotalIncomeComponent } from '../../components/total-income/total-income.component';
import { AppEarningReportsComponent } from '../../components/earning-reports/earning-reports.component';
// import { AppTablesComponent } from '../ui-components/tables/tables.component';

@Component({
  selector: 'app-starter',
  standalone: true,  // ← Asegúrate que esté en true si usas Angular 19
  imports: [
    MaterialModule,
    AppTotalFollowersComponent,
    AppTotalIncomeComponent,
    AppEarningReportsComponent
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent { }

// ### **4. Verificar el componente AppTotalIncomeComponent**