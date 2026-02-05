import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CajasService } from 'src/app/providers/services/treasury/cajas.service';
import { SetupUserEnterpriseService } from 'src/app/core/providers/setup-user-enterprise.service';

@Component({
  selector: 'inverso-form-cajas-modal',
  templateUrl: './form-cajas-modal.component.html',
  styleUrls: ['./form-cajas-modal.component.scss']
})
export class FormCajasModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loadingSpinnerSave: boolean = false;
  public medioPagos: any[] = [];
  public contaMonedas: any[] = [];
  public documentos: any[] = [];

  public misEmpresas: any[] = [];
  public misEmpresasSucursales: any[] = [];

  public newForm: FormGroup = this.formBuilder.group({
    id_empresa: ['', [Validators.required]],
    id_empresa_sucursal: ['', [Validators.required]],
    id_medio_pago: ['', [Validators.required]],
    id_conta_documento: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    id_moneda: ['', [Validators.required]],
    activo: [false, [Validators.required]],
  });


  public adata: any = null;
  @Input('item') set item(data: any) {
    if (data) {
      this.adata = data;
      this.newForm.patchValue({
        id_empresa: data.id_empresa,
        id_empresa_sucursal: data.id_empresa_sucursal,
        id_medio_pago: data.id_medio_pago,
        id_conta_documento: data.id_conta_documento,
        nombre: data.nombre,
        descripcion: data.descripcion,
        id_moneda: data.id_moneda,
        activo: data.activo
      });
      this.newForm.get('id_empresa')?.disable();
      this.newForm.get('id_empresa_sucursal')?.disable();
      this.newForm.get('id_medio_pago')?.disable();
      this.newForm.get('id_conta_documento')?.disable();
      this.newForm.get('id_moneda')?.disable();
    }
  }

  constructor(private dialogRef: NbDialogRef<FormCajasModalComponent>,
    private formBuilder: FormBuilder,
    private cajasService: CajasService,
    private setupUserEnterpriseService: SetupUserEnterpriseService,
  ) { }

  ngOnInit() {
    this.suscribeForm();

    this.cajasService.getMedioPagos$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.medioPagos = response || [];
      });

    this.cajasService.getContaMonedas$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.contaMonedas = response || [];
      });

    this.cajasService.getContaDocumentos$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.documentos = response || [];
      });

    this.setupUserEnterpriseService.getMisEmpresas$()
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.misEmpresas = response;
        if( this.adata ) {
          this.newForm.get('id_empresa')?.patchValue(this.adata.id_empresa);
        }
      }, err => {
        this.misEmpresas = [];
      });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private suscribeForm() {
    this.newForm.get('id_empresa')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        setTimeout(() => {
          this.getEmpresaSurcursales();
        }, 0);
      });
  }

  private getEmpresaSurcursales() {
    const id_empresa = this.newForm.get('id_empresa')?.value;
    if (!id_empresa) {
      this.misEmpresas = [];
      return;
    };

    this.setupUserEnterpriseService.getMisEmpresaSucursales$({ id_empresa })
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.misEmpresasSucursales = response;
        if( this.adata ) {
          this.newForm.get('id_empresa_sucursal')?.patchValue(this.adata.id_empresa_sucursal);
        }
      }, err => {
        this.misEmpresasSucursales = [];
      });
  }


  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onSave() {
    const value = this.newForm.value;
    const invalid = this.newForm.invalid;
    if (invalid) return;
    if (!confirm('¿Estás seguro?')) return;

    if (!this.adata || !this.adata.id_caja) {
      const data = {
        id_empresa: value.id_empresa,
        id_empresa_sucursal: value.id_empresa_sucursal,
        id_medio_pago: value.id_medio_pago,
        id_conta_documento: value.id_conta_documento,
        nombre: value.nombre,
        descripcion: value.descripcion,
        id_moneda: value.id_moneda,
        activo: value.activo,
      };
      this.loadingSpinnerSave = true;
      this.cajasService.add$(data)
        .pipe(map(res => res.data),
          takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            this.dialogRef.close({ cancel: false, data: response });
            this.loadingSpinnerSave = false;
          },
          error: err => this.loadingSpinnerSave = false
        });
    } else {
      const data = {
        nombre: value.nombre,
        descripcion: value.descripcion,
        activo: value.activo,
      };
      this.loadingSpinnerSave = true;
      this.cajasService.update$(this.adata.id_caja, data)
        .pipe(map(res => res.data),
          takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            this.dialogRef.close({ cancel: false, data: response });
            this.loadingSpinnerSave = false;
          },
          error: err => {
            this.loadingSpinnerSave = false;
          }
        });

    }

  }



}
