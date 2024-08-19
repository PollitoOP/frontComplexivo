import { Categoria } from './categoria';

export class Producto {
  idProducto: number = 0;
  nombrePro: string = '';
  descripcionPro: string = '';
  tallaPro: number = 0;
  precioPro: number = 0;
  estadoPro: boolean = true;
  fotoUrl: string = '';
  fotoPath: string = '';
  idCategoria: number = 0;
  idInventario: number = 0;
  idProductoPersona: number = 0;
  categoria: Categoria = new Categoria; 
}
