import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';


interface lugares {
  value: string;
  viewValue: string;
}




@Component({
  selector: 'app-form-add-reserva',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    RouterModule

  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-add-reserva.component.html',
  styles: ``
})
export class FormAddReservaComponent {

  value: Date;

  selectedValue: string;


  lugares: lugares[] = [
    { value: 'Dentro', viewValue: 'Dentro' },
    { value: 'Fuera', viewValue: 'Fuera' },
  ];
  public formAgregar!: FormGroup;
  modoFormulario: 'agregar' | 'editar' = 'agregar';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute) { }
  sessionObj: any;
  ngOnInit(): void {
    const session = localStorage.getItem('session');
    if (session) {
      this.sessionObj = JSON.parse(session);
      console.log('Usuario en sesión desde reservas:', this.sessionObj.user.username);
      console.log('ID de usuario desde comisiones:', this.sessionObj.user.company_code);
    } else {
      console.log('No hay usuario en sesión');
    }

    this.formAgregar = this.fb.group({
      nombre: ['', Validators.required],
      // company_code: [this.sessionObj.user.company_code],
      company_code: [this.sessionObj.user.company_code, [Validators.required]],

      lugar_reserva: ['', Validators.required],
      cedula: ['', Validators.required],
      telefono: ['', Validators.required],
      fecha_reserva: ['', Validators.required],
      hora_reserva: ['', Validators.required],
      cantidad: ['', Validators.required],
      observaciones: ['']
    });
    this.route.paramMap.subscribe(params => {
      const cedula = params.get('cedula');
      if (cedula) {
        this.modoFormulario = 'editar';
        this.cargarDatosReserva(cedula);
      }
    });

  }

  obtenerReservaPorCedula(cedula: string): Observable<any> {
    return this.http.post<any>('https://neocompanyapp.com/php/reservas/buscar_reservas.php', {
      cedula: cedula
    });
  }

  cargarDatosReserva(cedula: string) {
    this.obtenerReservaPorCedula(cedula).subscribe((data) => {
      if (data && data.reserva) {
        this.formAgregar.patchValue(data.reserva);
        this.formAgregar.get('cedula')?.disable();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No encontrado',
          text: 'No se encontraron datos de la reserva.',
        });
        this.router.navigate(['/dashboard/view/tabla-reservas']);
      }
    });
  }

  private apiUrlAgregar = 'https://neocompanyapp.com/php/reservas/guardar_reservas.php';
  private apiUrlActualizar = 'https://neocompanyapp.com/php/reservas/actualizar_reservas.php';
  // private apiUrlAgregar = 'http://localhost/php/reservas/guardar_reservas.php';
  onSubmit() {
    if (this.modoFormulario === 'editar') {
      this.actualizarReserva();
    } else {
      this.guardarReserva();
    }
  }
actualizarReserva() {
  this.formAgregar.get('cedula')?.enable(); // 👈 Importante
  const formData = this.formAgregar.value;

  this.http.post(this.apiUrlActualizar, formData)
    .subscribe({
      next: (respuesta: any) => {
        Swal.fire('Reserva actualizada', respuesta.mensaje, 'success');
        this.formAgregar.get('cedula')?.disable(); // 👈 Si quieres volverlo a desactivar
        this.router.navigate(['/dashboard/view/tabla-reservas']);
      },
      error: (error) => {
        console.error(error);
        Swal.fire('Error', 'Hubo un problema al actualizar la reserva.', 'error');
      }
    });
}


  guardarReserva() {
    if (this.formAgregar.valid) {
      const formData = this.formAgregar.value;

      this.http.post(this.apiUrlAgregar, formData).subscribe({
        next: (response) => {
          console.log('Reserva guardada:', response);
          // alert('Reserva registrada correctamente');
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
            title: "Reserva registrada.",
            // text: "Los datos del taxista han sido cargados correctamente.",
          });
          this.formAgregar.reset({
            nombre: '',
            company_code: this.sessionObj.user.company_code,
            lugar_reserva: '',
            cedula: '',
            telefono: '',
            fecha_reserva: '',
            hora_reserva: '',
            cantidad: '',
            observaciones: ''
          });
          Object.keys(this.formAgregar.controls).forEach(key => {
            const control = this.formAgregar.get(key);
            control?.markAsPristine();
            control?.markAsUntouched();
          });
          this.router.navigate(['/dashboard/view/tabla-reservas']);


        },
        error: (error) => {
          console.error('Error al guardar:', error);
          // alert('Error al registrar la reserva');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al registrar la reserva.',
          });
        }
      });
    } else {
      // alert('Por favor completa todos los campos requeridos');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor completa todos los campos requeridos.',
      });
    }
  }
  volver() {
    this.router.navigate(['/dashboard/view/tabla-reservas']);
  }
}