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
        // this.cargarReportes();
        
    }
    sessionObj: any;
    companyNameDeseado: any;
    ngOnInit(): void {
        // ✅ Primero obtener la sesión
        const session = localStorage.getItem('session');
        if (session) {
            this.sessionObj = JSON.parse(session);
            this.companyNameDeseado = this.sessionObj.user.company_code;
            console.log('Usuario en sesión:', this.sessionObj.user.username);
            console.log('Company code:', this.companyNameDeseado);
            
            // ✅ Ahora sí cargar los reportes
            this.cargarReportes();
        } else {
            console.log('No hay usuario en sesión');
        }
    }


    cargarReportes() {
        // ✅ Verificar que tengamos el company_code antes de filtrar
        if (!this.companyNameDeseado) {
            console.error('No hay company_code para filtrar');
            return;
        }

        this.http.get<stats[]>(this.apiUrl).subscribe({
            next: (response) => {
                if (Array.isArray(response)) {
                    this.stats = response.filter(item => 
                        item.company_code === this.companyNameDeseado
                    );
                    console.log('Datos filtrados:', this.stats);
                } else {
                    this.stats = [];
                    console.error('Respuesta no es un array:', response);
                }
            },
            error: (error) => {
                console.error('Error al cargar reportes:', error);
                this.stats = [];
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
