import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap, takeUntil, catchError } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AppDataService } from 'src/app/core/providers/app-data.service';
import { PuntoVentasService } from 'src/app/providers/services/accounting/punto-ventas.service';
import { FormConfigAddDocsModalComponent } from '../form-config-add-docs-modal/form-config-add-docs-modal.component';
import { FormConfigAddUsersModalComponent } from '../form-config-add-users-modal/form-config-add-users-modal.component';
import { FormConfigAddAlmacenModalComponent } from '../form-config-add-almacen-modal/form-config-add-almacen-modal.component';
// import { FormConfigAddCajasModalComponent } from '../form-config-add-cajas-modal/form-config-add-cajas-modal.component';

@Component({
  selector: 'inverso-form-config-modal',
  templateUrl: './form-config-modal.component.html',
  styleUrls: ['./form-config-modal.component.scss']

})

export class FormConfigModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loadingSpinnerSave: boolean = false;
  public empresaConfig = this.appDataService.getEmpresaConfig();

  public puntoVentaDocumentos: any = [];
  public puntoVentaUsuarios: any = [];
  public puntoVenta: any;
  public puntoVentaCajas: any = [];

  public adata: any = null;
  @Input('item') set item(data: any) {
    if (data) {
      this.adata = data;
      this.getPuntoVentaDocumentos();
      this.getPuntoVentaUsuarios();
      // this.getPuntoVentaCajas();
      this.getPuntoVenta();
    }
  }

  constructor(private dialogRef: NbDialogRef<FormConfigModalComponent>,
    private nbDialogService: NbDialogService,
    private appDataService: AppDataService,
    private puntoVentasService: PuntoVentasService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: false });
    }, 50);
  }

  private getPuntoVentaDocumentos() {
    this.puntoVentasService.getDocumentosByPuntoVenta$(this.adata.id_punto_venta)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.puntoVentaDocumentos = response || [];
      });
  }

  private getPuntoVentaUsuarios() {
    this.puntoVentasService.getUsuariosByPuntoVenta$(this.adata.id_punto_venta)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.puntoVentaUsuarios = response || [];
      });
  }

  //  private getPuntoVentaCajas() {
  //   this.puntoVentasService.getCajasByPuntoVenta$(this.adata.id_punto_venta)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(response => {
  //       this.puntoVentaCajas = response || [];
  //     });
  // }

  private getPuntoVenta() {
    this.puntoVentasService.getById$(this.adata.id_punto_venta)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.puntoVenta = response;
      });
  }

  public onAgregarDocumento() {
    const dialogRef = this.nbDialogService.open(FormConfigAddDocsModalComponent, {
      context: {
        item: this.adata,
      },
      closeOnBackdropClick: false,
      closeOnEsc: true,
      hasScroll: true,
      autoFocus: false,
      // width: '600px',
    });

    dialogRef.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && !res.cancel) {
          this.getPuntoVentaDocumentos();
        }
      });
  }

  public onAgregarUsuario() {
    const dialogRef = this.nbDialogService.open(FormConfigAddUsersModalComponent, {
      context: {
        item: this.adata,
      },
      closeOnBackdropClick: false,
      closeOnEsc: true,
      hasScroll: true,
      autoFocus: false,
      // width: '600px',
    });

    dialogRef.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && !res.cancel) {
          this.getPuntoVentaUsuarios();
        }
      });
  }

  // public onAgregarCajas() {
  //   const dialogRef = this.nbDialogService.open(FormConfigAddCajasModalComponent, {
  //     context: {
  //       item: null,
  //       puntoVenta: this.puntoVenta,
  //     },
  //     closeOnBackdropClick: false,
  //     closeOnEsc: true,
  //     hasScroll: true,
  //     autoFocus: false,
  //     // width: '600px',
  //   });

  //   dialogRef.onClose
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((res) => {
  //       if (res && !res.cancel) {
  //         this.getPuntoVentaCajas();
  //       }
  //     });
  // }

  // public onEditarCajas(item: any) {
  //   const dialogRef = this.nbDialogService.open(FormConfigAddCajasModalComponent, {
  //     context: {
  //       item: item,
  //       puntoVenta: this.puntoVenta,
  //     },
  //     closeOnBackdropClick: false,
  //     closeOnEsc: true,
  //     hasScroll: true,
  //     autoFocus: false,
  //     // width: '600px',
  //   });

  //   dialogRef.onClose
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((res) => {
  //       if (res && !res.cancel) {
  //         this.getPuntoVentaCajas();
  //       }
  //     });
  // }

  public onAgregarAlmacen() {
    const dialogRef = this.nbDialogService.open(FormConfigAddAlmacenModalComponent, {
      context: {
        item: this.puntoVenta,
      },
      closeOnBackdropClick: false,
      closeOnEsc: true,
      hasScroll: true,
      autoFocus: false,
      // width: '600px',
    });

    dialogRef.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && !res.cancel) {
          this.getPuntoVenta();
        }
      });
  }

  public onEliminarDocumento(item: any) {
    if (!confirm('¿Estás seguro de eliminar el documento del punto de venta?')) return;
    this.puntoVentasService.deleteDocumentosFromPuntoVenta$(this.adata.id_punto_venta, item.id_conta_documento)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getPuntoVentaDocumentos();
      });
  }

  public onEliminarUsuario(item: any) {
    if (!confirm('¿Estás seguro de eliminar el usuario del punto de venta?')) return;
    this.puntoVentasService.deleteUsuariosFromPuntoVenta$(this.adata.id_punto_venta, item.id_user)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getPuntoVentaUsuarios();
      });
  }

  // public onEliminarCaja(item: any) {
  //   if (!confirm('¿Estás seguro de eliminar la caja del punto de venta?')) return;
  //   this.puntoVentasService.deleteCajasFromPuntoVenta$(this.adata.id_punto_venta, item.id_caja)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(response => {
  //       this.getPuntoVentaCajas();
  //     });
  // }

}
