import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, forkJoin, of } from 'rxjs';
import { SalesService } from 'src/app/providers/services/sales/sales.service';
import { SalesQuickService } from 'src/app/providers/services/sales/sales-quick.service';

@Component({
  selector: 'inverso-venta-main-articulos',
  templateUrl: './venta-main-articulos.component.html',
  styleUrls: ['./venta-main-articulos.component.scss']
})
export class VentaMainArticulosComponent implements OnInit, OnDestroy {
  private idPuntoVenta: any;
  public puntoVenta: any;
  public articulos: any[] = [];
  public loadingSpinner: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  // Propiedades para la vista
  // public productos: any[] = [];
  public productosFiltrados: any[] = [];
  public searchTerm: string = '';
  public selectedCategoria: any = null;
  public categorias: any[] = [];
  public totalProductos: number = 0;

  // Carrito de compras
  public carrito: any[] = [];
  public subtotalVenta: number = 0;
  public igvVenta: number = 0;
  public totalVenta: number = 0;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private salesQuickService: SalesQuickService,
    private nbToastrService: NbToastrService,
  ) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      this.idPuntoVenta = params.get('id_punto_venta');
      this.getMasters();
    });

    this.suscribeForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private suscribeForm() {

  }

  public getMasters() {
    // TODO: Comentar esta línea cuando conectes con la API real
    // this.loadDatosMock();
    // return;

    // TODO: Descomentar esto para usar la API real
    const puntoVenta$ = this.salesQuickService.getPuntoVentaById$(this.idPuntoVenta).pipe(takeUntil(this.destroy$));
    const articulos$ = this.salesQuickService.getSearchArticuloToVenta$({ id_punto_venta: this.idPuntoVenta }).pipe(takeUntil(this.destroy$));
    this.loadingSpinner = true;
    forkJoin({
      puntoVenta: puntoVenta$,
      articulos: articulos$,
    }).subscribe({
      next: (response) => {
        this.loadingSpinner = false;
        this.puntoVenta = response.puntoVenta || {};
        this.articulos = response.articulos || [];
        this.procesarArticulos();
      },
      error: (err) => {
        this.loadingSpinner = false;
        this.puntoVenta = null;
        this.articulos = [];
      }
    });
  }

  private procesarArticulos() {
    // Procesar artículos de la API
    // this.productos = this.articulos.map(item => ({
    //   id: item.id_articulo,
    //   nombre: item.nombre,
    //   codigo: item.codigo,
    //   codigoBarras: item.codigo_barras,
    //   precio: item.precio_venta,
    //   stock: item.stock_disponible,
    //   imagen: item.imagen_url,
    //   categoria: item.categoria_nombre,
    //   id_categoria: item.id_categoria
    // }));

    this.productosFiltrados = [...this.articulos];
    this.totalProductos = this.articulos.length;

    // Extraer categorías únicas
    const categoriasMap = new Map();
    this.articulos.forEach(item => {
      if (item.id_categoria && !categoriasMap.has(item.id_categoria)) {
        categoriasMap.set(item.id_categoria, {
          id: item.id_categoria,
          nombre: item.categoria_nombre
        });
      }
    });
    this.categorias = Array.from(categoriasMap.values());
  }

  public onBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  // ==================== Métodos de UI ====================

  public onSearch(data: any) {
    this.aplicarFiltros();
  }

  public onClearSearch() {
    this.searchTerm = '';
    this.aplicarFiltros();
  }

  public onFilterCategoria() {
    this.aplicarFiltros();
  }

  private aplicarFiltros() {
    let productosFiltrados = [...this.articulos];

    // Filtrar por búsqueda
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const termino = this.searchTerm.toLowerCase().trim();
      productosFiltrados = productosFiltrados.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.codigo.toLowerCase().includes(termino) ||
        (p.codigoBarras && p.codigoBarras.toLowerCase().includes(termino))
      );
    }

    // Filtrar por categoría
    if (this.selectedCategoria !== null) {
      productosFiltrados = productosFiltrados.filter(p => p.id_categoria === this.selectedCategoria);
    }

    this.productosFiltrados = productosFiltrados;
    this.totalProductos = productosFiltrados.length;
  }

  public onSelectProducto(producto: any) {
    // Verificar si el producto ya está en el carrito
    const index = this.carrito.findIndex(item => item.id === producto.id);

    if (index !== -1) {
      // Si ya existe, aumentar la cantidad
      if (this.carrito[index].cantidad < producto.stock) {
        this.carrito[index].cantidad++;
        this.carrito[index].subtotal = this.carrito[index].cantidad * this.carrito[index].precio;
        this.nbToastrService.info(`Cantidad de ${producto.nombre} actualizada`, 'Carrito');
      } else {
        this.nbToastrService.warning('No hay más stock disponible', 'Stock insuficiente');
      }
    } else {
      // Si no existe, agregarlo al carrito
      this.carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        codigo: producto.codigo,
        precio: producto.precio,
        cantidad: 1,
        stock_disponible: producto.stock,
        subtotal: producto.precio
      });
      this.nbToastrService.success(`${producto.nombre} agregado al carrito`, 'Éxito');
    }

    this.calcularTotales();
  }

  // ==================== Métodos del Carrito ====================

  public onRemoveFromCart(index: number) {
    const producto = this.carrito[index];
    this.carrito.splice(index, 1);
    this.calcularTotales();
    this.nbToastrService.info(`${producto.nombre} eliminado del carrito`, 'Carrito');
  }

  public onIncreaseQty(index: number) {
    const item = this.carrito[index];
    if (item.cantidad < item.stock_disponible) {
      item.cantidad++;
      item.subtotal = item.cantidad * item.precio;
      this.calcularTotales();
    } else {
      this.nbToastrService.warning('No hay más stock disponible', 'Stock insuficiente');
    }
  }

  public onDecreaseQty(index: number) {
    const item = this.carrito[index];
    if (item.cantidad > 1) {
      item.cantidad--;
      item.subtotal = item.cantidad * item.precio;
      this.calcularTotales();
    }
  }

  public onUpdateCart() {
    // Validar cantidades
    this.carrito.forEach(item => {
      if (item.cantidad < 1) {
        item.cantidad = 1;
      }
      if (item.cantidad > item.stock_disponible) {
        item.cantidad = item.stock_disponible;
        this.nbToastrService.warning(`Stock máximo: ${item.stock_disponible}`, item.nombre);
      }
      item.subtotal = item.cantidad * item.precio;
    });
    this.calcularTotales();
  }

  public onLimpiarCarrito() {
    if (confirm('¿Estás seguro de limpiar el carrito?')) {
      this.carrito = [];
      this.calcularTotales();
      this.nbToastrService.info('Carrito limpiado', 'Carrito');
    }
  }

  private calcularTotales() {
    this.subtotalVenta = this.carrito.reduce((sum, item) => sum + item.subtotal, 0);
    this.igvVenta = this.subtotalVenta * 0.18;
    this.totalVenta = this.subtotalVenta + this.igvVenta;
  }

  public onGenerarVenta() {
    if (this.carrito.length === 0) {
      this.nbToastrService.warning('El carrito está vacío', 'Advertencia');
      return;
    }

    // TODO: Aquí abres el modal para generar la venta
    console.log('Generar venta con:', {
      items: this.carrito,
      subtotal: this.subtotalVenta,
      igv: this.igvVenta,
      total: this.totalVenta,
      puntoVenta: this.puntoVenta
    });

    this.nbToastrService.success('Abriendo modal de venta...', 'Generar Venta');

    // Aquí deberías abrir un modal con los detalles de la venta
    // Por ejemplo:
    // this.dialogService.open(GenerarVentaModalComponent, {
    //   context: {
    //     carrito: this.carrito,
    //     totales: {
    //       subtotal: this.subtotalVenta,
    //       igv: this.igvVenta,
    //       total: this.totalVenta
    //     },
    //     puntoVenta: this.puntoVenta
    //   }
    // });
  }

  // ==================== Datos Mock ====================

  private loadDatosMock() {
    // Simular datos del punto de venta
    this.puntoVenta = {
      id_punto_venta: 1,
      nombre: 'Punto central',
      id_almacen: 1,
      almacen_nombre: 'Almacén Principal'
    };

    // Simular categorías
    this.categorias = [
      { id: 1, nombre: 'Bebidas' },
      { id: 2, nombre: 'Snacks' },
      { id: 3, nombre: 'Lácteos' },
      { id: 4, nombre: 'Panadería' },
      { id: 5, nombre: 'Limpieza' }
    ];

    // Simular productos
    this.articulos = [
      {
        id: 1,
        nombre: 'Coca Cola 500ml',
        codigo: 'CC500',
        codigoBarras: '7501234567890',
        precio: 3.50,
        stock: 45,
        imagen: null,
        categoria: 'Bebidas',
        id_categoria: 1
      },
      {
        id: 2,
        nombre: 'Inca Kola 500ml',
        codigo: 'IK500',
        codigoBarras: '7501234567891',
        precio: 3.00,
        stock: 32,
        imagen: null,
        categoria: 'Bebidas',
        id_categoria: 1
      },
      {
        id: 3,
        nombre: 'Agua San Luis 625ml',
        codigo: 'ASL625',
        codigoBarras: '7501234567892',
        precio: 2.00,
        stock: 60,
        imagen: null,
        categoria: 'Bebidas',
        id_categoria: 1
      },
      {
        id: 4,
        nombre: 'Papas Lays Original',
        codigo: 'PL001',
        codigoBarras: '7501234567893',
        precio: 4.50,
        stock: 28,
        imagen: null,
        categoria: 'Snacks',
        id_categoria: 2
      },
      {
        id: 5,
        nombre: 'Doritos Nacho',
        codigo: 'DN001',
        codigoBarras: '7501234567894',
        precio: 5.00,
        stock: 0,
        imagen: null,
        categoria: 'Snacks',
        id_categoria: 2
      },
      {
        id: 6,
        nombre: 'Cheetos Flamin Hot',
        codigo: 'CFH001',
        codigoBarras: '7501234567895',
        precio: 4.50,
        stock: 15,
        imagen: null,
        categoria: 'Snacks',
        id_categoria: 2
      },
      {
        id: 7,
        nombre: 'Leche Gloria Entera 1L',
        codigo: 'LG1L',
        codigoBarras: '7501234567896',
        precio: 5.50,
        stock: 20,
        imagen: null,
        categoria: 'Lácteos',
        id_categoria: 3
      },
      {
        id: 8,
        nombre: 'Yogurt Gloria Fresa',
        codigo: 'YGF001',
        codigoBarras: '7501234567897',
        precio: 3.50,
        stock: 18,
        imagen: null,
        categoria: 'Lácteos',
        id_categoria: 3
      },
      {
        id: 9,
        nombre: 'Pan Ciabatta',
        codigo: 'PC001',
        codigoBarras: '7501234567898',
        precio: 2.50,
        stock: 12,
        imagen: null,
        categoria: 'Panadería',
        id_categoria: 4
      },
      {
        id: 10,
        nombre: 'Pan Integral',
        codigo: 'PI001',
        codigoBarras: '7501234567899',
        precio: 6.00,
        stock: 8,
        imagen: null,
        categoria: 'Panadería',
        id_categoria: 4
      },
      {
        id: 11,
        nombre: 'Detergente Ariel 1kg',
        codigo: 'DA1K',
        codigoBarras: '7501234567800',
        precio: 12.50,
        stock: 25,
        imagen: null,
        categoria: 'Limpieza',
        id_categoria: 5
      },
      {
        id: 12,
        nombre: 'Jabón Bolivar',
        codigo: 'JB001',
        codigoBarras: '7501234567801',
        precio: 1.50,
        stock: 40,
        imagen: null,
        categoria: 'Limpieza',
        id_categoria: 5
      }
    ];

    this.productosFiltrados = [...this.articulos];
    this.totalProductos = this.articulos.length;
  }

}
