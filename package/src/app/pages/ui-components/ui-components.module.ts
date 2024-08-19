import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { UiComponentsRoutes } from './ui-components.routing';

// ui components
import { MatNativeDateModule } from '@angular/material/core';
import { FormProductoComponent } from './productos/form.component';
import { FormPersonaComponent } from './persona/form.component';
import { FormPersonaComponent as fromPerfil } from './persona/form2.component';
import { FormCategoriaComponent } from './categoria/form.component';
import { FormHabitacionComponent } from './habitaciones/form.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UiComponentsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
  ],
  declarations: [
    FormProductoComponent,
    FormPersonaComponent,
    FormCategoriaComponent,
    FormHabitacionComponent,
    fromPerfil
  ],
})
export class UicomponentsModule {}
