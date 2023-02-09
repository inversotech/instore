import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { map, Subject, takeUntil } from 'rxjs';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { FormNuevoInvUserModalComponent } from '../form-nuevo-inv-user-modal/form-nuevo-inv-user-modal.component';
import { FormUpdateInvUserModalComponent } from '../form-update-inv-user-modal/form-update-inv-user-modal.component';

@Component({
  selector: 'open-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss']
})
export class ListaUsuariosComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public almacenUsuarios: any[] = [];
  public loadingSpinner: boolean = false;
  public filterForm = this.formBuilder.group({
    text_search: [],
  });
  public almacenId: any;

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
    private almacenUsuariosService: AlmacenUsuariosService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loadingSpinner = false;

    this.activatedRoute?.parent?.paramMap
      .pipe(
        map(res => res.get('id')),
        takeUntil(this.destroy$),
      ).subscribe(res => {
        this.almacenId = res;
        this.getAlmacenResponsables();
      });

    this.initPagination();
  }

  public pageChanged(event: any) {
    this.pagination.currentPage = event;
    this.getAlmacenResponsables();
  }

  private initPagination() {
    this.pagination.currentPage = 1;
    this.pagination.pageSize = 10;
    this.pagination.totalItems = 0;
  }
  public submitFormSearch() {
    this.getAlmacenResponsables();
  }

  public getAlmacenResponsables() {
    const textSearch = this.filterForm.get('text_search')?.value || '';

    const params = {
      text_search: textSearch,
      almacen_id: this.almacenId,
      page: this.pagination.currentPage,
      per_page: this.pagination.pageSize,
    };
    this.loadingSpinner = true;
    this.almacenUsuariosService.getByQuery$(params)
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
        this.almacenUsuarios = response.data;
      }, err => {
        this.almacenUsuarios = [];
        this.loadingSpinner = false;
      });
  }

  public onRegistrarNuevo() {
    if (!this.almacenId) return;
    const modal = this.nbDialogService.open(FormNuevoInvUserModalComponent);
    modal.componentRef.instance.almacenId = this.almacenId;
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getAlmacenResponsables();
        }
      }, err => { });
  }

  public onEliminar(item: any) {
    if (!item.almacen_id || !item.persona_id) return;

    if (confirm('Seguro que quieres eliminar el item?')) {
      this.loadingSpinner = true;
      this.almacenUsuariosService.deleteCustom$(item.almacen_id, item.persona_id)
        .pipe(
          takeUntil(this.destroy$))
        .subscribe(response => {
          this.loadingSpinner = false;
          this.getAlmacenResponsables();
        }, err => {
          this.loadingSpinner = false;
        });
    }
  }

  public onUpdate(item: any) {
    if (!item) return;
    const modal = this.nbDialogService.open(FormUpdateInvUserModalComponent);
    modal.componentRef.instance.item = item;
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getAlmacenResponsables();
        }
      }, err => { });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
