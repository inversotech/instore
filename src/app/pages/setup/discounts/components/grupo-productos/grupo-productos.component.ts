import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AnhosService } from 'src/app/providers/services/accounting/anhos.service';
import { DiscountsCoreService } from 'src/app/providers/services/sales/discounts.core.service';
@Component({
  selector: 'open-grupo-productos',
  templateUrl: './grupo-productos.component.html',
  styleUrls: ['./grupo-productos.component.scss']
})
export class GrupoProductosComponent implements OnInit, OnDestroy {
  public anhos$ = this.anhosService.getAll$();
  public formProductos !: FormGroup;
  public loadingSpinnerSave = false;
  public articulos: any[] = []
  private articulosOriginal: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: NbDialogService,
    private anhosService: AnhosService,
    private discountsCoreService: DiscountsCoreService,
 ) { }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.formProductos = this.formBuilder.group({
      id_anho: [2025, Validators.required]
    });

    const id_descuento = this.activatedRoute.snapshot.paramMap.get('id_descuento');
    const id_anho = this.formProductos.get('id_anho')?.value;


    if (!id_descuento) {
      console.warn('No se encontró id_descuento en la ruta');
      return;
    }

    // Carga inicial
    this.cargarProductos(id_descuento, this.formProductos.get('id_anho')?.value);

    // Escucha cambios en el año
    this.formProductos.get('id_anho')?.valueChanges.subscribe((nuevoAnho) => {
      this.cargarProductos(id_descuento, nuevoAnho);
    });
  }

  private cargarProductos(id_descuento: string, id_anho: number) {
    this.discountsCoreService.getGrupoProductos(id_descuento, id_anho).subscribe({
      next: (data) => {

        this.articulos = data;
        this.articulosOriginal = JSON.parse(JSON.stringify(data)); // copia profunda
        console.log(`Artículos del año ${id_anho}:`, data);
      },
      error: (err) => {
        console.error(`Error al cargar artículos del año ${id_anho}:`, err);
      }
    });
  }

  public onSave() {
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
      ids_articulos_remove_checkeds
    };

    const id_descuento = this.activatedRoute.snapshot.paramMap.get('id_descuento');
    console.log('Payload enviado:', payload);
    if (!id_descuento) {
  console.error('No se encontró id_descuento en la ruta');
  return;
}

    this.discountsCoreService.postGrupoProductos(id_descuento, payload).subscribe({
      next: (res) => {
        console.log('Guardado exitosamente:', res);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
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

