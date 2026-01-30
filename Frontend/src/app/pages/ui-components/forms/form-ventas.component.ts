import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

interface Articulo {
  nombre: string;
  talla: string;
  color: string;
  cantidad: number;
  precio: number;
}

@Component({
  selector: 'app-form-ventas',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    CurrencyPipe
  ],
  templateUrl: './form-add-ventas.component.html'
})
export class AppFormVentasComponent implements OnInit {

  formBuscar!: FormGroup;
  formAgregar!: FormGroup;
  articulosVenta: Articulo[] = [];
  formActivo: boolean = false;
  sessionObj: any;

  displayedColumns: string[] = ['nombre', 'talla', 'color', 'cantidad', 'precio', 'acciones'];
  dataSource!: MatTableDataSource<Articulo>;

  private apiUrlBuscar = 'https://neocompanyapp.com/php/clientes/buscar_cliente.php';
  private apiUrlAgregar = 'https://neocompanyapp.com/php/ventas/guardar_ventas.php';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private currencyPipe: CurrencyPipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AppFormVentasComponent>
  ) { }

  ngOnInit(): void {
    const session = localStorage.getItem('session');
    if (session) this.sessionObj = JSON.parse(session);

    this.formAgregar = this.crearFormularioAgregar();
    this.formBuscar = this.crearFormularioBuscar();

    this.dataSource = new MatTableDataSource(this.articulosVenta);

    // Detectar cambios en cédula con debounce
    this.formBuscar.get('cedula')?.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe(value => this.consultarPorCedula(value));
  }

  crearFormularioBuscar(): FormGroup {
    return this.fb.group({
      cedula: ['', Validators.required]
    });
  }

  crearFormularioAgregar(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      cedula: ['', Validators.required],
      telefono: ['', Validators.required],
      observaciones: ['']
    });
  }

  consultarPorCedula(cedula: string) {
    if (!cedula) return;
    this.http.post<any>(this.apiUrlBuscar, { cedula }).subscribe({
      next: (data) => {
        if (data && data.success) {
          this.formAgregar.patchValue({
            nombre: data.cliente.nombre,
            cedula: data.cliente.cedula,
            telefono: data.cliente.telefono
          });
          this.formActivo = true;
          Swal.fire({ icon: 'success', title: 'Cliente encontrado', toast: true, position: 'top-end', timer: 2500, showConfirmButton: false });
        } else {
          Swal.fire({ icon: 'warning', title: 'Cliente no encontrado', text: 'No se encontró un cliente con esa cédula.' });
          this.formActivo = false;
        }
      },
      error: (err) => {
        console.error('Error en la búsqueda:', err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo buscar el cliente.' });
      }
    });
  }

  agregarArticulo(nombre: string, talla: string, color: string, cantidad: number, precio: number) {
    if (!nombre || !cantidad || !precio) return;
    this.articulosVenta.push({ nombre, talla, color, cantidad, precio });
    this.dataSource.data = this.articulosVenta;
  }

  eliminarArticulo(index: number) {
    this.articulosVenta.splice(index, 1);
    this.dataSource.data = this.articulosVenta;
  }

  calcularTotal(): number {
    return this.articulosVenta.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
  }

  getTotalFormateado(): string {
    return this.currencyPipe.transform(this.calcularTotal(), 'COP', 'symbol', '1.0-0') || '$0';
  }

  guardarVenta() {
    if (this.formAgregar.valid && this.articulosVenta.length > 0) {
      const data = {
        ...this.formAgregar.value,
        articulos: this.articulosVenta,
        total: this.calcularTotal()
      };

      this.http.post<any>(this.apiUrlAgregar, data).subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire({ icon: 'success', title: 'Venta registrada', text: 'La venta se guardó correctamente.' });
            this.formAgregar.reset();
            this.articulosVenta = [];
            this.dataSource.data = [];
            this.formActivo = false;
            this.router.navigate(['/dashboard/view/ventas']);
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: response.message || 'Ocurrió un error al guardar la venta.' });
          }
        },
        error: (error) => {
          console.error('Error al guardar:', error);
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar la venta.' });
        }
      });
    } else {
      Swal.fire({ icon: 'warning', title: 'Formulario incompleto', text: 'Completa todos los campos y agrega al menos un artículo.' });
    }
  }

  cerrarFormulario(): void {
    this.dialogRef.close();
  }

}
