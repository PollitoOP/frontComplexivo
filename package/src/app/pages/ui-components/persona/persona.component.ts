import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PersonaService } from 'src/app/services/persona.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioRol } from 'src/app/models/usuariorol';
import { Persona } from 'src/app/models/persona';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
  standalone: true,
  providers: [DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    MatMenuModule,
    MatPaginatorModule,
    MatInputModule,
    RouterModule,
  ],
})
export class PersonaComponent implements OnInit {
  usuarios: Usuario[] = [];
  personas: Persona[] = [];
  usuarioRoles: UsuarioRol[] = [];
  usuariosFiltrados: Usuario[] = [];
  displayedColumns: string[] = [
    'profile',
    'email',
    'direccion',
    'telefono',
    'fechaNacimiento',
    'actions',
  ];
  filtro: string = '';
  message = new FormControl('');

  constructor(
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.usuarioService.listar().subscribe((usuarios) => {
      this.usuarios = usuarios;
  
      this.personaService.listar().subscribe((personas) => {
        this.personas = personas;
  
        // Filtrar los usuarios que tienen el rol "Personal"
        this.usuariosFiltrados = this.usuarios.filter((usuario) => {
          if (usuario.usuarioRol && usuario.usuarioRol.length > 0) {
            // Acceder al primer rol del usuario
            const rolUsuario = usuario.usuarioRol[0];
            // Aquí necesitamos asegurarnos de que el idRol coincide con el idRol del rol "Personal"
            return rolUsuario.idRol === 2; // Cambia 2 por el ID del rol "Personal"
          } else {

            return false;
          }
        });
  
        // Asignar la información de persona a cada usuario filtrado
        this.usuariosFiltrados.forEach((usuario) => {
          const persona = this.personas.find(
            (persona) => persona.idPersona === usuario.idPersona
          );
          if (persona) {
            usuario.persona = persona;
          }
        });

      });
    });
  }
  

  filtrarUsuario(): void {
    this.usuariosFiltrados = this.usuarios.filter((usuario) => {
      const fechaNacimientoFormateada = this.datePipe.transform(
        usuario.persona.fechaNacimiento,
        'dd/MM/yyyy'
      );

      const textoBusqueda = `
            ${usuario.persona.cedula}
            ${usuario.persona.nombrePer} 
            ${usuario.persona.apellidoPer} 
            ${usuario.persona.emailPer} 
            ${usuario.persona.telefonoPer} 
            ${usuario.persona.direccionPer}
            ${fechaNacimientoFormateada}
        `.toLowerCase();

      return textoBusqueda.includes(this.filtro.toLowerCase());
    });
  }

  borrarFiltro(): void {
    this.filtro = '';
    this.filtrarUsuario();
  }
}
