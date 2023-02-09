import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { map, Subject, takeUntil } from 'rxjs';
import { AnhosService } from 'src/app/providers/services/accounting/anhos.service';
import { AlmacenArticulosService } from 'src/app/providers/services/inventory/almacen-articulos.service';
import { FormNuevoInvArticuloModalComponent } from '../form-nuevo-inv-articulo-modal/form-nuevo-inv-articulo-modal.component';
import { FormUpdateInvArticuloModalComponent } from '../form-update-inv-articulo-modal/form-update-inv-articulo-modal.component';

@Component({
  selector: 'open-catalogo-articulos',
  templateUrl: './catalogo-articulos.component.html',
  styleUrls: ['./catalogo-articulos.component.scss']
})
export class CatalogoArticulosComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public almacenArticulos: any[] = [];
  // public almacenArticulos: any[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public loadingSpinner: boolean = false;
  // public textSearch: FormControl = new FormControl();
  public filterForm = this.formBuilder.group({
    anho_id: ['', Validators.required],
    text_search: [],
  });
  public almacenId: any;
  public anhos: any[] = [];

  public pagination: any = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
  };

  public paginationControls: any = {
    maxSize: 9,
    directionLinks: true,
    responsive: true,
    autoHide: true,
  };

  constructor(
    private nbDialogService: NbDialogService,
    private activatedRoute: ActivatedRoute,
    private almacenArticulosService: AlmacenArticulosService,
    private anhosService: AnhosService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loadingSpinner = false;

    this.activatedRoute?.parent?.paramMap
      .pipe(
        map(res => res.get('id')),
        takeUntil(this.destroy$),
      ).subscribe(res => {
        this.almacenId = res;
        this.getMasters();
      });

    this.initPagination();
    this.subscribeForm();
  }

  private getMasters() {
    this.anhosService.getAll$()
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.anhos = response;
        if (this.anhos.length > 0) {
          setTimeout(() => {
            this.filterForm.get('anho_id')?.patchValue(this.anhos[0].anho_id);
          }, 0);
        }
      }, err => {
        this.anhos = [];
      });
  }

  private subscribeForm() {
    this.filterForm.get('anho_id')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.getAlmacenArticulos();
      });
  }

  public pageChanged(event: any) {
    this.pagination.currentPage = event;
    this.getAlmacenArticulos();
  }

  private initPagination() {
    this.pagination.currentPage = 1;
    this.pagination.pageSize = 10;
    this.pagination.totalItems = 0;
  }
  public submitFormSearch() {
    this.getAlmacenArticulos();
  }

  public getAlmacenArticulos() {
    const textSearch = this.filterForm.get('text_search')?.value || '';
    const anhoId = this.filterForm.get('anho_id')?.value || '';
    if (!anhoId) return;

    const params = {
      text_search: textSearch,
      anho_id: anhoId,
      almacen_id: this.almacenId,
      page: this.pagination.currentPage,
      per_page: this.pagination.pageSize,
    };
    this.loadingSpinner = true;
    this.almacenArticulosService.getByQuery$(params)
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(response => {
        if (response) {
          this.pagination.currentPage = response.current_page;
          this.pagination.pageSize = response.per_page;
          this.pagination.totalItems = response.total;
        } else {
          this.initPagination();
        }
        this.loadingSpinner = false;
        this.almacenArticulos = response.data;
      }, err => {
        this.almacenArticulos = [];
        this.loadingSpinner = false;
      });
  }

  public onRegistrarNuevo() {
    if (!this.almacenId) return;
    const modal = this.nbDialogService.open(FormNuevoInvArticuloModalComponent);
    modal.componentRef.instance.almacenId = this.almacenId;
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getAlmacenArticulos();
        }
      }, err => { });
  }

  public onEliminar(item: any) {
    if (!item.anho_id || !item.almacen_id || !item.articulo_id) return;

    if (confirm('Seguro que quieres eliminar el item?')) {
      this.loadingSpinner = true;
      this.almacenArticulosService.deleteCustom$(item.anho_id, item.almacen_id, item.articulo_id)
        .pipe(
          takeUntil(this.destroy$))
        .subscribe(response => {
          this.loadingSpinner = false;
          this.getAlmacenArticulos();
        }, err => {
          this.loadingSpinner = false;
        });
    }
  }

  public onUpdate(item: any) {
    if (!item) return;
    const modal = this.nbDialogService.open(FormUpdateInvArticuloModalComponent);
    modal.componentRef.instance.item = item;
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getAlmacenArticulos();
        }
      }, err => { });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
