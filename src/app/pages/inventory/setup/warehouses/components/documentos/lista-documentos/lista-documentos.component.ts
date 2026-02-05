import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { map, Subject, takeUntil } from 'rxjs';
import { FormNuevoInvDocModalComponent } from '../form-nuevo-inv-doc-modal/form-nuevo-inv-doc-modal.component';
import { FormUpdateInvDocModalComponent } from '../form-update-inv-doc-modal/form-update-inv-doc-modal.component';
import { AlmacenDocumentosService } from 'src/app/providers/services/inventory/almacen-documentos.service';

@Component({
  selector: 'inverso-lista-documentos',
  templateUrl: './lista-documentos.component.html',
  styleUrls: ['./lista-documentos.component.scss']
})
export class ListaDocumentosComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public almacenDocumentos: any[] = [];
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
    private almacenDocumentosService: AlmacenDocumentosService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loadingSpinner = false;
    this.activatedRoute?.parent?.paramMap
      .pipe(
        map(res => res.get('id')),
        takeUntil(this.destroy$),
      ).subscribe(res => {
        this.almacenId = res;
        this.getAlmacenDocumentos();
      });
    this.initPagination();
  }

  public pageChanged(event: any) {
    this.pagination.currentPage = event;
    this.getAlmacenDocumentos();
  }

  private initPagination() {
    this.pagination.currentPage = 1;
    this.pagination.pageSize = 10;
    this.pagination.totalItems = 0;
  }
  public submitFormSearch() {
    this.getAlmacenDocumentos();
  }

  public getAlmacenDocumentos() {
    const textSearch = this.filterForm.get('text_search')?.value || '';
    const params = {
      text_search: textSearch,
      id_almacen: this.almacenId,
      page: this.pagination.currentPage,
      per_page: this.pagination.pageSize,
    };
    this.loadingSpinner = true;
    this.almacenDocumentosService.getByQuery$(params)
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
        this.almacenDocumentos = response.data;
      }, err => {
        this.almacenDocumentos = [];
        this.loadingSpinner = false;
      });
  }

  public onRegistrarNuevo() {
    if (!this.almacenId) return;
    const modal = this.nbDialogService.open(FormNuevoInvDocModalComponent);
    modal.componentRef.instance.almacenId = this.almacenId;
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getAlmacenDocumentos();
        }
      }, err => { });
  }

  public onEliminar(item: any) {
    if (!item.id_almacen || !item.id_conta_documento) return;

    if (confirm('Seguro que quieres eliminar el item?')) {
      this.loadingSpinner = true;
      this.almacenDocumentosService.deleteCustom$(item.id_almacen, item.id_conta_documento, item.id_tipo_operacion)
        .pipe(
          takeUntil(this.destroy$))
        .subscribe(response => {
          this.loadingSpinner = false;
          this.getAlmacenDocumentos();
        }, err => {
          this.loadingSpinner = false;
        });
    }
  }

  public onUpdate(item: any) {
    if (!item) return;
    const modal = this.nbDialogService.open(FormUpdateInvDocModalComponent);
    modal.componentRef.instance.item = item;
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getAlmacenDocumentos();
        }
      }, err => { });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
