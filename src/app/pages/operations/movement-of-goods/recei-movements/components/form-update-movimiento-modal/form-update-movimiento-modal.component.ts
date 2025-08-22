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
            this.newForm.get('almacen_id')?.patchValue(this.aInventarioMovimiento.almacen_id);
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
        almacen_id: this.aInventarioMovimiento.almacen_id,
        tipo_movimiento: this.aInventarioMovimiento.tipo_movimiento,
        tipo_operacion_id: this.aInventarioMovimiento.tipo_operacion_id,
        fecha: new Date(this.aInventarioMovimiento.fecha),
        detalle: this.aInventarioMovimiento.detalle,

        proveedor_id: this.aInventarioMovimiento.proveedor_id ?? '',
        proveedor_ruc_id: this.aInventarioMovimiento.proveedor_ruc_id ?? '',
        proveedor_razon_social: this.aInventarioMovimiento.proveedor_razon_social ?? '',
      }, { emitEvent: false });

      const { proveedor_id, proveedor_ruc_id, proveedor_razon_social } = this.aInventarioMovimiento;
      if (this.aInventarioMovimiento.proveedor_id) {
        this.firstPatch = true;
        this.ruc.setValue(this.aInventarioMovimiento.proveedor_ruc_id ?? '', { emitEvent: false });
        this.onValidarRuc(proveedor_ruc_id, proveedor_razon_social, proveedor_id);
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
            this.newForm.get('tipo_operacion_id')?.patchValue(this.aInventarioMovimiento.tipo_operacion_id);
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
        this.newForm.get('proveedor_id')?.reset('');
        this.newForm.get('proveedor_ruc_id')?.reset('');
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

  proveedorHandle = (value: any) => value?.ruc_id ? value?.ruc_id : value;
  public proveedorSelect = (value: any) => this.onValidarRuc(value?.ruc_id, value?.contribuyente_nombre, value?.persona_id);
  private onValidarRuc(ruc_id: string, razon_social: string, proveedor_id: string) {
    if (!ruc_id) return;
    this.proveedorLoading = true;
    this.personaConsultasService.getRuc$({ ruc: ruc_id })
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.newForm.get('proveedor_id')?.patchValue(proveedor_id);
          this.newForm.get('proveedor_ruc_id')?.patchValue(ruc_id);
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
        `El ruc ${data?.ruc_id} tiene estado ${estado}, tome sus precauciones.`,
        'Un momento',
        { status: "warning", icon: "alert-circle-outline" }
      );
    }

    if (condicion !== 'HABIDO') {
      this.nbToastrService.show(
        `El ruc ${data?.ruc_id} esta en condición ${condicion}, tome sus precauciones.`,
        'Un momento',
        { status: "warning", icon: "alert-circle-outline" }
      );
    }
  }

  private buildForm() {
    const controls = {
      almacen_id: [{ value: '', disabled: true }, [Validators.required]],
      tipo_movimiento: ['', [Validators.required]],
      tipo_operacion_id: ['', [Validators.required]],
      fecha: [new Date(), [Validators.required]],
      detalle: ['', [Validators.required]],

      proveedor_id: [''],
      proveedor_ruc_id: [''],
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
    const proveedor_id = this.newForm.get('proveedor_id')?.value;

    if (ruc && !proveedor_id) {
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
      tipo_operacion_id: value.tipo_operacion_id,
      fecha: aFecha,
      detalle: value.detalle,
      proveedor_id: value.proveedor_id,
      proveedor_ruc_id: value.proveedor_ruc_id,
    };
    this.loadingSpinnerSave = true;
    this.movimientosService.updateIngreso$(this.aInventarioMovimiento.movimiento_id, data)
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
    const proveedor_id = this.newForm.get('proveedor_id')?.value;
    const proveedor_ruc_id = this.newForm.get('proveedor_ruc_id')?.value;
    if (!proveedor_id || !proveedor_ruc_id) {
      this.showToast();
      return;
    }
    const dialog = this.nbDialogService.open(InfoProveedorModalComponent);
    dialog.componentRef.instance.ruc_id = proveedor_ruc_id;
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
