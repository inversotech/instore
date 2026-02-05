import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AlmacenesService } from 'src/app/providers/services/inventory/almacenes.service';

@Component({
  selector: 'open-warehouse-main',
  templateUrl: './warehouse-main.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./warehouse-main.component.scss']
})
export class WarehouseMainComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public params: any;

  public tabs = [
    {
      title: 'Datos Generales',
      route: './datos-generales',
      icon: 'grid-outline',
      responsive: true, // hide title before `route-tabs-icon-only-max-width` value
    },
    {
      title: 'Catálogo de artículos',
      route: './catalogo-articulos',
      icon: 'list-outline',
      responsive: true, // hide title before `route-tabs-icon-only-max-width` value
    },
    {
      title: 'Responsables',
      route: './responsibles',
      icon: 'people-outline',
      responsive: true, // hide title before `route-tabs-icon-only-max-width` value
    },
    {
      title: 'Documentos',
      route: './documentos',
      icon: 'list-outline',
      responsive: true, // hide title before `route-tabs-icon-only-max-width` value
    },
  ];

  private almacenId: any;
  public almacenData: any;
  public loadingSave: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private almacenesService: AlmacenesService,
  ) { }

  ngOnInit() {
    this.activatedRoute
      .queryParamMap
      .pipe(
        map((res: any) => res.params),
        takeUntil(this.destroy$),
      ).subscribe((response) => {
        this.params = response;
      });

    this.activatedRoute?.paramMap
      .pipe(
        map(res => res.get('id')),
        takeUntil(this.destroy$),
      ).subscribe(res => {
        this.almacenId = res;
        this.getAlmacen();
      });
  }

  private getAlmacen() {
    // if (!this.pedidoCompraData) return;
    if (!this.almacenId) return;
    this.loadingSave = true;
    this.almacenesService.getById$(this.almacenId)
      .pipe(map(res => res.data),
        takeUntil(this.destroy$), finalize(() => this.loadingSave = false))
      .subscribe(response => {
        setTimeout(() => {
          this.almacenData = response;
        }, 0);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }




  public onBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute, queryParams: this.params });
  }


}
