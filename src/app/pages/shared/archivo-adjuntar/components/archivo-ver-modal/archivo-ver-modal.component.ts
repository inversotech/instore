import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Subject, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { finalize, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'lamb-archivo-ver-modal',
  styleUrls: ['./archivo-ver-modal.component.scss'],
  templateUrl: './archivo-ver-modal.component.html',
})
export class ArchivoVerModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loadingSave: boolean = false;
  public item: any;

  constructor(
    private httpClient: HttpClient,
    private dialogRef: NbDialogRef<ArchivoVerModalComponent>,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    // this.getMasters();
  }

  get esImagen() {
    return this.item.formato === 'image/png' || this.item.formato === 'image/jpg' || this.item.formato === 'image/jpeg';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public descargarArchivo() {
    this.loadingSave = true;
    this.httpClient.get(this.item.url)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingSave = false),
      )
      .subscribe((res: any) => {
        let blob = null;
        if (this.esImagen) {
          blob = new Blob([res], { type: 'image/jpeg' });
        } else {
          blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' });
        }
        const objectUrl = URL.createObjectURL(blob);
        window.location.assign(objectUrl);
      });

  }
}