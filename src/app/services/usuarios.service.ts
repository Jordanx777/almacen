import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface UsuarioData {
  id: number;
  usuario: string;
  estado: string;
  fechaRegistro: Date;
  fechaVencimiento: Date;
  ultimoAcceso: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
//   private apiUrl = 'https://neocompanyapp.com/php/usuarios/listar_usuarios.php'; // Ajusta la ruta real
    private apiUrl = 'https://neocompanyapp.com/php/usuario/listar_usuarios.php'; // Ajusta la ruta real
  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<UsuarioData[]> {
  return this.http.get<any>(this.apiUrl).pipe(
    map(respuesta => respuesta.data)
  );
}
}
