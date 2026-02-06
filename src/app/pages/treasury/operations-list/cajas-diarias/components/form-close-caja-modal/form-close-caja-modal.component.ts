import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { IncomeService } from 'src/app/providers/services/treasury/income.service';

@Component({
  selector: 'inverso-form-close-caja-modal',
  templateUrl: './form-close-caja-modal.component.html',
  styleUrls: ['./form-close-caja-modal.component.scss']
})
export class FormCloseCajaModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public cierreForm: FormGroup = this.buildForm();
  public loadingSpinnerSave: boolean = false;

  public acaja: any;
  @Input() public set item(item: any) {
    this.acaja = item;
    if (this.acaja) {
      // this.patchForm();
    }
  };

  public tipoOperacions: any[] = [];
  public misAlmacenes: any[] = [];

  constructor(private dialogRef: NbDialogRef<FormCloseCajaModalComponent>,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private incomeService: IncomeService,
  ) { }

  ngOnInit() {
    this.getMasters();
    this.getTipoOperacions();
    this.suscribeForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getMasters() {

  }

  private patchForm() {

  }

  private getTipoOperacions() {

  }

  private suscribeForm() {
    // this.cierreForm.get('tipo_movimiento')?.valueChanges
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(response => {
    //     setTimeout(() => {
    //       this.getTipoOperacions();
    //     }, 0);
    //   }, err => {
    //   });
  }

  private buildForm() {
    const controls = {
      fecha: [new Date(), [Validators.required]],
      importe_comision: [0, [Validators.required]],
      descripcion_cierre: ['Cierre de caja, el día ' + this.datePipe.transform(new Date(), 'dd/MM/yyyy'), [Validators.required]],
    };
    return this.formBuilder.group(controls);
  }

  get f() {
    return this.cierreForm.controls;
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onSave() {
    const invalid = this.cierreForm.invalid;
    const value = this.cierreForm.value;
    if (invalid) return;
    // const aFecha = this.datePipe.transform(value.fecha, 'yyyy-MM-dd');
    if (!confirm('Seguro?')) return;

    const data = {
      id_caja_diario: this.acaja.id_caja_diario,
      // fecha: this.datePipe.transform(this.cierreForm.value.fecha, 'yyyy-MM-dd'),
      importe_comision: value.importe_comision,
      descripcion_cierre: value.descripcion_cierre,
    };
    this.loadingSpinnerSave = true;
    this.incomeService.cerrarCaja$(data)
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
