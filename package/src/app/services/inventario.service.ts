import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from '../models/inventario';
import { environment } from '../pages/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

    private apiUrl = `${environment.apiUrl}/inventarios`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.apiUrl}`);
  }
}
