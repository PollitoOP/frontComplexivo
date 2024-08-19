import { Component, Output, EventEmitter, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdministradorService } from 'src/app/services/administrador.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  username: string = '';
  fotoUrl: string = '/assets/images/profile/default-user.jpg';
  idPersona: number | null = null;

  constructor(
    public dialog: MatDialog, 
    private router: Router, 
    private administradorService: AdministradorService
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    const idPersonaStr = localStorage.getItem('idPersona');
    if (idPersonaStr) {
      this.idPersona = +idPersonaStr;
    }
  }

  confirmLogout() {
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('idPersona');
        this.router.navigate(['/authentication/login']);
      }
    });
  }
}
