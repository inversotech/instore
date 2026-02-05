import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AlmacenArticulosService } from 'src/app/providers/services/inventory/almacen-articulos.service';
import { UsersService } from 'src/app/providers/services/setup-system/users.service';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { TipoOperacionsService } from 'src/app/providers/services/inventory/tipo-operacions.service';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { DatePipe } from '@angular/common';
import { PersonaConsultasService } from 'src/app/providers/services/services/persona-consultas.service';
import { InfoProveedorModalComponent } from 'src/app/pages/shared/info-proveedor-modal';

@Component({
  selector: 'open-form-ingreso-nuevo-movimiento-modal',
  templateUrl: './form-ingreso-nuevo-movimiento-modal.component.html',
  styleUrls: ['./form-ingreso-nuevo-movimiento-modal.component.scss']
})
export class FormIngresoNuevoMovimientoModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public newForm: FormGroup = this.formBuilder.group({
    id_almacen: ['', [Validators.required]],
    tipo_movimiento: ['I', [Validators.required]],
    id_tipo_operacion: ['', [Validators.required]],
    fecha: [new Date(), [Validators.required]],
    detalle: ['', [Validators.required]],
    tipo_gestion: ['AGREGADO', [Validators.required]],

    id_proveedor: [''],
    proveedor_id_ruc: [''],
    proveedor_razon_social: [''],
  });;
  public ruc: FormControl = new FormControl('');
  public loadingSpinnerSave: boolean = false;
  public loadingProveedor: boolean = false;
  public tipoOperacions: any[] = [];
  public misAlmacenes: any[] = [];

  @ViewChild('inputProveedor', { read: ElementRef }) inputProveedor!: ElementRef;
  public proveedorLoading: boolean = false;
  public proveedorStatus: any = 'basic';
  public proveedores: any[] = [];

  public tipoGestions: any[] = [
    { id: 'AGREGADO', descripcion: 'Sin unidades individuales' },
    { id: 'UNIDAD', descripcion: 'Con tracking individual' },
  ];
  constructor(private dialogRef: NbDialogRef<FormIngresoNuevoMovimientoModalComponent>,
    private almacenUsuariosService: AlmacenUsuariosService,
    private iipoOperacionsService: TipoOperacionsService,
    private movimientosService: MovimientosService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private nbToastrService: NbToastrService,
    private nbDialogService: NbDialogService,
    private personaConsultasService: PersonaConsultasService,
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

  seleccionado: any = 'AGREGADO';
  seleccionar(item: any) {
    this.seleccionado = item.id;
    this.newForm.get('tipo_gestion')?.setValue(item.id);
  }

  private getMasters() {
    this.almacenUsuariosService.getMisAlmacenes$({})
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.misAlmacenes = response || [];
      }, err => {
        this.misAlmacenes = [];
      });
  }

  private getTipoOperacions() {
    const tipo_movimiento = this.newForm.get('tipo_movimiento')?.value;
    this.iipoOperacionsService.getByQuery$({ tipo_movimiento })
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.tipoOperacions = response || [];
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
      if (val.length > 0 && typeof val !== 'object') {
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
    const aFecha = this.datePipe.transform(value.fecha, 'yyyy-MM-dd HH:mm:ss');
    if (confirm('¿Estás seguro de crear el item?')) {
      // this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de crear el item?' } })
      //   .onClose.subscribe(status => {
      //     if (status) {
      const data = {
        tipo_movimiento: value.tipo_movimiento,
        id_almacen: value.id_almacen,
        id_tipo_operacion: value.id_tipo_operacion,
        id_proveedor: value.id_proveedor,
        proveedor_id_ruc: value.proveedor_id_ruc,
        fecha: aFecha,
        detalle: value.detalle,
        tipo_gestion: value.tipo_gestion,
      };
      this.loadingSpinnerSave = true;
      this.movimientosService.addIngreso$(data)
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
      'Alto!',
      { status: "warning", icon: "alert-circle-outline" }
    );
  }

}
