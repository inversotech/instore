import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { SetupUserEnterpriseService } from 'src/app/core/providers/setup-user-enterprise.service';
import { AppDataService } from 'src/app/core/providers/app-data.service';
import { FormOpenCajaModalComponent } from '../form-open-caja-modal/form-open-caja-modal.component';
import { CajaDiariosService } from 'src/app/providers/services/treasury/caja-diarios.service';
import { FormCloseCajaModalComponent } from '../form-close-caja-modal/form-close-caja-modal.component';

@Component({
  selector: 'inverso-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  public cajaDiarios: any[] = [];
  public loadingSpinner: boolean = false;

  public searchForm: FormGroup = this.formBuilder.group({
    id_empresa: ['', Validators.required],
    id_anho: ['', Validators.required],
    id_mes: ['', Validators.required],
    id_medio_pago: ['008', Validators.required],
    text_search: [''],
  });

  private destroy$: Subject<void> = new Subject<void>();
  public empresas$ = this.getEmpresas$();
  public mediosPagos$: Observable<any> = this.cajaDiariosService.getMediosPago$().pipe(
    map(res => res),
    catchError(() => of([]))
  );
  // public empresasSucursales$ = this.getEmpresaSucursales$();

  public empresaConfig = this.appDataService.getEmpresaConfig();

  constructor(private formBuilder: FormBuilder,
    private nbDialogService: NbDialogService,
    private cajaDiariosService: CajaDiariosService,
    private appDataService: AppDataService,
    private setupUserEnterpriseService: SetupUserEnterpriseService,
  ) { }

  ngOnInit() {
    this.setDefaultValues();
    this.getDiarioCajas();
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
        setTimeout(() => {
          this.getDiarioCajas();
        }, 0);
      });

    this.searchForm.get('id_medio_pago')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        setTimeout(() => {
          this.getDiarioCajas();
        }, 0);
      });
  }

  public submitFormSearch() {
    this.getDiarioCajas();
  }

  public getDiarioCajas() {
    const value = this.searchForm.value;
    const params = {
      text_search: value.text_search,
      id_empresa: value.id_empresa,
      id_anho: value.id_anho,
      id_mes: value.id_mes,
      id_medio_pago: value.id_medio_pago
    };
    this.loadingSpinner = true;
    this.cajaDiariosService.getByQuery$(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.cajaDiarios = response;
        this.loadingSpinner = false;
      }, err => {
        this.loadingSpinner = false;
      });
  }

  public onRegistrarNuevo() {
    const modal = this.nbDialogService.open(FormOpenCajaModalComponent);
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getDiarioCajas();
        }
      }, err => { });
  }

  public onCloseCaja(item: any) {
    const modal = this.nbDialogService.open(FormCloseCajaModalComponent);
    modal.componentRef.instance.item = item;
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.getDiarioCajas();
        }
      }, err => { });
  }

  public onDelete(item: any) {
    if (!confirm('¿Estás seguro de eliminar el registro?')) return;

    // this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de eliminar el registro?' } })
    //   .onClose.subscribe(status => {
    //     if (status) {
    this.cajaDiariosService.delete$(item.id_caja_diario)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getDiarioCajas();
      });
    //   } else {
    //   }
    // }, err => {
    // });
  }


}
