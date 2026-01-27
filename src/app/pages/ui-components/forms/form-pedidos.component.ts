import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-pedidos',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-pedidos.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class FormPedidosComponent {

  formAgregar!: FormGroup;
  modoFormulario: 'agregar' | 'editar' = 'agregar';
  sessionObj: any;

  private apiGuardar = 'https://neocompanyapp.com/php/pedidos/guardar_pedido.php';
  private apiActualizar = 'https://neocompanyapp.com/php/pedidos/actualizar_pedido.php';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const session = localStorage.getItem('session');
    if (session) {
      this.sessionObj = JSON.parse(session);
    }

    this.formAgregar = this.fb.group({
      proveedor: ['', Validators.required],
      numero_pedido: ['', Validators.required],
      fecha_pedido: ['', Validators.required],
      cantidad_prendas: ['', Validators.required],
      valor_total: ['', Validators.required],
      estado_pedido: ['pendiente', Validators.required],
      observaciones: [''],
      company_code: [this.sessionObj?.user?.company_code, Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modoFormulario = 'editar';
        // aquí luego cargas el pedido por ID
      }
    });
  }

  onSubmit() {
    if (this.formAgregar.invalid) {
      Swal.fire('Error', 'Completa los campos obligatorios', 'error');
      return;
    }

    const url = this.modoFormulario === 'editar'
      ? this.apiActualizar
      : this.apiGuardar;

    this.http.post(url, this.formAgregar.value).subscribe({
      next: (resp: any) => {
        Swal.fire('Éxito', resp.mensaje || 'Pedido guardado', 'success');
        this.router.navigate(['/dashboard/view/tabla-pedidos']);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar el pedido', 'error');
      }
    });
  }

  volver() {
    this.router.navigate(['/dashboard/view/tabla-pedidos']);
  }
}
