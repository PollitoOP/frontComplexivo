import { Categoria } from './categoria';
import { Administrador } from './administrador';

export class Habitacion {
  idHabitacion: number = 0;
  numero: number = 0;
  descripcion: string = '';
  precio: number = 0;
  estado: string = '';
  idCategoria: number = 0;
  idAdministrador: number = 0;
  categoria: Categoria = new Categoria; 
  administrador: Administrador = new Administrador; 
}
