import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UnidadMedidasService } from 'src/app/providers/services/inventory/unidad-medidas.service';
import { MarcasService } from 'src/app/providers/services/inventory/marcas.service';
import { ClasesService } from 'src/app/providers/services/inventory/clases.service';
import { ArticulosService } from 'src/app/providers/services/inventory/articulos.service';

@Component({
  selector: 'open-main-article',
  templateUrl: './main-article.component.html',
  styleUrls: ['./main-article.component.scss']
})
export class MainArticleComponent implements OnInit, OnDestroy {
  public loadingSpinnerSave: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  public editarForm: FormGroup = this.buildNuevoForm();
  public unidadMedidas: any[] = [];
  public marcas: any[] = [];
  public clases: any[] = [];
  @ViewChild('inputFile') inputFile!: ElementRef;
  public imageFile: any;
  public parent: any;
  public articuloData: any;
  public params: any;

  constructor(
    private unidadMedidasService: UnidadMedidasService,
    private marcasService: MarcasService,
    private clasesService: ClasesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private articulosService: ArticulosService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loadingSpinnerSave = false;
    this.getMasters();

    this.activatedRoute
      .queryParamMap
      .pipe(
        map((res: any) => res.params),
        takeUntil(this.destroy$),
      ).subscribe((response) => {
        this.params = response;
      });

    this.activatedRoute.paramMap
      .pipe(map(res => res.get('producto_id')))
      .subscribe(res => {
        this.editarForm.get('parent_id')?.patchValue(res);
        this.getArticuloParent();
      });

    this.activatedRoute.paramMap
      .pipe(map(res => res.get('articulo_id')))
      .subscribe(res => {
        if (res) {
          this.editarForm.get('articulo_id')?.patchValue(res);
          this.getArticulo();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private getArticuloParent() {
    const value = this.editarForm.get('parent_id')?.value;
    if (value) {
      this.articulosService.getById$(value)
        .pipe(map(res => res.data),
          takeUntil(this.destroy$))
        .subscribe(response => {
          this.parent = response;
        }, err => {
        });
    }
  }
  private getArticulo() {
    const value = this.editarForm.get('articulo_id')?.value;
    if (value) {
      this.articulosService.getById$(value)
        .pipe(map(res => res.data),
          takeUntil(this.destroy$))
        .subscribe(response => {
          this.patchForm(response);
        }, err => {
        });
    }
  }

  private patchForm(response: any) {
    this.articuloData = response;
    setTimeout(() => {
      this.editarForm.patchValue({
        unidad_medida_id: response.unidad_medida_id,
        marca_id: response.marca_id,
        clase_id: response.clase_id,
        nombre: response.nombre,
        codigo: response.codigo,
        activo: response.activo,
        img_url: response.img_url,
      });
    }, 100);
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
      articulo_id: [''],
      parent_id: ['', [Validators.required]],
      unidad_medida_id: ['', [Validators.required]],
      marca_id: [''],
      clase_id: [{ value: 6, disabled: true }, [Validators.required]],
      nombre: ['', [Validators.required]],
      codigo: [{ value: '#### #### #### ####', disabled: true }, [Validators.required]],
      img_url: [''],
      activo: [true, [Validators.required]],
    };
    return this.formBuilder.group(controls);
  }

  public onDeleteArchivo() {
    this.imageFile = null;
    this.inputFile.nativeElement.value = '';
    this.editarForm.patchValue({
      img_url: (this.articuloData && this.articuloData.img_default_url) || '',
      // img_url: '',
    });
  }

  public onFileChange(event: any) {
    const reader = new FileReader();
    if (this.isExistFiles(event)) {
      const files = event.target.files;
      reader.readAsDataURL(files.item(0));
      reader.onload = () => {
        this.editarForm.patchValue({
          img_url: reader.result as string,
        });
      };
      this.imageFile = files.item(0);
    }
  }

  private isExistFiles(event: any) {
    return event.target.files && (event.target.files.length > 0);
  }

  public onBack() {
    const articuloId = this.editarForm.get('articulo_id')?.value;
    if (articuloId) {
      this.router.navigate(['../../'], { relativeTo: this.activatedRoute, queryParams: this.params });
    } else {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute, queryParams: this.params });
    }
  }

  public onSave() {
    const value = this.editarForm.value;
    const valid = this.editarForm.valid;
    if (!valid) {
      return;
    }
    const formData: FormData = new FormData();
    formData.append('articulo_id', value.articulo_id);
    formData.append('parent_id', value.parent_id);
    formData.append('unidad_medida_id', value.unidad_medida_id);
    formData.append('marca_id', value.marca_id || '');
    formData.append('clase_id', '6');
    formData.append('codigo', '');
    formData.append('nombre', value.nombre || '');
    formData.append('activo', value.activo ? '1' : '0');
    formData.append('img_file', this.imageFile || '');
    formData.append('img_url', (this.imageFile) ? '' : value.img_url);

    if (value.articulo_id) {
      this.loadingSpinnerSave = true;
      this.articulosService.updateWithFile$(value.articulo_id, formData)
        .pipe(
          map(res => res.data),
          takeUntil(this.destroy$),
        )
        .subscribe((res: any) => {
          this.loadingSpinnerSave = false;
        }, (err: any) => {
          this.loadingSpinnerSave = false;
        });
    } else {
      this.loadingSpinnerSave = true;
      this.articulosService.add$(formData)
        .pipe(
          map(res => res.data),
          takeUntil(this.destroy$),
        )
        .subscribe((res: any) => {
          if (res) {
            this.editarForm.get('articulo_id')?.patchValue(res.articulo_id)
          }
          this.loadingSpinnerSave = false;
        }, (err: any) => {
          this.loadingSpinnerSave = false;
        });
    }
  }



}
