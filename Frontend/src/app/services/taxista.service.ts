// taxista.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

 interface Taxista {
  nombre: string;
  cedula: number;
  telefono: number;
  numero_placa: string;
  sexo: string;
  fecha_nacimiento: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class TaxistaService {
  private apiUrl = 'https://neocompanyapp.com/php/taxistas/guardar_taxistas.php';
  // private apiUrl = 'http://localhost/php/taxistas/guardar_taxistas.php';
  // private apiUrl = 'http://localhost/php/taxistas/guardar_taxistas.php';

  constructor(private http: HttpClient) { }

  guardarTaxista(data: any) {
    return this.http.post(this.apiUrl, data);
  }

 obtenerTaxistaPorCedula(cedula: string): Observable<any> {
  return this.http.post<any>('https://neocompanyapp.com/php/comisiones/buscar_taxistas.php', {
    cedula: cedula
  });
}


actualizarTaxista(data: Taxista): Observable<any> {
  return this.http.put(`https://neocompanyapp.com/php/taxistas/actualizar_taxistas.php`, data);
}

eliminarTaxista(cedula: string): Observable<any> {
  return this.http.delete(`https://neocompanyapp.com/php/taxistas/eliminar_taxistas.php?cedula=${cedula}`);
}


  obtenerTaxistas(): Observable<Taxista[]> {
    return this.http.get<Taxista[]>(this.apiUrl);
  }

}
