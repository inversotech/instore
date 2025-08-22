import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MonedasService } from 'src/app/providers/services/accounting/monedas.service';
import { AnhosService } from 'src/app/providers/services/accounting/anhos.service';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { VentaPreciosService } from 'src/app/providers/services/sales/venta-precios.service';

@Component({
  selector: 'open-lista-general',
  templateUrl: './lista-general.component.html',
  styleUrls: ['./lista-general.component.scss']
})
export class ListaGeneralComponent implements OnInit, OnDestroy {
  public ventaPrecios: any[] = [];
  public loadingSpinner: boolean = false;

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
    this.ventaPreciosService.getByQuery$(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.ventaPrecios = response;
        this.loadingSpinner = false;
      }, err => {
        this.loadingSpinner = false;
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

}
