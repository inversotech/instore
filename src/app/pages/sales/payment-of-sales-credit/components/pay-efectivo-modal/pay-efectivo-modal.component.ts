import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { IncomeService } from 'src/app/providers/services/treasury/income.service';

@Component({
  selector: 'open-pay-efectivo-modal',
  templateUrl: './pay-efectivo-modal.component.html',
  styles: [`
    ::ng-deep nb-dialog-container {
        width: 25rem !important;
    }
    `]
})
export class PayEfectivoModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public payForm: FormGroup = this.buildForm();
  public loadingSpinnerSave: boolean = false;
  public aData: any;
  @Input() public set data(item: any) {
    this.aData = item;
    if (this.aData) {
      // this.patchForm();
    }
  };

  public tipoOperacions: any[] = [];
  public misAlmacenes: any[] = [];

  constructor(private dialogRef: NbDialogRef<PayEfectivoModalComponent>,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private incomeService: IncomeService,
  ) { }

  ngOnInit() {
    this.getMasters();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getMasters() {

  }

  private buildForm() {
    const controls = {
      glosa: ['Efectivo, el ' + this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm'), [Validators.required]],
    };
    return this.formBuilder.group(controls);
  }

  get f() {
    return this.payForm.controls;
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onSave() {
    const invalid = this.payForm.invalid;
    const value = this.payForm.value;
    if (invalid) return;
    if (!this.aData.id_caja) return;
    if (!confirm('Seguro?')) return;

    const data = {
      id_caja: this.aData.id_caja,
      glosa: value.glosa,
      importe: this.aData.total_importe,
      carrito_ventas: this.aData.carritoVentas.map((item: any) => ({
        id_venta: item.id_venta,
        saldo_pendiente_pagar: item.saldo_pendiente_pagar,
      })),
    };
    this.loadingSpinnerSave = true;
    this.incomeService.saveDepositoFromCaja$(data)
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.dialogRef.close({ cancel: false, data: response });
        this.loadingSpinnerSave = false;
      }, err => {
        this.loadingSpinnerSave = false;
      });
  }

}
