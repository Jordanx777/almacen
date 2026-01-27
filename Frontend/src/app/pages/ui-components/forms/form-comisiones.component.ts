import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import Swal from 'sweetalert2/dist/sweetalert2.esm.js';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';

// 

interface pago {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-form-comisiones',
  imports: [
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    RouterModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],

  templateUrl: './form-add-comisiones.component.html',
})
export class AppFormComisionesComponent implements OnInit {
  public formBuscar!: FormGroup;
  public formAgregar!: FormGroup;
  public cedula: any;
  public nombre!: any;
  public numero_placa!: any;
  public personas_referidas!: any;
  public estado!: any;
  public observaciones!: any;
  // public data: any
  // public sessionObj: any;

  value: Date;
  selectedValue: string;
  pagos: pago[] = [
    { value: 'pagado', viewValue: 'Pagado' },
    { value: 'no-pagado', viewValue: 'No pagado' },
  ];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AppFormComisionesComponent> // <-- aquí
  ) { }

  private apiUrlBuscar = 'https://neocompanyapp.com/php/comisiones/buscar_taxistas.php';
  // private apiUrlBuscar = 'http://localhost/php/comisiones/buscar_taxistas.php';
  // private apiUrlAgregar = 'http://localhost/php/comisiones/guardar_comisiones.php';
  private apiUrlAgregar = 'https://neocompanyapp.com/php/comisiones/guardar_comisiones.php';
  // private apiUrlBuscar = 'http://localhost/php/comisiones/buscar_taxistas.php';

  consultarPorCedula(cedula: string) {
    if (!cedula) return;

    this.http.post<any>(this.apiUrlBuscar, { cedula })
      .subscribe({
        next: (data) => {
          if (data && data.success) {
            this.formAgregar.patchValue({
              nombre: data.taxista.nombre,
              numero_placa: data.taxista.numero_placa,
              personas_referidas: data.taxista.personas_referidas,
              estado: data.taxista.estado,
              observaciones: data.taxista.observaciones
            });
            this.formActivo = true;
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast: any) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Taxista encontrado",
              // text: "Los datos del taxista han sido cargados correctamente.",
            });

          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Taxista no encontrado',
              text: 'No se encontró un taxista con esa cédula.',
            });
            this.formActivo = false;
          }
        },
        error: (err) => {
          console.error('Error en la búsqueda:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al consultar. Intenta de nuevo más tarde.',
          });
        }
      });
  }
  sessionObj: any;

  ngOnInit(): void {
    const session = localStorage.getItem('session');
    if (session) {
      this.sessionObj = JSON.parse(session);
    this.formAgregar = this.crearFormularioAgregar();

      console.log('Usuario en sesión desde comisiones:', this.sessionObj.user.username);
      console.log('ID de usuario desde comisiones:', this.sessionObj.user.company_code);
    } else {
      console.log('No hay usuario en sesión');
    }
    this.formBuscar = this.crearFormularioConsultar();
    this.route.paramMap.subscribe(params => {
      const cedula = params.get('cedula');
      if (cedula) {
        // this.modoFormulario = 'editar';
        this.consultarPorCedula(cedula);
        this.cedula = cedula;
      }
    });
    this.formBuscar.get('cedula')?.valueChanges
      .pipe(debounceTime(3000), distinctUntilChanged())
      .subscribe(value => this.consultarPorCedula(value));



  }

  cerrarFormulario(): void {
    this.dialogRef.close();  // Cierra el diálogo
  }
  private crearFormularioConsultar(): FormGroup {
    return this.fb.group({
      cedula: ['', [Validators.required]],
    });
  }

  private crearFormularioAgregar(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      numero_placa: ['', [Validators.required]],
      personas_referidas: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      observaciones: [''],
      company_code: [this.sessionObj.user.company_code],

    });
  }

  formActivo: boolean = false;

  guardarComision() {
    if (this.formAgregar.valid) {
      const data = {
        
        cedula: this.formBuscar.get('cedula')?.value || this.cedula,
        // cedula: this.?cedula
        ...this.formAgregar.value,
        total: this.calcularComision(this.formAgregar.get('personas_referidas')?.value)
      };

      fetch(this.apiUrlAgregar, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            Swal.fire({
              icon: 'success',
              title: '¡Comisión guardada!',
              text: 'La comisión se guardó correctamente.',
            });
            this.formAgregar.reset();
            this.formBuscar.reset();
            this.router.navigate(['/dashboard/view/tables']);

            this.formActivo = false;
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.message || 'Ocurrió un error al guardar.',
            });
          }
        })
        .catch(error => {
          console.error('Error al guardar:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo guardar la comisión. Intenta más tarde.',
          });
        });
    }
  }

  comision_por_cliente = 5;

  calcularComision(clientes: any): number {
    const num = Number(clientes);
    return isNaN(num) ? 0 : num * this.comision_por_cliente;
  }
}
