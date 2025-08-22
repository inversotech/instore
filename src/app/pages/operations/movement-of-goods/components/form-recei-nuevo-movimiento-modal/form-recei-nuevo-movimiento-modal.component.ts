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
  selector: 'open-form-recei-nuevo-movimiento-modal',
  templateUrl: './form-recei-nuevo-movimiento-modal.component.html',
  styleUrls: ['./form-recei-nuevo-movimiento-modal.component.scss']
})
export class FormReceiNuevoMovimientoModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public newForm: FormGroup = this.buildForm();
  public ruc: FormControl = new FormControl('');
  public loadingSpinnerSave: boolean = false;
  public loadingProveedor: boolean = false;
  public tipoOperacions: any[] = [];
  public misAlmacenes: any[] = [];

  @ViewChild('inputProveedor', { read: ElementRef }) inputProveedor!: ElementRef;
  public proveedorLoading: boolean = false;
  public proveedorStatus: any = 'basic';
  public proveedores: any[] = [];

  constructor(private dialogRef: NbDialogRef<FormReceiNuevoMovimientoModalComponent>,
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

  private getMasters() {
    this.almacenUsuariosService.getMisAlmacenes$({})
      .pipe(map(res => res.data),
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
        this.newForm.get('proveedor_id')?.reset('');
        this.newForm.get('proveedor_ruc_id')?.reset('');
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
      almacen_id: ['', [Validators.required]],
      tipo_movimiento: ['I', [Validators.required]],
      tipo_operacion_id: ['', [Validators.required]],
      fecha: [new Date(), [Validators.required]],
      detalle: ['', [Validators.required]],

      proveedor_id: [''],
      proveedor_ruc_id: [''],
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
    if (confirm('¿Estás seguro de crear el item?')) {
      // this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de crear el item?' } })
      //   .onClose.subscribe(status => {
      //     if (status) {
      const data = {
        tipo_movimiento: value.tipo_movimiento,
        almacen_id: value.almacen_id,
        tipo_operacion_id: value.tipo_operacion_id,
        proveedor_id: value.proveedor_id,
        proveedor_ruc_id: value.proveedor_ruc_id,
        fecha: aFecha,
        detalle: value.detalle,
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
      'Alto!',
      { status: "warning", icon: "alert-circle-outline" }
    );
  }

}
