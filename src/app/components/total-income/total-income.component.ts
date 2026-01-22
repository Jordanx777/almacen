import { Component, ViewChild, Pipe, OnInit } from '@angular/core';
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
import { C } from '@angular/cdk/scrolling-module.d-ud2XrbF8';
import { CommonModule } from '@angular/common';
import { I } from '@angular/cdk/a11y-module.d-DBHGyKoh';



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
    imports: [CommonModule, MaterialModule, NgApexchartsModule, MatButtonModule, TablerIconsModule],
    templateUrl: './total-income.component.html',
})
export class AppTotalIncomeComponent implements OnInit {
    totalSalidas: number = 0;

    @ViewChild('chart') chart: ChartComponent = Object.create(null);
    public totalincomeChart!: Partial<totalincomeChart> | any;





    constructor(private http: HttpClient) {

    }


    sessionObj: any;
    usuario: any;
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        const session = localStorage.getItem('session');
        if (session) {
            this.sessionObj = JSON.parse(session);
            console.log('Usuario en sesión desde taxista:', this.sessionObj.user.username);
            console.log('ID de usuario:', this.sessionObj.user.company_name);
            console.log('Company code:', this.sessionObj.user.company_code);
            this.usuario = this.sessionObj.user.company_code;

        } else {
            console.log('No hay usuario en sesión');
        }
        this.grafica();
        this.obtenerDatosUsuario();
        this.datosGrafica();
        // this.grafica();
    }
    url = 'https://neocompanyapp.com/php/taxistas/obtener_datos_u.php';
    datos: any;
    taxistas: any;
    comisiones: any;
    obtenerDatosUsuario() {
        const companyCode = this.usuario;

        this.http.get<any>(`${this.url}?company_code=${companyCode}`).subscribe({
            next: (data) => {
                console.log('Conteo de taxistas:', data.total);
                this.taxistas = data.total;
                this.comisiones = data.comisiones;
                this.totalSalidas = data.datos2;
            },
            error: (err) => {
                console.error('Error al obtener datos:', err);
            }
        });
    }

    datosGrafica() {
        this.http.get<any[]>('https://neocompanyapp.com/php/comisiones/reportes_pagos.php', {}).subscribe(data => {
            if (data && data.length > 0) {
                // this.totalincomeChart.series[0].data = data.map(item => item.nombre); // Asignar el nombre del taxista
                this.totalincomeChart.series[0].data = data.map(
                    // item => item.nombre, // Asignar el nombre del taxista
                    item => item.total_a_pagar
                );
                // this.totalincomeChart.xaxis.categories = data.map(item => item.fecha);
            } else {
                console.warn('No se encontraron datos para la gráfica');
                this.totalincomeChart.series[0].data = [];
                // this.totalincomeChart.xaxis.categories = [];
            }
        });
    }

    grafica() {
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
                    // name: "Total Income",
                    color: "#16cdc7",
                    // data: [250, 660, 200, 400, 120, 580, 200],

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
