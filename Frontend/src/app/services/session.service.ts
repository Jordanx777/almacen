import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { UserData } from '../pages/ui-components/tables/tabla-taxistas.component';
// import { UserData } from '../pages/ui-components/tables/tabla-reservas.component';

interface UserData {
  username: string;
  email: string;
  password: string;
  telefono: number;
  company_name: string; // Opcional, solo para taxistas
  // numero_placa?: string; // Opcional, solo para taxistas
  // cantidadpersonas?: number; // Opcional, solo para reservas
  // lugar?: string; // Opcional, solo para reservas
  // fecha?: string; // Opcional, solo para reservas
  // hora?: string; // Opcional, solo para reservas
}


@Injectable({ providedIn: 'root' })
export class SessionService {
  constructor(private http: HttpClient) { }

  /** Verifica si hay un usuario logueado en localStorage */
  checkSession(): { loggedIn: boolean; user?: UserData } {
    // const user = JSON.parse(localStorage.getItem('user'));
    // console.log(user.company_name); // ¿Aquí qué sale?

    const storedUser = localStorage.getItem('session');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as UserData;
        return { loggedIn: true, user };
      } catch (e) {
        console.error('Error al parsear user en localStorage', e);
        return { loggedIn: false };
      }
    }
    return { loggedIn: false };
  }

  /** Retorna los datos del usuario desde localStorage */
  getSessionData(): UserData | null {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  /** Cierra la "sesión" eliminando los datos del localStorage */
  logout(): void {
    localStorage.removeItem('session');
    // localStorage.removeItem('user');
  }


  // session.service.ts
  registrarSalida(accesoId: number) {
    return this.http.post('https://neocompanyapp.com/php/auth/salida.php', { acceso_id: accesoId });
  }

}
