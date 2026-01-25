import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../../material.module';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppFormVentasComponent } from '../forms/form-ventas.component';
import { Router } from '@angular/router';
import { parse } from 'date-fns';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';


// 📦 EXCEL EXPORT
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface Taxistasdata {
  id: number;
  imagePath: string;
  uname: string;
  budget: number;
  priority: string;
  sexo: string | 'femenino' | 'masculino';
  company_code: string;
}

@Component({
  selector: 'app-tables',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  standalone: true,
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class AppTablesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns1: string[] = ['assigned', 'name', 'priority', 'budget'];
  dataSource1 = new MatTableDataSource<Taxistasdata>([]);
  imagenesPorId: { [key: number]: number } = {};

  public formBuscar!: FormGroup;
  private apiUrl = 'https://neocompanyapp.com/php/comisiones/tabla_comisiones.php';

  // sessionObj: any;

  irAgregarComisiones() {
    this.router.navigate(['/dashboard/view/form-ventas']);
  }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) { }

  cargarDatos(): void {
    this.http.get<Taxistasdata[]>(this.apiUrl).subscribe(

      data => {
        const safeData = Array.isArray(data) ? data : [];

        // Filtrar por company_name
        const filtrados = safeData.filter(item => item.company_code === this.sessionObj.user.company_code);

        this.dataSource1.data = filtrados

        // Mantener imágenes por sexo
        for (let card of filtrados) {
          let numeroAleatorio = 0;
          if (card.sexo === 'femenino') {
            const opciones = [2, 4, 10];
            numeroAleatorio = opciones[Math.floor(Math.random() * opciones.length)];
          } else {
            const opciones = [1, 3, 5, 6, 7, 8, 9];
            numeroAleatorio = opciones[Math.floor(Math.random() * opciones.length)];
          }
          this.imagenesPorId[card.id] = numeroAleatorio;
        }
        console.log('this.sessionObj:', this.sessionObj);
        if (this.paginator) {
          this.dataSource1.paginator = this.paginator;
        }
      },
      error => {
        console.error('Error al obtener los datos:', error);
        this.dataSource1 = new MatTableDataSource<Taxistasdata>([]);
      }
    );
  }






  sessionObj: any;
  ngOnInit(): void {
    this.formBuscar = this.crearFormularioConsultar();
    this.cargarDatos();
    const session = localStorage.getItem('session');
    if (session) {
      this.sessionObj = JSON.parse(session);
      console.log('Usuario en sesión desde comisiones:', this.sessionObj.user.username);
      console.log('ID de usuario desde comisiones:', this.sessionObj.user.company_code);
    } else {
      console.log('No hay usuario en sesión');
    }

    this.dataSource1.filterPredicate = (data: any, filter: string) => {
      const searchTerm = filter?.trim().toLowerCase() || '';
      const estado = this.getEstado(data)?.toLowerCase() || '';
      return (
        data?.title?.toLowerCase()?.includes(searchTerm) ||
        data?.cedula?.toString()?.includes(searchTerm) ||
        estado.includes(searchTerm)
      );
    };

    this.formBuscar.get('cedula')?.valueChanges.subscribe((value: string) => {
      let filtro = value.trim().toLowerCase();
      if (filtro === 'no pagado' || filtro === 'no comenzado') filtro = 'no-pagado';
      this.dataSource1.filter = filtro;
      if (filtro === 'pagado') filtro = 'pagado';
      this.dataSource1.filter = filtro;
    });

   this.iniciarAutoActualizacion();


  }
  intervalId: any;
  iniciarAutoActualizacion() {
    this.intervalId = setInterval(() => {
      this.cargarDatos();
      console.log('Ventas actualizadas automáticamente');
    }, 20000); // cada 20 segundos
  }

  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator;
  }

  getEstado(element: any): string {
    if (element.pagado === 0 && element.total === 0) return 'no registran pagos';
    if (element.pagado === 0 && element.total > 1) return 'no comenzado';
    if (element.pagado > 0 && element.total > 0 && element.pagado < element.total) return 'no comenzado';
    if (element.pagado < element.total) return 'en proceso';
    if (element.pagado === element.total) return 'completado';
    return '';
  }

  private crearFormularioConsultar(): FormGroup {
    return this.fb.group({
      cedula: ['', [Validators.required]],
    });
  }

  abrirFormulario(comision: any) {
    this.router.navigate(['dashboard/view/add-ventas', comision.cedula]);
  }

  pagarCompleto(element: any): void {
    const dialogRef = this.dialog.open(DialogPagoTotalComponent, {
      data: element,
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarDatos();
      }
    });
  }
  verHistorial(element: any): void {
    this.router.navigate(['dashboard/view/historial-ventas', element.cedula]);
  }
  abonar(element: any): void {
    const dialogRef = this.dialog.open(DialogAbonarComponent, {
      data: element,
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarDatos();
      }
    });
  }

  exportarExcel(): void {
    const dataExport = this.dataSource1.data.map((element: any) => ({
      Nombre: element.title,
      Cédula: element.cedula || 'No registrada',
      'Deuda ($)': element.total - element.pagado,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExport);

    // Estilizar columnas: ajustar ancho
    const colWidths = [
      { wch: 30 }, // Nombre
      { wch: 20 }, // Cédula
      { wch: 15 }, // Deuda
    ];
    worksheet['!cols'] = colWidths;

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Ventas': worksheet },
      SheetNames: ['Ventas'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fecha = new Date().toLocaleDateString('es-CO').replace(/\//g, '-');
    const nombreArchivo = `Reporte-Ventas-${fecha}.xlsx`;

    const data: Blob = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(data, nombreArchivo);

    // FileSaver.saveAs(data, nombreArchivo);
  }


}

// ─────────────────────────────────────────────
// DIALOG: Pago total
@Component({
  selector: 'dialog-pago-total',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Pago Total</h2>
    <mat-dialog-content>
      <p>Confirmar pago total para: {{ data.title || data.uname || data.nombre || data.element.nombre}}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="submit()">Confirmar</button>
    </mat-dialog-actions>
  `,
})
export class DialogPagoTotalComponent {
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogPagoTotalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Datos recibidos en el diálogo:', data.cedula || data.element?.cedula || data.cedula);
    console.log('Monto total:', data.total_a_pagar || data.element?.total_a_pagar || data.total || 0);

  }

  submit() {
    const monto =
      this.data?.total ??
      this.data?.total_a_pagar ??
      this.data?.element?.total_a_pagar ??
      0;

    if (monto <= 0) {
      console.error('Monto inválido');
      return;
    }

    const cedula =
      this.data?.cedula ??
      this.data?.element?.cedula ??
      '';

    this.http.post('https://neocompanyapp.com/php/comisiones/pago_comisiones.php', {
      monto,
      cedula
    }).subscribe({
      next: (response) => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast: any) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Pago exitoso",
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error al procesar el pago:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo procesar el pago. Intente más tarde.'
        });
      }
    });
  }

}

// ─────────────────────────────────────────────
// DIALOG: Abonar
@Component({
  selector: 'dialog-abonar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
  <h2 mat-dialog-title style="text-align: center;">Abonar Pago</h2>
  <mat-dialog-content style="text-align: center;">
    <p>Ingrese monto a abonar para: {{ data.title || data.uname }}</p>
    <mat-form-field appearance="outline" class="w-100" color="primary" style="width: 100%;">
      <mat-label>Monto</mat-label>
      <input matInput #monto placeholder="0" type="number"/>
    </mat-form-field>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button mat-dialog-close>Cancelar</button>
    <button mat-raised-button color="primary" (click)="confirmarAbono(monto.value)">Confirmar</button>
  </mat-dialog-actions>
`,
})
export class DialogAbonarComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogAbonarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private router: Router
  ) { }

  confirmarAbono(montoV: string) {
    const monto = parseFloat(montoV);

    if (isNaN(monto) || monto <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Monto inválido',
        text: 'Por favor ingrese un monto válido mayor a cero.'
      });
      return;
    }

    this.http.post('https://neocompanyapp.com/php/comisiones/pago_comisiones.php', {
      id: this.data.id,
      monto: monto,
      cedula: this.data.cedula,
    }).subscribe({
      next: (response) => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast: any) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Abono registrado exitosamente",
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error al registrar abono:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el abono. Intente más tarde.'
        });
      }
    });
  }
}
