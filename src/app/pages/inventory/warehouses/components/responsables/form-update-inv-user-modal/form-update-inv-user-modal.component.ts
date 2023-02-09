import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { UsersService } from 'src/app/providers/services/setup-system/users.service';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';

@Component({
  selector: 'open-form-update-inv-user-modal',
  templateUrl: './form-update-inv-user-modal.component.html',
  styleUrls: ['./form-update-inv-user-modal.component.scss']
})
export class FormUpdateInvUserModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public newForm: FormGroup = this.buildForm();
  public loadingSpinnerSave: boolean = false;
  private aItem: any;
  @Input() set item(iitem: any) {
    this.aItem = iitem;
    if (iitem) {
      this.loadingSpinnerSave = true;
      setTimeout(() => {
        this.textSearchUser.patchValue(`${this.aItem.user_email}`);
        this.newForm?.patchValue({
          persona_id: this.aItem.persona_id,
          almacen_id: this.aItem.almacen_id,
          fecha_inicio: new Date(this.aItem.fecha_inicio),
          fecha_fin: new Date(this.aItem.fecha_fin),
          asignado: this.aItem.asignado,
          activo: this.aItem.activo,
        });
        this.loadingSpinnerSave = false;
      }, 1000);
    }
  };

  public textSearchUser: FormControl = new FormControl({ value: '', disabled: true });
  @ViewChild('idUserSearch') idUserSearch!: ElementRef;
  public filteredUserList$: Observable<any[]> | undefined;

  constructor(private dialogRef: NbDialogRef<FormUpdateInvUserModalComponent>,
    private almacenUsuariosService: AlmacenUsuariosService,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.suscribeForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private suscribeForm() {
    this.filteredUserList$ = this.textSearchUser.valueChanges
      .pipe(startWith(''),
        debounceTime(400),
        switchMap(this.loadUsers.bind(this)),
        map((items) => {
          this.idUserSearch.nativeElement.click();
          return items;
        })
      );
  }

  private loadUsers(term: string): Observable<any> {
    if (typeof term === 'object' || term === '' || term === null) return of([]);
    const params = { text_search: term };
    return this.usersService.getByQuery$(params)
      .pipe(map(x => x?.data || []));
  }

  public viewHandleUser(value: any) {
    if (typeof value === 'object') {
      return value.email ? `${value.id} (${value.email})` : 'None.';
    } else {
      return value;
    }
  }

  public selectedChangeUser(item: any) {
    if (!item || !item.id) return;
    this.newForm.get('persona_id')?.setValue(item.id);
  }

  private buildForm() {
    const controls = {
      persona_id: [{ value: '', disabled: true }, [Validators.required]],
      almacen_id: [{ value: '', disabled: true }, [Validators.required]],
      fecha_inicio: [{ value: '', disabled: true }, [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      asignado: [false, [Validators.required]],
      activo: [true, [Validators.required]],
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

  public onSave() {
    const value = this.newForm.value;
    const invalid = this.newForm.invalid;
    if (invalid) return;

    if (confirm('¿Estás seguro de crear el item?')) {
      // this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de crear el item?' } })
      //   .onClose.subscribe(status => {
      //     if (status) {
      const data = {
        fecha_fin: value.fecha_fin,
        activo: value.activo,
        asignado: value.asignado,
      };
      this.loadingSpinnerSave = true;
      this.almacenUsuariosService.updateCustom$(this.aItem.almacen_id, this.aItem.persona_id, data)
        .pipe(map(res => res.data),
          takeUntil(this.destroy$))
        .subscribe(response => {
          this.dialogRef.close({ cancel: false });
          this.loadingSpinnerSave = false;
        }, err => {
          this.loadingSpinnerSave = false;
        });
    }
    // } else {
    // }
    // }, err => {
    // });

  }

}
