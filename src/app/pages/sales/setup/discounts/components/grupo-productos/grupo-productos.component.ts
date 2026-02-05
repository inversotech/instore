import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AnhosService } from 'src/app/providers/services/accounting/anhos.service';
import { DiscountsCoreService } from 'src/app/providers/services/sales/discounts.core.service';
@Component({
  selector: 'inverso-grupo-productos',
  templateUrl: './grupo-productos.component.html',
  styleUrls: ['./grupo-productos.component.scss']
})
export class GrupoProductosComponent implements OnInit, OnDestroy {
  public anhos$ = this.anhosService.getAll$();
  public formProductos !: FormGroup;
  public loadingSpinnerSave = false;
  public articulos: any[] = [];
  public id_venta_descuento: any;
  public articulosOriginal: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: NbDialogService,
    private anhosService: AnhosService,
    private discountsCoreService: DiscountsCoreService,
    private nbToastrService: NbToastrService,
  ) { }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.formProductos = this.formBuilder.group({
      id_anho: [2025, Validators.required]
    });

    this.id_venta_descuento = this.activatedRoute.snapshot.paramMap.get('id_venta_descuento');
    if (!this.id_venta_descuento) {
      console.warn('No se encontró id_venta_descuento en la ruta');
      return;
    } else {
      // setTimeout(() => {
      this.cargarProductos();
      // }, 100);
    }

    // Escucha cambios en el año
    this.formProductos.get('id_anho')?.valueChanges.subscribe((nuevoAnho) => {
      setTimeout(() => {
        this.cargarProductos();
      }, 0);
    });
  }

  private cargarProductos() {
    const id_anho = this.formProductos.get('id_anho')?.value
    if (!id_anho) return;
    if (!this.id_venta_descuento) return;
    this.loadingSpinnerSave = true;
    this.discountsCoreService.getGrupoProductos(this.id_venta_descuento, id_anho).subscribe({
      next: (data) => {
        this.loadingSpinnerSave = false;
        this.articulos = data;
        this.articulosOriginal = JSON.parse(JSON.stringify(data)); // copia profunda
        console.log(`Artículos del año ${id_anho}:`, data);
      },
      error: (err) => {
        this.loadingSpinnerSave = false;
        console.error(`Error al cargar artículos del año ${id_anho}:`, err);
      }
    });
  }

  public onSave() {
    if (!this.id_venta_descuento) {
      this.nbToastrService.info('No se encontró id_venta_descuento en la ruta', 'Un momento');
      return;
    };

    const ids_articulos_add_checkeds: number[] = [];
    const ids_articulos_remove_checkeds: number[] = [];

    this.articulos.forEach((articulo, index) => {
      const original = this.articulosOriginal[index];
      if (original.checked === false && articulo.checked === true) {
        ids_articulos_add_checkeds.push(articulo.id_articulo);
      }
      if (original.checked === true && articulo.checked === false && articulo.id_articulo) {
        ids_articulos_remove_checkeds.push(articulo.id_articulo);
      }
    });

    const payload = {
      ids_articulos_add_checkeds,
      ids_articulos_remove_checkeds,
    };
    this.loadingSpinnerSave = true;
    this.discountsCoreService.postGrupoProductos(this.id_venta_descuento, payload).subscribe({
      next: (res) => {
        this.loadingSpinnerSave = false;
        this.cargarProductos();
      },
      error: (err) => {
        this.loadingSpinnerSave = false;
      }
    });
  }

  public onClose() {
    this.router.navigate(['../../'], { relativeTo: this.activatedRoute }); // vuelve a ListaGeneralComponent
  }

  onBack() {
    this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
  }
}

