import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { AssetService } from 'src/app/services/asset.service';
import Swal from 'sweetalert2';
import { Producto } from 'src/app/models/producto';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';

@Component({
  selector: 'app-form-producto',
  templateUrl: './form.component.html',
  styleUrls: ['./producto.component.css'],
})
export class FormProductoComponent implements OnInit {
  public titulo: string = 'Nuevo Producto';
  nuevaImagenFile: File | undefined;
  public producto: Producto = new Producto();
  categorias: Categoria[] = [];

  constructor(
    private productoService: ProductoService,
    private assetService: AssetService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.cargarProducto();
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe((data: Categoria[]) => {
      this.categorias = data;
    });
  }

  cargarProducto(): void {
    this.activatedRoute.params.subscribe((params) => {
      let idProducto = params['idProducto'];
      if (idProducto) {
        this.titulo = 'Editar Producto';
        this.productoService.buscar(idProducto).subscribe((producto) => {
          this.producto = producto;
        });
      }
    });
  }

  validarFormulario(): boolean {
    if (
      !this.producto.nombrePro ||
      !this.producto.precioPro ||
      !this.producto.tallaPro ||
      this.producto.estadoPro === undefined ||
      !this.producto.idCategoria ||
      !this.producto.descripcionPro
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

    // Asignar valores fijos
    this.producto.idInventario = 1;
    this.producto.idProductoPersona = 1;

    if (this.nuevaImagenFile) {
      this.assetService.uploadImage(this.nuevaImagenFile).subscribe(
        (response) => {
          this.producto.fotoUrl = response.url; // Aquí asignamos la URL de la imagen subida
          this.producto.fotoPath = response.key;
          this.guardarProducto();
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
          Swal.fire('Error', 'No se pudo subir la imagen.', 'error');
        }
      );
    } else {
      this.guardarProducto();
    }
  }

  guardarProducto(): void {
    if (this.producto.idProducto) {
      this.productoService.actualizar(this.producto.idProducto, this.producto).subscribe(
        () => {
          Swal.fire(
            '¡Acción exitosa!',
            `Producto ${this.producto.nombrePro} actualizado con éxito.`,
            'success'
          );
          this.router.navigate(['/ui-components/productos']);
        },
        (error) => {
          console.error('Error al actualizar producto:', error);
          Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
        }
      );
    } else {
      this.productoService.crear(this.producto).subscribe(
        (productoCreado) => {
          Swal.fire(
            '¡Acción exitosa!',
            `Producto ${this.producto.nombrePro} guardado con éxito.`,
            'success'
          );
          this.router.navigate(['/ui-components/productos']);
        },
        (error) => {
          console.error('Error al crear producto:', error);
          Swal.fire('Error', 'No se pudo guardar el producto.', 'error');
        }
      );
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.nuevaImagenFile = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.producto.fotoUrl = e.target.result;
        this.producto.fotoPath = e.target.result;
      };
      reader.readAsDataURL(files[0]);
    }
  }
}
