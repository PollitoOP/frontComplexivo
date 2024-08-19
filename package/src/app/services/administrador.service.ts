import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Administrador } from '../models/administrador';  
import { environment } from '../pages/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdministradorService {
  private apiUrl = `${environment.apiUrl}/administradores`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Administrador[]> {
    return this.http.get<Administrador[]>(this.apiUrl);
  }

  buscar(id: number): Observable<Administrador> {
    return this.http.get<Administrador>(`${this.apiUrl}/${id}`);
  }

  crear(administrador: Administrador): Observable<Administrador> {
    return this.http.post<Administrador>(this.apiUrl, administrador);
  }

  actualizar(id: number, administrador: Administrador): Observable<Administrador> {
    return this.http.put<Administrador>(`${this.apiUrl}/${id}`, administrador);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
