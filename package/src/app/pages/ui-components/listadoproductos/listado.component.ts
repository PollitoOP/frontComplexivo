import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Producto } from 'src/app/models/producto';
import { Categoria } from 'src/app/models/categoria';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css'],
})
export class ListadoComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  productosFiltrados: Producto[] = [];
  filtro: string = '';
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

  borrarFiltro(): void {
    this.filtro = '';
    this.filtrarProductos();
  }

}
