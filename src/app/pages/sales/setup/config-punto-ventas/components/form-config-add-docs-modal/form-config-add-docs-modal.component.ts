import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap, takeUntil, catchError } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { TipoOperacionsService } from 'src/app/providers/services/inventory/tipo-operacions.service';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { DatePipe } from '@angular/common';
import { DiscountsCoreService } from 'src/app/providers/services/sales/discounts.core.service';
import { SetupUserEnterpriseService } from 'src/app/core/providers/setup-user-enterprise.service';
import { AppDataService } from 'src/app/core/providers/app-data.service';
import { PuntoVentasService } from 'src/app/providers/services/accounting/punto-ventas.service';
import { UsersService } from 'src/app/providers/services/setup-system/users.service';

@Component({
  selector: 'inverso-form-config-add-docs-modal',
  templateUrl: './form-config-add-docs-modal.component.html',
  styleUrls: ['./form-config-add-docs-modal.component.scss']

})

export class FormConfigAddDocsModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loadingSpinnerSave: boolean = false;

  public documentos: any = [];
  public adata: any = null;
  @Input('item') set item(data: any) {
    if (data) {
      this.adata = data;
    }
  }

  constructor(private dialogRef: NbDialogRef<FormConfigAddDocsModalComponent>,
    private puntoVentasService: PuntoVentasService,
  ) { }

  ngOnInit() {
    this.puntoVentasService.getDocumentosToAssign$(this.adata.id_punto_venta)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        const adocumentos = response || [];
        this.documentos = adocumentos.map((item: any) => {
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
      documentos_checkeds: this.documentos
        .filter((doc: any) => doc.checked)
        .map((doc: any) => ({ id_conta_documento: doc.id_conta_documento }))
      ,
    };
    this.loadingSpinnerSave = true;
    this.puntoVentasService.addDocumentosToPuntoVenta$(this.adata.id_punto_venta, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.loadingSpinnerSave = false;
        this.dialogRef.close({ cancel: false });
      }, err => {
        this.loadingSpinnerSave = false;
      });

  }
}
