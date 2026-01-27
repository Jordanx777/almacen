import { Component, ViewChild, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexLegend,
    ApexStroke,
    ApexTooltip,
    ApexAxisChartSeries,
    ApexPlotOptions,
    NgApexchartsModule,
    ApexFill,
    ApexGrid,
    ApexXAxis,
    ApexYAxis,
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface salesprofitChart {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    fill: ApexFill;
    grid: ApexGrid;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
}

interface month {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-sales-profit',
    standalone: true,  // ← AGREGAR standalone
    imports: [
        MaterialModule, 
        TablerIconsModule, 
        NgApexchartsModule, 
        MatButtonModule, 
        CommonModule
    ],
    templateUrl: './sales-profit.component.html',
})
export class AppSalesProfitComponent implements OnInit {
    @ViewChild('chart') chart: ChartComponent = Object.create(null);
    public salesprofitChart!: Partial<salesprofitChart> | any;

    months: month[] = [
        { value: 'enero', viewValue: 'Ene' },
        { value: 'febrero', viewValue: 'Feb' },
        { value: 'marzo', viewValue: 'Mar' },
        { value: 'abril', viewValue: 'Abr' },
        { value: 'mayo', viewValue: 'May' },
        { value: 'junio', viewValue: 'Jun' },
        { value: 'julio', viewValue: 'Jul' },
        { value: 'agosto', viewValue: 'Ago' },
        { value: 'septiembre', viewValue: 'Sep' },
        { value: 'octubre', viewValue: 'Oct' },
        { value: 'noviembre', viewValue: 'Nov' },
        { value: 'diciembre', viewValue: 'Dic' },
    ];

    constructor() {}

    ngOnInit(): void {
        this.inicializarGrafica();
    }

    private inicializarGrafica(): void {
        this.salesprofitChart = {
            series: [
                {
                    name: "Este Año",
                    type: "area",
                    data: [25, 25, 10, 10, 45, 45, 75, 70, 35],
                },
                {
                    name: "Año Pasado",
                    type: "line",
                    data: [50, 50, 25, 20, 20, 20, 35, 35, 60],
                },
            ],
            chart: {
                height: 320,
                type: 'area',
                fontFamily: "inherit",
                foreColor: "#adb0bb",
                fontSize: "12px",
                offsetX: -15,
                offsetY: 10,
                animations: {
                    speed: 500,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ["#00A1FF", "#8965E5"],
            dataLabels: {
                enabled: false,
            },
            fill: {
                opacity: 0.1,
                type: 'solid',
            },
            grid: {
                show: true,
                strokeDashArray: 3,
                borderColor: "#90A4AE50",
            },
            stroke: {
                curve: "smooth",
                width: 2,
            },
            xaxis: {
                categories: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
            },
            yaxis: {
                tickAmount: 3,
            },
            legend: {
                show: true,
                position: 'top',
            },
            tooltip: {
                theme: "dark",
            },
        };
    }
}