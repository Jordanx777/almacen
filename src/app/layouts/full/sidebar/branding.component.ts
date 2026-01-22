import { Component } from '@angular/core';
// import { CoreService } from 'src/app/services/core.service';
import { RouterModule } from '@angular/router';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-branding',
  imports: [RouterModule],
  template: `
    <a [routerLink]="['/']" class="navbar-brand d-flex align-items-center" style="text-decoration: none;">
      <span class="text-primary">N</span>
      <span class="text-danger">E</span>
      <span class="text-warning">O</span>
      <span class="text-light">...</span>
      <span class="text-success">C</span>
      <span class="text-info">O</span>
      <span class="text-secondary">M</span>
      <span class="text-dark">P</span>
      <span class="text-success">A</span>
      <span class="text-primary">N</span>
      <span class="text-secondary">Y</span>
      <span class="text-warning">.</span>
    </a>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();
  constructor(private settings: CoreService){} 
}
