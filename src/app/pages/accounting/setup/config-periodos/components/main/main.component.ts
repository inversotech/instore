import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder, FormControl } from "@angular/forms";
import { catchError, map, takeUntil } from "rxjs/operators";
import { Observable, of, Subject } from "rxjs";
import { NbDialogService } from "@nebular/theme";
import { SetupUserEnterpriseService } from "src/app/core/providers/setup-user-enterprise.service";
import { AppDataService } from "src/app/core/providers/app-data.service";
import { AnhosService } from "src/app/providers/services/accounting/anhos.service";
import { AnhoConfigModalComponent } from "../anho-config-modal/anho-config-modal.component";
import { ContaAnhoConfigsService } from "src/app/providers/services/accounting/conta-anho-configs.service";

@Component({
  selector: "lamb-main",
  templateUrl: "main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public anhosConfig: any[] = [];
  public mesesConfig: any[] = [];
  public anhoConfigSelected: any = null;
  public filterForm: FormGroup = this.formBuilder.group({
    id_empresa: ['', [Validators.required]],
  });
  public loading: boolean = false;
  public empresas$ = this.getEmpresas$();
  public empresaConfig = this.appDataService.getEmpresaConfig();
  public tipoAsientos$ = this.contaAnhoConfigsService.getTipoAsientos$({});
  public id_tipo_asiento: FormControl = new FormControl('', Validators.required);

  constructor(
    private contaAnhoConfigsService: ContaAnhoConfigsService,
    private formBuilder: FormBuilder,
    private appDataService: AppDataService,
    private nbDialogService: NbDialogService,
    private setupUserEnterpriseService: SetupUserEnterpriseService,
  ) { }

  ngOnInit() {
    this.filterForm.get('id_empresa')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.getAnhoConfigs();
          }, 0);
        }
      });

    this.id_tipo_asiento.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getMesConfigs();
        }
      });

    this.setDefaultValues();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getEmpresas$(): Observable<any> {
    return this.setupUserEnterpriseService.getMisEmpresas$().pipe(map(res => res.data), catchError(() => of([])));
  }

  private setDefaultValues() {
    console.log('this.empresaConfig');
    console.log(this.empresaConfig);
    if (this.empresaConfig) {
      setTimeout(() => {
        this.filterForm.get('id_empresa')?.patchValue(this.empresaConfig.id_empresa);
      }, 0);
    }

  }

  private getAnhoConfigs() {
    this.mesesConfig = [];
    this.anhoConfigSelected = null;
    const value = this.filterForm.value;
    if (!value.id_empresa) return;

    this.loading = true;
    this.contaAnhoConfigsService
      .getAnhoConfigs$({ id_empresa: value.id_empresa })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.loading = false;
          this.anhosConfig = data || [];
        },
        error: () => {
          this.loading = false;
          this.anhosConfig = [];
        },
      }
      );
  }

  private getMesConfigs() {
    this.mesesConfig = [];
    const value = this.filterForm.value;
    const id_tipo_asiento = this.id_tipo_asiento.value;
    if (!value.id_empresa) return;
    if (!id_tipo_asiento) return;
    if (!this.anhoConfigSelected) return;
    this.loading = true;
    this.contaAnhoConfigsService
      .getMesConfigs$({ id_empresa: value.id_empresa, id_anho: this.anhoConfigSelected.id_anho, id_tipo_asiento: id_tipo_asiento })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.loading = false;
          // this.anhoConfig = data.anhoConfig || null;
          this.mesesConfig = data || [];
        },
        error: () => {
          this.loading = false;
          // this.anhoConfig = null;
          this.mesesConfig = [];
        },
      }
      );
  }

  public onBuscarInformacionPeriodo() {
    this.getAnhoConfigs();
  }

  public periodConfigOpening() {
    this.nbDialogService
      .open(AnhoConfigModalComponent)
      .onClose.subscribe(({ cancel }) => {
        if (cancel) return;
        this.getAnhoConfigs();
      });
  }


  public showMesConfig(item: any) {
    this.anhoConfigSelected = item;
    this.getMesConfigs();
  }

  public closeMesConfig(id_mes: any, estadoActual: any): void {
    const value = this.filterForm.value;
    const valid = this.filterForm.valid;
    if (!valid) return;
    if (!this.anhoConfigSelected) return;

    let title = "";
    if (estadoActual == 0) {
      title = "abrir";
    } else if (estadoActual == 1) {
      title = "cerrar";
    } else if (estadoActual == 2) {
      title = "reabrir";
    }
    if (!confirm(`¿Estás seguro de ${title} es periodo?`)) return;
    const data = {
      id_empresa: value.id_empresa,
      id_anho: this.anhoConfigSelected.id_anho,
      id_mes: id_mes,
      estado_actual: estadoActual,
    };
    this.loading = true;
    this.contaAnhoConfigsService
      .changeEstadoMesConfig$(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.loading = false;
          this.getMesConfigs();
        },
        error: (err: any) => {
          this.loading = false;
        }
      });
  }

  // public closeAnhoConfig(item: any) {
  //   this.changeAnhoConfig('0', item.id_anho);
  // }

  // public openAnhoConfig(item: any) {
  //   this.changeAnhoConfig('1', item.id_anho);
  // }

  public changeAnhoConfig(item: any) {
    const value = this.filterForm.value;
    const valid = this.filterForm.valid;
    if (!valid) return;

    if (!confirm(`¿Estás seguro de cerrar el periodo ${item.id_anho}?`)) return;
    const data = {
      id_empresa: value.id_empresa,
      id_anho: item.id_anho,
      estado_actual: item.estado,
    };
    this.loading = true;
    this.contaAnhoConfigsService
      .changeEstadoAnhoConfig$(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.loading = false;
          this.getAnhoConfigs();
        },
        error: (err: any) => {
          this.loading = false;
        }
      });
  }


  public generateMesConfig() {
    const value = this.filterForm.value;
    if (!this.anhoConfigSelected) return;
    if (this.id_tipo_asiento.invalid) return;

    if (!confirm(`¿Estás seguro de generar los meses para el año ${this.anhoConfigSelected.id_anho}?`)) return;
    const data = {
      id_empresa: value.id_empresa,
      id_anho: this.anhoConfigSelected.id_anho,
      id_tipo_asiento: this.id_tipo_asiento.value,
    };
    this.loading = true;
    this.contaAnhoConfigsService
      .addMesConfig$(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.loading = false;
          this.getMesConfigs();
        },
        error: (err: any) => {
          this.loading = false;
        }
      });
  }
}
