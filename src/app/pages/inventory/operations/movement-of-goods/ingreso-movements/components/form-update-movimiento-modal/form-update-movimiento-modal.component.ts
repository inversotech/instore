import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { TipoOperacionsService } from 'src/app/providers/services/inventory/tipo-operacions.service';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { DatePipe } from '@angular/common';
import { PersonaConsultasService } from 'src/app/providers/services/services/persona-consultas.service';
import { InfoProveedorModalComponent } from 'src/app/pages/shared/info-proveedor-modal';

@Component({
  selector: 'open-form-update-movimiento-modal',
  templateUrl: './form-update-movimiento-modal.component.html',
  styleUrls: ['./form-update-movimiento-modal.component.scss']
})
export class FormUpdateMovimientoModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public newForm: FormGroup = this.buildForm();
  public ruc: FormControl = new FormControl('');
  public loadingSpinnerSave: boolean = false;

  public aInventarioMovimiento: any;
  @Input() public set inventarioMovimiento(item: any) {
    this.aInventarioMovimiento = item;
    if (this.aInventarioMovimiento) {
      this.patchForm();
    }
  };

  public tipoOperacions: any[] = [];
  public misAlmacenes: any[] = [];

  @ViewChild('inputProveedor', { read: ElementRef }) inputProveedor!: ElementRef;
  public proveedorLoading: boolean = false;
  public proveedorStatus: any = 'basic';
  public proveedores: any[] = [];
  public firstPatch: boolean = false;

  constructor(private dialogRef: NbDialogRef<FormUpdateMovimientoModalComponent>,
    private almacenUsuariosService: AlmacenUsuariosService,
    private iipoOperacionsService: TipoOperacionsService,
    private movimientosService: MovimientosService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private nbToastrService: NbToastrService,
    private personaConsultasService: PersonaConsultasService,
    private nbDialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.getMasters();
    this.suscribeForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getMasters() {
    this.almacenUsuariosService.getMisAlmacenes$({})
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.misAlmacenes = response || [];
        if (this.aInventarioMovimiento) {
          setTimeout(() => {
            this.newForm.get('id_almacen')?.patchValue(this.aInventarioMovimiento.id_almacen);
          }, 0);
        }
      }, err => {
        this.misAlmacenes = [];
      });
  }

  private patchForm() {
    this.proveedorStatus = 'basic';
    setTimeout(() => {
      this.newForm.patchValue({
        id_almacen: this.aInventarioMovimiento.id_almacen,
        tipo_movimiento: this.aInventarioMovimiento.tipo_movimiento,
        id_tipo_operacion: this.aInventarioMovimiento.id_tipo_operacion,
        fecha: new Date(this.aInventarioMovimiento.fecha),
        detalle: this.aInventarioMovimiento.detalle,

        id_proveedor: this.aInventarioMovimiento.id_proveedor ?? '',
        proveedor_id_ruc: this.aInventarioMovimiento.proveedor_id_ruc ?? '',
        proveedor_razon_social: this.aInventarioMovimiento.proveedor_razon_social ?? '',
      }, { emitEvent: false });

      const { id_proveedor, proveedor_id_ruc, proveedor_razon_social } = this.aInventarioMovimiento;
      if (this.aInventarioMovimiento.id_proveedor) {
        this.firstPatch = true;
        this.ruc.setValue(this.aInventarioMovimiento.proveedor_id_ruc ?? '', { emitEvent: false });
        this.onValidarRuc(proveedor_id_ruc, proveedor_razon_social, id_proveedor);
      }
      this.getTipoOperacions();
    }, 0);
  }

  private getTipoOperacions() {
    const tipo_movimiento = this.newForm.get('tipo_movimiento')?.value;
    if (!tipo_movimiento) return;
    this.iipoOperacionsService.getByQuery$({ tipo_movimiento })
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.tipoOperacions = response || [];
        if (this.aInventarioMovimiento) {
          setTimeout(() => {
            this.newForm.get('id_tipo_operacion')?.patchValue(this.aInventarioMovimiento.id_tipo_operacion);
          }, 0);
        }
      }, err => {
        this.tipoOperacions = [];
      });
  }

  private suscribeForm() {
    this.newForm.get('tipo_movimiento')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        setTimeout(() => {
          this.getTipoOperacions();
        }, 0);
      }, err => {
      });

    this.ruc.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.proveedores = [];
        this.newForm.get('id_proveedor')?.reset('');
        this.newForm.get('proveedor_id_ruc')?.reset('');
        this.newForm.get('proveedor_razon_social')?.reset('');
        this.proveedorStatus = 'basic';
      }),
      takeUntil(this.destroy$),
    ).subscribe(val => {
      if (val.length > 0 && typeof val !== 'object' && !this.firstPatch) {
        this.personaConsultasService.searchContribuyente$({ text_search: val }).subscribe(({ data }) => {
          this.proveedores = data;
          this.inputProveedor.nativeElement.click();
        });
      }
    });
  }

  proveedorHandle = (value: any) => value?.id_ruc ? value?.id_ruc : value;
  public proveedorSelect = (value: any) => this.onValidarRuc(value?.id_ruc, value?.contribuyente_nombre, value?.id_persona);
  private onValidarRuc(id_ruc: string, razon_social: string, id_proveedor: string) {
    if (!id_ruc) return;
    this.proveedorLoading = true;
    this.personaConsultasService.getRuc$({ ruc: id_ruc })
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.newForm.get('id_proveedor')?.patchValue(id_proveedor);
          this.newForm.get('proveedor_id_ruc')?.patchValue(id_ruc);
          this.newForm.get('proveedor_razon_social')?.patchValue(razon_social);
          this.configRucExistsInSunat(data);
          this.proveedorLoading = false;
          this.firstPatch = false;
        }, error: () => {
          this.proveedorLoading = false;
        }
      })
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

    if (estado !== 'ACTIVO') {
      this.nbToastrService.show(
        `El ruc ${data?.id_ruc} tiene estado ${estado}, tome sus precauciones.`,
        'Un momento',
        { status: "warning", icon: "alert-circle-outline" }
      );
    }

    if (condicion !== 'HABIDO') {
      this.nbToastrService.show(
        `El ruc ${data?.id_ruc} esta en condición ${condicion}, tome sus precauciones.`,
        'Un momento',
        { status: "warning", icon: "alert-circle-outline" }
      );
    }
  }

  private buildForm() {
    const controls = {
      id_almacen: [{ value: '', disabled: true }, [Validators.required]],
      tipo_movimiento: ['', [Validators.required]],
      id_tipo_operacion: ['', [Validators.required]],
      fecha: [new Date(), [Validators.required]],
      detalle: ['', [Validators.required]],

      id_proveedor: [''],
      proveedor_id_ruc: [''],
      // proveedor_razon_social: [{ value: '', disabled: true }],
      proveedor_razon_social: [''],
    };
    return this.formBuilder.group(controls);
  }

  get f() {
    return this.newForm.controls;
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  private validateContribuyente() {
    const ruc = this.ruc?.value;
    const id_proveedor = this.newForm.get('id_proveedor')?.value;

    if (ruc && !id_proveedor) {
      this.nbToastrService.show(
        'Si tiene planeado agregar un proveedor, ingréselo correctamente.',
        'Un momento',
        { status: "warning", icon: "alert-circle-outline" }
      );
      throw new Error("");
    }
  }

  public onSave() {
    const value = this.newForm.value;
    const invalid = this.newForm.invalid;
    if (invalid) return;
    this.validateContribuyente();
    const aFecha = this.datePipe.transform(value.fecha, 'yyyy-MM-dd');
    if (!confirm('¿Estás seguro de actualizar el item?')) return;

    const data = {
      id_tipo_operacion: value.id_tipo_operacion,
      fecha: aFecha,
      detalle: value.detalle,
      id_proveedor: value.id_proveedor,
      proveedor_id_ruc: value.proveedor_id_ruc,
    };
    this.loadingSpinnerSave = true;
    this.movimientosService.updateIngreso$(this.aInventarioMovimiento.id_movimiento, data)
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.dialogRef.close({ cancel: false, data: response });
        this.loadingSpinnerSave = false;
      }, err => {
        this.loadingSpinnerSave = false;
      });
  }

  public moreInfoProveedor() {
    const id_proveedor = this.newForm.get('id_proveedor')?.value;
    const proveedor_id_ruc = this.newForm.get('proveedor_id_ruc')?.value;
    if (!id_proveedor || !proveedor_id_ruc) {
      this.showToast();
      return;
    }
    const dialog = this.nbDialogService.open(InfoProveedorModalComponent);
    dialog.componentRef.instance.id_ruc = proveedor_id_ruc;
    dialog.onClose.subscribe(res => {
      if (!res.cancel) {
      }
    });
  }

  public showToast() {
    this.nbToastrService.show(
      `Ingrese correctamente el ruc del contribuyente`,
      'Un momento',
      { status: "warning", icon: "alert-circle-outline" }
    );
  }
}
