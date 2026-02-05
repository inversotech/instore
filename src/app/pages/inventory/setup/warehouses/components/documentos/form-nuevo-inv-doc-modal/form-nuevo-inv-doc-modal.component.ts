import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { UsersService } from 'src/app/providers/services/setup-system/users.service';
import { AlmacenDocumentosService } from 'src/app/providers/services/inventory/almacen-documentos.service';

@Component({
  selector: 'open-form-nuevo-inv-doc-modal',
  templateUrl: './form-nuevo-inv-doc-modal.component.html',
  styleUrls: ['./form-nuevo-inv-doc-modal.component.scss']
})
export class FormNuevoInvDocModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public newForm: FormGroup = this.formBuilder.group({
    id_conta_documento: ['', [Validators.required]],
    // id_almacen: ['', [Validators.required]],
    id_tipo_operacion: ['', [Validators.required]],
    activo: [true, [Validators.required]],
  });;
  public loadingSpinnerSave: boolean = false;
  public contaDocumentos: any[] = [];
  public tipoOperacions: any[] = [];
  @Input() public almacenId: any;

  constructor(private dialogRef: NbDialogRef<FormNuevoInvDocModalComponent>,
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

    this.almacenDocumentosService.getContaDocumentos$({ id_almacen: this.almacenId })
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
      id_conta_documento: value.id_conta_documento,
      id_tipo_operacion: value.id_tipo_operacion,
      id_almacen: this.almacenId,
      activo: value.activo,
    };
    this.loadingSpinnerSave = true;
    this.almacenDocumentosService.add$(data)
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
