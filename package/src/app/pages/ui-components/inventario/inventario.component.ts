import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  NgApexchartsModule,
  ApexResponsive,
} from 'ng-apexcharts';
import { InventarioService } from 'src/app/services/inventario.service';
import { Inventario } from 'src/app/models/inventario';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface trafficChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TablerIconsModule,
    MatCardModule,
    NgApexchartsModule,
    MatTableModule,
    CommonModule,
    RouterModule, 
  ],
})
export class InventarioComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public trafficChart!: Partial<trafficChart> | any;
  
  displayedColumns: string[] = ['profile', 'detalles', 'status'];
  dataSource = new MatTableDataSource<any>(); 
  public inventario: Inventario[] = [];
  public inventarioFiltrado: Inventario[] = [];
  public disponibles: number = 0;
  public enReposicion: number = 0;
  inventarioNombre: string = '';

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarInventario();
    this.initCharts();
  }

  cargarInventario() {
    this.inventarioService.listar().subscribe(
      (inventario) => {
        this.inventario = inventario;
        this.inventarioFiltrado = inventario;
      },
      (error) => {
        console.error('Error al cargar inventario:', error);
      }
    );
  }
  
  cargarProductos(): void {
    this.inventarioService.listar().subscribe(inventarios => {
      const productos = inventarios.flatMap(inventario => inventario.producto);

      productos.forEach(producto => {
        if (producto.fotoPath) {
          producto.fotoUrl = this.getFotoUrl(producto.fotoPath);
        }
      });

      // Calcular los productos disponibles y en reposición
      this.disponibles = productos.filter(producto => producto.estadoPro).length;
      this.enReposicion = productos.filter(producto => !producto.estadoPro).length;

      this.dataSource.data = productos;

      // Actualizar la gráfica después de cargar los productos
      this.updateTrafficChart();
    });
  }

  getFotoUrl(fotoPath: string): string {
    return `https://practicacomplexivo.s3.amazonaws.com/${fotoPath}`;
  }

  initCharts(): void {
    // Inicializa la gráfica por primera vez con valores predeterminados
    this.updateTrafficChart();
  }

  updateTrafficChart(): void {
    this.trafficChart = {
      series: [this.disponibles, this.enReposicion],
      labels: ['Disponibles', 'En Reposición'],
      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 135,  // Reduce la altura para que la gráfica sea más pequeña
      },
      colors: ['#4bd08b', '#fb977d'], 
      plotOptions: {
        pie: {
          donut: {
            size: '70%',  // Reduce el tamaño del donut para que ocupe menos espacio
            background: 'none',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '10px',  // Reduce el tamaño de la fuente
                color: undefined,
                offsetY: 5,
              },
              value: {
                show: true,
                fontSize: '12px',  // Reduce el tamaño de la fuente
                fontWeight: 600,
                color: '#98aab4',
              },
            },
          },
        },
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 991,
          options: {
            chart: {
              width: 100,  // Reduce el ancho en dispositivos pequeños
            },
          },
        },
      ],
      tooltip: {
        enabled: true,
      },
    };
  }  

  verReporte() {
    const doc = new jsPDF();

    // Agregar logotipo
    const imgData = './assets/images/logos/logocomple.png';
    doc.addImage(imgData, 'PNG', 160, 10, 40, 15); // (imageData, format, x, y, width, height)

    // Título del reporte
    doc.setFontSize(18);
    doc.setTextColor(41, 128, 186); // Color del texto en RGB rgb(41, 128, 186)
    doc.setFont('helvetica');
    doc.text('Reporte de Inventario', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // Fecha de generación del reporte
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const fecha = new Date().toLocaleDateString();
    doc.text(`Fecha: ${fecha}`, 14, 30);

    // Descripción del reporte
    doc.text(`Resumen del inventario de productos, incluyendo información sobre el número total de productos,`, 14, 40);
    doc.text(`su disponibilidad, y su estado actual.`, 14, 45);

    // Información del inventario
    doc.text(`Número total de productos: ${this.dataSource.data.length}`, 14, 55);
    doc.text(`Productos disponibles: ${this.disponibles}`, 14, 60);
    doc.text(`Productos en reposición: ${this.enReposicion}`, 14, 65);

    const productosData = this.dataSource.data.map((producto: any) => [
      producto.nombrePro,
      producto.descripcionPro,
      `$${producto.precioPro}`,
      producto.tallaPro,
      producto.estadoPro ? 'Disponible' : 'En Reposición',
    ]);

    (doc as any).autoTable({
      head: [['Producto', 'Descripción', 'Precio', 'Talla', 'Estado']],
      body: productosData,
      startY: 75,
    });

    doc.save('reporte_inventario.pdf');
  }


  imprimirReporte() {
    const doc = new jsPDF();

    // Agregar logotipo
    const imgData = './assets/images/logos/logocomple.png';
    doc.addImage(imgData, 'PNG', 160, 10, 40, 15); // (imageData, format, x, y, width, height)

    // Título del reporte
    doc.setFontSize(18);
    doc.setTextColor(41, 128, 186); // Color del texto en RGB
    doc.setFont('helvetica');
    doc.text('Reporte de Inventario', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // Fecha de generación del reporte
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const fecha = new Date().toLocaleDateString();
    doc.text(`Fecha: ${fecha}`, 14, 30);

    // Descripción del reporte
    doc.text(`Resumen del inventario de productos, incluyendo información sobre el número total de productos,`, 14, 40);
    doc.text(`su disponibilidad, y su estado actual.`, 14, 45);

    // Información del inventario
    doc.text(`Productos Totales: ${this.dataSource.data.length}`, 14, 55);

    const productosData = this.dataSource.data.map((producto: any) => [
      producto.nombrePro,
      producto.descripcionPro,
      producto.precioPro,
      producto.tallaPro,
      producto.estadoPro ? 'Disponible' : 'En Reposición',
    ]);

    (doc as any).autoTable({
      head: [['Producto', 'Descripción', 'Precio', 'Talla', 'Estado']],
      body: productosData,
      startY: 65,
    });

    // Print the PDF
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }

}
