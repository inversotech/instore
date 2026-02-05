import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { map, tap, filter, debounceTime, distinctUntilChanged, switchMap, catchError, takeUntil, startWith, finalize } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
// import { PersonasService, TipoExistenciasService, UsersService } from 'src/app/providers/services';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoExistenciasService } from 'src/app/providers/services/inventory/tipo-existencias.service';
import { AlmacenesService } from 'src/app/providers/services/inventory/almacenes.service';

@Component({
  selector: 'open-datos-generales',
  templateUrl: './datos-generales.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./datos-generales.component.scss']
})
export class DatosGeneralesComponent implements OnInit, OnDestroy {
  public almacenForm: FormGroup = this.buildForm();
  public loadingSpinnerSave: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  public tipoExistencias: any[] = [];

  private almacenId: any;
  public almacenData: any;
  public loadingSave: boolean = false;

  constructor(
    private tipoExistenciasService: TipoExistenciasService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private almacenesService: AlmacenesService,
  ) { }

  ngOnInit() {
    this.loadingSpinnerSave = false;
    // this.filteredOptions$ = of(this.personas);
    this.getMasters();
    this.subscribeForm();

    this.activatedRoute?.parent?.paramMap
      .pipe(
        map(res => res.get('id')),
        takeUntil(this.destroy$),
      ).subscribe(res => {
        this.almacenId = res;
        this.getAlmacen();
      });

  }

  private getAlmacen() {
    // if (!this.pedidoCompraData) return;
    if (!this.almacenId) return;
    this.loadingSave = true;
    this.almacenesService.getById$(this.almacenId)
      .pipe(map(res => res.data),
        takeUntil(this.destroy$), finalize(() => this.loadingSave = false))
      .subscribe(response => {
        setTimeout(() => {
          this.almacenData = response;
          this.patchForm();
        }, 0);
      });
  }

  private getMasters() {
    this.tipoExistenciasService.getAll$()
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.tipoExistencias = response;
        if (this.almacenData && this.almacenData?.id_tipo_existencia) {
          setTimeout(() => {
            this.almacenForm.get('id_tipo_existencia')?.patchValue(this.almacenData.id_tipo_existencia);
          }, 0);
        }
      }, err => {
        this.tipoExistencias = [];
      });
  }

  private patchForm() {
    setTimeout(() => {
      this.almacenForm.patchValue({
        id_almacen: this.almacenData.id_almacen,
        id_parent: this.almacenData.id_parent,
        id_empresa: this.almacenData.id_empresa,
        id_empresa_sucursal: this.almacenData.id_empresa_sucursal,
        id_tipo_existencia: this.almacenData.id_tipo_existencia,
        nombre: this.almacenData.nombre,
        activo: this.almacenData.activo,
      },);
    }, 0);
  }
  private subscribeForm() {
    // this.filteredOptions$ = this.textSearch.valueChanges
    //   .pipe(
    //     // startWith(''),
    //     debounceTime(500),
    //     distinctUntilChanged(), // contenido sea distinto al anterior
    //     // map(filterString => this.filter(filterString)),
    //     switchMap(this.getPersonas.bind(this)),
    //     // tap(() => this.loadingSpinnerSearch = false), // icon spin
    //     map((items) => {
    //       return items;
    //     }),
    //   );
  }

  // private getPersonas(term: String) {
  //   const query = {
  //     text_search: term,
  //   };
  //   return this.personasService.getByQuery$(query)
  //     .pipe(
  //       catchError(() => of({ data: [] })),
  //       map(response => response.data),
  //       takeUntil(this.destroy$)
  //     );
  // }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  // private getPersonasDocumentos(personaId: any) {
  //   this.loadingSpinnerGetData = true;
  //   this.personasService.getDocumentos$(personaId)
  //     .pipe(map(res => res.data), takeUntil(this.destroy$))
  //     .subscribe(response => {
  //       this.loadingSpinnerGetData = false;
  //       this.personaDocumentos = response;
  //     }, err => {
  //       this.loadingSpinnerGetData = false;
  //       this.personaDocumentos = [];
  //     });
  // }

  // public viewHandle(value: any) {
  //   return value.fullname || value;
  // }

  // public onClose() {
  //   // setTimeout(() => {
  //   //   this.dialogRef.close({ cancel: true });
  //   // }, 50);
  // }

  // public onBack() {
  //   this.router.navigate(['../'], { relativeTo: this.activatedRoute, queryParams: this.params });
  // }

  // public onNextPersonaExist() {
  //   this.options = 'PERSONA_EXIST';
  //   const personaSeleccionada = this.textSearch.value;
  //   if (personaSeleccionada) {
  //     this.userForm.patchValue({
  //       id_persona: personaSeleccionada.id_persona,
  //       name: personaSeleccionada.fullname,
  //       title: personaSeleccionada.fecha_nac_parse,
  //       picture: personaSeleccionada.img_default_url,
  //     });
  //     this.getPersonasDocumentos(personaSeleccionada.id_persona);
  //   }
  // }

  public onSave() {
    const value = this.almacenForm.value;
    const valid = this.almacenForm.valid;
    if (valid) {

    }
  }

}
