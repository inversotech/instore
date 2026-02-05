import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SalesService } from 'src/app/providers/services/sales/sales.service';

@Component({
  selector: 'inverso-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public misPuntoVentas$ = this.salesService.getMisPuntoVentas$({});
  // public ventaNoFinalizadas$ = this.salesService.getSalesNoFinalized$({});
  public loadingSpinner: boolean = false;
  public ventasNoFinalizadasPorPuntoVenta: { [key: string]: any[] } = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private salesService: SalesService,
    // private almacenUsuariosService: AlmacenUsuariosService,
  ) { }

  ngOnInit() {

    this.misPuntoVentas$.subscribe(puntoVentas => {
      puntoVentas.forEach((puntoVenta: any) => {
        this.loadVentasNoFinalizadas(puntoVenta.id_punto_venta);
      });
    });
    // this.getSalesNoFinalized();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadVentasNoFinalizadas(id_punto_venta: string) {
    this.loadingSpinner = true;
    this.salesService.getSalesNoFinalized$({ id_punto_venta: id_punto_venta }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loadingSpinner = false;
          this.ventasNoFinalizadasPorPuntoVenta[id_punto_venta] = response;
        },
        error: (err) => {
          this.loadingSpinner = false;
        }
      });
  }

  public onCreateVenta(puntoVenta: any) {
    this.loadingSpinner = true;
    this.salesService.addSale$({ id_punto_venta: puntoVenta.id_punto_venta })
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
          this.loadVentasNoFinalizadas(venta.id_punto_venta);
        },
        error: (err) => {
          this.loadingSpinner = false;
        }
      });
  }

}
