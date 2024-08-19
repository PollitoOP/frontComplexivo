import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Producto } from 'src/app/models/producto';
import { Categoria } from 'src/app/models/categoria';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  productosFiltrados: Producto[] = [];
  filtro: string = '';
  filtroSeleccionado: string = 'nombrePro';
  valorFiltro: string = '';
  message = new FormControl('');

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.productoService.listar().subscribe((productos) => {
      this.productos = productos;

      this.categoriaService.listar().subscribe((categorias) => {
        this.categorias = categorias;

        this.productos.forEach((producto) => {
          const categoria = this.categorias.find(
            (categoria) => categoria.idCategoria === producto.idCategoria
          );
          if (categoria) {
            producto.categoria = categoria;
          }
        });
        this.productosFiltrados = this.productos;
      });
    });
  }

  filtrarProductos(): void {
    this.productosFiltrados = this.productos.filter((producto) => {
      const estadoTexto = producto.estadoPro ? 'Disponible' : 'En reposición';
      const textoBusqueda =
        `${producto.nombrePro} ${producto.categoria.nombre} ${producto.descripcionPro} ${producto.tallaPro} ${producto.precioPro} ${estadoTexto}`.toLowerCase();
      return textoBusqueda.includes(this.filtro.toLowerCase());
    });
  }

  aplicarFiltro(): void {
    if (!this.valorFiltro) {
      this.productosFiltrados = this.productos;
      return;
    }

    this.productosFiltrados = this.productos.filter((producto) => {
      const valor = this.valorFiltro.toLowerCase();
      const campo = (producto as any)[this.filtroSeleccionado].toString().toLowerCase();
      return campo.includes(valor);
    });
  }

  borrarFiltro(): void {
    this.filtro = '';
    this.valorFiltro = '';
    this.filtrarProductos();
  }

  eliminarProducto(idProducto: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el producto seleccionado.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminar(idProducto).subscribe(() => {
          this.listar();
          Swal.fire('¡Acción exitosa!', 'Producto eliminado.', 'success');
        });
      }
    });
  }

  buscarProducto(idProducto: number): void {
    // Implementar la lógica para navegar o editar el producto
  }
}
