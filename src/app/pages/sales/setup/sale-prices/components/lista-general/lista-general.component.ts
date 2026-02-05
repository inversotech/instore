import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { MonedasService } from 'src/app/providers/services/accounting/monedas.service';
import { AnhosService } from 'src/app/providers/services/accounting/anhos.service';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { VentaPreciosService } from 'src/app/providers/services/sales/venta-precios.service';
import { ArticuloUnidadsService } from 'src/app/providers/services/inventory/articulo-unidads.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'inverso-lista-general',
  templateUrl: './lista-general.component.html',
  styleUrls: ['./lista-general.component.scss']
})
export class ListaGeneralComponent implements OnInit, OnDestroy {
  public ventaPrecios: any[] = [];
  public ventaPreciosAgregados: any[] = [];
  public ventaPreciosUnidades: any[] = [];
  public loadingSpinner: boolean = false;
  public activeTab: string = 'agregados';
  public busquedaUnidades: string = '';

  public searchForm: FormGroup = this.formBuilder.group({
    id_almacen: ['', Validators.required],
    id_anho: [new Date().getFullYear(), Validators.required],
    text_search: [''],
  });

  private destroy$: Subject<void> = new Subject<void>();
  public monedas$ = this.monedasService.getAll$();
  public anhos$ = this.anhosService.getAll$();
  public misAlmacenes$ = this.almacenUsuariosService.getMisAlmacenes$({});

  constructor(private formBuilder: FormBuilder,
    private monedasService: MonedasService,
    private anhosService: AnhosService,
    private almacenUsuariosService: AlmacenUsuariosService,
    private ventaPreciosService: VentaPreciosService,
    private articuloUnidadsService: ArticuloUnidadsService,
    private nbToastrService: NbToastrService,
  ) { }

  ngOnInit() {
    this.setDefaultValues();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setDefaultValues() {
    this.searchForm.get('id_almacen')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        setTimeout(() => {
          this.getPrecios();
        }, 0);
      });

    this.searchForm.get('id_anho')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        setTimeout(() => {
          this.getPrecios();
        }, 0);
      });

    this.misAlmacenes$.subscribe(almacenes => {
      if (almacenes && almacenes.length > 0) {
        this.searchForm.get('id_almacen')?.setValue(almacenes[0].id_almacen);
      }
    });


  }

  public submitFormSearch() {
    this.getPrecios();
  }

  public getPrecios() {
    const value = this.searchForm.value;
    const invalid = this.searchForm.invalid;
    if (invalid) return;

    const params = {
      id_almacen: value.id_almacen,
      id_anho: value.id_anho,
      text_search: value.text_search,
    };

    this.loadingSpinner = true;

    // Cargar precios de ambos tipos en paralelo
    forkJoin({
      agregados: this.ventaPreciosService.getByQuery$(params),
      unidades: this.articuloUnidadsService.getArticulosSinPrecio$(params)
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loadingSpinner = false)
    ).subscribe({
      next: (response) => {
        this.ventaPrecios = response.agregados || [];
        // this.separarPorTipo();
        this.cargarUnidadesConPrecios(response.unidades || []);
      },
      error: () => {
        this.ventaPreciosAgregados = [];
        this.ventaPreciosUnidades = [];
      }
    });
  }

  // private separarPorTipo() {
  //   this.ventaPreciosAgregados = this.ventaPrecios.filter(
  //     item => item.tipo_gestion === 'AGREGADO' || !item.tipo_gestion
  //   );
  // }

  private cargarUnidadesConPrecios(articulosUnidad: any[]) {
    console.log('articulosUnidad---');
    console.log(articulosUnidad);

    this.ventaPreciosUnidades = articulosUnidad.map(item => ({
      ...item,
      expanded: false,
      total_unidades: item.lotes?.reduce((acc: number, lote: any) =>
        acc + (lote.unidades?.length || 0), 0) || 0
    }));
  }

  public cargarLotesArticulo(item: any) {
    if (item.lotesLoaded) return;

    const params = {
      id_articulo: item.id_articulo,
      id_almacen: this.searchForm.value.id_almacen,
      id_anho: this.searchForm.value.id_anho,
    };

    this.articuloUnidadsService.getLotesByArticulo$(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          item.lotes = response?.lotes || response || [];
          item.lotesLoaded = true;
        },
        error: () => {
          item.lotes = [];
        }
      });
  }

  public onTabChange(event: any) {
    this.activeTab = event?.tabTitle?.toLowerCase().includes('unidad') ? 'unidades' : 'agregados';
  }

  public toggleExpand(item: any) {
    item.expanded = !item.expanded;
    // Cargar lotes al expandir si no están cargados
    if (item.expanded && !item.lotesLoaded) {
      this.cargarLotesArticulo(item);
    }
  }

  public aplicarPrecioATodos(item: any, tipo: string) {
    if (!item.lotes) return;

    item.lotes.forEach((lote: any) => {
      if (tipo === 'pen' || tipo === 'ambos') {
        lote.precio_promedio_lote = item.precio_inicial_pen;
      }
      if (tipo === 'usd' || tipo === 'ambos') {
        lote.precio_promedio_lote_me = item.precio_inicial_usd;
      }

      if (lote.unidades) {
        lote.unidades.forEach((unidad: any) => {
          if (tipo === 'pen' || tipo === 'ambos') {
            unidad.precio_uni = item.precio_inicial_pen;
          }
          if (tipo === 'usd' || tipo === 'ambos') {
            unidad.precio_uni_me = item.precio_inicial_usd;
          }
        });
      }
    });
  }

  public aplicarPrecioLote(lote: any, tipo: string) {
    if (!lote.unidades) return;
    lote.unidades.forEach((unidad: any) => {
      if (tipo === 'pen' || tipo === 'ambos') {
        unidad.precio_uni = lote.precio_promedio_lote;
      }
      if (tipo === 'usd' || tipo === 'ambos') {
        unidad.precio_uni_me = lote.precio_promedio_lote_me;
      }
    });
  }

  public onGuardar(item: any) {

    const data = {
      id_almacen: item.id_almacen,
      id_articulo: item.id_articulo,
      id_anho: item.id_anho,
      precio_inicial_pen: item.precio_inicial_pen,
      precio_inicial_usd: item.precio_inicial_usd,
    };
    this.loadingSpinner = true;
    this.ventaPreciosService.add$(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getPrecios();
        this.loadingSpinner = false;
      }, err => {
        this.loadingSpinner = false;
      });
  }

  public onGuardarAll() {
    const ventaPrecios = this.ventaPrecios || [];

    const dataVentaPrecios = ventaPrecios.map(item => ({
      id_almacen: item.id_almacen,
      id_articulo: item.id_articulo,
      id_anho: item.id_anho,
      precio_inicial_pen: item.precio_inicial_pen,
      precio_inicial_usd: item.precio_inicial_usd,
    }));
    this.loadingSpinner = true;
    this.ventaPreciosService.add$({ items: dataVentaPrecios })
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getPrecios();
        this.loadingSpinner = false;
      }, err => {
        this.loadingSpinner = false;
      });
  }

  public onGuardarAllAgregados() {
    const ventaPrecios = this.ventaPreciosAgregados || [];

    const dataVentaPrecios = ventaPrecios.map(item => ({
      id_almacen: item.id_almacen,
      id_articulo: item.id_articulo,
      id_anho: item.id_anho,
      precio_inicial_pen: item.precio_inicial_pen,
      precio_inicial_usd: item.precio_inicial_usd,
    }));
    this.loadingSpinner = true;
    this.ventaPreciosService.add$({ items: dataVentaPrecios })
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getPrecios();
        this.loadingSpinner = false;
      }, err => {
        this.loadingSpinner = false;
      });
  }

  public onSincronizarArticulos() {
    this.loadingSpinner = true;
    this.ventaPreciosService.onSincronizarArticulos$({
      id_almacen: this.searchForm.value.id_almacen,
      id_anho: this.searchForm.value.id_anho
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getPrecios();
          this.loadingSpinner = false;
        },
        error: () => {
          this.loadingSpinner = false;
        }
      });
  }

  public onGuardarAllUnidades() {
    const ventaPrecios = this.ventaPreciosUnidades || [];
    if (ventaPrecios.length === 0) return;

    // Recolectar todas las actualizaciones de unidades individuales
    const actualizaciones: any[] = [];

    ventaPrecios.forEach(item => {
      if (item.lotes) {
        item.lotes.forEach((lote: any) => {
          if (lote.unidades) {
            lote.unidades.forEach((unidad: any) => {
              if (unidad.precio_unidad_pen || unidad.precio_unidad_usd) {
                actualizaciones.push({
                  id: unidad.id_articulo_unidad,
                  data: {
                    precio_uni_pen: unidad.precio_unidad_pen,
                    precio_uni_usd: unidad.precio_unidad_usd
                  }
                });
              }
            });
          }
        });
      }
    });

    if (actualizaciones.length === 0) {
      this.nbToastrService.show('No hay precios para guardar', 'Información', { status: 'info' });
      return;
    }

    this.loadingSpinner = true;

    // Ejecutar todas las actualizaciones
    const requests = actualizaciones.map(act =>
      this.articuloUnidadsService.updatePrecioUnidad$(act.id, act.data)
    );

    forkJoin(requests)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingSpinner = false)
      )
      .subscribe({
        next: () => {
          this.nbToastrService.show('Precios actualizados correctamente', 'Éxito', { status: 'success' });
          this.getPrecios();
        },
        error: () => {
          this.nbToastrService.show('Error al actualizar precios', 'Error', { status: 'danger' });
        }
      });
  }

  // Guardar precio por articulo (aplica a todas las unidades)
  public onGuardarPrecioArticulo(item: any) {
    if (!item.precio_inicial_pen && !item.precio_inicial_usd) {
      this.nbToastrService.show('Ingrese un precio', 'Advertencia', { status: 'warning' });
      return;
    }
    console.log(item);

    const data = {
      id_articulo: item.id_articulo,
      id_almacen: item.id_almacen_actual,
      id_anho: item.id_anho,
      precio_uni_pen: item.precio_inicial_pen ?? 0,
      precio_uni_usd: item.precio_inicial_usd ?? 0
    };

    this.loadingSpinner = true;
    this.articuloUnidadsService.updatePrecioByArticulo$(data)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingSpinner = false)
      )
      .subscribe({
        next: () => {
          this.nbToastrService.show('Precio aplicado a todas las unidades', 'Éxito', { status: 'success' });
          // Actualizar precios en la UI
          this.aplicarPrecioATodos(item, 'ambos');
          // this.getPrecios();
        },
        error: () => {
          this.nbToastrService.show('Error al aplicar precio', 'Error', { status: 'danger' });
        }
      });
  }

  // Guardar precio por lote (aplica a todas las unidades del lote)
  public onGuardarPrecioLote(item: any, lote: any) {
    if (!lote.precio_promedio_lote && !lote.precio_promedio_lote_me) {
      this.nbToastrService.show('Ingrese un precio para el lote', 'Advertencia', { status: 'warning' });
      return;
    }

    const data = {
      id_almacen: item.id_almacen_actual,
      id_anho: item.id_anho,
      id_articulo: item.id_articulo,
      lote_numero: lote.lote_numero,
      precio_uni: lote.precio_promedio_lote,
      precio_uni_me: lote.precio_promedio_lote_me
    };

    this.loadingSpinner = true;
    this.articuloUnidadsService.updatePrecioByLote$(data)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingSpinner = false)
      )
      .subscribe({
        next: () => {
          this.nbToastrService.show('Precio aplicado a las unidades del lote', 'Éxito', { status: 'success' });
          // Actualizar precios en la UI
          // this.getPrecios();
          this.aplicarPrecioLote(lote, 'ambos');
        },
        error: () => {
          this.nbToastrService.show('Error al aplicar precio al lote', 'Error', { status: 'danger' });
        }
      });
  }



  // Getter para filtrar unidades por nombre, lote o serie
  get unidadesFiltradas(): any[] {
    if (!this.busquedaUnidades?.trim()) {
      return this.ventaPreciosUnidades;
    }

    const termino = this.busquedaUnidades.toLowerCase().trim();

    return this.ventaPreciosUnidades.filter(item => {
      // Buscar en nombre del artículo
      if (String(item.articulo_nombre || '').toLowerCase().includes(termino)) return true;
      if (String(item.articulo_codigo || '').toLowerCase().includes(termino)) return true;
      if (String(item.codigo_almacen || '').toLowerCase().includes(termino)) return true;

      // Buscar en lotes y unidades
      if (item.lotes) {
        for (const lote of item.lotes) {
          // Buscar en número de lote
          if (String(lote.lote_numero || '').toLowerCase().includes(termino)) return true;

          // Buscar en series de unidades
          if (lote.unidades) {
            for (const unidad of lote.unidades) {
              if (String(unidad.serie || '').toLowerCase().includes(termino)) return true;
              if (String(unidad.modelo || '').toLowerCase().includes(termino)) return true;
            }
          }
        }
      }

      return false;
    });
  }

  // Método para resaltar texto que coincide con la búsqueda
  public highlightText(text: any): string {
    if (!text || !this.busquedaUnidades?.trim()) {
      return String(text || '');
    }

    const termino = this.busquedaUnidades.trim();
    const textStr = String(text);
    const regex = new RegExp(`(${this.escapeRegex(termino)})`, 'gi');
    return textStr.replace(regex, '<span class="search-highlight">$1</span>');
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Verificar si un item tiene coincidencia en artículo
  public tieneCoincidenciaArticulo(item: any): boolean {
    if (!this.busquedaUnidades?.trim()) return false;
    const termino = this.busquedaUnidades.toLowerCase().trim();
    return String(item.articulo_nombre || '').toLowerCase().includes(termino) ||
      String(item.articulo_codigo || '').toLowerCase().includes(termino) ||
      String(item.codigo_almacen || '').toLowerCase().includes(termino);
  }

  // Verificar si un lote tiene coincidencia
  public tieneCoincidenciaLote(lote: any): boolean {
    if (!this.busquedaUnidades?.trim()) return false;
    const termino = this.busquedaUnidades.toLowerCase().trim();
    return String(lote.lote_numero || '').toLowerCase().includes(termino);
  }

  // Verificar si una unidad tiene coincidencia
  public tieneCoincidenciaUnidad(unidad: any): boolean {
    if (!this.busquedaUnidades?.trim()) return false;
    const termino = this.busquedaUnidades.toLowerCase().trim();
    return String(unidad.serie || '').toLowerCase().includes(termino) ||
      String(unidad.modelo || '').toLowerCase().includes(termino);
  }

}
