import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { NbDialogRef } from '@nebular/theme';
import { Subject } from 'rxjs';
import { SetupUserEnterpriseService } from 'src/app/core/providers/setup-user-enterprise.service';
import { AppDataService } from 'src/app/core/providers/app-data.service';

@Component({
    selector: 'open-change-enterprise-modal',
    templateUrl: 'change-enterprise-modal.component.html',
    styleUrls: ['change-enterprise-modal.component.scss'],
})

export class ChangeEnterpriseModalComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public enterpriseForm: FormGroup = this.buildForm();
    public empresas: any[] = [];
    public empresasSucursales: any[] = [];
    public empresaConfig = this.appDataService.getEmpresaConfig();

    public loadingSave: boolean = false;
    constructor(
        private dialogRef: NbDialogRef<ChangeEnterpriseModalComponent>,
        private appDataService: AppDataService,
        public setupUserEnterpriseService: SetupUserEnterpriseService,
        public formBuilder: FormBuilder) { }

    ngOnInit() {
        this.loadMasters();
        this.subscribeForms();
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

    private subscribeForms() {
        this.enterpriseForm.controls['empresa_id'].valueChanges
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe(value => {
                if (value) {
                    setTimeout(() => {
                        this.enterpriseForm.get('empresa_sucursal_id')?.patchValue('');
                    }, 0);
                    this.loadEmpresaSucursales(value);
                }
            });
    }

    private loadEmpresaSucursales(empresaId: any) {
        this.setupUserEnterpriseService.getMisEmpresaSucursales$({ empresa_id: empresaId })
            .pipe(
                map(res => res.data),
                takeUntil(this.destroy$),
            )
            .subscribe(response => {
                const empresasSucursaless = response || [];
                this.empresasSucursales = empresasSucursaless;
                const empresaIgual = empresasSucursaless.find((res: any) => res.empresa_sucursal_id === this.empresaConfig.empresa_sucursal_id && res.empresa_id === this.empresaConfig.empresa_id);
                if (this.empresaConfig && empresaIgual) {
                    setTimeout(() => {
                        this.enterpriseForm.get('empresa_sucursal_id')?.patchValue(this.empresaConfig.empresa_sucursal_id);
                    }, 0);
                }
            });
    }

    private loadMasters() {
        this.setupUserEnterpriseService.getMisEmpresas$()
            .pipe(
                map(res => res.data),
                takeUntil(this.destroy$),
            )
            .subscribe(response => {
                const empresass = response || [];
                this.empresas = empresass;
                const empresaIgual = empresass.find((res: any) => res.empresa_id === this.empresaConfig.empresa_id);
                if (this.empresaConfig && empresaIgual) {
                    setTimeout(() => {
                        this.enterpriseForm.get('empresa_id')?.patchValue(this.empresaConfig.empresa_sucursal_id);
                    }, 0);
                }
            });
    }

    private buildForm() {
        const controls = this.initializeControls();
        // this.enterpriseForm = this.formBuilder.group(controls);
        return this.formBuilder.group(controls);
    }
    private initializeControls() {
        const controls = {
            empresa_id: ['', Validators.required],
            empresa_sucursal_id: ['', Validators.required],
        };
        return controls;
    }

    public onSubmit() {
        const invalid = this.enterpriseForm.invalid;
        const value = this.enterpriseForm.value;
        if (invalid) return;

        this.loadingSave = true;
        this.setupUserEnterpriseService.add$(value)
            .pipe(
                map(resp => resp.data),
                takeUntil(this.destroy$),
            )
            .subscribe(ress => {
                this.loadingSave = false;
                if (ress) {
                    this.dialogRef.close({ cancel: false });
                }
            }, err => {
                this.loadingSave = false;
            });
    }
}
