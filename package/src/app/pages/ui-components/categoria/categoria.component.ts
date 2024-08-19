import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { CategoriaService } from 'src/app/services/categoria.service';
import { HabitacionService } from 'src/app/services/habitacion.service';
import { Categoria } from 'src/app/models/categoria';
import { FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
  standalone: true,
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
export class CategoriaComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  displayedColumns: string[] = ['idCategoria', 'nombre', 'actions'];
  filtro: string = '';
  message = new FormControl('');

  constructor(
    private categoriaService: CategoriaService,
    private habitacionService: HabitacionService
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.categoriaService.listar().subscribe((categorias) => {
      this.categorias = categorias;
      this.categoriasFiltradas = categorias;
    });
  }

  filtrarCategoria(): void {
    this.categoriasFiltradas = this.categorias.filter((categoria) =>
      categoria.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  borrarFiltro(): void {
    this.filtro = '';
    this.filtrarCategoria();
  }

  eliminarCategoria(categoria: Categoria): void {
    this.habitacionService.listar().subscribe((habitaciones) => {
      const vinculada = habitaciones.some(
        (habitacion) => habitacion.idCategoria === categoria.idCategoria
      );

      if (vinculada) {
        Swal.fire({
          icon: 'error',
          title: 'No se puede eliminar',
          text: `La categoría "${categoria.nombre}" está vinculada a una o más habitaciones.`,
        });
      } else {
        Swal.fire({
          title: `¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.categoriaService.eliminar(categoria.idCategoria).subscribe(
              () => {
                Swal.fire(
                  '¡Eliminado!',
                  `La categoría "${categoria.nombre}" ha sido eliminada.`,
                  'success'
                );
                this.listar(); // Recargar la lista de categorías
              },
              (error) => {
                console.error('Error al eliminar la categoría:', error);
                Swal.fire(
                  'Error',
                  'No se pudo eliminar la categoría.',
                  'error'
                );
              }
            );
          }
        });
      }
    });
  }
}
