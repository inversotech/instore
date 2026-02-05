import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { IncomeService } from 'src/app/providers/services/treasury/income.service';

@Component({
  selector: 'inverso-pay-pos-modal',
  templateUrl: './pay-pos-modal.component.html',
  styles: [`
    ::ng-deep nb-dialog-container {
        width: 25rem !important;
    }
    `]
})
export class PayPosModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public payForm: FormGroup = this.buildForm();
  public loadingSpinner: boolean = false;

  public aData: any;
  @Input() public set data(item: any) {
    this.aData = item;
    if (this.aData) {
      // this.patchForm();
    }
  };

  public tipoTarjetas: any[] = [];
  public misAlmacenes: any[] = [];

  constructor(private dialogRef: NbDialogRef<PayPosModalComponent>,
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
    this.loadingSpinner = false;
    const tipoTarjetas$ = this.incomeService.getTipoTarjetas$({}).pipe(takeUntil(this.destroy$));
    forkJoin({
      tipoTarjetas: tipoTarjetas$,
    }).subscribe({
      next: (response) => {
        this.loadingSpinner = false;
        // this.contaDocumentos = response.contaDocumentos || [];
        this.tipoTarjetas = response.tipoTarjetas || [];
        // this.misCajasHabilitadas = response.misCajasHabilitadas || [];
        if (this.tipoTarjetas.length > 0) {
          this.payForm.patchValue({
            id_tipo_tarjeta: this.tipoTarjetas[0].id_tipo_tarjeta
          });
        }
      },
      error: (err) => {
        this.loadingSpinner = false;
        this.tipoTarjetas = [];
      }
    });
  }

  private buildForm() {
    const controls = {
      id_tipo_tarjeta: ['', [Validators.required]],
      operacion: ['', [Validators.required]],
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
    if (!confirm('Seguro?')) return;

    const data = {
      id_caja_diario: this.aData.id_caja_diario,
      glosa: '',
      id_tipo_tarjeta: value.id_tipo_tarjeta,
      operacion: value.operacion,
      importe: this.aData.total_importe,
      carrito_ventas: this.aData.carritoVentas.map((item: any) => ({
        id_venta: item.id_venta,
        saldo_pendiente_pagar: item.saldo_pendiente_pagar,
      })),
    };
    this.loadingSpinner = true;
    this.incomeService.saveDepositoFromCaja$(data)
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.dialogRef.close({ cancel: false, data: response });
        this.loadingSpinner = false;
      }, err => {
        this.loadingSpinner = false;
      });
  }

}
