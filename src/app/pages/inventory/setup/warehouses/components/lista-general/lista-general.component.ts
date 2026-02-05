import { Component, OnInit, OnDestroy } from '@angular/core';
import { getDateToday } from '../../shared/utils';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/pages/shared/components';
import { AlmacenesService } from 'src/app/providers/services/inventory/almacenes.service';
import { FormNuevoWarehouseModalComponent } from '../form-nuevo-warehouse-modal/form-nuevo-warehouse-modal.component';

@Component({
  selector: 'open-lista-general',
  templateUrl: './lista-general.component.html',
  styleUrls: ['./lista-general.component.scss']
})
export class ListaGeneralComponent implements OnInit, OnDestroy {
  public almacenes: any[] = [];
  public loadingSpinner: boolean = false;
  public textSearch: FormControl = new FormControl();
  private destroy$: Subject<void> = new Subject<void>();

  get today() {
    return getDateToday();
  }

  public pagination: any = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 15,
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
    private almacenesService: AlmacenesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    // Seleccionar si hay params en la ruta
    this.activatedRoute
      .queryParamMap
      .pipe(
        map((res: any) => res.params),
        takeUntil(this.destroy$),
      ).subscribe((response) => {
        if (response.text_search) {
          // setTimeout(() => {
          this.textSearch.patchValue(response.text_search);
          // }, 700);
        }
      });

    // this.loadingSpinner = false;
    this.getAlmacenes();
    this.initPagination();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public pageChanged(event: any) {
    this.pagination.currentPage = event;
    this.getAlmacenes();
  }

  private initPagination() {
    this.pagination.currentPage = 1;
    this.pagination.pageSize = 15;
    this.pagination.totalItems = 0;
  }

  public submitFormSearch() {
    this.getAlmacenes();
  }

  public getAlmacenes() {
    const textSearch = this.textSearch.value || '';
    const params = {
      text_search: textSearch,
      page: this.pagination.currentPage,
      per_page: this.pagination.pageSize,
    };

    this.loadingSpinner = true;
    this.almacenesService.getByQuery$(params)
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.almacenes = response;
        this.loadingSpinner = false;
      }, err => {
        this.loadingSpinner = false;
      });
  }

  public onRegistrarNuevo() {
    const modal = this.nbDialogService.open(FormNuevoWarehouseModalComponent);
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getAlmacenes();
        }
      }, err => { });
  }


  public onManageAlmacen(item: any) {

    this.router.navigate(['./', item.id_almacen], {
      relativeTo: this.activatedRoute, queryParams: {
        text_search: this.textSearch.value,
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
  //         this.getAlmacenes();
  //       }
  //     }, err => { });
  // }

  public onDelete(userId: any) {
    this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de eliminar el almacén?' } })
      .onClose.subscribe(status => {
        if (status) {
          this.almacenesService.delete$(userId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              this.getAlmacenes();
            });
        } else {
        }
      }, err => {
      });

  }


}
