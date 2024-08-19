import { Routes } from '@angular/router';

// ui
import { ProductoComponent } from './productos/producto.component';
import { ListadoComponent } from './listadoproductos/listado.component';
import { InventarioComponent } from './inventario/inventario.component';
import { PersonaComponent } from './persona/persona.component';
import { FormProductoComponent } from './productos/form.component';
import { FormPersonaComponent } from './persona/form.component';
import { FormPersonaComponent as fromPerfil } from './persona/form2.component';
import { FormCategoriaComponent } from './categoria/form.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { HabitacionComponent } from './habitaciones/habitacion.component';
import { FormHabitacionComponent } from './habitaciones/form.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'productos',
        component: ProductoComponent,
      },
			{
				path: 'productos/form',
				component: FormProductoComponent,
			},
			{
				path: 'productos/formproducto/:idProducto',
				component: FormProductoComponent,
			},
      {
        path: 'inventario',
        component: InventarioComponent,
      },
      {
        path: 'personas',
        component: PersonaComponent,
      },
			{
				path: 'personas/form',
				component: FormPersonaComponent,
			},
			{
				path: 'personas/formpersona/:idPersona',
				component: FormPersonaComponent,
			},
      {
        path: 'listados',
        component: ListadoComponent,
      },
      {
        path: 'miPerfil/:idPersona',
        component: fromPerfil,
      },
      {
        path: 'categorias',
        component: CategoriaComponent,
      },
			{
				path: 'categorias/form',
				component: FormCategoriaComponent,
			},
			{
				path: 'categorias/formcategoria/:idCategoria',
				component: FormCategoriaComponent,
			},
      {
        path: 'habitaciones',
        component: HabitacionComponent,
      },
			{
				path: 'habitaciones/form',
				component: FormHabitacionComponent,
			},
			{
				path: 'habitaciones/formhabitacion/:idHabitacion',
				component: FormHabitacionComponent,
			},
    ],
  },
];
