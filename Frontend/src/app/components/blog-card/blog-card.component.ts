import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TablerIconsModule } from 'angular-tabler-icons';

interface cardimgs {
  id: number;
  time: string;
  imgSrc: string;
  nombre: string;
  views: string;
  category: string;
  comments: number;
  date: string;
  sexo: 'femenino' | 'masculino';
}

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    TablerIconsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './blog-card.component.html',
})
export class AppBlogCardsComponent implements OnInit {

  sexo: string = 'femenino';

  // Lista filtrable y lista original
  cardimgs: cardimgs[] = [];
  allCardimgs: cardimgs[] = [];

  imagenesPorId: { [key: number]: number } = {};
  trackById(index: number, item: cardimgs) {
    return item.id;
  }

 constructor(private http: HttpClient) {}

private apiUrlBuscar = 'https://neocompanyapp.com/php/taxistas/get_taxistas.php';
// private apiUrlBuscar = 'http://localhost/php/taxistas/get_taxistas.php';
private apiUrlAgregar = 'https://neocompanyapp.com/php/taxistas/guardar_taxistas.php';
ngOnInit(): void {
  this.http.get<cardimgs[]>(this.apiUrlBuscar).subscribe({
    next: (data) => {
      // Validar que data sea un array y tenga elementos
      if (Array.isArray(data) && data.length > 0) {
        this.cardimgs = data;
        this.allCardimgs = data;

        // Asignar imágenes según sexo
        for (let card of this.cardimgs) {
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
      } else {
        // Si no hay registros o la respuesta no es válida, limpiar arrays para evitar errores
        this.cardimgs = [];
        this.allCardimgs = [];
        console.warn('No se encontraron registros o la respuesta es inválida');
      }
    },
    error: (err) => {
      // Manejo de error en la llamada HTTP
      console.error('Error al obtener datos:', err);
      this.cardimgs = [];
      this.allCardimgs = [];
    }
  });
}

  buscar(bus: string): void {
    console.log('Buscando:', bus);

    if (bus && bus.trim() !== '') {
      this.cardimgs = this.allCardimgs.filter((card) =>
        card.nombre.toLowerCase().includes(bus.toLowerCase())
      );
    } else {
      // Restauramos todas las tarjetas si no hay texto
      this.cardimgs = [...this.allCardimgs];
    }
  }
}
