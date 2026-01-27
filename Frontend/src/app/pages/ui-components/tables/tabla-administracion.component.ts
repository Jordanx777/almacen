import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuarios.service';

export interface UsuarioData {
  usuario: string;
  estado: string;
  fechaRegistro: Date;
  fechaVencimiento: Date;
  ultimoAcceso: Date;
}



const USUARIOS: string[] = ['DondeOlano', 'cmartinez', 'jperez', 'acastro', 'lrodriguez'];
const ESTADOS: string[] = ['Activo', 'Inactivo'];

@Component({
  selector: 'app-tabla-administracion',
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
    MatButtonModule
  ],
  templateUrl: './tabla-administracion.component.html',
  styleUrls: ['./tabla-administracion.component.scss']
})
export class TablaAdministracionComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'usuario',
    // 'email',
    'estado',
    'fechaRegistro',
    'fechaVencimiento',
    'ultimoAcceso',
    'acciones'
  ];

  dataSource: MatTableDataSource<UsuarioData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private usuarioService: UsuarioService) {
    this.dataSource = new MatTableDataSource<UsuarioData>([]);
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarUsuarios(); // <-- Aquí
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editarUsuario(usuario: UsuarioData) {
    console.log('Editar usuario', usuario);
    // lógica de edición aquí
  }

  eliminarUsuario(usuario: UsuarioData) {
    console.log('Eliminar usuario', usuario);
    // lógica de eliminación aquí
  }

  calcularTiempoRestante(fechaVencimiento: Date): number {
    const hoy = new Date();
    const diff = fechaVencimiento.getTime() - hoy.getTime();
    return Math.max(Math.ceil(diff / (1000 * 3600 * 24)), 0); // Días restantes
  }


 cargarUsuarios() {
  this.usuarioService.obtenerUsuarios().subscribe({
    next: (usuarios) => {
      // Convertir las fechas string a objetos Date
      const usuariosTransformados = usuarios.map((u: any) => ({
        ...u,
        fechaRegistro: new Date(u.fechaRegistro),
        fechaVencimiento: new Date(u.fechaVencimiento),
        ultimoAcceso: u.ultimoAcceso ? new Date(u.ultimoAcceso) : null
      }));

      this.dataSource.data = usuariosTransformados;
      console.log('Usuarios cargados', usuariosTransformados);
    },
    error: (err) => {
      console.error('Error al cargar usuarios', err);
    }
  });
}


}

// function createNewUsuario(id: number): UsuarioData {
//   const usuario = USUARIOS[Math.floor(Math.random() * USUARIOS.length)] + id;
//   const estado = ESTADOS[Math.floor(Math.random() * ESTADOS.length)];

//   const fechaRegistro = randomDate(new Date(2023, 0, 1), new Date());
//   const ultimoAcceso = randomDate(fechaRegistro, new Date());
//   const fechaVencimiento = new Date(fechaRegistro);
//   fechaVencimiento.setDate(fechaVencimiento.getDate() + 30); // 30 días después del registro

//   return {
//     usuario,
//     estado,
//     fechaRegistro,
//     ultimoAcceso,
//     fechaVencimiento
//   };
// }

// function randomDate(start: Date, end: Date): Date {
//   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
// }
