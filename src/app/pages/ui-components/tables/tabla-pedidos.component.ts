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
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

export interface Pedido {
  id?: number;
  proveedor: string;
  numero_pedido: string;
  fecha_pedido: string;
  cantidad_prendas: number;
  valor_total: number;
  estado_pedido: 'pendiente' | 'recibido';
  company_code: string;
}

@Component({
  selector: 'app-tabla-pedidos',
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
  templateUrl: './tabla-pedidos.component.html',
  styleUrls: ['./tabla-pedidos.component.scss']
})
export class TablaPedidosComponent implements AfterViewInit {

  dataSource: MatTableDataSource<Pedido>;
  displayedColumns: string[] = [
    'proveedor',
    'numero_pedido',
    'fecha_pedido',
    'cantidad_prendas',
    'valor_total',
    'estado_pedido',
    'acciones'
  ];

  companyNameDeseado: string = '';
  sessionObj: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private router: Router) {
    this.dataSource = new MatTableDataSource<Pedido>([]);
  }

  ngOnInit(): void {
    const session = localStorage.getItem('session');
    if (session) {
      this.sessionObj = JSON.parse(session);
      this.companyNameDeseado = this.sessionObj.user.company_code;
    }
    this.cargarPedidos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarPedidos() {
    const apiUrl = 'https://neocompanyapp.com/php/pedidos/get_pedidos.php';

    this.http.get<Pedido[]>(apiUrl).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.dataSource.data = response.filter(
            p => p.company_code === this.companyNameDeseado
          );
        } else {
          this.dataSource.data = [];
        }
      },
      error: () => {
        this.dataSource.data = [];
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  agregarPedido() {
    this.router.navigate(['/dashboard/view/form-pedido']);
  }

  editarPedido(pedido: Pedido) {
    this.router.navigate(['/dashboard/view/editar-pedido', pedido.id]);
  }

  eliminarPedido(pedido: Pedido) {
    Swal.fire({
      title: '¿Eliminar pedido?',
      text: `Pedido #${pedido.numero_pedido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.http.post(
          'https://neocompanyapp.com/php/pedidos/eliminar_pedido.php',
          { id: pedido.id }
        ).subscribe({
          next: () => this.cargarPedidos(),
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el pedido', 'error');
          }
        });
      }
    });
  }

  exportarExcel() {
    const data = this.dataSource.filteredData.map(p => ({
      Proveedor: p.proveedor,
      'Número Pedido': p.numero_pedido,
      Fecha: p.fecha_pedido,
      'Cantidad Prendas': p.cantidad_prendas,
      'Valor Total': p.valor_total,
      Estado: p.estado_pedido
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Pedidos.xlsx');
  }
}
