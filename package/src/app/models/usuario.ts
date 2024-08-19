import { Persona } from './persona';
import { UsuarioRol } from './usuariorol';

export class Usuario {
  idUsuario: number = 0;
  idPersona: number = 0;
  usuario: string = '';
  password: string = '';
  persona: Persona = new Persona();
  usuarioRol: UsuarioRol[] = [];
}
