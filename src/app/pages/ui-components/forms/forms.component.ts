import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SessionService } from '../../../services/session.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { ProductosService } from 'src/app/services/productos.service'; // Servicio para productos

interface Categoria {
  id: number;
  nombre: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-forms-productos',
  imports: [
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  standalone: true,
  templateUrl: './form-add-productos.component.html',
})
export class AppFormsProductoComponent implements OnInit {

  modoFormulario: 'agregar' | 'editar' = 'agregar';
  public formAgregar!: FormGroup;

  categorias: Categoria[] = [
    { id: 1, nombre: 'Camiseta' },
    { id: 2, nombre: 'Pantalón' },
    { id: 3, nombre: 'Chaqueta' },
    { id: 4, nombre: 'Accesorio' },
  ];


  

  tallas: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  proveedores: Proveedor[] = [
    { id: 1, nombre: 'Proveedor 1' },
    { id: 2, nombre: 'Proveedor 2' },
  ];

  sessionObj: any;

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    const session = localStorage.getItem('session');
    if (session) {
      this.sessionObj = JSON.parse(session);
      console.log('Usuario en sesión:', this.sessionObj.user.username);
    }

    this.formAgregar = this.crearFormularioAgregar();
  }

  private crearFormularioAgregar(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      categoria: [null, [Validators.required]],
      talla: [null, [Validators.required]],
      color: ['', [Validators.required]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      precioCompra: [0, [Validators.required, Validators.min(0)]],
      precioVenta: [0, [Validators.required, Validators.min(0)]],
      proveedor: [null, [Validators.required]],
      descripcion: [''],
      imagen: [null],
      company_code: [this.sessionObj?.user?.company_code || '', [Validators.required]],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.formAgregar.patchValue({ imagen: file });
  }

  onSubmit(): void {
    if (this.formAgregar.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, complete todos los campos requeridos.',
      });
      return;
    }

    if (this.modoFormulario === 'editar') {
      // Actualizar producto
      this.productosService.actualizarProducto(this.formAgregar.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'Producto actualizado correctamente.',
          }).then(() => this.router.navigate(['/dashboard/view/tabla-productos']));
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el producto.' });
        }
      });
    } else {
      // Guardar nuevo producto
      this.productosService.obtenerProductoPorCodigo(this.formAgregar.value.codigo).subscribe({
        next: (res) => {
          if (res && res.producto) {
            Swal.fire({
              icon: 'error',
              title: 'Código duplicado',
              text: `Ya existe un producto con este código: ${res.producto.nombre}`,
            });
          } else {
            this.productosService.guardarProducto(this.formAgregar.value).subscribe({
              next: () => {
                Swal.fire({ icon: 'success', title: '¡Guardado!', text: 'Producto registrado correctamente.' });
                this.formAgregar.reset();
                this.router.navigate(['/dashboard/view/tabla-productos']);
              },
              error: (err) => {
                console.error('Error al guardar:', err);
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo registrar el producto.' });
              }
            });
          }
        },
        error: (err) => {
          console.error('Error al verificar código:', err);
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo verificar el código del producto.' });
        }
      });
    }
  }

  onReset(): void {
    this.formAgregar.reset();
  }

}
