import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core'; // ✅ CAMBIO: Agregado ChangeDetectorRef
import { MaterialModule } from '../../material.module';
import {
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexLegend,
    ApexStroke,
    ApexTooltip,
    ApexAxisChartSeries,
    ApexPlotOptions,
    ApexResponsive,
    ApexGrid,
    ApexFill,
    ApexMarkers,
    ApexXAxis,
    ApexYAxis,
    NgApexchartsModule,
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

export interface totalincomeChart {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    responsive: ApexResponsive;
    grid: ApexGrid;
    fill: ApexFill;
    markers: ApexMarkers;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    colors: string | any;
}

/**
 * Componente que muestra el ingreso total y estadísticas del usuario
 * 
 * Características:
 * - Muestra gráfica de ingresos usando ApexCharts
 * - Obtiene datos del usuario desde el backend
 * - Previene errores de detección de cambios de Angular
 * 
 * @component
 * @standalone
 */
@Component({
    selector: 'app-total-income',
    standalone: true,
    imports: [
        CommonModule, 
        MaterialModule, 
        NgApexchartsModule, 
        MatButtonModule, 
        TablerIconsModule
    ],
    templateUrl: './total-income.component.html',
})
export class AppTotalIncomeComponent implements OnInit {
    // ============================================
    // PROPIEDADES
    // ============================================
    
    /** Total de salidas registradas */
    totalSalidas: number = 0;
    
    /** Configuración de la gráfica de ingresos */
    totalincomeChart!: Partial<totalincomeChart> | any;
    
    /** Objeto de sesión del localStorage */
    sessionObj: any;
    
    /** Company code del usuario actual */
    usuario: any;
    
    /** Número total de taxistas */
    taxistas: any;
    
    /** Total de comisiones */
    comisiones: any;
    
    /** Datos adicionales */
    datos: any;
    
    /** Referencia al componente de gráfica */
    @ViewChild('chart') chart: ChartComponent = Object.create(null);

    /** URL base de la API */
    private readonly API_BASE_URL = 'https://neocompanyapp.com/php';

    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    /**
     * Constructor del componente
     * @param http - Cliente HTTP para realizar peticiones
     * @param cdr - ChangeDetectorRef para manejar detección de cambios manual
     */
    constructor(
        private http: HttpClient,
        private cdr: ChangeDetectorRef // ✅ CAMBIO: Inyectado ChangeDetectorRef
    ) {}

    // ============================================
    // CICLO DE VIDA
    // ============================================
    
    /**
     * Inicialización del componente
     * 
     * ✅ CAMBIO: Se movió la carga de datos a setTimeout para evitar NG0100
     * 
     * Orden de ejecución:
     * 1. Inicializar configuración de gráfica (síncrono)
     * 2. Cargar sesión del localStorage (síncrono)
     * 3. Diferir carga de datos al siguiente ciclo (asíncrono)
     */
    ngOnInit(): void {
        // 1. Primero inicializar la gráfica (no modifica binding)
        this.inicializarGrafica();
        
        // 2. Cargar sesión
        this.cargarSesion();
        
        // ✅ CAMBIO: Diferir la carga de datos al siguiente ciclo del event loop
        // Esto previene el error NG0100 al permitir que Angular complete
        // la primera verificación de cambios antes de modificar el estado
        setTimeout(() => {
            this.obtenerDatosUsuario();
            this.datosGrafica();
        }, 0);
    }

    // ============================================
    // MÉTODOS PRIVADOS
    // ============================================

    /**
     * Carga la sesión del localStorage de forma segura
     * 
     * Maneja errores y verifica la existencia de localStorage
     * (importante para SSR o entornos sin window)
     */
    private cargarSesion(): void {
        try {
            // Verificar que localStorage esté disponible
            if (typeof localStorage !== 'undefined') {
                const session = localStorage.getItem('session');
                
                if (session) {
                    this.sessionObj = JSON.parse(session);
                    this.usuario = this.sessionObj?.user?.company_code;
                    
                    console.log('Usuario en sesión:', this.sessionObj.user.username);
                    console.log('Company code:', this.usuario);
                } else {
                    console.warn('No hay usuario en sesión');
                }
            }
        } catch (error) {
            console.error('Error al cargar sesión:', error);
        }
    }

    /**
     * Inicializa la configuración de la gráfica ApexCharts
     * 
     * Define el estilo, colores, tooltips y comportamiento de la gráfica
     * Los datos se cargan posteriormente en datosGrafica()
     */
    private inicializarGrafica(): void {
        this.totalincomeChart = {
            chart: {
                id: "total-income",
                type: "area",
                height: 75,
                sparkline: {
                    enabled: true,
                },
                group: "sparklines",
                fontFamily: "inherit",
                foreColor: "#adb0bb",
            },
            series: [
                {
                    name: "Total a Pagar",
                    color: "#16cdc7",
                    data: [], // Se llenará con datosGrafica()
                },
            ],
            stroke: {
                curve: "smooth",
                width: 2,
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 0,
                    inverseColors: false,
                    opacityFrom: 0,
                    opacityTo: 0,
                    stops: [20, 180],
                },
            },
            markers: {
                size: 0,
            },
            tooltip: {
                theme: "dark",
                fixed: {
                    enabled: true,
                    position: "right",
                },
                x: {
                    show: false,
                },
            },
        };
    }

    // ============================================
    // MÉTODOS PÚBLICOS - API CALLS
    // ============================================

    /**
     * Obtiene los datos del usuario desde el backend
     * 
     * ✅ CAMBIO: Agregado detectChanges() para forzar actualización de la vista
     * 
     * Endpoint: /php/taxistas/obtener_datos_u.php
     * Parámetros: company_code del usuario
     * 
     * Actualiza:
     * - taxistas: Total de taxistas
     * - comisiones: Total de comisiones
     * - totalSalidas: Total de salidas registradas
     */
    obtenerDatosUsuario(): void {
        // Validar que existe el company_code
        if (!this.usuario) {
            console.warn('No hay company_code disponible');
            return;
        }

        const url = `${this.API_BASE_URL}/taxistas/obtener_datos_u.php`;
        
        this.http.get<any>(`${url}?company_code=${this.usuario}`).subscribe({
            next: (data) => {
                console.log('Datos recibidos:', data);
                
                // Asignar datos con valores por defecto
                this.taxistas = data.total || 0;
                this.comisiones = data.comisiones || 0;
                this.totalSalidas = data.datos2 || 0;
                
                // ✅ CAMBIO: Forzar detección de cambios
                // Esto asegura que la vista se actualice correctamente
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al obtener datos del usuario:', err);
                
                // Valores por defecto en caso de error
                this.taxistas = 0;
                this.comisiones = 0;
                this.totalSalidas = 0;
                
                // ✅ CAMBIO: Detectar cambios también en error
                this.cdr.detectChanges();
            }
        });
    }

    /**
     * Obtiene los datos para poblar la gráfica de ingresos
     * 
     * ✅ CAMBIO: Agregado detectChanges() después de actualizar la serie
     * 
     * Endpoint: /php/comisiones/reportes_pagos.php
     * 
     * Actualiza la serie de datos de la gráfica con los valores
     * de 'total_a_pagar' de cada registro
     */
    datosGrafica(): void {
        const url = `${this.API_BASE_URL}/comisiones/reportes_pagos.php`;
        
        this.http.get<any[]>(url).subscribe({
            next: (data) => {
                if (data && Array.isArray(data) && data.length > 0) {
                    // Actualizar los datos de la serie de la gráfica
                    this.totalincomeChart.series[0].data = data.map(
                        item => item.total_a_pagar || 0
                    );
                    
                    console.log('Datos de gráfica cargados:', data.length, 'registros');
                    
                    // ✅ CAMBIO: Forzar actualización de la gráfica
                    this.cdr.detectChanges();
                } else {
                    console.warn('No se encontraron datos para la gráfica');
                    this.totalincomeChart.series[0].data = [];
                    
                    // ✅ CAMBIO: Detectar cambios en array vacío
                    this.cdr.detectChanges();
                }
            },
            error: (err) => {
                console.error('Error al obtener datos de la gráfica:', err);
                this.totalincomeChart.series[0].data = [];
                
                // ✅ CAMBIO: Detectar cambios también en error
                this.cdr.detectChanges();
            }
        });
    }
}