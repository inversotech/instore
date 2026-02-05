import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PuntoVentasService } from 'src/app/providers/services/accounting/punto-ventas.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'inverso-form-config-add-almacen-modal',
  templateUrl: './form-config-add-almacen-modal.component.html',
  styleUrls: ['./form-config-add-almacen-modal.component.scss']

})

export class FormConfigAddAlmacenModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loadingSpinnerSave: boolean = false;

  public idAlmacenSeleccionado: any = new FormControl('');
  public almacenes: any = [];
  public adata: any = null;
  @Input('item') set item(data: any) {
    if (data) {
      this.adata = data;
      this.idAlmacenSeleccionado.patchValue(data.id_almacen);
    }
  }

  constructor(private dialogRef: NbDialogRef<FormConfigAddAlmacenModalComponent>,
    private puntoVentasService: PuntoVentasService,
  ) { }

  ngOnInit() {
    this.puntoVentasService.getAlmacenesToAssign$(this.adata.id_punto_venta)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        const aalmacenes = response || [];
        this.almacenes = aalmacenes.map((item: any) => {
          return {
            ...item,
            checked: false
          };
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }




  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }


  public onSave() {
    const data = {
      id_almacen: this.idAlmacenSeleccionado.value
    };
    this.loadingSpinnerSave = true;
    this.puntoVentasService.addAlmacenesToPuntoVenta$(this.adata.id_punto_venta, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.loadingSpinnerSave = false;
        this.dialogRef.close({ cancel: false });
      }, err => {
        this.loadingSpinnerSave = false;
      });

  }
}
