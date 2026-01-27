import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

// 
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import Swal from 'sweetalert2';
import { SessionService } from '../../../services/session.service';

/* ===================== INTERFACES ===================== */
interface Categoria {
  id: number;
  nombre: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}

/* ===================== COMPONENT ===================== */
@Component({
  selector: 'app-forms-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './form-add-productos.component.html',
})
export class AppFormsProductoComponent implements OnInit {

  modoFormulario: 'agregar' | 'editar' = 'agregar';
  formAgregar!: FormGroup;
  sessionObj: any;

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionService: SessionService
  ) {}

  /* ===================== INIT ===================== */
  ngOnInit(): void {
    const session = localStorage.getItem('session');
    if (session) {
      this.sessionObj = JSON.parse(session);
    }

    this.formAgregar = this.crearFormulario();
  }

  /* ===================== FORM ===================== */
  private crearFormulario(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      categoria: [null, Validators.required],
      talla: [null, Validators.required],
      color: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      precioCompra: [0, [Validators.required, Validators.min(0)]],
      precioVenta: [0, [Validators.required, Validators.min(0)]],
      proveedor: [null, Validators.required],
      descripcion: [''],
      imagen: [null],
      company_code: [
        this.sessionObj?.user?.company_code || '',
        Validators.required
      ],
    });
  }

  /* ===================== FILE ===================== */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.formAgregar.patchValue({ imagen: file.name });
    }
  }

  /* ===================== SUBMIT ===================== */
  onSubmit(): void {
    if (this.formAgregar.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor complete todos los campos obligatorios.',
      });
      return;
    }

    const producto = {
      ...this.formAgregar.value,
      id: Date.now(), // ID temporal
    };

    // 🔹 Obtener productos actuales
    const productos = JSON.parse(
      localStorage.getItem('productos') || '[]'
    );

    // 🔹 Guardar producto
    productos.push(producto);
    localStorage.setItem('productos', JSON.stringify(productos));

    Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'Producto registrado correctamente.',
    }).then(() => {
      this.formAgregar.reset();
      this.router.navigate(['/dashboard/view/tabla-productos']);
    });
  }

  /* ===================== RESET ===================== */
  onReset(): void {
    this.formAgregar.reset();
  }
}
