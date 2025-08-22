import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { finalize, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PersonaConsultasService } from 'src/app/providers/services/services/persona-consultas.service';

@Component({
  selector: 'lamb-info-proveedor-modal',
  templateUrl: './info-proveedor-modal.component.html',
  styleUrls: ['./info-proveedor-modal.component.scss']
})
export class InfoProveedorModalComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  public loadingSave: boolean = false;
  public contribuyente: any;
  public loadingMoreInfoProveedor: boolean = false;
  public proveedorStatus: any;
  @Input() ruc_id: any;

  constructor(private dialogRef: NbDialogRef<InfoProveedorModalComponent>,
    private personaConsultasService: PersonaConsultasService,
    private nbToastrService: NbToastrService,
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getMasters();
    }, 500);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getMasters() {
    if (!this.ruc_id) return;
    this.loadingMoreInfoProveedor = true;
    this.personaConsultasService.getRuc$({ ruc: this.ruc_id })
      .pipe(map(res => res.data),
        takeUntil(this.destroy$),
        finalize(() => this.loadingMoreInfoProveedor = false),
      )
      .subscribe((response: any) => {
        this.contribuyente = response;
        this.configRucExistsInSunat(response);
      }, error => {
      });
  }

  private configRucExistsInSunat(data: any) {
    const condicion = (data.tipo_condicion_nombre).toUpperCase();
    const estado = (data.tipo_estado_nombre).toUpperCase();

    if (condicion === 'HABIDO' && estado === 'ACTIVO') {
      this.proveedorStatus = 'success'; // Success
    } else if (estado === 'ACTIVO' && condicion !== 'HABIDO') {
      this.proveedorStatus = 'warning'; // Warning
    } else if (estado !== 'ACTIVO' && condicion !== 'HABIDO') {
      this.proveedorStatus = 'danger'; // Danger - No pasa.
    } else {
      this.proveedorStatus = 'danger'; // Danger - No pasa.
    }

    // if (estado !== 'ACTIVO') {
    //   this.nbToastrService.show(
    //     `El ruc ${data?.ruc_id} tiene estado ${estado}, tome sus precauciones.`,
    //     'Un momento',
    //     { status: "warning", icon: "alert-circle-outline" }
    //   );
    // }

    // if (condicion !== 'HABIDO') {
    //   this.nbToastrService.show(
    //     `El ruc ${data?.ruc_id} esta en condición ${condicion}, tome sus precauciones.`,
    //     'Un momento',
    //     { status: "warning", icon: "alert-circle-outline" }
    //   );
    // }
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

}
