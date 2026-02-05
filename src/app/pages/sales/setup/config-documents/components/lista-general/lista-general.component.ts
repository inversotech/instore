import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/pages/shared/components';
// import { FormNuevoWarehouseModalComponent } from '../form-nuevo-warehouse-modal/form-nuevo-warehouse-modal.component';
import { SetupUserEnterpriseService } from 'src/app/core/providers/setup-user-enterprise.service';
import { AppDataService } from 'src/app/core/providers/app-data.service';
import { ContaDocumentsService } from 'src/app/providers/services/accounting/conta-documents.service';

@Component({
  selector: 'inverso-lista-general',
  templateUrl: './lista-general.component.html',
  styleUrls: ['./lista-general.component.scss']
})
export class ListaGeneralComponent implements OnInit, OnDestroy {
  public documentos: any[] = [];
  public loadingSpinner: boolean = false;

  public searchForm: FormGroup = this.formBuilder.group({
    id_empresa: ['', Validators.required],
    text_search: [''],
  });

  private destroy$: Subject<void> = new Subject<void>();
  public empresas$ = this.getEmpresas$();
  public empresaConfig = this.appDataService.getEmpresaConfig();

  constructor(private formBuilder: FormBuilder,
    private appDataService: AppDataService,
    private setupUserEnterpriseService: SetupUserEnterpriseService,
    private contaDocumentsService: ContaDocumentsService,
  ) { }

  ngOnInit() {
    this.setDefaultValues();
    this.getDocumentos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getEmpresas$(): Observable<any> {
    return this.setupUserEnterpriseService.getMisEmpresas$().pipe(map(res => res.data), catchError(() => of([])));
  }

  private setDefaultValues() {
    if (this.empresaConfig) {
      setTimeout(() => {
        this.searchForm.get('id_empresa')?.patchValue(this.empresaConfig.id_empresa);
      }, 0);
    }

    this.searchForm.get('id_empresa')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getDocumentos();
      });
  }

  public submitFormSearch() {
    this.getDocumentos();
  }

  public getDocumentos() {
    const value = this.searchForm.value;
    const params = {
      text_search: value.text_search,
      id_empresa: value.id_empresa,
    };

    this.loadingSpinner = true;
    this.contaDocumentsService.getByQuery1$(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.documentos = response;
        this.loadingSpinner = false;
      }, err => {
        this.loadingSpinner = false;
      });
  }

  public onAssignMe(item: any) {
    this.contaDocumentsService.onAddOrDeletessigme$({
      id_conta_documento: item.id_conta_documento,
      assigme: '1',
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getDocumentos();
      });
  }

  public onUnassignMe(item: any) {
    this.contaDocumentsService.onAddOrDeletessigme$({
      id_conta_documento: item.id_conta_documento,
      assigme: '0',
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getDocumentos();
      });
  }




}
