import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ComisionService } from 'src/app/services/comision-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-historial-comisiones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatMenuModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatExpansionModule
  ],
  templateUrl: './historial-comisiones.component.html',
  styleUrls: ['./historial-comisiones.component.scss']
})
export class HistorialComisionesComponent implements OnInit, AfterViewInit {
  constructor(
    private comisionService: ComisionService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  comisiones: any[] = [];
  cedula = '';
  estadoFiltro = '';
  fechaInicio = '';
  fechaFin = '';
  totalComisiones: any;
  totalAbonado: any;
  totalPagado: any;
  displayedColumns: string[] = [ 'nombre', 'placa', 'referidos', 'total', 'pagado', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('dialogDetalle') dialogDetalle!: TemplateRef<any>;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cedula = params.get('cedula');
      if (cedula) {
        this.cedula = cedula;
        this.cargarComisiones();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  cargarComisiones() {
    this.comisionService.getComisiones(this.cedula, this.estadoFiltro, this.fechaInicio, this.fechaFin)
      .subscribe(data => {
        this.comisiones = data;
        this.dataSource.data = this.comisiones;
        this.totalComisiones = this.comisiones.reduce((sum, item) => sum + Number(item.total_a_pagar), 0);
        this.totalPagado = this.comisiones.reduce((sum, item) => sum + Number(item.pagado), 0);
      });
  }

  cambiarEstado(id: number, estado: string) {
    this.comisionService.updateEstado(id, estado).subscribe(() => this.cargarComisiones());
  }

  abrirFormulario(comision: any) {
    this.router.navigate(['dashboard/view/add-comisiones', comision.cedula]);
  }

  pagarCompleto(element: any): void {
    const dialogRef = this.dialog.open(DialogPagoTotalHistorialComponent, {
      data: {
        element,
        totalComisiones: this.totalComisiones
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarComisiones();
      }
    });
  }

  abrirDialogAbonar(comision: any): void {
    const dialogRef = this.dialog.open(DialogAbonarHistorialComponent, {
      data: comision,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarComisiones();
      }
    });
  }

  abrirDetalle(data: any): void {
    if (window.innerWidth <= 768) {
      this.dialog.open(this.dialogDetalle, {
        data: data,
        width: '90vw',
        maxWidth: '400px'
      });
    }
  }
}

@Component({
  selector: 'dialog-abonar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule
  ],
  template: `
    <button mat-button (click)="closeDialog()"><mat-icon>close</mat-icon> Cerrar</button>
    <h2 mat-dialog-title style="text-align: center;">Abonar Pago</h2>
    <mat-dialog-content style="text-align: center;">
      <p>Ingrese monto a abonar para: {{ data.title || data.uname || data.nombre }}</p>
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
export class DialogAbonarHistorialComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogAbonarHistorialComponent>,
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

    this.http.post('https://neocompanyapp.com/php/comisiones/abono_comisiones.php', {
      id: this.data.id,
      monto: monto,
      cedula: this.data.cedula,
    }).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Abono registrado exitosamente',
          showConfirmButton: false,
          timer: 3000
        });
        this.dialogRef.close(true);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el abono. Intente más tarde.'
        });
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-pago-total',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CurrencyPipe],
  template: `
    <h2 mat-dialog-title>Pago Total</h2>
    <mat-dialog-content>
      <p class="">Confirmar pago para:
        <b>{{ data.title || data.uname || data.nombre || data.element.nombre}}</b>
       </p>
      <p>Monto total a pagar:
        <b>{{ data.total_a_pagar || data.element?.total_a_pagar || data.total || 0 | currency }}</b>
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="submit()">Confirmar</button>
    </mat-dialog-actions>
  `,
})
export class DialogPagoTotalHistorialComponent {
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogPagoTotalHistorialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Datos recibidos en el diálogo:', data.cedula || data.element?.cedula || data.cedula);
    console.log('Monto total:', data.total_a_pagar || data.element?.total_a_pagar || data.total || 0);
  }

  submit() {
    const monto = this.data?.total ?? this.data?.total_a_pagar ?? this.data?.element?.total_a_pagar ?? 0;
    if (monto <= 0) {
      console.error('Monto inválido');
      return;
    }

    const cedula =
      this.data?.cedula ??
      this.data?.element?.cedula ??
      '';
    const id =
      this.data?.id ??
      this.data?.element?.id ??
      '';

    this.http.post('https://neocompanyapp.com/php/comisiones/abono_comisiones.php', {
      monto,
      cedula,
      id
    }).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Pago exitoso',
          showConfirmButton: false,
          timer: 3000
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
