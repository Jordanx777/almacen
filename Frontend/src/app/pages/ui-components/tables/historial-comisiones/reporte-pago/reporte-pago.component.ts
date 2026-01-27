import {
  Component,
  ViewChild,
  AfterViewInit,
  TemplateRef,
  LOCALE_ID,
  Inject
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CommonModule, CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { MatExpansionModule } from '@angular/material/expansion';

registerLocaleData(localeEs);

@Component({
  standalone: true,
  imports: [
    CurrencyPipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    NgChartsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    MatOption,
    MatPaginatorModule,
    MatDialogModule,
    DatePipe,
    MatExpansionModule
  ],
  selector: 'app-reporte-pagos',
  templateUrl: './reporte-pago.component.html',
  styleUrls: ['./reporte-pago.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class ReportePagosComponent implements AfterViewInit {
  cedulaFiltro = '';
  estadoFiltro = '';
  fechaInicio = '';
  fechaFin = '';

  totalGeneral = 0;
  totalPagado = 0;
  totalPendiente = 0;

  columnas: string[] = ['nombre', 'fecha', 'cedula', 'estado', 'total_a_pagar', 'pagado', 'pendiente'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('detalleUsuarioDialog') detalleUsuarioDialog!: TemplateRef<any>;

  usuarioSeleccionado: any = null;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  reporte: any[] = [];
  sessionObj: any = {};

  graficaData: any;
  graficaOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Distribución del Pago'
      }
    }
  };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  abrirDetalleUsuario(row: any): void {
    this.usuarioSeleccionado = row;

    const pendiente = row.total_a_pagar - row.pagado;

    this.graficaData = {
      labels: ['Pagado', 'Pendiente'],
      datasets: [{
        data: [row.pagado, pendiente],
        backgroundColor: ['#28a745', '#ffc107'],
        hoverOffset: 6
      }]
    };

    this.dialog.open(this.detalleUsuarioDialog, {
      width: window.innerWidth <= 768 ? '90vw' : '600px',
      maxWidth: '95vw'
    });
  }

  cargarReporte() {
    const params = {
      cedula: this.cedulaFiltro,
      estado: this.estadoFiltro,
      fecha_inicio: this.fechaInicio ? new Date(this.fechaInicio).toISOString().split('T')[0] : '',
      fecha_fin: this.fechaFin ? new Date(this.fechaFin).toISOString().split('T')[0] : '',
    };

    if (this.fechaInicio && this.fechaFin && this.fechaInicio > this.fechaFin) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return;
    }

    this.http.get<any[]>('https://neocompanyapp.com/php/comisiones/reportes_pagos.php', { params }).subscribe(data => {
      this.dataSource.data = data;
      this.totalGeneral = data.reduce((s, i) => s + Number(i.total_a_pagar), 0);
      this.totalPagado = data.reduce((s, i) => s + Number(i.pagado), 0);
      this.totalPendiente = this.totalGeneral - this.totalPagado;

      this.graficaData = {
        labels: ['Pagado', 'Pendiente'],
        datasets: [{
          data: [this.totalPagado, this.totalPendiente],
          backgroundColor: ['#28a745', '#dc3545'],
          hoverOffset: 6
        }]
      };
    });
  }

  exportarExcel(): void {
    const dataExport = this.dataSource.data.map(r => ({
      Nombre: r.nombre,
      Fecha: r.fecha,
      Cédula: r.cedula,
      Estado: r.estado,
      'Total ($)': r.total_a_pagar,
      'Pagado ($)': r.pagado,
      'Pendiente ($)': r.total_a_pagar - r.pagado
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExport);
    const wb: XLSX.WorkBook = { Sheets: { 'Pagos': ws }, SheetNames: ['Pagos'] };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `Reporte_Pagos_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  ngOnInit() {
    this.cargarReporte();
    console.log('Componente ReportePagosComponent inicializado');

    const session = localStorage.getItem('session');
    if (session) {
      this.sessionObj = JSON.parse(session);
      console.log('Usuario en sesión desde comisiones:', this.sessionObj.user.username);
      console.log('ID de usuario desde comisiones:', this.sessionObj.user.company_code);
    } else {
      console.log('No hay usuario en sesión');
    }

    const companyNameDeseado = this.sessionObj.user?.company_code;

    this.http.get<any[]>('https://neocompanyapp.com/php/comisiones/reportes_pagos.php').subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          const filtrados = data.filter(item => item.company_code === companyNameDeseado);
          this.dataSource.data = filtrados;
          console.log(data);
          console.log(this.dataSource.data);
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
}
