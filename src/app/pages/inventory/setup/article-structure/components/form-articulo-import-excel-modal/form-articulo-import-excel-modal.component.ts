import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
// import { NgxFileDropEntry } from 'ngx-file-drop';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ArticulosService } from 'src/app/providers/services/inventory/articulos.service';

@Component({
  selector: 'open-form-articulo-import-excel-modal',
  templateUrl: './form-articulo-import-excel-modal.component.html',
  styleUrls: ['./form-articulo-import-excel-modal.component.scss']
})
export class FormArticuloImportExcelModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loadingSpinnerSave: boolean = false;
  public filesExcels: any[] = [];
  @ViewChild('inputFileExcel') inputFileExcel!: ElementRef;
  @Input() id_clase: any;
  @Input() id_producto: any;
  // public files: NgxFileDropEntry[] = [];
  
  constructor(
    private dialogRef: NbDialogRef<FormArticuloImportExcelModalComponent>,
    private articulosService: ArticulosService,
  ) { }

  ngOnInit() {
    // this.loadingSpinnerSave = false;
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

  // private isExistFiles(event: any) {
  //   return event.target.files && (event.target.files.length > 0);
  // }

  // public onFileChangeExcel(event: any) {
  //   if (this.isExistFiles(event)) {
  //     const files = event.target.files as FileList;
  //     if (this.filesExcels.length === 0) {
  //       this.filesExcels.push(files.item(0));
  //     }
  //   }
  // }

  public fileOver(event: any) {
    console.log('fileOver');
  }
  public fileLeave(event: any) {
    console.log('fileOver');
  }
  public onDeleteFile(event: any) {
    this.filesExcels = [];
    // this.inputFileExcel!.nativeElement!.value = '';
  }

  public dropped(files: NgxFileDropEntry[]) {
    // this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // console.log(droppedFile.relativePath, file);
          if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.type === '.xlsx') {
            this.filesExcels = [];
            this.filesExcels.push(file);
          }
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public onSave() {
    this.loadingSpinnerSave = true;
    if (this.filesExcels.length === 1) {
      const formData: FormData = new FormData();
      formData.append('file_excel', this.filesExcels[0] || null);

      this.articulosService.addImportItem$(formData)
        .pipe(map(res => res.data))
        .subscribe(response => {
          this.loadingSpinnerSave = false;
          this.dialogRef.close({ cancel: false });
        }, err => {
          this.loadingSpinnerSave = false;
        });
    }
  }

  public downloadTemplate() {
    const link = document.createElement('a');
    link.download = 'Plantilla_importar_articulos_items.xlsx';
    link.href = 'assets/templates/Plantilla_importar_articulos_items.xlsx';
    link.click();
  }


}
