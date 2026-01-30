import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit, OnDestroy {
  
  form: FormGroup;
  hidePassword = true;
  loading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    // console.log('🔍 Login - Verificando sesión...');
    
    // Verificar si ya hay sesión activa
    if (this.authService.isAuthenticated()) {
      // console.log('✅ Login - Ya hay sesión, redirigiendo a dashboard');
      this.router.navigate(['/dashboard']);
    } else {
      // console.log('❌ Login - No hay sesión activa');
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
    this.form.disable();

    const loginData = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    // console.log('📤 Login - Enviando credenciales...', { email: loginData.email });

    this.authService.login(loginData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // console.log('📥 Login - Respuesta recibida:', response);
          
          if (response.status === 'success') {
            // console.log('✅ Login - Exitoso, usuario:', response.data.user);
            
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast: any) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });

            Toast.fire({
              icon: 'success',
              title: `¡Bienvenido ${response.data.user.nombre}!`
            });

            // Esperar un momento para que el toast se muestre
            setTimeout(() => {
              // console.log('🚀 Login - Navegando a dashboard...');
              this.router.navigate(['/dashboard']).then(success => {
                // console.log('🚀 Login - Navegación completada:', success);
              });
            }, 500);

          } else {
            // console.error('❌ Login - Error en respuesta:', response.message);
            this.errorMessage = response.message || 'Error al iniciar sesión';
            this.loading = false;
            this.form.enable();
            
            Swal.fire({
              icon: 'error',
              title: 'Error de autenticación',
              text: this.errorMessage,
            });
          }
        },
        error: (error) => {
          console.error('❌ Login - Error de conexión:', error);
          this.loading = false;
          this.form.enable();
          
          this.errorMessage = 'Error al conectar con el servidor';
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.errorMessage,
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}