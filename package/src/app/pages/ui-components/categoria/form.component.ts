import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-categoria',
  templateUrl: './form.component.html',
  styleUrls: ['./categoria.component.css'],
})
export class FormCategoriaComponent implements OnInit {
  public titulo: string = 'Nuevo Tipo de Habitación';
  public categoria: Categoria = new Categoria();

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarCategoria();
  }

  cargarCategoria(): void {
    this.activatedRoute.params.subscribe((params) => {
      const idCategoria = params['idCategoria'];
      if (idCategoria) {
        this.titulo = 'Editar Tipo de Habitación';
        this.categoriaService.buscar(idCategoria).subscribe((categoria) => {
          this.categoria = categoria;
        });
      }
    });
  }

  crear(): void {
    if (!this.categoria.nombre.trim()) {
      Swal.fire('warning', 'El nombre de la categoría es requerido.', 'error');
      return;
    }

    if (this.categoria.idCategoria) {
      // Actualizar categoría existente
      this.categoriaService
        .actualizar(this.categoria.idCategoria, this.categoria)
        .subscribe(
          () => {
            this.router.navigate(['/ui-components/categorias']);
            Swal.fire(
              '¡Acción exitosa!',
              `Categoría ${this.categoria.nombre} actualizada con éxito.`,
              'success'
            );
          },
          (error) => {
            console.error('Error al actualizar la categoría:', error);
            Swal.fire(
              'Error',
              'No se pudo actualizar la categoría.',
              'error'
            );
          }
        );
    } else {
      // Crear nueva categoría
      this.categoriaService.crear(this.categoria).subscribe(
        (categoriaCreada) => {
          this.categoria = categoriaCreada;
          this.router.navigate(['/ui-components/categorias']);
          Swal.fire(
            '¡Acción exitosa!',
            `Categoría ${this.categoria.nombre} creada con éxito.`,
            'success'
          );
        },
        (error) => {
          console.error('Error al crear la categoría:', error);
          Swal.fire('Error', 'No se pudo guardar la categoría.', 'error');
        }
      );
    }
  }

  volver(): void {
    Swal.fire({
      title: '¿Desea volver a la pantalla anterior?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, volver',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/ui-components/categorias']);
      }
    });
  }
}
