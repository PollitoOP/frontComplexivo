import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdministradorService } from 'src/app/services/administrador.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  hide = true;
  usernameRequired = false;
  usernameIncorrect = false;
  passwordRequired = false;
  passwordIncorrect = false;

  constructor(
    private router: Router,
    private administradorService: AdministradorService
  ) {}

  ngOnInit(): void {}

  login() {
    this.resetValidationErrors();

    if (!this.username) {
      this.usernameRequired = true;
      return;
    }

    if (!this.password) {
      this.passwordRequired = true;
      return;
    }

    this.administradorService.listar().subscribe(
      (administradores) => {
        const administradorEncontrado = administradores.find(
          (admin) =>
            admin.usuario.trim() === this.username.trim() &&
            admin.password.trim() === this.password.trim()
        );

        if (administradorEncontrado) {
          // Guardar información del administrador en localStorage
          localStorage.setItem('adminId', administradorEncontrado.idAdministrador.toString());
          localStorage.setItem('username', administradorEncontrado.usuario);

          // Redirigir al dashboard
          this.router.navigate(['/dashboard']);
        } else {
          this.usernameIncorrect = true;
          this.passwordIncorrect = true;
          Swal.fire({
            icon: 'warning',
            title: 'Credenciales Incorrectas',
            text: 'Verifique su usuario y contraseña.',
          });
        }
      },
      (error) => {
        console.error('Error al verificar los administradores', error);
      }
    );
  }

  resetValidationErrors() {
    this.usernameRequired = false;
    this.usernameIncorrect = false;
    this.passwordRequired = false;
    this.passwordIncorrect = false;
  }
}
