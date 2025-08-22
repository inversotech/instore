import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, map, of, takeUntil } from 'rxjs';
import { MesesService } from 'src/app/providers/services/accounting/meses.service';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { SalesService } from 'src/app/providers/services/sales/sales.service';

@Component({
  selector: 'open-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public misAlmacenes$ = this.almacenUsuariosService.getMisAlmacenes$({});
  // public ventaNoFinalizadas$ = this.salesService.getSalesNoFinalized$({});
  public loadingSpinner: boolean = false;
  public ventasNoFinalizadasPorAlmacen: { [key: string]: any[] } = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private salesService: SalesService,
    private almacenUsuariosService: AlmacenUsuariosService,
  ) { }

  ngOnInit() {

    this.misAlmacenes$.subscribe(almacenes => {
      almacenes.forEach((almacen: any) => {
        this.loadVentasNoFinalizadas(almacen.id_almacen);
      });
    });

    // this.getSalesNoFinalized();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadVentasNoFinalizadas(almacenId: string) {
    this.loadingSpinner = true;
    this.salesService.getSalesNoFinalized$({ id_almacen: almacenId }).pipe(takeUntil(this.destroy$))
      .subscribe(ventas => {
        this.ventasNoFinalizadasPorAlmacen[almacenId] = ventas;
        this.loadingSpinner = false;
      });
  }

  public onCreateVenta(almacen: any) {
    this.loadingSpinner = true;
    this.salesService.addSale$({ id_almacen: almacen.id_almacen })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loadingSpinner = false;
          this.router.navigate(['./', response.id_venta], { relativeTo: this.activatedRoute });
        },
        error: (err) => {
          this.loadingSpinner = false;
        }
      });
  }

  public onContinueVenta(venta: any) {
    this.router.navigate(['./', venta.id_venta], { relativeTo: this.activatedRoute });
  }

  public onDeleteVenta(venta: any) {
    this.loadingSpinner = true;
    this.salesService.deleteSale$(venta.id_venta)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loadingSpinner = false;
          this.loadVentasNoFinalizadas(venta.id_almacen);
        },
        error: (err) => {
          this.loadingSpinner = false;
        }
      });
  }

}
