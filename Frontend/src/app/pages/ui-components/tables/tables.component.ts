import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core'; // ✅ CAMBIO: Agregado OnDestroy y ChangeDetectorRef
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
import { AppFormComisionesComponent } from '../forms/form-comisiones.component';
import { Router } from '@angular/router';
import { parse } from 'date-fns';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';

// 📦 EXCEL EXPORT
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Interfaz para los datos de taxistas/comisiones
 */
export interface Taxistasdata {
  id: number;
  imagePath: string;
  uname: string;
  budget: number;
  priority: string;
  sexo: string | 'femenino' | 'masculino';
  company_code: string;
}

/**
 * Componente de tabla de comisiones
 * 
 * Características:
 * - Tabla de comisiones con paginación
 * - Búsqueda y filtrado de datos
 * - Exportación a Excel
 * - Actualización automática cada 20 segundos
 * - Gestión de pagos (completo y abonos)
 * 
 * @component
 * @standalone
 */
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
export class AppTablesComponent implements OnInit, AfterViewInit, OnDestroy { // ✅ CAMBIO: Agregado OnDestroy
  
  // ============================================
  // PROPIEDADES
  // ============================================
  
  /** Referencia al paginador de Material */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /** Columnas a mostrar en la tabla */
  displayedColumns1: string[] = ['assigned', 'name', 'priority', 'budget'];
  
  /** Fuente de datos para la tabla */
  dataSource1 = new MatTableDataSource<Taxistasdata>([]);
  
  /** Mapeo de imágenes aleatorias por ID de usuario */
  imagenesPorId: { [key: number]: number } = {};

  /** Formulario de búsqueda */
  public formBuscar!: FormGroup;
  
  /** URL del endpoint de la API */
  private apiUrl = 'https://neocompanyapp.com/php/comisiones/tabla_comisiones.php';

  /** Objeto de sesión del usuario */
  sessionObj: any;
  
  /** ID del intervalo de actualización automática */
  intervalId: any;

  // ============================================
  // CONSTRUCTOR
  // ============================================
  
  /**
   * Constructor del componente
   * @param http - Cliente HTTP para peticiones
   * @param fb - FormBuilder para crear formularios reactivos
   * @param dialog - Servicio de diálogos de Material
   * @param router - Router de Angular para navegación
   * @param cdr - ChangeDetectorRef para detección de cambios manual
   */
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef // ✅ CAMBIO: Inyectado ChangeDetectorRef
  ) { }

  // ============================================
  // CICLO DE VIDA
  // ============================================
  
  /**
   * Inicialización del componente
   * 
   * ✅ CAMBIOS:
   * - Validación de sesión antes de cargar datos
   * - Uso de setTimeout para diferir carga de datos
   * - Mejor manejo de errores
   * 
   * Orden de ejecución:
   * 1. Crear formulario de búsqueda
   * 2. Cargar y validar sesión
   * 3. Configurar filtros
   * 4. Diferir carga de datos
   * 5. Iniciar actualización automática
   */
  ngOnInit(): void {
    // 1. Crear formulario de búsqueda
    this.formBuscar = this.crearFormularioConsultar();
    
    // 2. Cargar y validar sesión
    const session = localStorage.getItem('session');
    if (session) {
      try {
        this.sessionObj = JSON.parse(session);
        console.log('Usuario en sesión desde comisiones:', this.sessionObj.user.username);
        console.log('ID de usuario desde comisiones:', this.sessionObj.user.company_code);
      } catch (error) {
        console.error('Error al parsear sesión:', error);
        return; // ✅ Salir si hay error al parsear
      }
    } else {
      console.log('No hay usuario en sesión');
      return; // ✅ Salir si no hay sesión
    }

    // 3. Configurar predicado de filtro personalizado
    this.dataSource1.filterPredicate = (data: any, filter: string) => {
      const searchTerm = filter?.trim().toLowerCase() || '';
      const estado = this.getEstado(data)?.toLowerCase() || '';
      return (
        data?.title?.toLowerCase()?.includes(searchTerm) ||
        data?.cedula?.toString()?.includes(searchTerm) ||
        estado.includes(searchTerm)
      );
    };

    // 4. Suscribirse a cambios en el campo de búsqueda
    this.formBuscar.get('cedula')?.valueChanges.subscribe((value: string) => {
      let filtro = value.trim().toLowerCase();
      
      // Normalizar términos de búsqueda
      if (filtro === 'no pagado' || filtro === 'no comenzado') {
        filtro = 'no-pagado';
      }
      if (filtro === 'pagado') {
        filtro = 'pagado';
      }
      
      this.dataSource1.filter = filtro;
    });

    // ✅ CAMBIO: Diferir la carga de datos al siguiente ciclo
    // Esto previene el error NG0100
    setTimeout(() => {
      this.cargarDatos();
      this.iniciarAutoActualizacion();
    }, 0);
  }

  /**
   * Se ejecuta después de que la vista está inicializada
   * 
   * Asigna el paginador a la fuente de datos
   */
  ngAfterViewInit(): void {
    this.dataSource1.paginator = this.paginator;
  }

  /**
   * ✅ NUEVO: Limpieza al destruir el componente
   * 
   * CRÍTICO para prevenir memory leaks y peticiones HTTP innecesarias
   * 
   * Sin esta limpieza:
   * - El intervalo seguiría ejecutándose después de navegar
   * - Consumo innecesario de recursos
   * - Posibles errores al actualizar componentes destruidos
   */
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('Intervalo de actualización detenido');
    }
  }

  // ============================================
  // MÉTODOS PÚBLICOS - API CALLS
  // ============================================

  /**
   * Carga los datos de comisiones desde el backend
   * 
   * ✅ CAMBIOS:
   * - Agregado detectChanges() para forzar actualización
   * - Mejor manejo de errores
   * - Validación de datos más robusta
   * 
   * Endpoint: /php/comisiones/tabla_comisiones.php
   * 
   * Procesa:
   * - Filtra por company_code del usuario
   * - Asigna imágenes aleatorias según el sexo
   * - Actualiza el paginador
   */
  cargarDatos(): void {
    // ✅ CAMBIO: Validar que existe sessionObj antes de usarlo
    if (!this.sessionObj?.user?.company_code) {
      console.error('No hay company_code disponible');
      return;
    }

    this.http.get<Taxistasdata[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Validar que data sea un array
        const safeData = Array.isArray(data) ? data : [];

        // Filtrar por company_code del usuario
        const filtrados = safeData.filter(
          item => item.company_code === this.sessionObj.user.company_code
        );

        // Actualizar fuente de datos
        this.dataSource1.data = filtrados;

        // Asignar imágenes aleatorias por sexo
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

        console.log('Datos cargados:', filtrados.length, 'registros');

        // Actualizar paginador si existe
        if (this.paginator) {
          this.dataSource1.paginator = this.paginator;
        }

        // ✅ CAMBIO: Forzar detección de cambios
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
        
        // Limpiar datos en caso de error
        this.dataSource1 = new MatTableDataSource<Taxistasdata>([]);
        
        // ✅ CAMBIO: Detectar cambios también en error
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Inicia la actualización automática de datos cada 20 segundos
   * 
   * IMPORTANTE: El intervalo debe ser limpiado en ngOnDestroy
   * para evitar fugas de memoria
   */
  iniciarAutoActualizacion(): void {
    this.intervalId = setInterval(() => {
      this.cargarDatos();
      console.log('Comisiones actualizadas automáticamente');
    }, 20000); // cada 20 segundos
  }

  // ============================================
  // MÉTODOS PÚBLICOS - UTILIDADES
  // ============================================

  /**
   * Calcula el estado de pago de un elemento
   * 
   * @param element - Elemento con propiedades pagado y total
   * @returns Estado como string
   */
  getEstado(element: any): string {
    if (element.pagado === 0 && element.total === 0) return 'no registran pagos';
    if (element.pagado === 0 && element.total > 1) return 'no comenzado';
    if (element.pagado > 0 && element.total > 0 && element.pagado < element.total) return 'no comenzado';
    if (element.pagado < element.total) return 'en proceso';
    if (element.pagado === element.total) return 'completado';
    return '';
  }

  /**
   * Crea el formulario de búsqueda
   * 
   * @returns FormGroup con validación
   */
  private crearFormularioConsultar(): FormGroup {
    return this.fb.group({
      cedula: ['', [Validators.required]],
    });
  }

  // ============================================
  // MÉTODOS PÚBLICOS - NAVEGACIÓN
  // ============================================

  /**
   * Navega al formulario de agregar comisiones
   */
  irAgregarComisiones(): void {
    this.router.navigate(['/dashboard/view/form-comisiones']);
  }

  /**
   * Abre el formulario de edición para una comisión específica
   * 
   * @param comision - Objeto con datos de la comisión
   */
  abrirFormulario(comision: any): void {
    this.router.navigate(['dashboard/view/add-comisiones', comision.cedula]);
  }

  /**
   * Navega al historial de comisiones de un usuario
   * 
   * @param element - Elemento con cédula del usuario
   */
  verHistorial(element: any): void {
    this.router.navigate(['dashboard/view/historial-comisiones', element.cedula]);
  }

  // ============================================
  // MÉTODOS PÚBLICOS - DIÁLOGOS
  // ============================================

  /**
   * Abre el diálogo para pagar el monto completo
   * 
   * @param element - Elemento con datos del pago
   */
  pagarCompleto(element: any): void {
    const dialogRef = this.dialog.open(DialogPagoTotalComponent, {
      data: element,
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarDatos(); // Recargar datos después del pago
      }
    });
  }

  /**
   * Abre el diálogo para abonar un monto parcial
   * 
   * @param element - Elemento con datos del pago
   */
  abonar(element: any): void {
    const dialogRef = this.dialog.open(DialogAbonarComponent, {
      data: element,
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarDatos(); // Recargar datos después del abono
      }
    });
  }

  // ============================================
  // MÉTODOS PÚBLICOS - EXPORTACIÓN
  // ============================================

  /**
   * Exporta los datos de la tabla a un archivo Excel
   * 
   * Características:
   * - Formatea columnas con anchos específicos
   * - Incluye fecha en el nombre del archivo
   * - Usa formato colombiano para fechas
   */
  exportarExcel(): void {
    // Mapear datos para exportación
    const dataExport = this.dataSource1.data.map((element: any) => ({
      Nombre: element.title,
      Cédula: element.cedula || 'No registrada',
      'Deuda ($)': element.total - element.pagado,
    }));

    // Crear hoja de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExport);

    // Configurar anchos de columna
    const colWidths = [
      { wch: 30 }, // Nombre
      { wch: 20 }, // Cédula
      { wch: 15 }, // Deuda
    ];
    worksheet['!cols'] = colWidths;

    // Crear libro de Excel
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Comisiones': worksheet },
      SheetNames: ['Comisiones'],
    };

    // Convertir a array buffer
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Generar nombre de archivo con fecha
    const fecha = new Date().toLocaleDateString('es-CO').replace(/\//g, '-');
    const nombreArchivo = `Reporte-Comisiones-${fecha}.xlsx`;

    // Crear blob y descargar
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(data, nombreArchivo);
  }
}

// ============================================
// COMPONENTE DE DIÁLOGO: PAGO TOTAL
// ============================================

/**
 * Diálogo para confirmar y procesar el pago total de una comisión
 * 
 * @component
 * @standalone
 */
@Component({
  selector: 'dialog-pago-total',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Pago Total</h2>
    <mat-dialog-content>
      <p>Confirmar pago total para: {{ data.title || data.uname || data.nombre || data.element?.nombre }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="submit()">Confirmar</button>
    </mat-dialog-actions>
  `,
})
export class DialogPagoTotalComponent {
  
  /**
   * Constructor del diálogo
   * @param http - Cliente HTTP para peticiones
   * @param fb - FormBuilder (no usado actualmente)
   * @param dialogRef - Referencia al diálogo
   * @param data - Datos del pago pasados al diálogo
   */
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogPagoTotalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Datos recibidos en el diálogo:', data.cedula || data.element?.cedula);
    console.log('Monto total:', data.total_a_pagar || data.element?.total_a_pagar || data.total || 0);
  }

  /**
   * Procesa el pago total
   * 
   * Endpoint: /php/comisiones/pago_comisiones.php
   * Método: POST
   * 
   * Valida el monto y la cédula antes de enviar la petición
   */
  submit(): void {
    // Obtener monto con fallback a múltiples propiedades
    const monto =
      this.data?.total ??
      this.data?.total_a_pagar ??
      this.data?.element?.total_a_pagar ??
      0;

    // Validar monto
    if (monto <= 0) {
      console.error('Monto inválido');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El monto a pagar es inválido.'
      });
      return;
    }

    // Obtener cédula
    const cedula =
      this.data?.cedula ??
      this.data?.element?.cedula ??
      '';

    // Validar cédula
    if (!cedula) {
      console.error('Cédula no proporcionada');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo identificar la cédula del usuario.'
      });
      return;
    }

    // Realizar petición HTTP
    this.http.post('https://neocompanyapp.com/php/comisiones/pago_comisiones.php', {
      monto,
      cedula
    }).subscribe({
      next: (response) => {
        // Mostrar notificación de éxito
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
        
        // Cerrar diálogo con resultado positivo
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error al procesar el pago:', error);
        
        // Mostrar error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo procesar el pago. Intente más tarde.'
        });
      }
    });
  }
}

// ============================================
// COMPONENTE DE DIÁLOGO: ABONAR
// ============================================

/**
 * Diálogo para abonar un monto parcial a una comisión
 * 
 * @component
 * @standalone
 */
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
  
  /**
   * Constructor del diálogo
   * @param dialogRef - Referencia al diálogo
   * @param data - Datos del pago pasados al diálogo
   * @param http - Cliente HTTP para peticiones
   * @param router - Router (no usado actualmente)
   */
  constructor(
    public dialogRef: MatDialogRef<DialogAbonarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * Procesa el abono parcial
   * 
   * Endpoint: /php/comisiones/pago_comisiones.php
   * Método: POST
   * 
   * @param montoV - Monto a abonar como string
   */
  confirmarAbono(montoV: string): void {
    // Convertir a número
    const monto = parseFloat(montoV);

    // Validar monto
    if (isNaN(monto) || monto <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Monto inválido',
        text: 'Por favor ingrese un monto válido mayor a cero.'
      });
      return;
    }

    // Realizar petición HTTP
    this.http.post('https://neocompanyapp.com/php/comisiones/pago_comisiones.php', {
      id: this.data.id,
      monto: monto,
      cedula: this.data.cedula,
    }).subscribe({
      next: (response) => {
        // Mostrar notificación de éxito
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
        
        // Cerrar diálogo con resultado positivo
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error al registrar abono:', error);
        
        // Mostrar error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el abono. Intente más tarde.'
        });
      }
    });
  }
}