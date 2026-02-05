import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UnidadMedidasService } from 'src/app/providers/services/inventory/unidad-medidas.service';
import { MarcasService } from 'src/app/providers/services/inventory/marcas.service';
import { ClasesService } from 'src/app/providers/services/inventory/clases.service';

@Component({
  selector: 'open-form-nuevo-article-modal',
  templateUrl: './form-nuevo-article-modal.component.html',
  styleUrls: ['./form-nuevo-article-modal.component.scss']
})
export class FormNuevoArticleModalComponent implements OnInit, OnDestroy {
  public nuevoForm: FormGroup = this.buildNuevoForm();
  public loadingSpinnerSave: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  public unidadMedidas: any[] = [];
  public marcas: any[] = [];
  public clases: any[] = [];

  constructor(private dialogRef: NbDialogRef<FormNuevoArticleModalComponent>,
    private unidadMedidasService: UnidadMedidasService,
    private marcasService: MarcasService,
    private clasesService: ClasesService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    // this.loadingSpinnerSave = false;
    this.getMasters();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getMasters() {
    this.unidadMedidasService.getAll$()
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.unidadMedidas = response;
      }, err => {
        this.unidadMedidas = [];
      });

    this.marcasService.getAll$()
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.marcas = response;
      }, err => {
        this.marcas = [];
      });

    this.clasesService.getAll$()
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.clases = response;
      }, err => {
        this.clases = [];
      });
  }

  private buildNuevoForm() {
    const controls = {
      id_articulo: ['', [Validators.required]],
      id_parent: ['', [Validators.required]],
      id_unidad_medida: ['', [Validators.required]],
      id_marca: ['', [Validators.required]],
      id_clase: [{ value: 6, disabled: true }, [Validators.required]],
      nombre: ['', [Validators.required]],
      codigo: [{ value: '#### #### #### ####', disabled: true }, [Validators.required]],
      img_url: ['', [Validators.required]],
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
    //   const value = this.nuevoForm.value;
    //   const valid = this.nuevoForm.valid;
    //   if (valid) {
    //     this.loadingSpinnerSave = true;
    //     this.rolsService.add$(value)
    //       .pipe(map(res => res.data),
    //         takeUntil(this.destroy$))
    //       .subscribe(response => {
    //         this.dialogRef.close({ cancel: false });
    //         this.loadingSpinnerSave = false;
    //       }, err => {
    //         this.loadingSpinnerSave = false;
    //       });
    //   }
    // this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de crear el item?' } })
    //   .onClose.subscribe(status => {
    //     if (status) {
    //   } else {
    //   }
    // }, err => {
    // });

    setTimeout(() => {
      this.dialogRef.close({ cancel: false });
    }, 50);
  }

}
