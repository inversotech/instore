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

@Component({
  selector: 'open-form-nuevo-documento-modal',
  templateUrl: './form-nuevo-documento-modal.component.html',
  styleUrls: ['./form-nuevo-documento-modal.component.scss']
})
export class FormNuevoDocumentoModalComponent implements OnInit, OnDestroy {

  public documentoForm: FormGroup = this.formBuilder.group({
    id_conta_documento: [''],
    id_empresa: ['', [Validators.required]],
    id_tipo_comprobante: ['', [Validators.required]],
    id_conta_documento_parent: [''],
    nombre: ['', [Validators.required]],
    serie: ['', [Validators.required]],
    contador: ['', [Validators.required]],
    activo: [true, [Validators.required]],
  });
  public empresas$ = this.getEmpresas$();
  public tipoComprobantes$ = this.contaDocumentsService.getTipoComprobantes$();
  public contaDocumentosPadre: any[] = [];

  public loadingSpinnerSave: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  public tipoExistencias: any[] = [];
  public misEmpresas: any[] = [];
  public misEmpresasSucursales: any[] = [];

  public empresaConfig = this.appDataService.getEmpresaConfig();

  @Input('item') set item(data: any) {
    this.documentoForm.patchValue({
      id_conta_documento: data.id_conta_documento,
      id_empresa: data.id_empresa,
      id_tipo_comprobante: data.id_tipo_comprobante,
      id_conta_documento_parent: data.id_conta_documento_parent,
      nombre: data.nombre,
      serie: data.serie,
      contador: data.contador,
      activo: data.activo
    });
  }

  constructor(private dialogRef: NbDialogRef<FormNuevoDocumentoModalComponent>,
    // private tipoExistenciasService: TipoExistenciasService,
    // private setupUserEnterpriseService: SetupUserEnterpriseService,
    // private almacenesService: AlmacenesService,
    private nbDialogService: NbDialogService,
    private setupUserEnterpriseService: SetupUserEnterpriseService,
    private contaDocumentsService: ContaDocumentsService,
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

  get isNota(): boolean {
    const tipoComprobante = this.documentoForm.get('id_tipo_comprobante')?.value;
    return ['07', '08', '87', '88'].includes(tipoComprobante);
  }

  private suscribeForms() {
    this.documentoForm.get('id_empresa')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        setTimeout(() => {
          this.getContaDocumentosPadre();
        }, 0);
      });

    this.documentoForm.get('id_tipo_comprobante')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        setTimeout(() => {
          this.getContaDocumentosPadre();
        }, 0);
      });
  }

  private getContaDocumentosPadre() {
    this.contaDocumentosPadre = [];
    this.contaDocumentsService.getContaDocumentsPadre$({ id_empresa: this.documentoForm.get('id_empresa')?.value })
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.contaDocumentosPadre = response || [];
      }, err => {
        this.contaDocumentosPadre = [];
      });
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



          const data = {
            id_empresa: value.id_empresa,
            id_tipo_comprobante: value.id_tipo_comprobante,
            id_conta_documento_parent: value.id_conta_documento_parent,
            nombre: value.nombre,
            serie: value.serie,
            contador: value.contador,
            activo: value.activo,
          };

          if (value.id_conta_documento) {
            this.loadingSpinnerSave = true;
            this.contaDocumentsService.update2$(value.id_conta_documento, data)
              .pipe(takeUntil(this.destroy$))
              .subscribe(response => {
                this.dialogRef.close({ cancel: false });
                this.loadingSpinnerSave = false;
              }, err => {
                this.loadingSpinnerSave = false;
              });

          } else {
            this.loadingSpinnerSave = true;
            this.contaDocumentsService.add2$(data)
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
