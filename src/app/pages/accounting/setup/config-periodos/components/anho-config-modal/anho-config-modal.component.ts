import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { catchError, map, takeUntil } from "rxjs/operators";
import { NbDialogRef } from "@nebular/theme";
import { Observable, of, Subject } from "rxjs";
import { DatePipe } from "@angular/common";
import { AnhosService } from "src/app/providers/services/accounting/anhos.service";
import { SetupUserEnterpriseService } from "src/app/core/providers/setup-user-enterprise.service";
import { AppDataService } from "src/app/core/providers/app-data.service";
import { MonedasService } from "src/app/providers/services/accounting/monedas.service";
import { ContaAnhoConfigsService } from "src/app/providers/services/accounting/conta-anho-configs.service";
import { TipoPlansService } from "src/app/providers/services/accounting/tipo-plans.service";

@Component({
  selector: "open-anho-config-modal",
  templateUrl: "./anho-config-modal.component.html",
  styleUrls: ["./anho-config-modal.component.scss"],
})
export class AnhoConfigModalComponent implements OnInit {
  private unSusb$ = new Subject<void>();
  public entities: any[] = [];
  public years: any[] = [];
  public planTypes: any[] = [];
  public periodOpeningForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    id_empresa: ['', [Validators.required]],
    id_anho: ['', [Validators.required]],
    id_tipo_plan: ['', [Validators.required]],
    id_moneda: ['', [Validators.required]],
    fecha_inicio: [new Date(), [Validators.required]],
    fecha_fin: [new Date(), [Validators.required]],
  });

  // public abForms: any;
  loading: boolean = false;
  public anhos$ = this.anhosService.getAll$();
  public tipoPlans$ = this.tipoPlansService.getAll$();
  public monedas$ = this.monedasService.getAll$();
  public empresas$ = this.getEmpresas$();
  public empresaConfig = this.appDataService.getEmpresaConfig();

  constructor(
    private formBuilder: FormBuilder,
    private anhosService: AnhosService,
    private appDataService: AppDataService,
    private dialogRef: NbDialogRef<AnhoConfigModalComponent>,
    private datePipe: DatePipe,
    private setupUserEnterpriseService: SetupUserEnterpriseService,
    private tipoPlansService: TipoPlansService,
    private monedasService: MonedasService,
    private contaAnhoConfigsService: ContaAnhoConfigsService,
  ) { }

  ngOnInit() {
    this.setDefaultValues();
  }

  private setDefaultValues() {
    if (this.empresaConfig) {
      setTimeout(() => {
        this.periodOpeningForm.get('id_empresa')?.patchValue(this.empresaConfig.id_empresa);
      }, 0);
    }
    this.periodOpeningForm.get('id_anho')?.patchValue(new Date().getFullYear());
  }

  private getEmpresas$(): Observable<any> {
    return this.setupUserEnterpriseService.getMisEmpresas$().pipe(map(res => res.data), catchError(() => of([])));
  }

  public onSave(): void {
    if (this.periodOpeningForm.invalid) return;
    const value = this.periodOpeningForm.value;
    const data = {
      nombre: value.nombre,
      id_empresa: value.id_empresa,
      id_anho: value.id_anho,
      id_tipo_plan: value.id_tipo_plan,
      id_moneda: value.id_moneda,
      fecha_inicio: this.datePipe.transform(value.fecha_inicio, "yyyy-MM-dd"),
      fecha_fin: this.datePipe.transform(value.fecha_fin, "yyyy-MM-dd"),
    };
    this.loading = true;
    this.contaAnhoConfigsService.addAnhoConfig$(data).subscribe(
      {
        next: (resp: any) => {
          this.loading = false;
          this.dialogRef.close({ cancel: false });
        },
        error: (error: any) => {
          this.loading = false;
        }
      }
    );
  }

  public onClose() {
    this.dialogRef.close({ cancel: true });
  }
}
