import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Subject, map, takeUntil, finalize } from 'rxjs';
import { TipoIgvsService } from 'src/app/providers/services/accounting/tipo-igvs.service';
import { SalesService } from 'src/app/providers/services/sales/sales.service';

@Component({
  selector: 'lamb-modal-type-igv',
  templateUrl: './modal-type-igv.component.html',
  styleUrls: ['./modal-type-igv.component.scss']
})
export class ModalTypeIgvComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loadingSpinner: boolean = false;
  public tipoIgvForm: FormGroup = this.formBuilder.group({
    id_venta_detalle: ['', Validators.required],
    id_tipo_igv: ['', Validators.required],
    aplicar_detalles: [false, Validators.required]
  });
  public typesIgv: any[] = [];
  @Input() public data: any;

  constructor(
    private dialogRef: NbDialogRef<ModalTypeIgvComponent>,
    private formBuilder: FormBuilder,
    private salesService: SalesService,
  ) {
  }

  ngOnInit(): void {
    this.getMasters();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getMasters() {
    this.loadingSpinner = true;
    this.salesService.getTipoIgvs$({})
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingSpinner = false))
      .subscribe(response => {
        this.typesIgv = response || [];

        setTimeout(() => {
          this.tipoIgvForm.patchValue({
            id_venta_detalle: this.data.id_venta_detalle,
            id_tipo_igv: this.data.id_tipo_igv
          });
        }, 0);

      });
  }

  get f() {
    return this.tipoIgvForm.controls;
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onAceptar() {
    const value = this.tipoIgvForm.value;
    const invalid = this.tipoIgvForm.invalid;
    if (invalid) return;

    const param = {
      id_tipo_igv: value.id_tipo_igv,
      aplicar_detalles: value.aplicar_detalles == true ? '1' : '0',
    };
    this.loadingSpinner = true;
    this.salesService.updateSaleDetalleTipoIgv$(value.id_venta_detalle, param)
      .pipe(map(res => res.data), takeUntil(this.destroy$), finalize(() => this.loadingSpinner = false))
      .subscribe(response => {
        setTimeout(() => {
          this.dialogRef.close({ cancel: false });
        }, 50);
      });
  }
}
