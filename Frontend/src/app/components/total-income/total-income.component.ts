import { Component, ViewChild, OnInit } from '@angular/core';
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
    totalSalidas: number = 0;
    totalincomeChart!: Partial<totalincomeChart> | any;
    sessionObj: any;
    usuario: any;
    taxistas: any;
    comisiones: any;
    datos: any;
    
    @ViewChild('chart') chart: ChartComponent = Object.create(null);

    private readonly API_BASE_URL = 'https://neocompanyapp.com/php';

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.cargarSesion();
        this.inicializarGrafica();
        this.obtenerDatosUsuario();
        this.datosGrafica();
    }

    /**
     * Carga la sesión del localStorage de forma segura
     */
    private cargarSesion(): void {
        try {
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
     * Obtiene los datos del usuario desde el backend
     */
    obtenerDatosUsuario(): void {
        if (!this.usuario) {
            console.warn('No hay company_code disponible');
            return;
        }

        const url = `${this.API_BASE_URL}/taxistas/obtener_datos_u.php`;
        
        this.http.get<any>(`${url}?company_code=${this.usuario}`).subscribe({
            next: (data) => {
                console.log('Datos recibidos:', data);
                this.taxistas = data.total || 0;
                this.comisiones = data.comisiones || 0;
                this.totalSalidas = data.datos2 || 0;
            },
            error: (err) => {
                console.error('Error al obtener datos del usuario:', err);
                // Valores por defecto en caso de error
                this.taxistas = 0;
                this.comisiones = 0;
                this.totalSalidas = 0;
            }
        });
    }

    /**
     * Obtiene los datos para la gráfica
     */
    datosGrafica(): void {
        const url = `${this.API_BASE_URL}/comisiones/reportes_pagos.php`;
        
        this.http.get<any[]>(url).subscribe({
            next: (data) => {
                if (data && Array.isArray(data) && data.length > 0) {
                    // Actualizar los datos de la serie
                    this.totalincomeChart.series[0].data = data.map(
                        item => item.total_a_pagar || 0
                    );
                    console.log('Datos de gráfica cargados:', data.length, 'registros');
                } else {
                    console.warn('No se encontraron datos para la gráfica');
                    this.totalincomeChart.series[0].data = [];
                }
            },
            error: (err) => {
                console.error('Error al obtener datos de la gráfica:', err);
                this.totalincomeChart.series[0].data = [];
            }
        });
    }

    /**
     * Inicializa la configuración de la gráfica
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
}