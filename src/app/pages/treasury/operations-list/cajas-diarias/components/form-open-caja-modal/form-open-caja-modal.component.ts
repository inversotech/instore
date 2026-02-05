import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, PipeTransform } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { catchError, debounceTime, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { AppDataService } from 'src/app/core/providers/app-data.service';
import { ConfirmModalComponent } from 'src/app/pages/shared/components';
import { AnhosService } from 'src/app/providers/services/accounting/anhos.service';
import { MesesService } from 'src/app/providers/services/accounting/meses.service';
import { UsersService } from 'src/app/providers/services/setup-system/users.service';
import { DatePipe } from '@angular/common';
import { CajaDiariosService } from 'src/app/providers/services/treasury/caja-diarios.service';

@Component({
  selector: 'open-form-open-caja-modal',
  templateUrl: './form-open-caja-modal.component.html',
  styleUrls: ['./form-open-caja-modal.component.scss']
})
export class FormOpenCajaModalComponent implements OnInit, OnDestroy {

  public documentoForm: FormGroup = this.formBuilder.group({
    id_caja: ['', [Validators.required]],
    id_anho: ['', [Validators.required]],
    id_mes: ['', [Validators.required]],
    id_responsable: ['', [Validators.required]],
    fecha_apertura: [new Date(), [Validators.required]],
    importe: [0, [Validators.required]],
  });
  public misPuntoVentasCajas$ = this.cajaDiariosService.getCajasDisponibles$({});
  public anhos$ = this.anhosService.getAll$();
  public meses$ = this.mesesService.getAll$();

  public loadingSpinnerSave: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  public tipoExistencias: any[] = [];
  public misEmpresas: any[] = [];
  public misEmpresasSucursales: any[] = [];

  public empresaConfig = this.appDataService.getEmpresaConfig();

  @Input('item') set item(data: any) {
    this.documentoForm.patchValue({
      id_caja: data.id_caja,
      id_anho: data.id_anho,
      id_mes: data.id_mes,
      id_responsable: data.id_responsable,
      fecha_apertura: new Date(data.fecha_apertura),
      importe: data.importe,
    });
  }

  public textSearchUser: FormControl = new FormControl('');
  @ViewChild('idUserSearch') idUserSearch!: ElementRef;
  public filteredUserList$: Observable<any[]> | undefined;
  public loadingUsers: boolean = false;


  constructor(private dialogRef: NbDialogRef<FormOpenCajaModalComponent>,
    private nbDialogService: NbDialogService,
    private cajaDiariosService: CajaDiariosService,
    private anhosService: AnhosService,
    private mesesService: MesesService,
    private appDataService: AppDataService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {

    this.suscribeForms();

    this.documentoForm.get('id_anho')?.patchValue(new Date().getFullYear());
    this.documentoForm.get('id_mes')?.patchValue(new Date().getMonth() + 1);

    this.filteredUserList$ = this.textSearchUser.valueChanges
      .pipe(startWith(''),
        debounceTime(400),
        tap(() => this.loadingUsers = true),
        switchMap(this.loadUsers.bind(this)),
        tap(() => this.loadingUsers = false),
        map((items) => {
          this.idUserSearch.nativeElement.click();
          return items;
        }),
      );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private loadUsers(term: string): Observable<any> {
    if (typeof term === 'object' || term === '' || term === null) return of([]);
    const params = { text_search: term };
    return this.usersService.getByQuery$(params)
      .pipe(map(x => x?.data || []));
  }

  public viewHandleUser(value: any) {
    if (typeof value === 'object') {
      return value.email ? `${value.email}` : 'None.';
    } else {
      return value;
    }
  }

  public selectedChangeUser(item: any) {
    if (!item || !item.id) return;
    this.documentoForm.get('id_responsable')?.setValue(item.id);
  }


  private suscribeForms() {

  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onSave() {
    const value = this.documentoForm.value;
    const invalid = this.documentoForm.invalid;
    if (invalid) return;
    this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de crear el item?' } })
      .onClose.subscribe(status => {
        if (status) {

          const fecha_apertura = this.datePipe.transform(value.fecha_apertura, 'yyyy-MM-dd HH:mm:ss');
          const data = {
            id_caja: value.id_caja,
            id_anho: value.id_anho,
            id_mes: value.id_mes,
            id_responsable: value.id_responsable,
            fecha_apertura: fecha_apertura,
            importe: value.importe,
          };
          this.loadingSpinnerSave = true;
          this.cajaDiariosService.openCajaDiario$(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: response => {
                this.dialogRef.close({ cancel: false, data: response });
                this.loadingSpinnerSave = false;
              },
              error: err => {
                this.loadingSpinnerSave = false;
              }
            });




        } else {
        }
      }, err => {
      });

  }

}
