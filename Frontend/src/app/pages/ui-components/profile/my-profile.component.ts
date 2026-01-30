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
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-my-profile',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent {

  user: any;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private sessionService: SessionService) { }
  editarPerfil() {
    console.log('Editar perfil');
    // Aquí pones lógica para editar perfil (modal, ruta, etc)
  }

  abrirConfiguracion() {
    console.log('Abrir configuración');
    // Aquí pones lógica para abrir la configuración general
  }
  abrirNotificaciones() {
    console.log('Abrir notificaciones');
    // Aquí pones lógica para abrir las notificaciones
  }
  abrirSeguridad() {
    console.log('Abrir seguridad');
    // Aquí pones lógica para abrir la configuración de seguridad
  }
  abrirAyuda() {
    console.log('Abrir ayuda');
    // Aquí pones lógica para abrir la sección de ayuda
  }
  abrirCerrarSesion() {
    console.log('Cerrar sesión');
    // Aquí pones lógica para cerrar sesión
  }
  sessionObj: any;
  usuario: any;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const session = localStorage.getItem('session');
    if (session) {
      this.sessionObj = JSON.parse(session);
      this.usuario = this.sessionObj.user.company_code;

    } else {
      console.log('No hay usuario en sesión');
    }

    this.obtenerDatosUsuario();

  }
  url = 'https://neocompanyapp.com/php/taxistas/obtener_datos_u.php';
  datos: any;
  taxistas: any;
  comisiones: any;
  obtenerDatosUsuario() {
    const companyCode = this.usuario;

    this.http.get<any>(`${this.url}?company_code=${companyCode}`).subscribe({
      next: (data) => {
        console.log('Conteo de taxistas:', data.total);
        this.taxistas = data.total;
        this.comisiones = data.comisiones;
        this.datos = data.datos2;
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      }
    });
  }



}
