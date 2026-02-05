import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap, takeUntil, catchError, finalize, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { TipoOperacionsService } from 'src/app/providers/services/inventory/tipo-operacions.service';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { DatePipe } from '@angular/common';
import { DiscountsCoreService } from 'src/app/providers/services/sales/discounts.core.service';
import { SetupUserEnterpriseService } from 'src/app/core/providers/setup-user-enterprise.service';
import { AppDataService } from 'src/app/core/providers/app-data.service';
import { PuntoVentasService } from 'src/app/providers/services/accounting/punto-ventas.service';
import { UsersService } from 'src/app/providers/services/setup-system/users.service';

@Component({
  selector: 'inverso-form-config-add-users-modal',
  templateUrl: './form-config-add-users-modal.component.html',
  styleUrls: ['./form-config-add-users-modal.component.scss']

})

export class FormConfigAddUsersModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loadingSpinnerSave: boolean = false;
  public loadingUsers: boolean = false;

  public newForm: FormGroup = this.formBuilder.group({
    id_user: ['', [Validators.required]],
  });

  public textSearchUser: FormControl = new FormControl('');
  @ViewChild('idUserSearch') idUserSearch!: ElementRef;
  public filteredUserList$: Observable<any[]> | undefined;

  public adata: any = null;
  @Input('item') set item(data: any) {
    if (data) {
      this.adata = data;
    }
  }

  constructor(private dialogRef: NbDialogRef<FormConfigAddUsersModalComponent>,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private puntoVentasService: PuntoVentasService,
  ) { }

  ngOnInit() {

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
    this.newForm.get('id_user')?.setValue(item.id);
  }




  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }


  public onSave() {
    const value = this.newForm.value;
    const invalid = this.newForm.invalid;
    if (invalid) return;

    if (!confirm('¿Estás seguro de crear el item?')) return;
    const data = {
      id_user: value.id_user,
    };

    this.loadingSpinnerSave = true;
    this.puntoVentasService.addUsersToPuntoVenta$(this.adata.id_punto_venta, data)
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.dialogRef.close({ cancel: false, data: response });
          this.loadingSpinnerSave = false;
        },
        error: err => {
          this.loadingSpinnerSave = false;
        }
      });


  }
}
