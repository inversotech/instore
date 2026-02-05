import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/pages/shared/components';
import { SetupUserEnterpriseService } from 'src/app/core/providers/setup-user-enterprise.service';
import { AppDataService } from 'src/app/core/providers/app-data.service';
import { FormNuevoDocumentoModalComponent } from '../form-nuevo-documento-modal/form-nuevo-documento-modal.component';
import { ContaVoucherConfigsService } from 'src/app/providers/services/accounting/conta-voucher-configs.service';

@Component({
  selector: 'open-lista-general',
  templateUrl: './lista-general.component.html',
  styleUrls: ['./lista-general.component.scss']
})
export class ListaGeneralComponent implements OnInit, OnDestroy {
  public voucherConfigs: any[] = [];
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
    private contaVoucherConfigsService: ContaVoucherConfigsService,
    private appDataService: AppDataService,
    private setupUserEnterpriseService: SetupUserEnterpriseService,
  ) { }

  ngOnInit() {
    this.setDefaultValues();
    this.getVoucherConfigs();
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
        this.getVoucherConfigs();
      });
  }

  public submitFormSearch() {
    this.getVoucherConfigs();
  }

  public getVoucherConfigs() {
    const value = this.searchForm.value;
    const params = {
      text_search: value.text_search,
      id_empresa: value.id_empresa,
    };
    this.loadingSpinner = true;
    this.contaVoucherConfigsService.getByQuery$(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.voucherConfigs = response;
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
          this.getVoucherConfigs();
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
          this.getVoucherConfigs();
        }
      }, err => { });
  }

  public onDelete(item: any) {
    this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de eliminar el registro?' } })
      .onClose.subscribe(status => {
        if (status) {
          this.contaVoucherConfigsService.delete2$(item.id_empresa, item.id_tipo_voucher)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              this.getVoucherConfigs();
            });
        } else {
        }
      }, err => {
      });
  }


}
