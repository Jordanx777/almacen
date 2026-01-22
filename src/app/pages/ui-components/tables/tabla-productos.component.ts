import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DateTime } from 'luxon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

// Interfaz de producto
export interface Producto {
  nombre: string;
  codigo: string;
  categoria_nombre: string;
  talla: string;
  color: string;
  cantidad: number;
  precioCompra: number;
  precioVenta: number;
  proveedor_nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-tabla-productos',
  templateUrl: './tabla-productos.component.html',
  styleUrls: ['./tabla-productos.component.scss'],
  imports: [ CommonModule,
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
     MatButtonModule,  ]
})
export class TablaProductosComponent implements AfterViewInit {

  displayedColumns: string[] = [
    'nombre',
    'codigo',
    'categoria',
    'talla',
    'color',
    'cantidad',
    'precioCompra',
    'precioVenta',
    'proveedor',
    'descripcion',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Producto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private apiUrl = 'https://tuapi.com/productos/get_productos.php'; // Cambia a tu API real

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarProductos() {
    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.dataSource.data = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.dataSource.data = [];
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  // Abrir detalle de producto (puedes crear un diálogo similar al de taxista)
  abrirDetalleProducto(producto: Producto) {
  // this.dialog.open(DetalleProductoComponent, {
  //   data: producto,
  //   width: '400px',
  //   height: '550px'
  // });
  console.log('Detalle del producto:', producto);
}


  editarProducto(producto: Producto) {
    this.router.navigate(['/dashboard/view/editar-producto', producto.codigo]);
  }

  eliminarProducto(producto: Producto) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`https://tuapi.com/productos/eliminar.php?codigo=${producto.codigo}`)
          .subscribe({
            next: () => {
              this.dataSource.data = this.dataSource.data.filter(p => p.codigo !== producto.codigo);
              Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
            },
            error: () => {
              Swal.fire("Error", "No se pudo eliminar el producto.", "error");
            }
          });
      }
    });
  }

  exportarExcelProductos() {
    const data = this.dataSource.filteredData;
    const headers = ['Nombre', 'Código', 'Categoría', 'Talla', 'Color', 'Cantidad', 'Precio Compra', 'Precio Venta', 'Proveedor', 'Descripción'];
    const selectedKeys = ['nombre','codigo','categoria_nombre','talla','color','cantidad','precioCompra','precioVenta','proveedor_nombre','descripcion'];

    const dataFormatted = data.map(row => selectedKeys.map(key => (row as any)[key]));

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataFormatted]);

    // Ajuste ancho columnas
    const colWidths = headers.map((h, i) => {
      let maxLen = h.length;
      dataFormatted.forEach(r => {
        const val = r[i] ? r[i].toString() : '';
        maxLen = Math.max(maxLen, val.length);
      });
      return { wch: maxLen + 2 };
    });
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const now = DateTime.now().setZone('America/Bogota');
    const filename = `productos_${now.toFormat('yyyy-MM-dd_HH-mm-ss')}.xlsx`;
    saveAs(blob, filename);
  }

  irAgregarProducto() {
    this.router.navigate(['/dashboard/view/form-producto']);
  }

}
