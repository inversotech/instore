import { DatePipe, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Subject, map, takeUntil, concatMap, delay, of, retryWhen, finalize, Subscription, Observable, startWith, debounceTime, switchMap, tap, forkJoin } from 'rxjs';
import { AppDataService } from 'src/app/core/providers/app-data.service';
import { ManageAutorizationService } from 'src/app/core/providers/guards';
import { AnhosService } from 'src/app/providers/services/accounting/anhos.service';
import { MesesService } from 'src/app/providers/services/accounting/meses.service';
import { IncomeService } from 'src/app/providers/services/treasury/income.service';

@Component({
  selector: 'lamb-main-income',
  templateUrl: './main-income.component.html',
  styleUrls: ['./main-income.component.scss']
})
export class MainIncomeComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loading: boolean = false;
  public misCajasHabilitadas: any[] = [];
  public vouchers: any[] = [];
  public depositos: any[] = [];
  public depositos_total: any;
  public anhos: any[] = [];
  public meses: any[] = [];

  public filterForm: FormGroup = this.formBuilder.group({
    text_search: [''],
    ids_caja_diario: [[]],
    id_anho: ['', Validators.required],
    id_mes: ['', Validators.required],
    // id_voucher: ['', Validators.required],
    // search_user: [''],
    // id_user: [''],
  });
  public paginate: any = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  };
  public paginationControls: any = {
    maxSize: 15,
    directionLinks: true,
    responsive: true,
    autoHide: true,
  };
  // variable fac
  // public loadingStatementsdlp!: boolean;
  // public loadingStatementsdlpC!: boolean;
  public subscribeAnular!: Subscription;
  public acctions = {
    canAnular: false,
  };

  // public filteredUser$: Observable<any[]> | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private anhosService: AnhosService,
    private mesesService: MesesService,
    private appDataService: AppDataService,
    // private datePipe: DatePipe,
    // private nbDialogService: NbDialogService,
    private incomeService: IncomeService,
    @Inject(DOCUMENT) protected document: any,
    // private facturacionService: FacturacionService,
    // private issuanceQuotationService: IssuanceQuotationService,
    private httpClient: HttpClient,
    private nbToastrService: NbToastrService,
    private manageAutorizationService: ManageAutorizationService,
  ) {
  }

  ngOnInit(): void {
    this.suscribeForms();
    this.getMasters();
    this.manageActions();
  }

  private manageActions() {
    this.subscribeAnular = this.manageAutorizationService.isAutorized('ANULAR').subscribe(response => {
      this.acctions.canAnular = response;
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getMasters(): void {

    forkJoin({
      // misAlmacenes: this.almacenUsuariosService.getMisAlmacenes$({}),
      misCajasHabilitadas: this.incomeService.getMisCajasHabilitadasAbiertas$({}),
      anhos: this.anhosService.getAll$(),
      meses: this.mesesService.getAll$(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ misCajasHabilitadas, anhos, meses }) => {
          this.misCajasHabilitadas = misCajasHabilitadas;
          this.anhos = anhos;
          this.meses = meses;

          if (this.misCajasHabilitadas.length > 0) {
            setTimeout(() => {
              this.filterForm.get('ids_caja_diario')?.setValue(this.misCajasHabilitadas.map((caja: any) => caja.id_caja_diario), { emitEvent: false });
            }, 0);
          }

          const currentYear = new Date().getFullYear();
          const year = anhos.find((a: any) => parseInt(a.id_anho, 10) === currentYear);
          if (year) {
            setTimeout(() => {
              this.filterForm.get('id_anho')?.setValue(year.id_anho, { emitEvent: false });
            }, 0);
          }

          const currentMonth = new Date().getMonth() + 1;
          const mes = meses.find((m: any) => parseInt(m.id_mes, 10) === currentMonth);

          if (mes) {
            setTimeout(() => {
              this.filterForm.get('id_mes')?.setValue(mes.id_mes, { emitEvent: false });
              this.onBuscar();
              // this.getVouchers();
            }, 0);
          }


        },
        error: () => {
          this.anhos = [];
          this.meses = [];
        }
      });

    // this.anhosService.getAll$()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(res => {
    //     this.anhos = res;
    //     const currentYear = new Date().getFullYear();
    //     const year = this.anhos.find(res => parseInt(res.id_anho) == currentYear);
    //     if (year) {
    //       setTimeout(() => {
    //         this.filterForm.get('id_anho')?.patchValue(year.id_anho);
    //       }, 0);
    //     }

    //     this.mesesService.getAll$()
    //       .pipe(takeUntil(this.destroy$))
    //       .subscribe(res => {
    //         this.meses = res;
    //         const currentMoth = new Date().getMonth() + 1;
    //         const mes = this.meses.find(res => parseInt(res.id_mes, 10) == currentMoth);
    //         if (mes) {
    //           setTimeout(() => {
    //             this.filterForm.get('id_mes')?.patchValue(mes.id_mes);
    //           }, 0);
    //           setTimeout(() => {
    //             this.onBuscar();
    //           }, 100);
    //         }
    //       }, err => {
    //         this.meses = [];
    //       });
    //   }, err => {
    //     this.anhos = [];
    //   });
  }

  // public getVouchers() {
  //   if (!this.filterForm.value.id_anho) return;
  //   if (!this.filterForm.value.id_mes) return;

  //   this.loading = true;
  //   const params = {
  //     id_anho: this.filterForm.value.id_anho,
  //     id_mes: this.filterForm.value.id_mes,
  //   };
  //   this.vouchersService.getToFilterAll$(params)
  //     .pipe(
  //       takeUntil(this.destroy$))
  //     .subscribe(response => {
  //       this.loading = false;
  //       this.vouchers = response || [];
  //       if (this.vouchers.length > 0) {
  //         setTimeout(() => {
  //           this.filterForm.get('id_voucher')?.patchValue((this.vouchers[0].id_voucher));
  //           this.onBuscar();
  //         }, 0);
  //       } else {
  //         setTimeout(() => {
  //           this.filterForm.get('id_voucher')?.patchValue('-1');
  //           this.onBuscar();
  //         }, 0);
  //       }
  //     }, err => {
  //       this.loading = false;
  //       this.vouchers = [];
  //       setTimeout(() => {
  //         this.filterForm.get('id_voucher')?.patchValue('-1');
  //         this.onBuscar();
  //       }, 0);
  //     });
  // }


  private suscribeForms(): void {
    this.filterForm.get('ids_caja_diario')?.valueChanges
      .subscribe(res => {
        setTimeout(() => {
          this.onBuscar();
        }, 100);
      });
    this.filterForm.get('id_anho')?.valueChanges
      .subscribe(res => {
        setTimeout(() => {
          this.onBuscar();
        }, 100);
      });
    this.filterForm.get('id_mes')?.valueChanges
      .subscribe(res => {
        setTimeout(() => {
          this.onBuscar();
        }, 100);
      });

    // this.filteredUser$ = this.filterForm.get('search_user')?.valueChanges
    //   .pipe(
    //     startWith(''),
    //     tap((data) => {
    //       setTimeout(() => {
    //         // this.loading = true;
    //       }, 0);
    //     }),
    //     debounceTime(300),
    //     takeUntil(this.destroy$),
    //     switchMap(this.loadUser.bind(this)),
    //     tap(() => {
    //       setTimeout(() => {
    //         this.loading = false;
    //       }, 0);
    //     }),
    //     map((items) => {
    //       setTimeout(() => {
    //         this.loading = false;
    //       }, 0);
    //       return items;
    //     }),
    //   );

    // this.filterForm.get('id_user')?.valueChanges
    //   .subscribe(res => {
    //     setTimeout(() => {
    //       this.onBuscar();
    //     }, 100);
    //   });
  }

  // get user() {
  //   return this.appDataService?.getUser();
  // }

  // viewHandleUser(value: any) {
  //   if (typeof value === 'object') {

  //     return value.id_user ? value.email : 'None.';
  //   } else {
  //     return value;
  //   }
  // }

  // public selectedChangeUser($event: any) {
  //   if (!$event || !$event.id_user) return;
  //   setTimeout(() => {
  //     this.filterForm.get('id_user')?.setValue($event.id_user);
  //   }, 0);
  // }

  // private loadUser(term: string): Observable<any> {
  //   return of();
    // if (typeof term === 'object') {
    //   return new Observable(observer => {
    //     return observer.next([]);
    //   });
    // }
    // const params = {
    //   text_search: term,
    // };
    // this.filterForm.get('id_user')?.patchValue('');
    // return this.userService.getWithQuery$(params)
    //   .pipe(map(res => {
    //     return (res && res.data) || [];
    //   }),
    //     takeUntil(this.destroy$),
    //   );
  // }

  public pageChanged(event: any) {
    this.paginate.currentPage = event;
    this.getDepositos();
  }

  public tagEstado(item: any): any {
    if (item.estado == 2) {
      return 'warning';
    } else if (item.finalizado == true) {
      return 'success';
    } else if (item.finalizado == false) {
      return 'warning';
    } else {
      return 'danger';
    }
  }


  public onBuscar(): void {
    if (this.filterForm.invalid) return;
    this.paginate.currentPage = 1;
    this.paginate.totalItems = 0;
    this.getDepositos();
  }

  private getDepositos(): void {
    if (this.filterForm.invalid) return;
    const value = this.filterForm.value;
    const params = {
      // id_user: value.id_user,
      text_search: value.text_search,
      page: this.paginate.currentPage,
      per_page: this.paginate.pageSize,
      id_anho: value.id_anho,
      id_mes: value.id_mes,
      ids_caja_diario: value.ids_caja_diario.join(','),
    };
    this.loading = true;
    this.incomeService.getIncomesFinalized$(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.loading = false;
          this.depositos = res.depositos.data;
          this.depositos_total = res.totales;
          this.paginate.currentPage = res.depositos.current_page;
          this.paginate.totalItems = res.depositos.total;
        },
        error: () => {
          this.loading = false;
          this.depositos = [];
          this.depositos_total = null;
          this.paginate.currentPage = 1;
          this.paginate.totalItems = 0;
        }
      });
  }

  // public onAnular(id_venta: any): void {
  //   if (this.filterForm.valid) {
  //     this.loading = true;
  //     this.salesService.anular$(id_venta)
  //       .pipe(map(response => response.data), takeUntil(this.destroy$))
  //       .subscribe(res => {
  //         this.loading = false;
  //         this.getDepositos();
  //       }, () => {
  //         this.loading = false;
  //         // this.ventas = [];
  //       });
  //   }
  // }

  public onView(id_cotizacion: any): void {
  }

  public onGoToEdit(id_venta: any) {
    this.router.navigate(['/pages/direct-billing/billing-issuance/form', id_venta], { relativeTo: this.activatedRoute });
  }

  public onGoToNew() {
    this.router.navigate(['/pages/direct-billing/billing-issuance/form'], { relativeTo: this.activatedRoute });
  }


  public onPrintTicket(doc: any, item: any) {
    // doc.loading = true;
    // this.issuanceQuotationService.printAgain$(item.id_venta)
    //   .pipe(
    //     takeUntil(this.destroy$),
    //   ).subscribe(() => {
    //     doc.loading = false;
    //   }, () => {
    //     doc.loading = false;
    //   });
  }

  public onPrintTicketPdf(doc: any, item: any) {
    // doc.loading = true;
    // this.issuanceQuotationService.printAgainPdf$(item.id_venta)
    //   .pipe(
    //     takeUntil(this.destroy$),
    //   ).subscribe(response => {
    //     doc.loading = false;
    //     const newBlob = new Blob([response], { type: 'application/pdf' });
    //     const fileURL = URL.createObjectURL(newBlob);
    //     const iframe = document.createElement('iframe');
    //     iframe.style.display = 'none';
    //     iframe.src = fileURL;
    //     document.body.appendChild(iframe);
    //     iframe.contentWindow?.print();
    //   }, () => {
    //     doc.loading = false;
    //   });
  }

  public onSendTicketMail(item: any) {
    // const context: any = { data: item, option: 1 }
    // this.nbDialogService.open(FormSendMailModalComponent, {
    //   context: context
    // }).onClose.subscribe(response => {
    //   if (response) {
    //   }
    // });
  }

  public fnPrintDocumentPdf(doc: any, item: any) {
    // doc.loading = true;
    // this.facturacionService.getDocumentPdf$(item.id_venta, { id_entidad: item.id_entidad })
    //   .pipe(
    //     takeUntil(this.destroy$),
    //   ).subscribe(response => {
    //     doc.loading = false;
    //     const newBlob = new Blob([response], { type: 'application/pdf' });
    //     const fileURL = URL.createObjectURL(newBlob);
    //     const iframe = document.createElement('iframe');
    //     iframe.style.display = 'none';
    //     iframe.src = fileURL;
    //     document.body.appendChild(iframe);
    //     iframe.contentWindow?.print();

    //   }, (err) => {
    //     doc.loading = false;
    //   });
  }

  public onPrintComprobantePdf(item: any) {
    // this.loadingStatementsdlp = true;
    // this.issuanceQuotationService.getRutaComprobantePdf$(item.id_venta)
    //   .pipe(
    //     takeUntil(this.destroy$),
    //   ).subscribe(response => {
    //     if (response.data) {
    //       if (response.data['servidor_archivo'] === 'LAMB') {
    //         this.onViewComprobanteLamb(response.data['url']);
    //       } else {
    //         this.onViewComprobateOtro(response.data['url']);
    //       }
    //     }

    //   }, () => {
    //     this.loadingStatementsdlpC = false;
    //   });
  }

  // private onViewComprobanteLamb(ruta: string) {
  //   this.httpClient.get(`${environment.apiUrls.openAccounting}/api/storage?fileName=${ruta}`)
  //     .pipe(
  //       finalize(() => {
  //       }),
  //     ).subscribe((response: any) => {
  //       if (response.success === true) {
  //         this.loadingStatementsdlpC = false;
  //         window.open(response.data, '_blank');
  //       }
  //     }, () => {
  //       this.loadingStatementsdlpC = false;
  //     });
  // }

  // private onViewComprobateOtro(ruta: string) {
  //   this.loadingStatementsdlp = false;
  //   window.open(ruta, '_blank');
  // }

  public onSendMailComprobante(item: any) {
    // const context: any = { data: item, option: 2 }
    // this.nbDialogService.open(FormSendMailModalComponent, {
    //   context: context
    // }).onClose.subscribe(response => {
    //   if (response) {
    //   }
    // });
  }



  public onActionProcess(doc: any, item: any) {
    switch (doc.codigo) {
      // case 'REFUSE':
      //   this.anularDeposito(item);
      //   break;
      case 'TK':
        this.onPrintTicket(doc, item);
        break;
      case 'PDF':
        this.onPrintTicketPdf(doc, item);
        break;
      case 'SMS':
        this.nbToastrService.warning('No ha sido implementado ésta opción.');
        break;
      case 'MAIL':
        this.onSendTicketMail(item);
        break;
      case 'CPDF':
        this.fnPrintDocumentPdf(doc, item);
        break;
      case 'CMAIL':
        this.onSendMailComprobante(item);
        break;
      case 'SEATS':
        this.regenerarAsientos(doc, item);
        break;
      case 'GUIA':
        this.onGoToNewGuia(item);
    }
  }

  public anularDeposito(item: any) {
    if (!confirm('¿Estás seguro de anular la deposito?')) return;
    this.loading = true;
    this.incomeService.anularIncome$(item.id_deposito)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.getDepositos();
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  public regenerarAsientos(doc: any, item: any) {
    if (!confirm('¿Estás seguro de regenerar los asientos?')) return;
    // this.loading = true;
    // this.salesService.regenerateSeats$(item.id_venta)
    //   .pipe(map(response => response.data), takeUntil(this.destroy$))
    //   .subscribe(res => {
    //     this.loading = false;
    //     this.getDepositos();
    //   }, () => {
    //     this.loading = false;
    //   });
  }

  public emitirGuia(doc: any, item: any) {
    if (!confirm('¿Estás seguro de emitir la guía?')) return;
    // this.loading = true;
    // this.salesService.regenerateSeats$(item.id_venta)
    //   .pipe(map(response => response.data), takeUntil(this.destroy$))
    //   .subscribe(res => {
    //     this.loading = false;
    //     this.getDepositos();
    //   }, () => {
    //     this.loading = false;
    //   });
  }

  public onGoToNewGuia($venta: any) {
    // const dialog = this.nbDialogService.open(RemissionGuideModalComponent);
    // dialog.componentRef.instance.idVenta = $venta.id_venta;
    // dialog.componentRef.instance.serieNumeroVenta = $venta.serie + '-' + $venta.numero;
    // dialog.onClose.subscribe(res => {
    //   if (res.onSave) {
    //     // this.onGoToEditGuide(res.data.id_venta_guia);
    //   }
    // });
  }
}
