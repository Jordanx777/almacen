import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { U } from '@angular/cdk/unique-selection-dispatcher.d-DSFqf1MM';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


export interface UserData {
  id?: number; // Agregado para manejar la eliminación
  nombre: string;
  cedula: number;
  telefono: number;
  company_code: string;
  cantidadpersonas: number;
  lugar: string;
  fecha: string;
  hora: string;
  reservas: any[]; // Agregado para manejar las reservas
}

const NOMBRES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver'
];
const LUGARES: string[] = ['Sala', 'Terraza'];

@Component({
  selector: 'app-tabla-reservas',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './tabla-reservas.component.html',
  styleUrls: ['./tabla-reservas.component.scss']
})
export class TablaReservasComponent implements AfterViewInit {

  constructor(private http: HttpClient , private router: Router) {
    this.dataSource = new MatTableDataSource<UserData>([]);
    // this.cargarReservas();
  }
  companyNameDeseado: any; // Cambia esto al nombre de la empresa que deseas filtrar
  sessionObj: any; // Para almacenar el objeto de sesión del usuario
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const session = localStorage.getItem('session');
    if (session) {
      this.sessionObj = JSON.parse(session);
      console.log('Usuario en sesión desde comisiones:', this.sessionObj.user.username);
      console.log('ID de usuario desde comisiones:', this.sessionObj.user.company_code);
    } else {
      console.log('No hay usuario en sesión');
    }
    this.companyNameDeseado = this.sessionObj.user.company_code;
    this.cargarReservas();
  }

  irAgregarReserva() {
    this.router.navigate(['/dashboard/view/form-reserva']);
  }

  displayedColumns: string[] = [
    'nombre',
    'cedula',
    'telefono',
    'cantidadpersonas',
    'lugar',
    'fecha',
    'hora',
    'acciones'
  ];

  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  


  agregarReserva() {
    this.router.navigate(['/view/form-reserva']); // Asegúrate de que esta ruta exista en tu app-routing.module.ts
  }

  cargarReservas() {
    const apiUrl = 'https://neocompanyapp.com/php/reservas/gets_reservas.php';
    // const apiUrl = 'http://localhost/php/reservas/get_reservas.php';
    this.http.get<UserData[]>(apiUrl).subscribe({
      next: (response) => {
        console.log('Datos cargados:', response);
        if (Array.isArray(response)) {

          const filtrados = response.filter(item => item.company_code === this.companyNameDeseado);
          this.dataSource.data = filtrados;

        } else {
          this.dataSource.data = [];
          console.error('Error al cargar los datos:', response);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.dataSource.data = [];
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editarReserva(reserva: UserData) {
    console.log('Editar reserva:', reserva);
    this.router.navigate(['dashboard/view/editar-reserva', reserva.cedula]);
  }

  // eliminarReserva(reserva: UserData) {
  //   console.log('Eliminar reserva:', reserva);
  // }

  exportarExcel() {
    const data = this.dataSource.filteredData.map(row => ({
      Nombre: row.nombre,
      Cédula: row.cedula,
      Teléfono: row.telefono,
      Personas: row.cantidadpersonas,
      Lugar: row.lugar,
      Fecha: row.fecha,
      Hora: row.hora
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reservas');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Reservas.xlsx');
  }
  confirmarEliminacion(reserva: UserData) {
    const apiUrl = 'https://neocompanyapp.com/php/reservas/eliminar_reserva.php';
    this.http.post(apiUrl, { id: reserva.id }).subscribe({
      next: (response) => {
        console.log('Reserva eliminada:', response);
        this.cargarReservas();
      },
      error: (error) => {
        console.error('Error al eliminar la reserva:', error);
      }
    });
  }
  eliminarReserva(reserva: UserData) {
    console.log('Eliminar reserva:', reserva);
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la reserva de ${reserva.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmarEliminacion(reserva);
      }
    });



    // const Toast = Swal.mixin({
    //   toast: true,
    //   position: "top-end",
    //   showConfirmButton: false,
    //   timer: 3000,
    //   timerProgressBar: true,
    //   didOpen: (toast: any) => {
    //     toast.onmouseenter = Swal.stopTimer;
    //     toast.onmouseleave = Swal.resumeTimer;
    //   }
    // });
    // Toast.fire({
    //   icon: "info",
    //   title: "Eliminando reserva...",
    //   // text: "Los datos del taxista han sido cargados correctamente.",
    // });
  }
}

// function createNewUser(id: number): UserData {
//   const nombre = NOMBRES[Math.floor(Math.random() * NOMBRES.length)];
//   const cedula = Math.floor(Math.random() * 1_000_000_000);
//   const telefono = 3000000000 + Math.floor(Math.random() * 999999999);
//   const cantidadpersonas = Math.floor(Math.random() * 5) + 1;
//   const lugar = LUGARES[Math.floor(Math.random() * LUGARES.length)];
//   const fecha = `2025-05-${Math.floor(Math.random() * 30 + 1).toString().padStart(2, '0')}`;
//   const hora = `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${['00', '30'][Math.floor(Math.random() * 2)]}`;

//   return { nombre, cedula, telefono, cantidadpersonas, lugar, fecha, hora };
// }
