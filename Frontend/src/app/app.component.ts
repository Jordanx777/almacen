// app.component.ts
import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event, RouterOutlet } from '@angular/router';
import { LoaderService } from './services/loader-service.service';
import { LoaderComponent } from './pages/ui-components/cargando/loader.componet';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    LoaderComponent,
    RouterOutlet
  ],
})
export class AppComponent {
  title = 'Neo Company';
  constructor(private router: Router, private loaderService: LoaderService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loaderService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loaderService.hide();
      }
    });
  }
  isLoading = this.loaderService.isLoading;

}
