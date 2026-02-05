import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoExistenciasService } from 'src/app/providers/services/inventory/tipo-existencias.service';
import { SetupUserEnterpriseService } from 'src/app/core/providers/setup-user-enterprise.service';
import { ConfirmModalComponent } from 'src/app/pages/shared/components';
import { AlmacenesService } from 'src/app/providers/services/inventory/almacenes.service';

@Component({
  selector: 'open-form-nuevo-warehouse-modal',
  templateUrl: './form-nuevo-warehouse-modal.component.html',
  styleUrls: ['./form-nuevo-warehouse-modal.component.scss']
})
export class FormNuevoWarehouseModalComponent implements OnInit, OnDestroy {
  public almacenForm: FormGroup = this.buildForm();
  public loadingSpinnerSave: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  public tipoExistencias: any[] = [];
  public misEmpresas: any[] = [];
  public misEmpresasSucursales: any[] = [];

  constructor(private dialogRef: NbDialogRef<FormNuevoWarehouseModalComponent>,
    private tipoExistenciasService: TipoExistenciasService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private setupUserEnterpriseService: SetupUserEnterpriseService,
    private almacenesService: AlmacenesService,
    private nbDialogService: NbDialogService,
    private formBuilder: FormBuilder,
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
    this.tipoExistenciasService.getAll$()
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.tipoExistencias = response;
      }, err => {
        this.tipoExistencias = [];
      });

    this.setupUserEnterpriseService.getMisEmpresas$()
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.misEmpresas = response;
      }, err => {
        this.misEmpresas = [];
      });

  }

  private suscribeForm() {
    this.almacenForm.get('id_empresa')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        setTimeout(() => {
          this.getEmpresaSurcursales();
        }, 0);
      });
  }

  private getEmpresaSurcursales() {
    const id_empresa = this.almacenForm.get('id_empresa')?.value;
    if (!id_empresa) {
      this.misEmpresas = [];
      return;
    };

    this.setupUserEnterpriseService.getMisEmpresaSucursales$({ id_empresa })
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.misEmpresasSucursales = response;
      }, err => {
        this.misEmpresasSucursales = [];
      });

  }

  private buildForm() {
    const controls = {
      id_almacen: [''],
      id_parent: [''],
      id_empresa: ['', [Validators.required]],
      id_empresa_sucursal: ['', [Validators.required]],
      id_tipo_existencia: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      activo: [true, [Validators.required]],
    };
    return this.formBuilder.group(controls);
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onSave() {
    const value = this.almacenForm.value;
    const invalid = this.almacenForm.invalid;
    if (invalid) return;
    this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de crear el item?' } })
      .onClose.subscribe(status => {
        if (status) {
          const data = {
            id_parent: value.id_parent,
            id_empresa: value.id_empresa,
            id_empresa_sucursal: value.id_empresa_sucursal,
            id_tipo_existencia: value.id_tipo_existencia,
            nombre: value.nombre,
            activo: value.activo,
          };
          this.loadingSpinnerSave = true;
          this.almacenesService.add$(data)
            .pipe(map(res => res.data),
              takeUntil(this.destroy$))
            .subscribe(response => {
              this.dialogRef.close({ cancel: false });
              this.loadingSpinnerSave = false;
            }, err => {
              this.loadingSpinnerSave = false;
            });
        } else {
        }
      }, err => {
      });

  }

}
