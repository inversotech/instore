import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { finalize, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'lamb-archivo-adjuntar-modal',
  styleUrls: ['./archivo-adjuntar-modal.component.scss'],
  templateUrl: './archivo-adjuntar-modal.component.html',
})
export class ArchivoAdjuntarModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loadingSave: boolean = false;
  public formArchivo: FormGroup = this.buildForm();

  public uploadProgress: number = 0;
  public archivoFile: any;
  public archivoUrl: any;
  @ViewChild('inputFile') inputFile!: ElementRef;

  public data: any;
  public apiUrl: any;

  constructor(
    private httpClient: HttpClient,
    private dialogRef: NbDialogRef<ArchivoAdjuntarModalComponent>,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm() {
    const controls = {
      archivo_file: [''],
      archivo_url: [''],
      archivo_name: [''],
      archivo_type_file: [''],
      archivo_size: [''],
    };
    return this.formBuilder.group(controls);
  }

  public onFileChange(event: any) {
    const reader = new FileReader();
    if (this.isExistFiles(event)) {
      const files = event.target.files as FileList;
      this.archivoFile = files.item(0);
      this.formArchivo.patchValue(
        {
          archivo_file: this.archivoFile,
          archivo_url: '',
          archivo_name: this.archivoFile.name,
          archivo_type_file: this.archivoFile.type,
          archivo_size: this.archivoFile.size,
        }
      );
      reader.readAsDataURL(this.archivoFile);
      reader.onload = () => {
        this.uploadProgress = 100;
      };
    }
  }

  private isExistFiles(event: any) {
    return event.target.files && (event.target.files.length > 0);
  }

  get f() {
    return this.formArchivo.controls;
  }

  public onDeleteArchivo() {
    this.archivoFile = null;
    this.archivoUrl = '';
    if (this.inputFile) {
      this.inputFile.nativeElement.value = '';
    }
    this.formArchivo.patchValue(
      {
        archivo_file: '',
        archivo_url: '',
        archivo_name: '',
        archivo_type_file: '',
        archivo_size: '',
      }
    );
    this.uploadProgress = 0;
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onSave() {

    this.loadingSave = true;
    const formData: FormData = new FormData();

    formData.append('archivo_file', this.formArchivo.value.archivo_file || '');
    formData.append('archivo_url', this.formArchivo.value.archivo_url || '');
    formData.append('archivo_name', this.formArchivo.value.archivo_name || '');
    formData.append('archivo_type_file', this.formArchivo.value.archivo_type_file || '');
    formData.append('archivo_size', this.formArchivo.value.archivo_size || '');
    for (var key of Object.keys(this.data)) {
      formData.append(key, this.data[key]);
    }

    const api = `${environment.apiUrls.openAccounting}${this.apiUrl}`;
    const upload$ = this.httpClient.post(api, formData)
      .pipe(
        map((res: any) => res.data),
        finalize(() => {
          this.loadingSave = false;
        })
      ).subscribe((event: any) => {
        setTimeout(() => {
          this.dialogRef.close({ cancel: false });
        }, 50);
      });
  }

}