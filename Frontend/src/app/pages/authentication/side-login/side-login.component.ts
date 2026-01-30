import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { HttpClient } from '@angular/common/http';
import { SessionService } from 'src/app/services/session.service';
import Swal from 'sweetalert2';

interface ApiResponse {
  success: boolean;
  user?: any;
  message?: string;
  // puedes agregar más campos según lo que el backend devuelva
}

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnDestroy {
  form: FormGroup;
  hidePassword = true;  // <-- Aquí declaras la variable para mostrar/ocultar contraseña
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder, private sessionService: SessionService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const session = this.sessionService.checkSession();
    if (session.loggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
    }
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const data = this.form.value;
    const url = 'https://neocompanyapp.com/php/auth/login.php';
    this.http.post<ApiResponse>(url, data, { withCredentials: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if (response.success) {
            localStorage.setItem('session', JSON.stringify({
              loggedIn: true,
              user: response.user
            }));
            localStorage.setItem('acceso_id', response.user.acceso_id);

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
            // 
            Toast.fire({
              icon: "success",
              title: "Login exitoso",
            });
            this.router.navigateByUrl('/dashboard', { replaceUrl: true });
          } else {
            Swal.fire({
              icon: 'error',
              title: response.message ? 'Error' : 'Error de autenticación',
              text: response.message,
            });
          }
        },
        error: (error) => {
          alert('Error al conectar con el servidor');
          console.error(error);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
