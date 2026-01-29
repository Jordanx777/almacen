import { Component, ChangeDetectorRef, AfterViewInit } from '@angular/core'; // ✅ CAMBIO: Agregado ChangeDetectorRef y AfterViewInit
import { 
    Router, 
    NavigationStart, 
    NavigationEnd, 
    NavigationCancel, 
    NavigationError, 
    Event, 
    RouterOutlet 
} from '@angular/router';
import { LoaderService } from './services/loader-service.service';
import { LoaderComponent } from './pages/ui-components/cargando/loader.componet';
import { CommonModule } from '@angular/common';

/**
 * Componente raíz de la aplicación
 * 
 * Características:
 * - Maneja el loader global durante la navegación
 * - Escucha eventos del router para mostrar/ocultar el loader
 * - Previene errores de detección de cambios (NG0100)
 * 
 * @component
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        CommonModule,
        LoaderComponent,
        RouterOutlet
    ],
})
export class AppComponent implements AfterViewInit { // ✅ CAMBIO: Agregado implements AfterViewInit
    
    // ============================================
    // PROPIEDADES
    // ============================================
    
    /** Título de la aplicación */
    title = 'Neo Company';
    
    /** Observable del estado de carga desde el servicio */
    isLoading = this.loaderService.isLoading;

    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    /**
     * Constructor del componente raíz
     * 
     * ✅ CAMBIO: Agregado ChangeDetectorRef para manejar detección de cambios
     * 
     * Suscribe a los eventos del router para controlar el loader global
     * 
     * @param router - Servicio de enrutamiento de Angular
     * @param loaderService - Servicio personalizado para manejar el estado del loader
     * @param cdr - ChangeDetectorRef para forzar detección de cambios cuando sea necesario
     */
    constructor(
        private router: Router, 
        private loaderService: LoaderService,
        private cdr: ChangeDetectorRef // ✅ CAMBIO: Inyectado ChangeDetectorRef
    ) {
        // Suscribirse a los eventos de navegación del router
        this.router.events.subscribe((event: Event) => {
            // Cuando inicia la navegación, mostrar el loader
            if (event instanceof NavigationStart) {
                this.loaderService.show();
            } 
            // Cuando termina la navegación (exitosa, cancelada o con error), ocultar el loader
            else if (
                event instanceof NavigationEnd ||
                event instanceof NavigationCancel ||
                event instanceof NavigationError
            ) {
                this.loaderService.hide();
            }
        });
    }

    // ============================================
    // CICLO DE VIDA
    // ============================================
    
    /**
     * Se ejecuta después de que la vista del componente ha sido inicializada
     * 
     * ✅ CAMBIO: Agregado este lifecycle hook para forzar detección de cambios
     * 
     * Esto previene el error NG0100 (ExpressionChangedAfterItHasBeenCheckedError)
     * que puede ocurrir cuando el estado del loader cambia inmediatamente
     * después de que la vista ha sido verificada
     */
    ngAfterViewInit(): void {
        // Forzar una detección de cambios después de que la vista esté inicializada
        // Esto asegura que cualquier cambio en el estado del loader
        // sea detectado correctamente sin causar errores
        this.cdr.detectChanges();
    }
}