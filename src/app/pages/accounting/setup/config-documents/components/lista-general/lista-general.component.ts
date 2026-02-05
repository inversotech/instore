import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/pages/shared/components';
// import { FormNuevoWarehouseModalComponent } from '../form-nuevo-warehouse-modal/form-nuevo-warehouse-modal.component';
import { SetupUserEnterpriseService } from 'src/app/core/providers/setup-user-enterprise.service';
import { AppDataService } from 'src/app/core/providers/app-data.service';
import { ContaDocumentsService } from 'src/app/providers/services/accounting/conta-documents.service';
import { FormNuevoDocumentoModalComponent } from '../form-nuevo-documento-modal/form-nuevo-documento-modal.component';

@Component({
  selector: 'open-lista-general',
  templateUrl: './lista-general.component.html',
  styleUrls: ['./lista-general.component.scss']
})
export class ListaGeneralComponent implements OnInit, OnDestroy {
  public documentos: any[] = [];
  public loadingSpinner: boolean = false;

  public searchForm: FormGroup = this.formBuilder.group({
    id_empresa: ['', Validators.required],
    text_search: [''],
  });

  private destroy$: Subject<void> = new Subject<void>();
  public empresas$ = this.getEmpresas$();
  // public empresasSucursales$ = this.getEmpresaSucursales$();

  public empresaConfig = this.appDataService.getEmpresaConfig();

  constructor(private formBuilder: FormBuilder,
    private nbDialogService: NbDialogService,
    private contaDocumentsService: ContaDocumentsService,
    private appDataService: AppDataService,
    private setupUserEnterpriseService: SetupUserEnterpriseService,
  ) { }

  ngOnInit() {
    this.setDefaultValues();
    this.getDocumentos();
    // this.initPagination();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getEmpresas$(): Observable<any> {
    return this.setupUserEnterpriseService.getMisEmpresas$().pipe(map(res => res.data), catchError(() => of([])));
  }

  // private getEmpresaSucursales$(): Observable<any> {
  //   return this.searchForm.get('id_empresa')?.valueChanges.pipe(
  //     switchMap(id_empresa => this.setupUserEnterpriseService.getMisEmpresaSucursales$({ id_empresa }).pipe(map(res => res.data)))
  //   ) ?? of([]);
  // }

  private setDefaultValues() {
    if (this.empresaConfig) {
      setTimeout(() => {
        this.searchForm.get('id_empresa')?.patchValue(this.empresaConfig.id_empresa);
      }, 0);
    }

    this.searchForm.get('id_empresa')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getDocumentos();
      });
  }

  public submitFormSearch() {
    this.getDocumentos();
  }

  public getDocumentos() {
    const value = this.searchForm.value;
    const params = {
      text_search: value.text_search,
      id_empresa: value.id_empresa,
    };

    this.loadingSpinner = true;
    this.contaDocumentsService.getByQuery2$(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.documentos = response;
        this.loadingSpinner = false;
      }, err => {
        this.loadingSpinner = false;
      });
  }

  public onRegistrarNuevo() {
    const modal = this.nbDialogService.open(FormNuevoDocumentoModalComponent);
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getDocumentos();
        }
      }, err => { });
  }

  public onUpdate(item: any) {
    const modal = this.nbDialogService.open(FormNuevoDocumentoModalComponent);
    modal.componentRef.instance.item = item;
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getDocumentos();
        }
      }, err => { });
  }

  public onDelete(item: any) {
    this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de eliminar el registro?' } })
      .onClose.subscribe(status => {
        if (status) {
          this.contaDocumentsService.delete2$(item.id_conta_documento)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              this.getDocumentos();
            });
        } else {
        }
      }, err => {
      });
  }


}
