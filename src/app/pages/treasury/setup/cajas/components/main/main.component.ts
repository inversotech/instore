import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/pages/shared/components';
import { SetupUserEnterpriseService } from 'src/app/core/providers/setup-user-enterprise.service';
import { AppDataService } from 'src/app/core/providers/app-data.service';
import { CajasService } from 'src/app/providers/services/treasury/cajas.service';
import { FormCajasModalComponent } from '../form-cajas-modal/form-cajas-modal.component';

@Component({
  selector: 'inverso-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  public cajas: any[] = [];
  public loadingSpinner: boolean = false;

  public searchForm: FormGroup = this.formBuilder.group({
    id_empresa: ['', Validators.required],
    id_empresa_sucursal: ['', Validators.required],
    text_search: [''],
  });

  private destroy$: Subject<void> = new Subject<void>();
  public empresas$ = this.getEmpresas$();
  public empresasSucursales: any[] = [];

  public empresaConfig = this.appDataService.getEmpresaConfig();

  constructor(private formBuilder: FormBuilder,
    private nbDialogService: NbDialogService,
    private cajasService: CajasService,
    private appDataService: AppDataService,
    private setupUserEnterpriseService: SetupUserEnterpriseService,
  ) { }

  ngOnInit() {
    this.suscribeForm();
    this.getCajas();
    this.setDefaultValues();


  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getEmpresas$(): Observable<any> {
    return this.setupUserEnterpriseService.getMisEmpresas$().pipe(map(res => res.data), catchError(() => of([])));
  }

  private suscribeForm() {
    this.searchForm.get('id_empresa')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        setTimeout(() => {
          this.getEmpresaSurcursales();
        }, 0);
      });

    this.searchForm.get('id_empresa_sucursal')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        setTimeout(() => {
          this.getCajas();
        }, 0);
      });
  }

  private getEmpresaSurcursales() {
    const id_empresa = this.searchForm.get('id_empresa')?.value;
    if (!id_empresa) {
      this.empresasSucursales = [];
      return;
    };
    this.setupUserEnterpriseService.getMisEmpresaSucursales$({ id_empresa })
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.empresasSucursales = response;
        if (this.searchForm.get('id_empresa_sucursal')?.value) {
          setTimeout(() => {
            this.searchForm.get('id_empresa_sucursal')?.patchValue(this.searchForm.get('id_empresa_sucursal')?.value);
          }, 0);
        }
      }, err => {
        this.empresasSucursales = [];
      });
  }


  private setDefaultValues() {
    if (this.empresaConfig) {
      this.searchForm.get('id_empresa')?.patchValue(this.empresaConfig.id_empresa);
      this.searchForm.get('id_empresa_sucursal')?.patchValue(this.empresaConfig.id_empresa_sucursal);
    }

  }

  public submitFormSearch() {
    this.getCajas();
  }

  public getCajas() {
    if (!this.searchForm.valid) return;
    const value = this.searchForm.value;
    const params = {
      id_empresa: value.id_empresa,
      id_empresa_sucursal: value.id_empresa_sucursal,
      text_search: value.text_search,
    };
    this.loadingSpinner = true;
    this.cajasService.getByQuery$(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.cajas = response || [];
          this.loadingSpinner = false;
        },
        error: (err) => {
          this.loadingSpinner = false;
        }
      });
  }

  public onRegistrarNuevo() {
    const modal = this.nbDialogService.open(FormCajasModalComponent);
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getCajas();
        }
      }, err => { });
  }

  public onActualizar(item: any) {
    const modal = this.nbDialogService.open(FormCajasModalComponent);
    modal.componentRef.instance.item = item;
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getCajas();
        }
      }, err => { });
  }

  public onDelete(item: any) {
    this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de eliminar el registro?' } })
      .onClose.subscribe(status => {
        if (status) {
          this.cajasService.delete$(item.id_caja)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              this.getCajas();
            });
        } else {
        }
      }, err => {
      });
  }


}
