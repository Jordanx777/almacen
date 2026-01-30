import {
  Component,
  ViewChild,
  AfterViewInit,
  TemplateRef,
  LOCALE_ID,
  Inject
} from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';

registerLocaleData(localeEs);

@Component({
  standalone: true,
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    MatFormFieldModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatDialogModule,
    MatExpansionModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class ReporteVentasComponent implements AfterViewInit {

  /* ================= FILTROS ================= */
  clienteFiltro = '';

  /* ================= TABLA ================= */
  columnas: string[] = [
    'cliente',
    'fecha',
    'productos',
    'cantidad',
    'total',
    'acciones'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('detalleVentaDialog') detalleVentaDialog!: TemplateRef<any>;
  @ViewChild('devolucionDialog') devolucionDialog!: TemplateRef<any>;

  ventaSeleccionada: any = null;

  /* ================= DEVOLUCIÓN ================= */
  devolucion = {
    nombre: '',
    documento: '',
    motivo: ''
  };

  constructor(
    private dialog: MatDialog,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /* ================= DETALLE ================= */
  abrirDetalleVenta(venta: any): void {
    this.ventaSeleccionada = venta;

    this.dialog.open(this.detalleVentaDialog, {
      width: '600px',
      maxWidth: '95vw'
    });
  }

  /* ================= FILTRAR ================= */
  cargarReporte(): void {
    let ventas = [...this.ventasDemo];

    if (this.clienteFiltro) {
      ventas = ventas.filter(v =>
        v.cliente.toLowerCase().includes(this.clienteFiltro.toLowerCase())
      );
    }

    this.dataSource.data = ventas;
  }

  /* ================= CANTIDAD TOTAL ================= */
  getTotalCantidad(venta: any): number {
    if (!venta.productos || !venta.productos.length) return 0;

    return venta.productos.reduce(
      (sum: number, p: any) => sum + p.cantidad,
      0
    );
  }

 /* ================= DEVOLUCIÓN ================= */
registrarDevolucion(venta: any): void {
  this.ventaSeleccionada = venta;
  this.devolucion = { nombre: '', documento: '', motivo: '' };

  this.dialog.open(this.devolucionDialog, {
    width: '500px',
    maxWidth: '95vw'
  });
}

confirmarDevolucion(): void {
  if (!this.devolucion.nombre || !this.devolucion.documento || !this.devolucion.motivo) {
    alert('Por favor completa todos los campos de la devolución');
    return;
  }

  console.log('Devolución confirmada:', {
    venta: this.ventaSeleccionada,
    datosDevolucion: this.devolucion
  });

  alert(`Devolución registrada para ${this.ventaSeleccionada.cliente}`);

  this.dialog.closeAll();

  }

  /* ================= EXPORTAR EXCEL ================= */
  exportarExcel(): void {
    const dataExport = this.dataSource.data.map(v => ({
      Cliente: v.cliente,
      Fecha: this.datePipe.transform(v.fecha, 'dd/MM/yyyy'),
      Productos: v.productos
        .map((p: any) => `${p.nombre} x${p.cantidad}`)
        .join(', '),
      Cantidad: this.getTotalCantidad(v),
      Total: v.total
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExport);
    const wb: XLSX.WorkBook = {
      Sheets: { Ventas: ws },
      SheetNames: ['Ventas']
    };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    saveAs(
      blob,
      `Reporte_Ventas_${new Date().toISOString().split('T')[0]}.xlsx`
    );
  }

  /* ================= DATOS DEMO ================= */
  ventasDemo = [
    {
      cliente: 'Ana Martínez',
      fecha: new Date('2026-01-20'),
      total: 120000,
      productos: [
        { nombre: 'Camiseta Blanca', cantidad: 2, precio: 40000 }
      ]
    },
    {
      cliente: 'Carlos Pérez',
      fecha: new Date('2026-01-21'),
      total: 200000,
      productos: [
        { nombre: 'Chaqueta Negra', cantidad: 1, precio: 120000 },
        { nombre: 'Gorra Negra', cantidad: 1, precio: 80000 }
      ]
    },
    {
      cliente: 'Laura Gómez',
      fecha: new Date('2026-01-22'),
      total: 80000,
      productos: [
        { nombre: 'Vestido Azul', cantidad: 1, precio: 80000 }
      ]
    }
  ];

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.dataSource.data = this.ventasDemo;
  }
}
