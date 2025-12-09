import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { IncomeService } from 'src/app/providers/services/treasury/income.service';

@Component({
  selector: 'open-pay-transferencia-modal',
  templateUrl: './pay-transferencia-modal.component.html',
  styles: [`
    ::ng-deep nb-dialog-container {
        width: 25rem !important;
    }
    `]
})
export class PayTransferenciaModalComponent implements OnInit, OnDestroy {
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

  public cuentaBancarias: any[] = [];
  public misAlmacenes: any[] = [];

  constructor(private dialogRef: NbDialogRef<PayTransferenciaModalComponent>,
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
    const cuentaBancarias$ = this.incomeService.getCuentaBancarias$({}).pipe(takeUntil(this.destroy$));
    forkJoin({
      cuentaBancarias: cuentaBancarias$,
    }).subscribe({
      next: (response) => {
        this.loadingSpinner = false;
        // this.contaDocumentos = response.contaDocumentos || [];
        this.cuentaBancarias = response.cuentaBancarias || [];
        // this.tipoTarjetas = response.tipoTarjetas || [];
        // this.misCajasHabilitadas = response.misCajasHabilitadas || [];
        if (this.cuentaBancarias.length > 0) {
          this.payForm.patchValue({
            id_cuenta_bancaria: this.cuentaBancarias[0].id_cuenta_bancaria
          });
        }
      },
      error: (err) => {
        this.loadingSpinner = false;
        this.cuentaBancarias = [];
      }
    });
  }

  private buildForm() {
    const controls = {
      id_cuenta_bancaria: ['', [Validators.required]],
      nro_operacion_dep: ['', [Validators.required]],
      fecha_operacion_dep: [new Date(), [Validators.required]],
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
    const fecha_operacion_dep = this.datePipe.transform(value.fecha_operacion_dep, 'yyyy-MM-dd');
    const data = {
      id_caja: this.aData.id_caja,
      glosa: '',
      id_cuenta_bancaria: value.id_cuenta_bancaria,
      nro_operacion_dep: value.nro_operacion_dep,
      fecha_operacion_dep: fecha_operacion_dep,
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
