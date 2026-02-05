import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Subject, finalize, takeUntil } from 'rxjs';
import { SalesService } from 'src/app/providers/services/sales/sales.service';

@Component({
  selector: 'select-unidades-modal',
  templateUrl: './select-unidades-modal.component.html',
  styleUrls: ['./select-unidades-modal.component.scss']
})
export class SelectUnidadesModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loading: boolean = false;

  @Input() public articulo: any;
  @Input() public idVenta: any;

  public unidadesDisponibles: any[] = [];
  public unidadesSeleccionadas: any[] = [];
  public loteSeleccionado: any = null;

  constructor(
    private dialogRef: NbDialogRef<SelectUnidadesModalComponent>,
    private salesService: SalesService,
  ) { }

  ngOnInit(): void {
    this.cargarUnidades();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarUnidades() {
    if (!this.articulo?.id_articulo || !this.idVenta) return;

    this.loading = true;
    const params = {
      id_articulo: this.articulo.id_articulo,
      id_venta: this.idVenta
    };

    this.salesService.getUnidadesDisponibles$(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          this.unidadesDisponibles = response?.data || response || [];
        },
        error: () => {
          this.unidadesDisponibles = [];
        }
      });
  }

  // Getter para filtrar unidades según el lote seleccionado
  get unidadesFiltradas(): any[] {
    if (!this.loteSeleccionado) {
      return this.unidadesDisponibles;
    }
    return this.unidadesDisponibles.filter(u => u.lote_numero === this.loteSeleccionado.lote_numero);
  }

  public isSelected(unidad: any): boolean {
    return this.unidadesSeleccionadas.some(u => u.id_articulo_unidad === unidad.id_articulo_unidad);
  }

  public toggleUnidad(unidad: any) {
    const index = this.unidadesSeleccionadas.findIndex(u => u.id_articulo_unidad === unidad.id_articulo_unidad);
    if (index > -1) {
      this.unidadesSeleccionadas.splice(index, 1);
    } else {
      this.unidadesSeleccionadas.push(unidad);
    }
  }

  public seleccionarTodas() {
    // Seleccionar solo las unidades filtradas (visibles)
    const filtradas = this.unidadesFiltradas;
    filtradas.forEach(u => {
      if (!this.isSelected(u)) {
        this.unidadesSeleccionadas.push(u);
      }
    });
  }

  public deseleccionarTodas() {
    // Deseleccionar solo las unidades filtradas (visibles)
    const filtradas = this.unidadesFiltradas;
    this.unidadesSeleccionadas = this.unidadesSeleccionadas.filter(
      u => !filtradas.some(f => f.id_articulo_unidad === u.id_articulo_unidad)
    );
  }

  public onClose() {
    this.dialogRef.close({ cancel: true, unidades: [] });
  }

  public onConfirmar() {
    this.dialogRef.close({ cancel: false, unidades: this.unidadesSeleccionadas });
  }
}
