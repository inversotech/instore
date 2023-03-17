import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/pages/shared/components';
import { AlmacenesService } from 'src/app/providers/services/inventory/almacenes.service';
import { FormNuevoMovimientoModalComponent } from '../form-nuevo-movimiento-modal/form-nuevo-movimiento-modal.component';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { VouchersService } from 'src/app/providers/services/accounting/vouchers.service';
import { AnhosService } from 'src/app/providers/services/accounting/anhos.service';
import { MesesService } from 'src/app/providers/services/accounting/meses.service';
// import { FormNuevoWarehouseModalComponent } from '../form-nuevo-warehouse-modal/form-nuevo-warehouse-modal.component';

@Component({
  selector: 'open-lista-general',
  templateUrl: './lista-general.component.html',
  styleUrls: ['./lista-general.component.scss']
})
export class ListaGeneralComponent implements OnInit, OnDestroy {
  public anhos: any[] = [];
  public meses: any[] = [];
  public vouchers: any[] = [];
  public movimientos: any[] = [];
  public loadingSpinner: boolean = false;
  // public textSearch: FormControl = new FormControl();
  public filterForm: FormGroup = this.formBuilder.group({
    anho_id: ['', Validators.required],
    mes_id: ['', Validators.required],
    voucher_id: ['-1'],
    text_search: [''],
  });
  private destroy$: Subject<void> = new Subject<void>();

  public pagination: any = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  };

  public paginationControls: any = {
    maxSize: 9,
    directionLinks: true,
    responsive: true,
    autoHide: true,
  };
  // public currentPage: number;
  // public pageSize: number;
  // public totalItems: number;

  constructor(private formBuilder: FormBuilder,
    private nbDialogService: NbDialogService,
    private movimientosService: MovimientosService,
    private vouchersService: VouchersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private anhosService: AnhosService,
    private mesesService: MesesService,
  ) { }

  ngOnInit() {
    // Seleccionar si hay params en la ruta
    this.activatedRoute
      .queryParamMap
      .pipe(
        map((res: any) => res.params),
        takeUntil(this.destroy$),
      ).subscribe((response) => {
        if (response.voucher_id) {
          setTimeout(() => {
            this.filterForm.get('voucher_id')?.patchValue(parseInt(response.voucher_id));
          }, 1000);
        }
        if (response.text_search) {
          // setTimeout(() => {
          this.filterForm.get('text_search')?.patchValue(response.text_search);
          // }, 700);
        }
      });
    this.getMasters();
    this.suscribeForm();
    this.initPagination();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public pageChanged(event: any) {
    this.pagination.currentPage = event;
    this.getInventarioMovimientos();
  }

  private initPagination() {
    this.pagination.currentPage = 1;
    this.pagination.pageSize = 15;
    this.pagination.totalItems = 0;
  }

  private suscribeForm() {

    this.filterForm.get('mes_id')?.valueChanges
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(response => {
        setTimeout(() => {
          this.getVouchers();
        }, 0);
      });

    this.filterForm.get('anho_id')?.valueChanges
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(response => {
        setTimeout(() => {
          this.getVouchers();
        }, 0);
      });

    this.filterForm.get('voucher_id')?.valueChanges
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(response => {
        setTimeout(() => {
          this.getInventarioMovimientos();
        }, 0);
      });
  }

  public submitFormSearch() {
    this.getInventarioMovimientos();
  }

  public getMasters() {

    this.anhosService.getAll$()
      .pipe(
        map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.loadingSpinner = false;
        const anhos: any[] = response || [];
        this.anhos = anhos;
        const selected = anhos.find(res => res.is_selected);
        if (selected) {
          setTimeout(() => {
            this.filterForm.get('anho_id')?.patchValue(selected.anho_id);
          }, 0);
        }
      }, err => {
        this.loadingSpinner = false;
        this.anhos = [];
      });

    this.mesesService.getAll$()
      .pipe(
        map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.loadingSpinner = false;
        const meses: any[] = response || [];
        this.meses = meses;
        const selected = meses.find(res => res.is_selected);
        if (selected) {
          setTimeout(() => {
            this.filterForm.get('mes_id')?.patchValue(selected.mes_id);
          }, 0);
        }
      }, err => {
        this.loadingSpinner = false;
        this.meses = [];
      });
  }

  public getVouchers() {
    if (!this.filterForm.value.anho_id) return;
    if (!this.filterForm.value.mes_id) return;

    this.loadingSpinner = true;
    const params = {
      anho_id: this.filterForm.value.anho_id,
      mes_id: this.filterForm.value.mes_id,
    };
    this.vouchersService.getToFilterAll$(params)
      .pipe(
        map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.loadingSpinner = false;
        this.vouchers = response || [];
        if (this.vouchers.length > 0) {
          setTimeout(() => {
            this.filterForm.get('voucher_id')?.patchValue((this.vouchers[0].voucher_id));
          }, 0);
        } else {
          setTimeout(() => {
            this.filterForm.get('voucher_id')?.patchValue('-1');
          }, 0);
        }
      }, err => {
        this.loadingSpinner = false;
        this.vouchers = [];
        setTimeout(() => {
          this.filterForm.get('voucher_id')?.patchValue('-1');
        }, 0);
      });
  }

  public getInventarioMovimientos() {
    if (!this.filterForm.valid) return;
    if (!this.filterForm.value.voucher_id) return;

    const textSearch = this.filterForm.get('text_search')?.value || '';
    const params = {
      text_search: textSearch,
      page: this.pagination.currentPage,
      per_page: this.pagination.pageSize,
      voucher_id: this.filterForm.value.voucher_id,
    };
    this.loadingSpinner = true;
    this.movimientosService.getByQuery$(params)
      .pipe(
        // map(res => res.data),
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
        this.movimientos = response.data;
      }, err => {
        this.movimientos = [];
        this.loadingSpinner = false;
      });
  }

  public onRegistrarNuevo() {
    const modal = this.nbDialogService.open(FormNuevoMovimientoModalComponent);
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel && res.data) {
          this.onManage(res.data);
        }
      }, err => { });
  }

  public onManage(item: any) {

    this.router.navigate(['./', item.movimiento_id], {
      relativeTo: this.activatedRoute, queryParams: {
        text_search: this.filterForm.get('text_search')?.value,
        voucher_id: this.filterForm.get('voucher_id')?.value,
      },
    });

  }

  // public onManageRols(userId: any, userNombre: any) {
  //   const modal = this.nbDialogService.open(FormManageRolesModalComponent);
  //   modal.componentRef.instance.userId = userId;
  //   modal.componentRef.instance.nombreUser = userNombre;
  //   modal.onClose
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(res => {
  //       if (!res.cancel) {
  //         this.getInventarioMovimientos();
  //       }
  //     }, err => { });
  // }

  public onDelete(item: any) {
    if (!item) return;

    this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de eliminar el almacén?' } })
      .onClose.subscribe(status => {
        if (status) {
          this.movimientosService.delete$(item.movimiento_id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              this.getInventarioMovimientos();
            });
        } else {
        }
      }, err => {
      });

  }

  public onEnable(item: any) {

    if (!confirm('¿Estas seguro (a)?')) return;

    this.loadingSpinner = true;
    this.movimientosService.enable$(item.movimiento_id, {})
      .pipe(
        map(res => res.data),
        takeUntil(this.destroy$),
        finalize(() => this.loadingSpinner = false)
      )
      .subscribe((values: any) => {
        this.getInventarioMovimientos();
      }, (err: any) => {
      });
  }



}
