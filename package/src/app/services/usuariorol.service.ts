import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioRol } from '../models/usuariorol';
import { environment } from '../pages/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioRolService {
  private apiUrl = `${environment.apiUrl}/usuariorol`;

  constructor(private http: HttpClient) {}

  listar(): Observable<UsuarioRol[]> {
    return this.http.get<UsuarioRol[]>(this.apiUrl);
  }

  buscar(id: number): Observable<UsuarioRol> {
    return this.http.get<UsuarioRol>(`${this.apiUrl}/${id}`);
  }

  crear(usuarioRol: UsuarioRol): Observable<UsuarioRol> {
    return this.http.post<UsuarioRol>(this.apiUrl, usuarioRol);
  }

  actualizar(id: number, usuarioRol: UsuarioRol): Observable<UsuarioRol> {
    return this.http.put<UsuarioRol>(`${this.apiUrl}/${id}`, usuarioRol);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
