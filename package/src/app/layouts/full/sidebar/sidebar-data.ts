import { NavItem } from './nav-item/nav-item';

// Menú para el Administrador
export const menuItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'home',
    route: '/dashboard',
  },
  {
    displayName: 'Tipos de Habitación',
    iconName: 'category',
    route: '/ui-components/categorias',
  },
  {
    displayName: 'Habitaciones',
    iconName: 'door',
    route: '/ui-components/habitaciones',
  },
];
