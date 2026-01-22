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
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TaxistaService } from 'src/app/services/taxista.service';
import { ActivatedRoute } from '@angular/router';
// import Swal from 'sweetalert2/dist/sweetalert2.esm.js';
import Swal from 'sweetalert2';
// import { S } from '@angular/cdk/scrolling-module.d-ud2XrbF8';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SessionService } from '../../../services/session.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
// import { MAC_ENTER } from '@angular/cdk/keycodes';


interface sexo {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-forms',
  // providers: [provideNativeDateAdapter()],
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
    MatTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  standalone: true,
  templateUrl: './form-add-taxista.component.html',
})
export class AppFormsComponent implements OnInit {

  valueData: Date;
  selectedValue: string;
  modoFormulario: 'agregar' | 'editar' = 'agregar';
  public formAgregar!: FormGroup;

  sexo_s: sexo[] = [
    { value: 'Masculino', viewValue: 'Masculino' },
    { value: 'Femenino', viewValue: 'Femenino' },
  ];

  constructor(
    private fb: FormBuilder,
    private taxistaService: TaxistaService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService
  ) { }
  sessionObj: any;

  ngOnInit(): void {
    const session = localStorage.getItem('session');
    if (session) {
      this.sessionObj = JSON.parse(session);
      console.log('Usuario en sesión desde taxista:', this.sessionObj.user.username);
      console.log('ID de usuario:', this.sessionObj.user.company_name);
      console.log('Company code:', this.sessionObj.user.company_code);
    } else {
      console.log('No hay usuario en sesión');
    }
    // Verifica si hay una sesión activa

    this.formAgregar = this.crearFormularioAgregar();
    this.route.paramMap.subscribe(params => {
      const cedula = params.get('cedula');
      if (cedula) {
        this.modoFormulario = 'editar';
        this.cargarDatosTaxista(cedula);
      }
    });

    if (this.modoFormulario === 'agregar') {
      this.formAgregar.get('cedula')?.valueChanges
        .pipe(
          debounceTime(1500), // espera 500ms sin escribir
          distinctUntilChanged()
        )
        .subscribe(value => {
          this.verificarCedula();
        });
    }
  }

  private crearFormularioAgregar(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      numero_placa: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z]{3}[0-9]{3}$/i), // 3 letras seguidas de 3 números
        ],
      ],
      cedula: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      company_code: [this.sessionObj?.user?.company_code || '', [Validators.required]],
    });
  }

  verificarCedula() {
    const control = this.formAgregar.get('cedula');
    const cedula = control?.value;

    this.taxistaService.obtenerTaxistaPorCedula(cedula).subscribe((data) => {
      if (data && data.taxista) {
        control?.setErrors({ cedulaDuplicada: true }); // Marca error
        Swal.fire({
          icon: 'error',
          title: 'Cédula duplicada',
          text: 'Ya existe un taxista registrado con esa cédula.',
        });
      } else {
        // Borra errores si está bien
        if (control?.hasError('cedulaDuplicada')) {
          control.setErrors(null);
        }
      }
    });
  }


  cargarDatosTaxista(cedula: string) {
    this.taxistaService.obtenerTaxistaPorCedula(cedula).subscribe((data) => {
      if (data && data.taxista) {
        this.formAgregar.patchValue(data.taxista);
        this.formAgregar.get('cedula')?.disable();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No encontrado',
          text: 'No se encontraron datos del taxista.',
        });
      }
    });
  }

  volverAtras() {
    window.history.back();
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
      // Si estamos en modo edición, solo actualizamos el taxista
      this.formAgregar.get('cedula')?.enable();
      // this.formAgregar.get('cedula')?.setValue(this.route.snapshot.paramMap.get('cedula'));
      this.taxistaService.actualizarTaxista(this.formAgregar.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'Taxista actualizado correctamente.',
          }).then(() => {
            this.router.navigate(['/dashboard/view/tabla-taxistas']);
          });
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al actualizar el taxista.',
          });
        }
      });
    } else {
      const cedula = this.formAgregar.value.cedula;

      this.taxistaService.obtenerTaxistaPorCedula(cedula).subscribe({
        next: (res) => {
          if (res && res.taxista) {
            Swal.fire({
              icon: 'error',
              title: 'Cédula duplicada',
              text: 'Ya existe un taxista registrado con esa cédula.',
              html: `
  Ya existe un taxista registrado con esa cédula. <br>
  aquí están los datos:<br>
  <strong>Nombre:</strong> ${res.taxista.nombre}<br>
  <strong>Cédula:</strong> ${res.taxista.cedula}<br>
  <strong>Teléfono:</strong> ${res.taxista.telefono}<br>
  <strong>Placa:</strong> ${res.taxista.numero_placa}<br>
  <strong>Sexo:</strong> ${res.taxista.sexo}<br>
  <strong>Fecha de Nacimiento:</strong> ${res.taxista.fecha_nacimiento}<br>
  `,

            });
          } else {
            // Si no existe, procede a guardar
            console.log(this.formAgregar.value);
            this.formAgregar.get('cedula')?.enable(); // Asegúrate de que la cédula esté habilitada
            this.formAgregar.get('company_code')?.setValue(this.sessionObj.user.company_code); // Asegúrate de que el company_code esté configurado
            this.taxistaService.guardarTaxista(this.formAgregar.value).subscribe({
              next: () => {
                Swal.fire({
                  icon: 'success',
                  title: '¡Guardado!',
                  text: 'El taxista fue registrado correctamente.',
                });
                this.formAgregar.reset();
                this.router.navigate(['/dashboard/view/tabla-taxistas']);
              },
              error: (err) => {
                console.error('Error al guardar:', err);
                Swal.fire({
                  icon: 'error',
                  title: 'Error al guardar',
                  text: 'Hubo un problema al intentar registrar el taxista.',
                });
              }
            });
          }
        },
        error: (err) => {
          console.error('Error al verificar cédula:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo verificar la cédula. Intenta nuevamente.',
          });
        }
      });
    }
  }

  onReset(): void {
    this.formAgregar.reset();
  }

}
