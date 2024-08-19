import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from 'src/app/services/persona.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioRolService } from 'src/app/services/usuariorol.service';
import { AssetService } from 'src/app/services/asset.service';
import Swal from 'sweetalert2';
import { Persona } from 'src/app/models/persona';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioRol } from 'src/app/models/usuariorol';

@Component({
  selector: 'app-form-persona',
  templateUrl: './form.component.html',
  styleUrls: ['./persona.component.css'],
})
export class FormPersonaComponent implements OnInit {
  public titulo: string = 'Nueva Persona';
  nuevaImagenFile: File | undefined;
  public persona: Persona = new Persona();
  public usuario: Usuario = new Usuario();
  today: Date = new Date();
  public cedulaExistente: boolean = false;

  constructor(
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private usuarioRolService: UsuarioRolService,
    private assetService: AssetService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarPersona();
  }

  cargarPersona(): void {
    this.activatedRoute.params.subscribe((params) => {
      const idPersona = params['idPersona'];
      if (idPersona) {
        this.titulo = 'Editar Personal';
        this.personaService.buscar(idPersona).subscribe((persona) => {
          this.persona = persona;
          if (this.persona.usuarios && this.persona.usuarios.length > 0) {
            this.usuario = this.persona.usuarios[0];
          }
        });
      }
    });
  }

  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    return date ? date <= today : false;
  };

  validarFormulario(): boolean {
    const {
      cedula,
      nombrePer,
      apellidoPer,
      direccionPer,
      emailPer,
      telefonoPer,
      fechaNacimiento,
    } = this.persona;
    
    if (
      !cedula ||
      !nombrePer ||
      !apellidoPer ||
      !direccionPer ||
      !emailPer ||
      !telefonoPer ||
      !fechaNacimiento
    ) {
      return false;
    }

    // Validar longitud de cédula y teléfono
    if (cedula.length !== 10 || telefonoPer.length !== 10) {
      return false;
    }
    return true;
  }

  crear(): void {
    if (!this.validarFormulario()) {
      Swal.fire('Error', 'Complete todos los campos.', 'error');
      return;
    }

    if (this.nuevaImagenFile) {
      this.assetService.uploadImage(this.nuevaImagenFile).subscribe(
        (response) => {
          this.persona.fotoUrl = response.url;
          this.persona.fotoPath = response.key;
          this.guardarPersona();
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
          Swal.fire('Error', 'No se pudo subir la imagen.', 'error');
        }
      );
    } else {
      this.guardarPersona();
    }
  }

  guardarPersona(): void {
    // Asegura que idProductoPersona siempre sea 1
    this.persona.idProductoPersona = 1;

    if (this.persona.idPersona) {
      // Actualizar persona existente
      this.personaService
        .actualizar(this.persona.idPersona, this.persona)
        .subscribe(
          () => {
            this.guardarUsuarioYRol(); // Llama al método para actualizar los datos del usuario
          },
          (error) => {
            console.error('Error al actualizar persona:', error);
            Swal.fire('Error', 'No se pudo actualizar la persona.', 'error');
          }
        );
    } else {
      // Crear nueva persona
      this.personaService.crear(this.persona).subscribe(
        (personaCreada) => {
          this.persona = personaCreada;
          this.guardarUsuarioYRol(); // Crear usuario y rol después de crear la persona
        },
        (error) => {
          console.error('Error al crear persona:', error);
          Swal.fire('Error', 'No se pudo guardar la persona.', 'error');
        }
      );
    }
  }

  guardarUsuarioYRol(): void {
    // Asignar idPersona al usuario
    this.usuario.idPersona = this.persona.idPersona;

    if (this.usuario.idUsuario) {
      // Actualizar usuario existente
      this.usuarioService
        .actualizar(this.usuario.idUsuario, this.usuario)
        .subscribe(
          () => {
            this.router.navigate(['/ui-components/personas']);
            Swal.fire(
              '¡Acción exitosa!',
              `Usuario ${this.usuario.usuario} actualizado con éxito.`,
              'success'
            );
          },
          (error) => {
            console.error('Error al actualizar usuario:', error);
            Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
          }
        );
    } else {
      // Crear nuevo usuario si no existe
      this.usuarioService.crear(this.usuario).subscribe(
        (usuarioCreado) => {
          this.usuario = usuarioCreado;

          // Crear la relación UsuarioRol con idRol = 2
          const usuarioRol = new UsuarioRol();
          usuarioRol.idUsuario = this.usuario.idUsuario;
          usuarioRol.idRol = 2; // Rol "Personal"

          this.usuarioRolService.crear(usuarioRol).subscribe(
            () => {
              this.router.navigate(['/ui-components/personas']);
              Swal.fire(
                '¡Acción exitosa!',
                `Persona y usuario ${this.usuario.usuario} creados con éxito.`,
                'success'
              );
            },
            (error) => {
              console.error('Error al crear usuario-rol:', error);
              Swal.fire(
                'Error',
                'No se pudo asignar el rol al usuario.',
                'error'
              );
            }
          );
        },
        (error) => {
          console.error('Error al crear usuario:', error);
          Swal.fire('Error', 'No se pudo guardar el usuario.', 'error');
        }
      );
    }
  }

  actualizarUsuario(): void {
    // Asignar idPersona al usuario
    this.usuario.idPersona = this.persona.idPersona;
  
    if (this.usuario.idUsuario) {
      // Solo actualizamos los campos usuario y password en el objeto usuario existente
      const usuarioActualizado: Usuario = {
        ...this.usuario, // Mantén el resto de los datos como están
        usuario: this.usuario.usuario,
        password: this.usuario.password
      };
  
      // Actualizar usuario existente
      this.usuarioService
        .actualizar(this.usuario.idUsuario, usuarioActualizado)
        .subscribe(
          () => {
            this.router.navigate(['/ui-components/personas']);
            Swal.fire(
              '¡Acción exitosa!',
              `Usuario ${this.usuario.usuario} actualizado con éxito.`,
              'success'
            );
          },
          (error) => {
            console.error('Error al actualizar usuario:', error);
            Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
          }
        );
    } else {
      // Crear nuevo usuario si no existe
      this.usuarioService.crear(this.usuario).subscribe(
        (usuarioCreado) => {
          this.usuario = usuarioCreado;
  
          // Crear la relación UsuarioRol con idRol = 2
          const usuarioRol = new UsuarioRol();
          usuarioRol.idUsuario = this.usuario.idUsuario;
          usuarioRol.idRol = 2; // Rol "Personal"
  
          this.usuarioRolService.crear(usuarioRol).subscribe(
            () => {
              this.router.navigate(['/ui-components/personas']);
              Swal.fire(
                '¡Acción exitosa!',
                `Persona y usuario ${this.usuario.usuario} creados con éxito.`,
                'success'
              );
            },
            (error) => {
              console.error('Error al crear usuario-rol:', error);
              Swal.fire(
                'Error',
                'No se pudo asignar el rol al usuario.',
                'error'
              );
            }
          );
        },
        (error) => {
          console.error('Error al crear usuario:', error);
          Swal.fire('Error', 'No se pudo guardar el usuario.', 'error');
        }
      );
    }
  }
  

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.nuevaImagenFile = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.persona.fotoUrl = e.target.result;
        this.persona.fotoPath = e.target.result;
      };
      reader.readAsDataURL(files[0]);
    }
  }

  volver(): void {
    Swal.fire({
      title: '¿Desea volver a la pantalla anterior?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, volver',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/ui-components/personas']);
      }
    });
  }
}
