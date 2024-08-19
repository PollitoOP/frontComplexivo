import { Component, OnInit } from '@angular/core';
import { menuItems } from './sidebar-data';  // Importa el menú único
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public menuItems: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Cargar las opciones del menú para el administrador
    this.menuItems = menuItems;
  }

  confirmLogout() {
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Navegar a la página de login después de confirmar el cierre de sesión
        this.router.navigate(['/authentication/login']);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log('Acción cancelada');
      }
    });
  }
}
