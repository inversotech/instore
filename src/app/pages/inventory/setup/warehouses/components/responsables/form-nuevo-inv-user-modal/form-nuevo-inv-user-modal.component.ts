import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AlmacenArticulosService } from 'src/app/providers/services/inventory/almacen-articulos.service';
import { UsersService } from 'src/app/providers/services/setup-system/users.service';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';

@Component({
  selector: 'open-form-nuevo-inv-user-modal',
  templateUrl: './form-nuevo-inv-user-modal.component.html',
  styleUrls: ['./form-nuevo-inv-user-modal.component.scss']
})
export class FormNuevoInvUserModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public newForm: FormGroup = this.buildForm();
  public loadingSpinnerSave: boolean = false;
  @Input() set almacenId(id: any) {
    setTimeout(() => {
      this.newForm.get('id_almacen')?.patchValue(id);
    }, 0);
  };

  public textSearchUser: FormControl = new FormControl('');
  @ViewChild('idUserSearch') idUserSearch!: ElementRef;
  public filteredUserList$: Observable<any[]> | undefined;

  constructor(private dialogRef: NbDialogRef<FormNuevoInvUserModalComponent>,
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
      return value.email ? `${value.email}` : 'None.';
    } else {
      return value;
    }
  }

  public selectedChangeUser(item: any) {
    if (!item || !item.id) return;
    this.newForm.get('id_persona')?.setValue(item.id);
  }

  private buildForm() {
    return this.formBuilder.group({
      id_persona: ['', [Validators.required]],
      id_almacen: ['', [Validators.required]],
      fecha_inicio: [new Date(), [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      asignado: [false, [Validators.required]],
      activo: [true, [Validators.required]],
    });
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
        id_persona: value.id_persona,
        id_almacen: value.id_almacen,
        fecha_inicio: value.fecha_inicio,
        fecha_fin: value.fecha_fin,
        activo: value.activo,
        asignado: value.asignado,
      };
      this.loadingSpinnerSave = true;
      this.almacenUsuariosService.add$(data)
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
