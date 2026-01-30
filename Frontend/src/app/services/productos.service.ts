import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = 'http://localhost/almacen-backend'; // Cambia esta URL según tu backend

  constructor(private http: HttpClient) { }

  obtenerProductoPorCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/codigo/${codigo}`);
  }

  guardarProducto(producto: any): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }

  actualizarProducto(producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${producto.id}`, producto);
  }

  listarProductos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
