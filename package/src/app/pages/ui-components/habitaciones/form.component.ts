import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitacionService } from 'src/app/services/habitacion.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Habitacion } from 'src/app/models/habitacion';
import { Categoria } from 'src/app/models/categoria';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-habitacion',
  templateUrl: './form.component.html',
  styleUrls: ['./habitacion.component.css'],
})
export class FormHabitacionComponent implements OnInit {
  public titulo: string = 'Nueva Habitación';
  public habitacion: Habitacion = new Habitacion();
  public categorias: Categoria[] = [];

  constructor(
    private habitacionService: HabitacionService,
    private categoriaService: CategoriaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarHabitacion();
    this.cargarCategorias();
  }

  cargarHabitacion(): void {
    this.activatedRoute.params.subscribe((params) => {
      const idHabitacion = params['idHabitacion'];
      if (idHabitacion) {
        this.titulo = 'Editar Habitación';
        this.habitacionService.buscar(idHabitacion).subscribe((habitacion) => {
          this.habitacion = habitacion;
        });
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }

  validarFormulario(): boolean {
    if (
      !this.habitacion.numero ||
      !this.habitacion.descripcion ||
      !this.habitacion.precio ||
      !this.habitacion.estado ||
      !this.habitacion.idCategoria
    ) {
      return false;
    }
    return true;
  }

  crear(): void {
    if (!this.validarFormulario()) {
      Swal.fire('Error', 'Complete todos los campos.', 'error');
      return;
    }

    // Asignar valores adicionales si es necesario
    this.habitacion.idAdministrador = 1;  // Asignar el ID de administrador, si aplica.

    this.guardarHabitacion();
  }

  guardarHabitacion(): void {
    if (this.habitacion.idHabitacion) {
      this.habitacionService.actualizar(this.habitacion.idHabitacion, this.habitacion).subscribe(
        () => {
          Swal.fire(
            '¡Acción exitosa!',
            `Habitación ${this.habitacion.numero} actualizada con éxito.`,
            'success'
          );
          this.router.navigate(['/ui-components/habitaciones']);
        },
        (error) => {
          console.error('Error al actualizar la habitación:', error);
          Swal.fire('Error', 'No se pudo actualizar la habitación.', 'error');
        }
      );
    } else {
      this.habitacionService.crear(this.habitacion).subscribe(
        (habitacionCreada) => {
          Swal.fire(
            '¡Acción exitosa!',
            `Habitación ${this.habitacion.numero} guardada con éxito.`,
            'success'
          );
          this.router.navigate(['/ui-components/habitaciones']);
        },
        (error) => {
          console.error('Error al crear la habitación:', error);
          Swal.fire('Error', 'No se pudo crear la habitación.', 'error');
        }
      );
    }
  }
}
