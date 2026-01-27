import { AfterViewInit, Component, ViewChild, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Router, RouterModule } from '@angular/router';

/* ========================= */
export interface Producto {
  nombre: string;
  categoria_nombre: string;
  talla: string;
  color: string;
  cantidad: number;
  precioCompra: number;
  precioVenta: number;
  proveedor_nombre: string;
}

@Component({
  selector: 'app-tabla-productos',
  standalone: true,
  templateUrl: './tabla-productos.component.html',
  styleUrls: ['./tabla-productos.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule
  ]
})
export class TablaProductosComponent implements AfterViewInit, OnInit {

  constructor(private dialog: MatDialog, private router: Router) {}

  displayedColumns: string[] = [
    'nombre','categoria','talla','color',
    'cantidad','precioCompra','precioVenta',
    'proveedor','acciones'
  ];

  dataSource = new MatTableDataSource<Producto>([]);
  categoriaSeleccionada: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  productosMock: Producto[] = [
    {
      nombre: 'Camiseta Oversize',
      categoria_nombre: 'Ropa',
      talla: 'M',
      color: 'Negro',
      cantidad: 12,
      precioCompra: 30000,
      precioVenta: 60000,
      proveedor_nombre: 'Proveedor A'
    }
  ];

  /* ===================== INIT ===================== */
  ngOnInit(): void {
    this.cargarProductos();

    this.dataSource.filterPredicate = (data: Producto, filter: string) => {
      const text = filter.toLowerCase();

      const coincideTexto =
        data.nombre.toLowerCase().includes(text) ||
        data.color.toLowerCase().includes(text) ||
        data.categoria_nombre.toLowerCase().includes(text);

      const coincideCategoria =
        !this.categoriaSeleccionada ||
        data.categoria_nombre === this.categoriaSeleccionada;

      return coincideTexto && coincideCategoria;
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /* ===================== LOCAL STORAGE ===================== */
  cargarProductos(): void {
    const productosLS = JSON.parse(localStorage.getItem('productos') || '[]');

    if (productosLS.length > 0) {
      this.dataSource.data = productosLS.map((p: any) => ({
        nombre: p.nombre,
        categoria_nombre: this.obtenerNombreCategoria(p.categoria),
        talla: p.talla,
        color: p.color,
        cantidad: p.cantidad,
        precioCompra: p.precioCompra,
        precioVenta: p.precioVenta,
        proveedor_nombre: this.obtenerNombreProveedor(p.proveedor)
      }));
    } else {
      this.dataSource.data = this.productosMock;
    }
  }

  guardarEnLocalStorage(): void {
    localStorage.setItem('productos', JSON.stringify(this.dataSource.data));
  }

  obtenerNombreCategoria(id: number): string {
    const categorias: any = {
      1: 'Camiseta',
      2: 'Pantalón',
      3: 'Chaqueta',
      4: 'Accesorio'
    };
    return categorias[id] || 'Sin categoría';
  }

  obtenerNombreProveedor(id: number): string {
    const proveedores: any = {
      1: 'Proveedor 1',
      2: 'Proveedor 2'
    };
    return proveedores[id] || 'Sin proveedor';
  }

  /* ===================== FILTROS ===================== */
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  filtrarCategoria(cat: string) {
    this.categoriaSeleccionada = cat;
    this.dataSource.filter = this.dataSource.filter || ' ';
  }

  /* ===================== CRUD ===================== */
  agregarProducto() {
    this.router.navigate(['/dashboard/view/form-producto']);
  }

  editarProducto(p: Producto) {
    const dialogRef = this.dialog.open(EditarProductoDialogComponent, {
      width: '650px',
      maxWidth: '90vw',
      data: { ...p }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(p, result);
        this.dataSource._updateChangeSubscription();
        this.guardarEnLocalStorage();
      }
    });
  }

  eliminarProducto(p: Producto) {
    Swal.fire({
      title: '¿Eliminar?',
      icon: 'warning',
      showCancelButton: true
    }).then(res => {
      if (res.isConfirmed) {
        this.dataSource.data = this.dataSource.data.filter(x => x !== p);
        this.guardarEnLocalStorage();
      }
    });
  }

  exportarExcelProductos() {
    const data = this.dataSource.filteredData;
    const sheet = XLSX.utils.json_to_sheet(data);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Productos');
    const buffer = XLSX.write(book, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'productos.xlsx');
  }
}

/* ===================================================== */
/* =============== DIALOG EDITAR PRODUCTO ============== */
/* ===================================================== */

@Component({
  standalone: true,
  selector: 'app-editar-producto-dialog',
  template: `
    <mat-card class="dialog-card">

      <mat-card-title class="dialog-title">
        Editar Producto
      </mat-card-title>

      <mat-card-content>
        <form class="form-dialog">

          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput [(ngModel)]="data.nombre" name="nombre">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Categoría</mat-label>
            <input matInput [(ngModel)]="data.categoria_nombre" name="categoria">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Talla</mat-label>
            <input matInput [(ngModel)]="data.talla" name="talla">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Color</mat-label>
            <input matInput [(ngModel)]="data.color" name="color">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Cantidad</mat-label>
            <input matInput type="number" [(ngModel)]="data.cantidad" name="cantidad">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Precio Compra</mat-label>
            <input matInput type="number" [(ngModel)]="data.precioCompra" name="precioCompra">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Precio Venta</mat-label>
            <input matInput type="number" [(ngModel)]="data.precioVenta" name="precioVenta">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Proveedor</mat-label>
            <input matInput [(ngModel)]="data.proveedor_nombre" name="proveedor">
          </mat-form-field>

        </form>
      </mat-card-content>

      <mat-card-actions align="end" class="dialog-actions">
        <button mat-stroked-button mat-dialog-close>Cancelar</button>
        <button mat-raised-button color="primary" [mat-dialog-close]="data">
          Guardar
        </button>
      </mat-card-actions>

    </mat-card>
  `,
  styles: [`
    .dialog-title {
      font-weight: 600;
      margin-bottom: 10px;
    }

    .form-dialog {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      padding-top: 10px;
    }

    mat-form-field {
      width: 100%;
    }

    .dialog-actions {
      padding-top: 16px;
    }
  `],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule
  ]
})
export class EditarProductoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Producto) {}
}
