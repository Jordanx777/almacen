import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComisionService{
  private baseUrl = 'https://neocompanyapp.com/php/comisiones';
  constructor(private http: HttpClient) { }
  addComision(data: any) {
  return this.http.post(`${this.baseUrl}/addComision.php`, data);
}

updateEstado(id: number, estado: string) {
  return this.http.post(`${this.baseUrl}/updateEstado.php`, { id, estado });
}

getComisiones(cedula: string, estado = '', fechaInicio = '', fechaFin = '') {
  return this.http.get<any[]>(`${this.baseUrl}/get_comisiones.php`, {
    params: { cedula, estado, fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  });
}

}
