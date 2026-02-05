import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { debounceTime, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, combineLatest, forkJoin, of } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/pages/shared/components';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { PersonaConsultasService } from 'src/app/providers/services/services/persona-consultas.service';
import { SalesService } from 'src/app/providers/services/sales/sales.service';
import { ModalTypeIgvComponent } from '../modal-type-igv/modal-type-igv.component';
import { DatePipe } from '@angular/common';
import { id } from 'date-fns/locale';

@Component({
  selector: 'inverso-venta-main',
  templateUrl: './venta-main.component.html',
  styleUrls: ['./venta-main.component.scss']
})
export class VentaMainComponent implements OnInit, OnDestroy {
  private idVenta: any;

  public contaDocumentos: any[] = [];
  public vouchers: any[] = [];
  public ventaDetalles: any[] = [];
  public ventaTotales: any;
  public loadingSpinner: boolean = false;
  public showMoreOptionPay: boolean = false;

  public filteredOptionsClientes$: Observable<any[]> | undefined = of([]);
  public rucCliente: FormControl = new FormControl('', [Validators.required]);
  public esCreditoInterno: FormControl = new FormControl('', [Validators.required]);
  @ViewChild('inputCliente', { read: ElementRef }) inputCliente!: ElementRef;
  public clienteLoading: boolean = false;
  public clienteStatus: any = 'basic';


  public tipoTarjetas: any[] = [];
  public cuentaBancarias: any[] = [];
  public misCajasHabilitadas: any[] = [];

  public documentoForm: FormGroup = this.formBuilder.group({
    id_conta_documento: ['', Validators.required],
    id_cliente: ['', Validators.required],
    cliente_id_tipo_documento: ['', Validators.required],
    cliente_num_documento: ['', Validators.required],
    cliente_razon_social: ['', Validators.required],
    cliente_direccion: ['', Validators.required],
    cliente_email: ['', Validators.required],
    fecha_emision: ['', Validators.required],
    fecha_vencimiento: ['', Validators.required],
    es_credito: ['0', Validators.required],
    id_almacen: ['', Validators.required],
  });

  public filteredOptionsArticulo$: Observable<any[]> | undefined = of([]);
  public articuloSearch: FormControl = new FormControl('', [Validators.required]);
  @ViewChild('inputArticulo', { read: ElementRef }) inputArticulo!: ElementRef;
  public articuloSearchLoading: boolean = false;
  public articuloAddLoading: boolean = false;
  public articuloStatus: any = 'basic';


  public documentoDetalleForm: FormGroup = this.formBuilder.group({
    id_articulo: ['', Validators.required],
    id_tipo_igv: ['', Validators.required],
    precio_inicial: ['', Validators.required],
    stock_actual: [0, Validators.required],
    cantidad: [1, Validators.required],
    descuento_total_item: [0, Validators.required],
  });
  private destroy$: Subject<void> = new Subject<void>();

  public saleDepositoForm: FormGroup = this.formBuilder.group({
    id_venta: ['', [Validators.required]],
    efectivo: [],
    glosa: [''],

    yape: [],
    glosa_yape: [''],

    deposito_cuenta: [],
    id_cuenta_bancaria: [''],
    nro_operacion_dep: [''],
    fecha_operacion_dep: [''],

    tarjeta: [],
    id_tipo_tarjeta: [],
    operacion: [],
  });

  constructor(private formBuilder: FormBuilder,
    private nbDialogService: NbDialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private salesService: SalesService,
    private personaConsultasService: PersonaConsultasService,
    private nbToastrService: NbToastrService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      this.idVenta = params.get('id_venta');
      this.getMasters();
    });

    // Seleccionar si hay params en la ruta
    // this.activatedRoute
    //   .queryParamMap
    //   .pipe(
    //     map((res: any) => res.params),
    //     takeUntil(this.destroy$),
    //   ).subscribe((response) => {
    //     if (response.id_voucher) {
    //       setTimeout(() => {
    //         this.documentoForm.get('id_voucher')?.patchValue(parseInt(response.id_voucher));
    //       }, 1000);
    //     }
    //   });
    this.suscribeForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private suscribeForm() {

    this.rucCliente?.valueChanges
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(value => {
        this.clienteStatus = 'basic'; // Success
        this.documentoForm.get('id_cliente')?.patchValue('');
        this.filteredOptionsClientes$ = of([]);
      });

    this.articuloSearch?.valueChanges
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(value => {
        // this.clienteStatus = 'basic'; // Success
        this.documentoDetalleForm.get('id_articulo')?.patchValue('');
        this.filteredOptionsArticulo$ = of([]);
      });

    // Observamos cambios en el formulario
    this.documentoForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(2000))
      .subscribe(() => {
        if (this.validarCampos()) {
          this.dispararEvento();
        }
      });

    this.documentoForm.get('es_credito')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        setTimeout(() => {
          this.esCreditoInterno.patchValue(res == '1');
        }, 0);
      });

    this.esCreditoInterno?.valueChanges
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(value => {
        this.setVentaPayment();
      });
  }

  private validarCampos(): boolean {
    // Verifica si todos los campos (excepto cliente_email) están completos y válidos
    const campos = ['id_conta_documento', 'id_cliente', 'cliente_id_tipo_documento', 'cliente_num_documento',
      'cliente_razon_social', 'cliente_direccion',
      'fecha_emision', 'fecha_vencimiento',
      'es_credito'];
    console.log('Validando campos ==== :');
    campos.forEach(campo => {
      console.log('campo: ' + campo);
      console.log(this.documentoForm.get(campo)?.value);
      console.log(this.documentoForm.get(campo)?.valid);
    });

    return campos.every(campo => this.documentoForm.get(campo)?.valid);
  }

  private dispararEvento() {
    this.onUpdateCabeceraVenta();
    // console.log('Todos los campos requeridos (excepto cliente_email) están completos y válidos');
    // Aquí puedes ejecutar cualquier otra acción necesaria
  }

  public onSearchArticulo() {
    // $event.stopPropagation();
    const invalidArticuloSearch = this.articuloSearch.invalid;
    if (invalidArticuloSearch) {
      this.nbToastrService.show(
        `Ingrese correctamente el nombre del artículo.`,
        'Busqueda de artículo inválido',
        { status: "warning", icon: "alert-circle-outline" }
      );
      return;
    };
    let articuloSearch = this.articuloSearch.value;

    if (typeof articuloSearch === 'object') {
      articuloSearch = articuloSearch.codigo_almacen;
    }
    const params = { text_search: articuloSearch, id_venta: this.idVenta }
    this.articuloSearchLoading = true;
    this.filteredOptionsArticulo$ = this.salesService.searchArticuloToVenta$(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.articuloSearchLoading = false),
        map((data) => {
          this.inputArticulo.nativeElement.click();
          return data;
        })
      );
  }

  articuloHandle = (value: any) => value?.id_articulo ? value?.articulo_nombre : value;
  public articuloSelect = (value: any) => this.onValidarArticulo(value);
  private onValidarArticulo(articulo: any) {
    if (articulo.id_articulo == null) return;

    this.documentoDetalleForm.patchValue({
      precio_inicial: articulo.precio_inicial,
      stock_actual: articulo.stock_actual,
      id_articulo: articulo.id_articulo,
      id_tipo_igv: articulo.id_tipo_igv,
    });

  }

  public submitDocumentoDetalle() {
    if (!this.idVenta) return;

    const value = this.documentoDetalleForm.value;
    if (!value.id_articulo) {
      this.nbToastrService.show(
        `Ingrese correctamente el nombre del producto o servicio.`,
        'Producto o servicio inválido',
        { status: "warning", icon: "alert-circle-outline" }
      );
      return;
    };

    const data = {
      id_venta: this.idVenta,
      id_articulo: value.id_articulo,
      precio_inicial: value.precio_inicial,
      id_tipo_igv: value.id_tipo_igv,
      cantidad: value.cantidad,
      descuento_total_item: value.descuento_total_item ?? 0,
      // stock_actual: value.stock_actual,
    };
    this.articuloAddLoading = true;
    this.salesService.addSaleDetalle$(data)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.articuloAddLoading = false),
      )
      .subscribe({
        next: (data) => {
          this.articuloAddLoading = false;
          setTimeout(() => {
            // this.documentoDetalleForm.reset();
            // this.articuloSearch.reset();
            this.inputArticulo.nativeElement.click();
            this.getVentaDetalleByIdVenta();
          }, 0);
        },
        error: (err) => {
          this.articuloAddLoading = false;
          console.log(err);
        }
      })
  }

  public onActualizarDetalle() {
    this.getVentaDetalleByIdVenta();
  }

  private getVentaDetalleByIdVenta() {
    if (!this.idVenta) return;
    this.loadingSpinner = true;
    this.salesService.getSaleDetalleById$({ id_venta: this.idVenta })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loadingSpinner = false;
          this.ventaDetalles = response.venta_detalles || [];
          this.ventaTotales = response.venta_totales || [];
          this.setVentaPayment();
        },
        error: (err) => {
          this.loadingSpinner = false;
        }
      });
  }

  private setVentaPayment() {
    if (this.esCreditoInterno.value) {
      setTimeout(() => {
        this.saleDepositoForm.patchValue({
          efectivo: '',
          glosa: '',

          yape: '',
          glosa_yape: '',

          deposito_cuenta: '',
          id_cuenta_bancaria: '',
          nro_operacion_dep: '',
          fecha_operacion_dep: '',

          tarjeta: '',
          id_tipo_tarjeta: '',
          operacion: '',
        });
      }, 0);
    } else {
      setTimeout(() => {
        this.saleDepositoForm.patchValue({
          efectivo: this.ventaTotales?.importe ?? 0,
        });
      }, 0);
    }

  }

  public onUpdateCabeceraVenta() {
    const value = this.documentoForm.value;
    const afecha = this.datePipe.transform(value.fecha_emision, 'yyyy-MM-dd HH:mm:ss');
    const bfecha = this.datePipe.transform(value.fecha_vencimiento, 'yyyy-MM-dd HH:mm:ss');
    const data = {
      id_conta_documento: value.id_conta_documento,
      id_cliente: value.id_cliente,
      cliente_id_tipo_documento: value.cliente_id_tipo_documento,
      cliente_num_documento: value.cliente_num_documento,
      cliente_razon_social: value.cliente_razon_social,
      cliente_direccion: value.cliente_direccion,
      cliente_email: value.cliente_email,
      fecha_emision: afecha,
      fecha_vencimiento: bfecha,
      es_credito: value.es_credito,
    };
    this.salesService.updateSale$(this.idVenta, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.getVentaDetalleByIdVenta();
        },
        error: (err) => {
          console.log(err);
        }
      })

  }

  public onSearchCliente() {
    // $event.stopPropagation();
    const invalidNumDocumento = this.rucCliente.invalid;
    if (invalidNumDocumento) {
      this.nbToastrService.show(
        `Ingrese correctamente el número de documento del cliente.`,
        'Número de documento inválido',
        { status: "warning", icon: "alert-circle-outline" }
      );
      return;
    };
    const id_conta_documento = this.documentoForm.get('id_conta_documento')?.value;
    const tipoComprobante = this.contaDocumentos.find((res) => res.id_conta_documento == id_conta_documento).id_tipo_comprobante;
    let numDocumento = this.rucCliente.value;
    if (typeof numDocumento === 'object') {
      numDocumento = numDocumento.numero_documento;
    }

    // Validar que sera Ruc 20
    // const regexRucPj = /^20.{9}$/;
    // if (tipoComprobante == '01' && !regexRucPj.test(numDocumento)) {
    //   this.nbToastrService.show(
    //     `Ingrese un número de documento válido para emitir facturas`,
    //     'Número de documento inválido',
    //     { status: "warning", icon: "alert-circle-outline" }
    //   );
    //   return;
    // }

    // const regexRucPn = /^10.{9}$/;
    // const regexDniPn = /^([1-9])\d{7}$/;
    // if (tipoComprobante == '03' && (!regexRucPn.test(numDocumento) || !regexDniPn.test(numDocumento))) {
    //   this.nbToastrService.show(
    //     `Ingrese un número de documento válido para emitir boletas`,
    //     'Número de documento inválido',
    //     { status: "warning", icon: "alert-circle-outline" }
    //   );
    //   return;
    // }

    if (tipoComprobante == '01') {
      this.clienteLoading = true;
      this.filteredOptionsClientes$ = this.personaConsultasService.searchClientesToFactura$({ text_search: numDocumento })
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.clienteLoading = false),
          map((data) => {
            this.inputCliente.nativeElement.click();
            return data;
          })
        );
    } else if (tipoComprobante == '03') {
      this.clienteLoading = true;
      this.filteredOptionsClientes$ = this.personaConsultasService.searchClientesToBoleta$({ text_search: numDocumento })
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.clienteLoading = false),
          map((data) => {
            this.inputCliente.nativeElement.click();
            return data;
          })
        );
    } else {
      this.nbToastrService.show(
        `Seleccione correctamente el tipo de comprobante.`,
        'Tipo de comprobante inválido',
        { status: "warning", icon: "alert-circle-outline" }
      );
      return;
    }
  }


  clienteHandle = (value: any) => value?.numero_documento ? value?.numero_documento : value;
  public clienteSelect = (value: any) => this.onValidarRuc(value?.numero_documento, value?.razon_social, value?.id_persona);
  private onValidarRuc(numero_documento: string, razon_social: string, id_persona: string) {

    if (!numero_documento) return;
    this.clienteLoading = true;

    if (numero_documento.length == 11) { // Solo si es ruc hay que validarlo
      this.clienteLoading = true;
      this.personaConsultasService.getRuc$({ ruc: numero_documento })
        .pipe(
          takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            console.log(data);

            this.clienteLoading = false;
            this.documentoForm.get('id_cliente')?.patchValue(id_persona);
            this.documentoForm.get('cliente_id_tipo_documento')?.patchValue(data.id_tipo_documento);
            this.documentoForm.get('cliente_num_documento')?.patchValue(numero_documento);
            this.documentoForm.get('cliente_razon_social')?.patchValue(razon_social);
            this.documentoForm.get('cliente_direccion')?.patchValue(data.direccion ?? 'Sin direccion');
            this.documentoForm.get('cliente_email')?.patchValue('example@ex.com');
            this.configRucExistsInSunat(data);
          }, error: () => {
            this.clienteLoading = false;
          }
        });
    } else if (numero_documento.length == 8) {
      this.clienteLoading = true;
      this.personaConsultasService.getDni$({ dni: numero_documento })
        .pipe(
          takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.clienteLoading = false;
            this.documentoForm.get('id_cliente')?.patchValue(id_persona);
            this.documentoForm.get('cliente_id_tipo_documento')?.patchValue(data.id_tipo_documento);
            this.documentoForm.get('cliente_num_documento')?.patchValue(numero_documento);
            this.documentoForm.get('cliente_razon_social')?.patchValue(razon_social);
            this.documentoForm.get('cliente_direccion')?.patchValue('Sin direccion');
            this.documentoForm.get('cliente_email')?.patchValue('example@ex.com');
            // this.configRucExistsInSunat(data);
          }, error: () => {
            this.clienteLoading = false;
          }
        });
    } else {
      this.clienteLoading = true;
      this.personaConsultasService.getNoDomiciliado$({ documento: numero_documento })
        .pipe(
          takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.clienteLoading = false;
            this.documentoForm.get('id_cliente')?.patchValue(id_persona);
            this.documentoForm.get('cliente_id_tipo_documento')?.patchValue(data.id_tipo_documento);
            this.documentoForm.get('cliente_num_documento')?.patchValue(numero_documento);
            this.documentoForm.get('cliente_razon_social')?.patchValue(razon_social);
            this.documentoForm.get('cliente_direccion')?.patchValue('Sin direccion');
            this.documentoForm.get('cliente_email')?.patchValue('example@ex.com');
            // this.configRucExistsInSunat(data);
          }, error: () => {
            this.clienteLoading = false;
          }
        });
    }
  }

  private configRucExistsInSunat(data: any) {
    const condicion = (data.tipo_condicion_nombre).toUpperCase();
    const estado = (data.tipo_estado_nombre).toUpperCase();

    if (condicion === 'HABIDO' && estado === 'ACTIVO') {
      this.clienteStatus = 'success'; // Success
    } else if (estado === 'ACTIVO' && condicion !== 'HABIDO') {
      this.clienteStatus = 'warning'; // Warning
    } else if (estado !== 'ACTIVO' && condicion !== 'HABIDO') {
      this.clienteStatus = 'danger'; // Danger - No pasa.
    } else {
      this.clienteStatus = 'danger'; // Danger - No pasa.
    }

    if (estado !== 'ACTIVO') {
      this.nbToastrService.show(
        `El ruc ${data?.id_ruc} tiene estado ${estado}, tome sus precauciones.`,
        'Un momento',
        { status: "warning", icon: "alert-circle-outline" }
      );
    }

    if (condicion !== 'HABIDO') {
      this.nbToastrService.show(
        `El ruc ${data?.id_ruc} esta en condición ${condicion}, tome sus precauciones.`,
        'Un momento',
        { status: "warning", icon: "alert-circle-outline" }
      );
    }
  }

  public getVentaById() {
    if (!this.idVenta) return;
    this.loadingSpinner = true;
    this.salesService.getSaleById$(this.idVenta)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.idVenta = response.id_venta;
          // this.venta = response;
          // console.log(this.venta);
          this.rucCliente.patchValue(response.num_doc_cli, { emitEvent: false });
          this.documentoForm.patchValue({
            id_conta_documento: response.id_conta_documento,
            id_almacen: response.id_almacen,
            fecha_emision: new Date(response.fecha_emision),
            fecha_vencimiento: new Date(response.fecha_vencimiento),
            es_credito: response.es_credito ? '1' : '0',

            id_cliente: response.id_cliente,
            cliente_id_tipo_documento: response.id_tipo_documento_cli,
            cliente_num_documento: response.num_doc_cli,
            cliente_razon_social: response.razon_social_cli,
            cliente_direccion: response.direccion_cli,
            cliente_email: response.email_cli,
          });

          // Solo si la venta no tiene id_conta_documento agregar la primera
          const firstContaDocumento = this.contaDocumentos?.at(-1)
          if (firstContaDocumento && !response.id_conta_documento) {
            this.documentoForm.patchValue({
              id_conta_documento: firstContaDocumento.id_conta_documento,
            });
          }

          this.loadingSpinner = false;
        },
        error: (err) => {
          this.loadingSpinner = false;
        }
      });

  }

  public getMasters() {
    const contaDocumentos$ = this.salesService.getMisContaDocumentos$({ id_venta: this.idVenta }).pipe(takeUntil(this.destroy$));
    const cuentaBancarias$ = this.salesService.getCuentaBancarias$({ id_venta: this.idVenta }).pipe(takeUntil(this.destroy$));
    const tipoTarjetas$ = this.salesService.getTipoTarjetas$({ id_venta: this.idVenta }).pipe(takeUntil(this.destroy$));
    const misCajasHabilitadas$ = this.salesService.getMisCajaCajasParaVentas$({}).pipe(takeUntil(this.destroy$));
    this.loadingSpinner = true;
    forkJoin({
      contaDocumentos: contaDocumentos$,
      cuentaBancarias: cuentaBancarias$,
      tipoTarjetas: tipoTarjetas$,
      misCajasHabilitadas: misCajasHabilitadas$
    }).subscribe({
      next: (response) => {
        this.loadingSpinner = false;
        this.contaDocumentos = response.contaDocumentos || [];
        this.cuentaBancarias = response.cuentaBancarias || [];
        this.tipoTarjetas = response.tipoTarjetas || [];
        this.misCajasHabilitadas = response.misCajasHabilitadas || [];
        this.getVentaById();
        this.getVentaDetalleByIdVenta();
      },
      error: (err) => {
        this.loadingSpinner = false;
        this.contaDocumentos = [];
        this.cuentaBancarias = [];
      }
    });



    // this.mesesService.getAll$()
    //   .pipe(
    //     takeUntil(this.destroy$))
    //   .subscribe(response => {
    //     this.loadingSpinner = false;
    //     const meses: any[] = response || [];
    //     this.meses = meses;
    //     const selected = meses.find(res => res.is_selected);
    //     if (selected) {
    //       setTimeout(() => {
    //         this.documentoForm.get('mes_id')?.patchValue(selected.mes_id);
    //       }, 0);
    //     }
    //   }, err => {
    //     this.loadingSpinner = false;
    //     this.meses = [];
    //   });
  }


  get hasCajaHabilitadaEfectivo(): boolean {
    return this.misCajasHabilitadas.some(caja => caja.id_medio_pago === '008');
  }
  get hasCajaHabilitadaYape(): boolean {
    return this.misCajasHabilitadas.some(caja => caja.id_medio_pago === '021');
  }
  get hasCajaHabilitadaCreditCard(): boolean {
    return this.misCajasHabilitadas.some(caja => caja.id_medio_pago === '006');
  }
  get hasCajaHabilitadaDeposito(): boolean {
    return this.misCajasHabilitadas.some(caja => caja.id_medio_pago === '001');
  }

  private clearSaleDepositoForm() {
    setTimeout(() => {
      this.saleDepositoForm.patchValue({
        efectivo: '',
        glosa: '',

        yape: '',
        glosa_yape: '',

        deposito_cuenta: '',
        id_cuenta_bancaria: '',
        nro_operacion_dep: '',
        fecha_operacion_dep: '',

        tarjeta: '',
        id_tipo_tarjeta: '',
        operacion: '',
      });
    }, 0);
  }

  public pushPayOnMethod(method: string) {
    this.clearSaleDepositoForm();
    if (method === 'efectivo') {
      setTimeout(() => {
        this.saleDepositoForm.patchValue({
          efectivo: this.ventaTotales?.importe ?? 0,
        });
      }, 0);
    } else if (method === 'yape') {
      setTimeout(() => {
        this.saleDepositoForm.patchValue({
          yape: this.ventaTotales?.importe ?? 0,
        });
      }, 0);
    } else if (method === 'transferencia') {
      setTimeout(() => {
        this.saleDepositoForm.patchValue({
          deposito_cuenta: this.ventaTotales?.importe ?? 0,
        });
      }, 0);
    } else if (method === 'tarjeta') {
      setTimeout(() => {
        this.saleDepositoForm.patchValue({
          tarjeta: this.ventaTotales?.importe ?? 0,
        });
      }, 0);
    }

  }
  // public onRegistrarNuevoRecei() {
  //   const modal = this.nbDialogService.open(FormReceiNuevoMovimientoModalComponent);
  //   modal.onClose
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(res => {
  //       if (!res.cancel && res.data) {
  //         this.onManageRecei(res.data);
  //       }
  //     }, err => { });
  // }

  // public onRegistrarNuevoDepar() {
  //   const modal = this.nbDialogService.open(FormDeparNuevoMovimientoModalComponent);
  //   modal.onClose
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(res => {
  //       if (!res.cancel && res.data) {
  //         this.onManageDepar(res.data);
  //       }
  //     }, err => { });
  // }


  // public onRegistrarNuevoBw() {
  //   const modal = this.nbDialogService.open(FormBwNuevoMovimientoModalComponent);
  //   modal.onClose
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(res => {
  //       if (!res.cancel && res.data) {
  //         this.onManageBw(res.data);
  //       }
  //     }, err => { });
  // }

  public onEditarOperacion(item: any) {
    if (!item) return;
    const dialog = this.nbDialogService.open(ModalTypeIgvComponent);
    dialog.componentRef.instance.data = {
      id_venta_detalle: item.id_venta_detalle,
      id_tipo_igv: item.id_tipo_igv,
    };
    // dialog.componentRef.instance.tipos_igv = 102030;
    dialog.onClose.subscribe({
      next: (res: any) => {
        if (!res.cancel) {
          this.getVentaDetalleByIdVenta();
        }
      }, error: () => {
      }
    });
  }

  // public onManageRols(userId: any, userNombre: any) {
  //   const modal = this.nbDialogService.open(FormManageRolesModalComponent);
  //   modal.componentRef.instance.userId = userId;
  //   modal.componentRef.instance.nombreUser = userNombre;
  //   modal.onClose
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(res => {
  //       if (!res.cancel) {
  //         this.getInventarioMovimientos();
  //       }
  //     }, err => { });
  // }

  public onDeleteVentaDetalle(item: any) {
    if (!item) return;
    if (!confirm('¿Estás seguro de eliminar el detalle de la venta?')) return;

    // this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de eliminar el almacén?' } })
    //   .onClose.subscribe(status => {
    //     if (status) {
    this.loadingSpinner = true;
    this.salesService.deleteSaleDetalle$(item.id_venta_detalle)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loadingSpinner = false;
          this.getVentaDetalleByIdVenta();
        },
        error: () => {
          this.loadingSpinner = false;
        }
      });
    // }, err => {
    // });

  }

  public onEnable(item: any) {

    if (!confirm('¿Estas seguro (a)?')) return;

    // this.loadingSpinner = true;
    // this.movimientosService.enable$(item.movimiento_id, {})
    //   .pipe(
    //     map(res => res.data),
    //     takeUntil(this.destroy$),
    //     finalize(() => this.loadingSpinner = false)
    //   )
    //   .subscribe((values: any) => {
    //   }, (err: any) => {
    //   });
  }


  public onFinalizar() {

    if (this.ventaDetalles.length == 0) {
      this.nbToastrService.show(`Un momento, agregue detalle a la operación`, 'Detalle', { status: 'warning' });
      return;
    }
    // const value = this.documentoForm.getRawValue();
    // const afecha: any = this.datePipe.transform(value.fecha_vencimiento, 'yyyy-MM-dd');

    const valuePay = this.saleDepositoForm.getRawValue();
    const fecha_operacion_dep = this.datePipe.transform(valuePay.fecha_operacion_dep, 'yyyy-MM-dd');

    const es_credito_interno = this.esCreditoInterno.value ? '1' : '0';

    const params = {
      es_credito_interno: es_credito_interno,

      //Pago de la operacion
      id_caja_efectivo: this.misCajasHabilitadas.find(caja => caja.id_medio_pago === '008')?.id_caja || null,
      efectivo: this.hasCajaHabilitadaEfectivo ? valuePay.efectivo : 0,
      glosa: valuePay.glosa,

      id_caja_yape: this.misCajasHabilitadas.find(caja => caja.id_medio_pago === '021')?.id_caja || null,
      yape: this.hasCajaHabilitadaYape ? valuePay.yape : 0,
      glosa_yape: valuePay.glosa_yape,

      id_caja_deposito: this.misCajasHabilitadas.find(caja => caja.id_medio_pago === '001')?.id_caja || null,
      deposito_cuenta: this.hasCajaHabilitadaYape ? valuePay.deposito_cuenta : 0,
      id_cuenta_bancaria: valuePay.id_cuenta_bancaria,
      nro_operacion_dep: valuePay.nro_operacion_dep,
      fecha_operacion_dep: fecha_operacion_dep,

      id_caja_tarjeta: this.misCajasHabilitadas.find(caja => caja.id_medio_pago === '006')?.id_caja || null,
      tarjeta: this.hasCajaHabilitadaCreditCard ? valuePay.tarjeta : 0,
      id_tipo_tarjeta: valuePay.id_tipo_tarjeta,
      operacion: valuePay.operacion,

      anticipos: [
        // {
        //   id_anticipo: 1,
        //   importe: 1
        // }
      ]
    };

    this.loadingSpinner = true;
    this.salesService.finalizarSale$(this.idVenta, params)
      .pipe(map(response => response.data), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.loadingSpinner = false;
        // this.compOutputDocuments.runOutputDocument(this.saleForm.get('id_venta')?.value);
        // this.openSaleIssued(res);
      }, () => {
        this.loadingSpinner = false;
      });
  }

  public onBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }


}
