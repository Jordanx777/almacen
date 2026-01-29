import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ✅ CAMBIO: Agregado OnInit y ChangeDetectorRef
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

/**
 * Interfaz para los datos de estadísticas de comisiones
 */
interface stats {
    id: number;
    color: string;
    title: string;
    estado: string;
    icon: string;
    pagado: string;
    company_code: string;
}

/**
 * Componente que muestra reportes de comisiones con paginación
 * 
 * Características:
 * - Lista paginada de comisiones
 * - Filtrado por company_code del usuario
 * - Soporte para paginador de Material
 * 
 * @component
 * @standalone
 */
@Component({
    selector: 'app-earning-reports',
    imports: [CommonModule, MaterialModule, TablerIconsModule],
    templateUrl: './earning-reports.component.html',
    standalone: true
})
export class AppEarningReportsComponent implements OnInit { // ✅ CAMBIO: Agregado implements OnInit
    
    // ============================================
    // PROPIEDADES
    // ============================================
    
    /** Lista completa de estadísticas de comisiones */
    stats: stats[] = [];
    
    /** URL del endpoint de la API */
    private apiUrl = 'https://neocompanyapp.com/php/comisiones/tabla_comisiones.php';

    /** Tamaño de página para la paginación */
    pageSize = 5;
    
    /** Página actual (1-indexed) */
    currentPage = 1;
    
    /** Objeto de sesión del localStorage */
    sessionObj: any;
    
    /** Company code del usuario para filtrar datos */
    companyNameDeseado: any;

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
     * Proceso:
     * 1. Cargar sesión del localStorage
     * 2. Obtener company_code del usuario
     * 3. Diferir carga de reportes al siguiente ciclo
     */
    ngOnInit(): void {
        // Obtener la sesión del localStorage
        const session = localStorage.getItem('session');
        
        if (session) {
            try {
                this.sessionObj = JSON.parse(session);
                this.companyNameDeseado = this.sessionObj.user.company_code;
                
                console.log('Usuario en sesión:', this.sessionObj.user.username);
                console.log('Company code:', this.companyNameDeseado);
                
                // ✅ CAMBIO: Diferir la carga de reportes al siguiente ciclo
                // Esto previene el error NG0100 (ExpressionChangedAfterItHasBeenCheckedError)
                setTimeout(() => {
                    this.cargarReportes();
                }, 0);
                
            } catch (error) {
                console.error('Error al parsear sesión:', error);
            }
        } else {
            console.log('No hay usuario en sesión');
        }
    }

    // ============================================
    // MÉTODOS PÚBLICOS - API CALLS
    // ============================================

    /**
     * Carga los reportes de comisiones desde el backend
     * 
     * ✅ CAMBIO: Agregado detectChanges() después de cargar datos
     * 
     * Endpoint: /php/comisiones/tabla_comisiones.php
     * 
     * Filtra los resultados por company_code del usuario actual
     * y actualiza el array stats con los datos filtrados
     */
    cargarReportes(): void {
        // Validar que existe el company_code antes de hacer la petición
        if (!this.companyNameDeseado) {
            console.error('No hay company_code para filtrar');
            return;
        }

        this.http.get<stats[]>(this.apiUrl).subscribe({
            next: (response) => {
                // Verificar que la respuesta sea un array válido
                if (Array.isArray(response)) {
                    // Filtrar por company_code del usuario
                    this.stats = response.filter(item => 
                        item.company_code === this.companyNameDeseado
                    );
                    
                    console.log('Datos filtrados:', this.stats);
                    
                    // ✅ CAMBIO: Forzar detección de cambios
                    // Esto asegura que la vista se actualice correctamente
                    this.cdr.detectChanges();
                } else {
                    // Si no es un array, inicializar como vacío
                    this.stats = [];
                    console.error('Respuesta no es un array:', response);
                    
                    // ✅ CAMBIO: Detectar cambios también en caso de error de formato
                    this.cdr.detectChanges();
                }
            },
            error: (error) => {
                console.error('Error al cargar reportes:', error);
                this.stats = [];
                
                // ✅ CAMBIO: Detectar cambios también en error HTTP
                this.cdr.detectChanges();
            }
        });
    }

    // ============================================
    // GETTERS - PAGINACIÓN
    // ============================================
    
    /**
     * Calcula el total de páginas basado en los datos y el pageSize
     * 
     * @returns Número total de páginas
     */
    get totalPages(): number {
        return Math.ceil(this.stats.length / this.pageSize);
    }

    /**
     * Obtiene solo los elementos visibles en la página actual
     * 
     * Implementa paginación del lado del cliente calculando
     * el índice de inicio y fin basado en la página actual
     * 
     * @returns Array de stats para la página actual
     */
    get pagedStats(): stats[] {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return this.stats.slice(startIndex, startIndex + this.pageSize);
    }

    // ============================================
    // MÉTODOS PÚBLICOS - NAVEGACIÓN
    // ============================================

    /**
     * Navega a una página específica
     * 
     * Valida que la página esté dentro de los límites válidos
     * antes de actualizar currentPage
     * 
     * @param page - Número de página (1-indexed)
     */
    goToPage(page: number): void {
        // Validar límites
        if (page < 1 || page > this.totalPages) {
            return;
        }
        
        this.currentPage = page;
    }

    /**
     * TrackBy function para optimizar el ngFor
     * 
     * Angular usa esta función para identificar elementos únicos
     * y evitar re-renderizados innecesarios
     * 
     * @param index - Índice del elemento
     * @param item - Objeto stats
     * @returns Identificador único del elemento
     */
    trackByTitle(index: number, item: stats): string {
        return item.title;
    }

    /**
     * Maneja el evento de cambio de página del paginador de Material
     * 
     * Se ejecuta cuando el usuario cambia de página o el tamaño de página
     * en el componente mat-paginator
     * 
     * @param event - Evento de paginación de Material con pageSize y pageIndex
     */
    onPageChange(event: PageEvent): void {
        // Actualizar tamaño de página
        this.pageSize = event.pageSize;
        
        // Actualizar página actual (convertir de 0-based a 1-based)
        this.currentPage = event.pageIndex + 1;
    }
}