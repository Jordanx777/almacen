import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileTaxistasComponent } from '../profile/profile-taxistas.component';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatButtonModule } from '@angular/material/button';
import { DateTime } from 'luxon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface UserData {
  nombre: string;
  cedula: number;
  telefono: number;
  placa: number;
  sexo: string;
  nacimiento: number;
  company_code: string;
}

@Component({
  selector: 'app-tabla-taxistas',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule, // Asegura estilos del botón
  ],
  templateUrl: './tabla-taxistas.component.html',
  styleUrls: ['./tabla-taxistas.component.scss'],
})
export class TablaTaxistasComponent implements AfterViewInit {


irAgregarTaxista() {
  this.router.navigate(['/dashboard/view/form-taxista']);
}


  displayedColumns: string[] = [
    'nombre',
    'cedula',
    // 'telefono',
    'placa',
    // 'sexo',
    // 'nacimiento',
    'acciones'];
  dataSource = new MatTableDataSource<UserData>([]);  // inicializar vacío

  private apiUrlBuscar = 'https://neocompanyapp.com/php/taxistas/get_taxistas.php';
// private apiUrlBuscar = 'http://localhost/php/taxistas/get_taxistas.php';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) { }
  sessionObj: any;
  ngOnInit(): void {
    const session = localStorage.getItem('session');
    if (session) {
      this.sessionObj = JSON.parse(session);
      console.log('Usuario en sesión desde comisiones:', this.sessionObj.user.username);
      console.log('ID de usuario desde comisiones:', this.sessionObj.user.company_code);
    } else {
      console.log('No hay usuario en sesión');
    }
    const companyNameDeseado = this.sessionObj.user.company_code;

    this.http.get<UserData[]>(this.apiUrlBuscar).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          const filtrados = data.filter(item => item.company_code === companyNameDeseado);
          this.dataSource.data = filtrados;
          console.log(data);
          console.log(this.dataSource);
          // this.dataSource = new MatTableDataSource<UserData>(filtrados);

        } else {
          this.dataSource.data = [];
          console.warn('No se encontraron registros o respuesta inválida');
        }
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
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
  abrirDetalleTaxista(taxista: any) {
    this.dialog.open(ProfileTaxistasComponent, {
      data: taxista,
      width: '400px',
      height: '550px',
      position: {
        top: '100px'
      },
    });
  }
  editarTaxista(taxista: any) {
    this.router.navigate(['dashboard/view/editar-taxista', taxista.cedula]);
  }

  eliminarTaxista(taxista: any) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.http.delete(`https://neocompanyapp.com/php/taxistas/eliminar_taxistas.php?cedula=${taxista.cedula}`).subscribe(() => {
          // Filtra y actualiza la tabla eliminando el taxista
          this.dataSource.data = this.dataSource.data.filter((item) => item.cedula !== taxista.cedula);

          // Muestra confirmación
          Swal.fire({
            title: "¡Eliminado!",
            text: "El taxista ha sido eliminado.",
            icon: "success"
          });
        }, (error) => {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el taxista.",
            icon: "error"
          });
        });
      }
    });
  }
  exportarExcel() {
    const data = this.dataSource.filteredData;

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Ajuste automático de ancho de columnas
    const objectMaxLength: number[] = [];

    const keys = Object.keys(data[0] || {});
    for (let i = 0; i < keys.length; i++) {
      objectMaxLength[i] = keys[i].length; // empezar con la longitud del encabezado
    }

    data.forEach(row => {
      keys.forEach((key, i) => {
        const value = (row as any)[key] ? (row as any)[key].toString() : '';
        objectMaxLength[i] = Math.max(objectMaxLength[i], value.length);
      });
    });

    worksheet['!cols'] = objectMaxLength.map(width => {
      return { wch: width + 2 }; // `wch` = "width in characters"
    });

    // Crear y exportar el libro
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Taxistas');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'taxistas.xlsx');
  }


  exportarExcelTaxistas() {
    const data = this.dataSource.filteredData;

    // Seleccionar columnas específicas
    const selectedKeys = ['nombre', 'telefono', 'cedula', 'category', 'numero_placa', 'sexo', 'fecha_nacimiento'];
    const headers = ['Nombre', 'Teléfono', 'Número de Cédula', 'Categoría', 'Número de Placa', 'Sexo', 'Fecha de Nacimiento'];

    // Armar datos en formato AOA (array of arrays)
    const dataFormatted = data.map(row => selectedKeys.map(key => (row as any)[key]));

    // Crear hoja con encabezados y datos
    const worksheet = XLSX.utils.aoa_to_sheet([
      headers,
      ...dataFormatted
    ]);

    // Ajustar ancho de columnas
    const colWidths = headers.map((header, i) => {
      let maxLength = header.length;
      dataFormatted.forEach(row => {
        const val = row[i] ? row[i].toString() : '';
        maxLength = Math.max(maxLength, val.length);
      });
      return { wch: maxLength + 2 };
    });
    worksheet['!cols'] = colWidths;

    // Crear y exportar el libro
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Taxistas');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const now = DateTime.now().setZone('America/Bogota');
    const filename = `taxistas_${now.toFormat('yyyy-MM-dd_HH-mm-ss')}.xlsx`;

    saveAs(blob, filename);


    // const filename = `taxistas_${now.toISOString().slice(0,19).replace(/[:T]/g, '-')}.xlsx`;
    // saveAs(blob, filename);

    // saveAs(blob, 'taxistas.xlsx');
  }





  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
}


// function createNewUser(): UserData {
//   const nombres = ['Luis Hernández', 'Camilo Marrugo', 'Jordano Vinasco', 'Ana Torres', 'Pedro Gómez'];
//   const sexos = ['Masculino', 'Femenino'];

//   return {
//     nombre: nombres[Math.floor(Math.random() * nombres.length)],
//     cedula: Math.floor(Math.random() * 1000000000),
//     telefono: 3000000000 + Math.floor(Math.random() * 100000000),
//     placa: Math.floor(100000 + Math.random() * 900000),
//     sexo: sexos[Math.floor(Math.random() * sexos.length)],
//     nacimiento: 1970 + Math.floor(Math.random() * 30),
//   };
// }
