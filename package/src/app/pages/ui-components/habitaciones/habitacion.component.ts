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
import { HabitacionService } from 'src/app/services/habitacion.service';
import { Habitacion } from 'src/app/models/habitacion';
import { FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-habitacion',
  templateUrl: './habitacion.component.html',
  styleUrls: ['./habitacion.component.css'],
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
export class HabitacionComponent implements OnInit {
  habitaciones: Habitacion[] = [];
  categorias:Categoria [] = [];
  habitacionesFiltradas: Habitacion[] = [];
  displayedColumns: string[] = ['idHabitacion', 'numero', 'descripcion', 'precio', 'estado', 'categoria', 'actions'];
  filtro: string = '';
  message = new FormControl('');

  constructor(private habitacionService: HabitacionService, private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.habitacionService.listar().subscribe((habitaciones) => {
      this.habitaciones = habitaciones;
  
      this.categoriaService.listar().subscribe((categorias) => {
        this.categorias = categorias;
  
        this.habitaciones.forEach((habitacion) => {
          const categoria = this.categorias.find((categoria) => categoria.idCategoria === habitacion.idCategoria);
          if (categoria) {
            habitacion.categoria = categoria;
          }
        });
  
        this.habitacionesFiltradas = this.habitaciones;
      });
    });
  }  

  filtrarHabitacion(): void {
    const filtro = this.filtro.toLowerCase();
    this.habitacionesFiltradas = this.habitaciones.filter((habitacion) =>
      habitacion.idHabitacion.toString().includes(filtro) ||
      habitacion.numero.toString().includes(filtro) ||
      habitacion.descripcion.toLowerCase().includes(filtro) ||
      habitacion.precio.toString().includes(filtro) ||
      habitacion.estado.toLowerCase().includes(filtro) ||
      habitacion.categoria.nombre.toLowerCase().includes(filtro)
    );
  }

  borrarFiltro(): void {
    this.filtro = '';
    this.filtrarHabitacion();
  }

  eliminarHabitacion(habitacion: Habitacion): void {
    Swal.fire({
      title: `¿Estás seguro de eliminar la habitación "${habitacion.numero}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.habitacionService.eliminar(habitacion.idHabitacion).subscribe(
          () => {
            Swal.fire(
              '¡Eliminado!',
              `La habitación "${habitacion.numero}" ha sido eliminada.`,
              'success'
            );
            this.listar(); // Recargar la lista de habitaciones
          },
          (error) => {
            console.error('Error al eliminar la habitación:', error);
            Swal.fire(
              'Error',
              'No se pudo eliminar la habitación.',
              'error'
            );
          }
        );
      }
    });
  }
  imprimirReporte() {
    const doc = new jsPDF();

    // Agregar logotipo
    const imgData = './assets/images/logos/logocomple.png';
    doc.addImage(imgData, 'PNG', 160, 10, 40, 15);

    // Título del reporte
    doc.setFontSize(18);
    doc.setTextColor(41, 128, 186);
    doc.setFont('helvetica');
    doc.text('Reporte de Habitaciones', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // Fecha de generación del reporte
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const fecha = new Date().toLocaleDateString();
    doc.text(`Fecha: ${fecha}`, 14, 30);

    // Descripción del reporte
    doc.text(`Resumen del estado actual de las habitaciones, incluyendo su número, descripción, precio,`, 14, 40);
    doc.text(`estado y categoría.`, 14, 45);

    // Información de las habitaciones
    doc.text(`Total de Habitaciones: ${this.habitacionesFiltradas.length}`, 14, 55);

    const habitacionesData = this.habitacionesFiltradas.map((habitacion: any) => [
      habitacion.numero,
      habitacion.descripcion,
      habitacion.precio,
      habitacion.estado,
      habitacion.categoria.nombre,
    ]);

    (doc as any).autoTable({
      head: [['Número', 'Descripción', 'Precio', 'Estado', 'Tipo']],
      body: habitacionesData,
      startY: 65,
    });

    // Imprimir el PDF
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }
}
