import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('userId'); // Verifica si el usuario está autenticado

    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/authentication/login']); // Redirige al login si no está autenticado
      return false;
    }
  }
}
