import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/Api.service';
import { CommonModule } from '@angular/common';

interface Rol {
  id_rol: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent implements OnInit {
  
  form: FormGroup;
  roles: Rol[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    // Verificar si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Cargar roles desde la BD
    this.loadRoles();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      id_rol: ['', [Validators.required]]
    });
  }

  loadRoles(): void {
    this.apiService.get<any>('/api/roles').subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.roles = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.errorMessage = 'No se pudieron cargar los roles disponibles';
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const registerData = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      email: this.form.value.email,
      password: this.form.value.password,
      confirmPassword: this.form.value.confirmPassword,
      telefono: this.form.value.telefono,
      id_rol: parseInt(this.form.value.id_rol)
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          console.log('Registro exitoso', response);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'Error al registrar usuario';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.errorMessage = error.modal?.message || 'Error al conectar con el servidor';
        this.loading = false;
      }
    });
  }
}