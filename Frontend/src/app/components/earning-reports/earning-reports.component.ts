import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';  // <-- Import necesario para el paginador

interface stats {
    id: number;
    color: string;
    title: string;
    estado: string;
    icon: string;
    pagado: string;
    company_code: string;
}

@Component({
    selector: 'app-earning-reports',
    imports: [CommonModule, MaterialModule, TablerIconsModule],
    templateUrl: './earning-reports.component.html',
    standalone: true
})
export class AppEarningReportsComponent {
    stats: stats[] = [];
    private apiUrl = 'https://neocompanyapp.com/php/comisiones/tabla_comisiones.php';

    // Variables para paginación
    pageSize = 5;              // items por página
    currentPage = 1;           // página actual

    constructor(private http: HttpClient) {
        this.cargarReportes();
    }
    sessionObj: any;
    companyNameDeseado: any;
    ngOnInit(): void {
        this.cargarReportes();
        const session = localStorage.getItem('session');
        if (session) {
            this.sessionObj = JSON.parse(session);
            console.log('Usuario en sesión desde comisiones:', this.sessionObj.user.username);
            console.log('ID de usuario desde comisiones:', this.sessionObj.user.company_code);
        } else {
            console.log('No hay usuario en sesión');
        }
        this.companyNameDeseado = this.sessionObj.user.company_code;
    }

    cargarReportes() {
        this.http.get<stats[]>(this.apiUrl).subscribe((response) => {
            if (Array.isArray(response)) {
                this.stats = response.filter(item => item.company_code === this.companyNameDeseado);
                // this.dataSource.data = filtrados;
                console.log('Datos cargados:', this.stats);
            } else {
                this.stats = [];
                console.error('Error al cargar los datos:', response);
            }
        });
    }

    // Total de páginas según datos y pageSize
    get totalPages(): number {
        return Math.ceil(this.stats.length / this.pageSize);
    }

    // Obtener solo los elementos visibles en la página actual
    get pagedStats(): stats[] {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return this.stats.slice(startIndex, startIndex + this.pageSize);
    }

    // Cambiar página asegurando no salir de límites
    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
    }

    // TrackBy para optimizar ngFor
    trackByTitle(index: number, item: stats): string {
        return item.title;
    }

    // *** Método para manejar el evento de paginador de Angular Material ***
    onPageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex + 1; // pageIndex es 0-based, por eso sumamos 1
    }
}
