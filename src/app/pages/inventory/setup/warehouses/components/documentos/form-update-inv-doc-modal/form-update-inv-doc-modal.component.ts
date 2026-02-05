import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AlmacenDocumentosService } from 'src/app/providers/services/inventory/almacen-documentos.service';

@Component({
  selector: 'open-form-update-inv-doc-modal',
  templateUrl: './form-update-inv-doc-modal.component.html',
  styleUrls: ['./form-update-inv-doc-modal.component.scss']
})
export class FormUpdateInvDocModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public newForm: FormGroup = this.formBuilder.group({
    id_conta_documento: [{ value: '', disabled: true }, [Validators.required]],
    id_tipo_operacion: [{ value: '', disabled: true }, [Validators.required]],
    activo: [true, [Validators.required]],
  });
  public loadingSpinnerSave: boolean = false;
  public tipoOperacions: any[] = [];
  public contaDocumentos: any[] = [];

  private aItem: any;
  @Input() set item(iitem: any) {
    this.aItem = iitem;
    if (iitem) {
      this.loadingSpinnerSave = true;
      setTimeout(() => {
        this.newForm?.patchValue({
          id_conta_documento: this.aItem.id_conta_documento,
          id_tipo_operacion: this.aItem.id_tipo_operacion,
          activo: this.aItem.activo,
        });
        this.loadingSpinnerSave = false;
      }, 1000);
    }
  };

  constructor(private dialogRef: NbDialogRef<FormUpdateInvDocModalComponent>,
    private almacenDocumentosService: AlmacenDocumentosService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.suscribeForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private suscribeForm() {
    this.almacenDocumentosService.getTipoOperacions$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.tipoOperacions = response || [];
      });

    this.almacenDocumentosService.getContaDocumentos$({ id_almacen: this.aItem.id_almacen })
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.contaDocumentos = response || [];
      });
  }

  get f() {
    return this.newForm.controls;
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

    if (!confirm('¿Estás seguro de crear el item?')) return;
    const data = {
      id_tipo_operacion: value.id_tipo_operacion,
      activo: value.activo,
    };
    this.loadingSpinnerSave = true;
    this.almacenDocumentosService.updateCustom$(this.aItem.id_almacen, this.aItem.id_conta_documento, this.aItem.id_tipo_operacion, data)
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.dialogRef.close({ cancel: false });
        this.loadingSpinnerSave = false;
      }, err => {
        this.loadingSpinnerSave = false;
      });

  }

}
