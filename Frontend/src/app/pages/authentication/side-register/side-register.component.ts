import { Component } from '@angular/core';
// import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { MaterialModule } from 'src/app/material.module';
import { CoreService } from '../../../services/core.service';
import { MaterialModule } from '../../../material.module';
import { HttpClient } from '@angular/common/http';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-side-register',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  // options = this.settings.getOptions();
  form: FormGroup;
  constructor(private settings: CoreService, private router: Router, private http: HttpClient, private fb: FormBuilder, private sessionService: SessionService) { }

  private crearFormularioAgregar(): FormGroup {
    return this.fb.group({
      uname: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      companyName: ['', [Validators.required, Validators.minLength(4)]],  // nuevo campo

    });
  }
  ngOnInit(): void {
    this.form = this.crearFormularioAgregar();
    // ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const session = this.sessionService.checkSession();
    if (session.loggedIn) {
      this.router.navigate(['/dashboard']);
    }
    else {
      console.log('No hay sesión activa');
    }

  }


  //   form = new FormGroup({
  //   uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
  //   email: new FormControl('', [Validators.required, Validators.email]),
  //   password: new FormControl('', [Validators.required]),
  //   companyName: new FormControl('', [Validators.required, Validators.minLength(4)]),  // nuevo campo
  // });
  generateCompanyCode(companyName: any): string {
    // Convertir a minúsculas y quitar espacios
    let cleanName = companyName.toLowerCase().replace(/\s+/g, '');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    cleanName += randomDigits;
    // Concatenar identificador fijo 'neo' y 'user'
    return 'neo' + cleanName + 'user';
  }


  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const companyName = this.form.value.companyName;
    const companyCode = this.generateCompanyCode(companyName);

    console.log('Código generado:', companyCode);

    // Aquí puedes preparar el objeto para enviarlo al backend
    const dataToSend = {
      uname: this.form.value.uname,
      email: this.form.value.email,
      password: this.form.value.password,
      companyName: companyName,
      companyCode: companyCode,  // este código que generaste
    };
// 
    // URL de tu API PHP para registro
    // const url = 'http://localhost/php/auth/registro.php';
    const url = 'https://neocompanyapp.com/php/auth/registro.php'; // Cambia esto por la URL de tu API

    this.http.post(url, dataToSend).subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log('Registro exitoso', response);
          // Redirigir o mostrar mensaje
          localStorage.setItem('session', JSON.stringify({
            loggedIn: true,
             user: response.user, // Asegúrate de que el backend devuelva el usuario
          }));
          this.router.navigate(['/dashboard']); // o donde desees redirigir
        } else {
          console.error('Error al registrar:', response.message);
          // Aquí podrías mostrar un error en pantalla
        }
      },
      error: (error) => {
        console.error('Error en la conexión al backend', error);
        // Aquí manejar error de conexión, mostrar mensaje, etc.
      },
    });
  }
}

