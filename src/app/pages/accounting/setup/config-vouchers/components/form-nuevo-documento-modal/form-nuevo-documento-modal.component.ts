import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
// import { ActivatedRoute, Router } from '@angular/router';
// import { SetupUserEnterpriseService } from 'src/app/core/providers/setup-user-enterprise.service';
// import { ConfirmModalComponent } from 'src/app/pages/shared/components';
import { ContaDocumentsService } from 'src/app/providers/services/accounting/conta-documents.service';
import { SetupUserEnterpriseService } from 'src/app/core/providers/setup-user-enterprise.service';
import { AppDataService } from 'src/app/core/providers/app-data.service';
import { ConfirmModalComponent } from 'src/app/pages/shared/components';
import { ContaVoucherConfigsService } from 'src/app/providers/services/accounting/conta-voucher-configs.service';

@Component({
  selector: 'open-form-nuevo-documento-modal',
  templateUrl: './form-nuevo-documento-modal.component.html',
  styleUrls: ['./form-nuevo-documento-modal.component.scss']
})
export class FormNuevoDocumentoModalComponent implements OnInit, OnDestroy {

  public documentoForm: FormGroup = this.formBuilder.group({
    id_empresa: ['', [Validators.required]],
    id_tipo_asiento: ['', [Validators.required]],
    id_tipo_voucher: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    automatico: [true, [Validators.required]],
  });
  public empresas$ = this.getEmpresas$();
  public tipoAsientos$ = this.contaVoucherConfigsService.getTipoAsientos$();
  public tipoVouchers$ = this.contaVoucherConfigsService.getTipoVouchers$();
  public contaDocumentosPadre: any[] = [];

  public loadingSpinnerSave: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  public tipoExistencias: any[] = [];
  public misEmpresas: any[] = [];
  public misEmpresasSucursales: any[] = [];

  public empresaConfig = this.appDataService.getEmpresaConfig();
  public adata: any = null;

  @Input('item') set item(data: any) {
    if (data) {
      this.adata = data;
      // No editar id_empresa, id_tipo_voucher si es update
      this.documentoForm.patchValue({
        id_empresa: data.id_empresa,
        id_tipo_asiento: data.id_tipo_asiento,
        id_tipo_voucher: data.id_tipo_voucher,
        nombre: data.nombre,
        automatico: data.automatico,
      });
      this.documentoForm.get('id_empresa')?.disable();
      this.documentoForm.get('id_tipo_voucher')?.disable();
    }
  }

  constructor(private dialogRef: NbDialogRef<FormNuevoDocumentoModalComponent>,
    private nbDialogService: NbDialogService,
    private setupUserEnterpriseService: SetupUserEnterpriseService,
    private contaVoucherConfigsService: ContaVoucherConfigsService,
    private appDataService: AppDataService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.documentoForm.get('id_empresa')?.patchValue(this.empresaConfig.id_empresa);
    }, 0);
    this.suscribeForms();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private suscribeForms() {

  }

  private getEmpresas$(): Observable<any> {
    return this.setupUserEnterpriseService.getMisEmpresas$().pipe(map(res => res.data), catchError(() => of([])));
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onSave() {
    const value = this.documentoForm.value;
    const invalid = this.documentoForm.invalid;
    if (invalid) return;
    this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de crear el item?' } })
      .onClose.subscribe(status => {
        if (status) {


          if (this.adata) {
            const data = {
              id_tipo_asiento: value.id_tipo_asiento,
              nombre: value.nombre,
              automatico: value.automatico,
            };
            this.loadingSpinnerSave = true;
            this.contaVoucherConfigsService.update2$(this.adata.id_empresa, this.adata.id_tipo_voucher, data)
              .pipe(takeUntil(this.destroy$))
              .subscribe(response => {
                this.dialogRef.close({ cancel: false });
                this.loadingSpinnerSave = false;
              }, err => {
                this.loadingSpinnerSave = false;
              });

          } else {
            const data = {
              id_empresa: value.id_empresa,
              id_tipo_asiento: value.id_tipo_asiento,
              id_tipo_voucher: value.id_tipo_voucher,
              nombre: value.nombre,
              automatico: value.automatico,
            };
            this.loadingSpinnerSave = true;
            this.contaVoucherConfigsService.add$(data)
              .pipe(takeUntil(this.destroy$))
              .subscribe(response => {
                this.dialogRef.close({ cancel: false });
                this.loadingSpinnerSave = false;
              }, err => {
                this.loadingSpinnerSave = false;
              });
          }


        } else {
        }
      }, err => {
      });

  }

}
