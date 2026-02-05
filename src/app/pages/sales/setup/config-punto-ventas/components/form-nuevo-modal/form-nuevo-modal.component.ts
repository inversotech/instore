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

// interface TipoAplicacion {
//   id_desc_tipo_aplicacion: string;
//   nombre: string;
// }
@Component({
  selector: 'inverso-form-nuevo-modal',
  templateUrl: './form-nuevo-modal.component.html',
  styleUrls: ['./form-nuevo-modal.component.scss']

})

export class FormNuevoModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public formulario: FormGroup = this.formBuilder.group({
    id_empresa: ['', [Validators.required]],
    id_empresa_sucursal: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    activo: [true, [Validators.required]],
  });
  public loadingSpinnerSave: boolean = false;
  public empresas$ = this.getEmpresas$();
  public empresaSucursales: any[] = [];
  public empresaConfig = this.appDataService.getEmpresaConfig();

  public adata: any = null;
  @Input('item') set item(data: any) {
    this.subcribeForm();
    if (data) {
      this.adata = data;
      // No editar id_empresa si es update
      this.formulario.patchValue({
        id_empresa: data.id_empresa,
        id_empresa_sucursal: data.id_empresa_sucursal,
        nombre: data.nombre,
        activo: data.activo,
      });
      this.formulario.get('id_empresa')?.disable();

    } else {
      // Nuevo registro
    }
  }

  constructor(private dialogRef: NbDialogRef<FormNuevoModalComponent>,
    private toastrService: NbToastrService,
    private formBuilder: FormBuilder,
    private setupUserEnterpriseService: SetupUserEnterpriseService,
    private appDataService: AppDataService,
    private puntoVentasService: PuntoVentasService,
  ) { }

  // activo: boolean = true;
  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getEmpresas$(): Observable<any> {
    return this.setupUserEnterpriseService.getMisEmpresas$()
      .pipe(map(res => res.data),
        switchMap(res => {
          if (!this.adata) {
            setTimeout(() => {
              this.formulario.get('id_empresa')?.patchValue(this.empresaConfig.id_empresa);
            }, 0);
          }
          return of(res);
        }), catchError(() => of([])));
  }

  private subcribeForm() {
    this.formulario.get('id_empresa')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        switchMap(id_empresa => this.setupUserEnterpriseService.getMisEmpresaSucursales$({ id_empresa }).pipe(
          map(res => res.data),
          catchError(() => of([]))
        ))
      )
      .subscribe(sucursales => {
        this.empresaSucursales = sucursales;
        if (!this.adata) {
          setTimeout(() => {
            this.formulario.get('id_empresa_sucursal')?.patchValue(this.empresaConfig.id_empresa_sucursal);
          }, 0);
        }
      });
  }

  get f() {
    return this.formulario.controls;
  }


  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onSave() {
    const invalid = this.formulario.invalid;
    if (invalid) {
      this.toastrService.warning('Completa todos los campos obligatorios', 'Formulario incompleto');
      return;
    }

    const rawValue = this.formulario.value;

    if (this.adata && this.adata.id_punto_venta) {
      const value = {
        id_empresa_sucursal: rawValue.id_empresa_sucursal,
        nombre: rawValue.nombre,
        activo: rawValue.activo,
      };
      this.loadingSpinnerSave = true;
      this.puntoVentasService.update$(this.adata.id_punto_venta, value).subscribe({
        next: (respuesta) => {
          this.dialogRef.close({ cancel: false, data: respuesta }); // Cierra el modal y pasa los datos
          this.loadingSpinnerSave = false;
        },
        error: (error) => {
          this.loadingSpinnerSave = false;
        }
      });
    } else {
      const value = {
        id_empresa: rawValue.id_empresa,
        id_empresa_sucursal: rawValue.id_empresa_sucursal,
        nombre: rawValue.nombre,
        activo: rawValue.activo,
      };
      this.loadingSpinnerSave = true;
      this.puntoVentasService.add$(value).subscribe({
        next: (respuesta) => {
          this.dialogRef.close({ cancel: false, data: respuesta }); // Cierra el modal y pasa los datos
          this.loadingSpinnerSave = false;
        },
        error: (error) => {
          this.loadingSpinnerSave = false;
        }
      });
    }
  }

}
