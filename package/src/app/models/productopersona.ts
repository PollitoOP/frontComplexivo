import { Persona } from './persona';
import { Producto } from './producto';

export class ProductoPersona {
  idProductoPersona: number = 0;
  idPersona: number = 0;
  idProducto: number = 0;
  Persona: Persona = new Persona;
  Producto: Producto = new Producto;
}
