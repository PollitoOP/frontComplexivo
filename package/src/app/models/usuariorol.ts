import { Rol } from './rol';
import { Usuario } from './usuario';

export class UsuarioRol {
  idUsuarioRol: number = 0;
  idRol: number = 0;
  idUsuario: number = 0;
  Usuario: Usuario = new Usuario;
  Rol: Rol = new Rol;
}
