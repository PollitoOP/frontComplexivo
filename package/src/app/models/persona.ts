import { Usuario } from "./usuario";
export class Persona {
  idPersona: number = 0;
  idProductoPersona: number = 0;
  cedula: string = '';
  nombrePer: string = '';
  apellidoPer: string = '';
  direccionPer: string = '';
  emailPer: string = '';
  telefonoPer: string = '';
  fechaNacimiento: Date = new Date();
  fotoUrl: string = '';
  fotoPath: string = '';
  usuarios: Usuario[] = []; 
}
