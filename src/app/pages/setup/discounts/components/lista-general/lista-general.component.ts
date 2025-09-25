import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MonedasService } from 'src/app/providers/services/accounting/monedas.service';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { NbDialogService } from '@nebular/theme';
import { FormNuevoDescuentoModalComponent } from '../form-nuevo-descuento-modal/form-nuevo-descuento-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountsCoreService } from 'src/app/providers/services/sales/discounts.core.service';
import { FormEditarModalComponent } from '../form-editar-modal-component/form-editar-modal.component';
@Component({
  selector: 'open-lista-general',
  templateUrl: './lista-general.component.html',
  styleUrls: ['./lista-general.component.scss']
})
export class ListaGeneralComponent implements OnInit, OnDestroy {
  // Array con los estados
  listaEstados = [
    { valor: -1, nombre: 'Todos' },
    { valor: 1, nombre: 'Activo' },
    { valor: 0, nombre: 'Inactivo' }
  ];
  mostrarFormulario: boolean = false;
  public descuentos: any[] = [];
  public loadingSpinner: boolean = false;
  mostrarModalProductos: boolean = false;

  public searchForm: FormGroup = this.formBuilder.group({
    id_almacen: [1, Validators.required],
    text_search: [''],
    estado: [-1]
  });

  private destroy$: Subject<void> = new Subject<void>();
  public monedas$ = this.monedasService.getAll$();
  public misAlmacenes$ = this.almacenUsuariosService.getMisAlmacenes$({});

  constructor(private formBuilder: FormBuilder,
    private monedasService: MonedasService,
    private almacenUsuariosService: AlmacenUsuariosService,
    private nbDialogService: NbDialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private discountsCoreService: DiscountsCoreService,
  ) { }
  


  ngOnInit() {
    this.setDefaultValues();
    this.obtenerDescuentos();
    console.log("habla  causa");

this.searchForm.get('id_almacen')?.valueChanges.subscribe(valor => {
        console.log('Almacén seleccionado:', valor);
        this.obtenerDescuentos(); // Se ejecuta automáticamente al cambiar
    });
  }
 

  public onEstadoChange(): void {
    //Se ejecuta cada vez que cambian el select
    // this.obtenerDescuentos();
      console.log(' onEstadoChange se ejecutó');
  console.log(' Valor actual del estado:', this.searchForm.get('estado')?.value);
  
  //Ejecuta después de un pequeño delay
  setTimeout(() => {
    this.obtenerDescuentos(); // aqui se quita el  setTimeout (ojo)
  }, 100);
  }

  public obtenerDescuentos(): void {
    console.log("obtenerDescuentos iniciado");
    const almacenId = this.searchForm.get('id_almacen')?.value;
    const estadoSeleccionado = this.searchForm.get('estado')?.value;
    // if (!almacenId) return;

    
    const params = {
      id_almacen: almacenId || 1, 
      estado: estadoSeleccionado ?? -1
      
    };

    console.log('Parámetros enviados:', params);

    this.discountsCoreService.listaDescuentos$(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta del backend:', response);
          console.log('Cantidad de descuentos recibidos:', response);
          this.descuentos = response;

        },

        error: (err:any) => {
          console.error('Error al obtener descuentos:', err);
        }
      });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  abrirGrupoProductos(id: string) {
  this.router.navigate([id, 'productos'], { relativeTo: this.activatedRoute });
}

  public verBeneficiados(id_descuento: any) {
    this.router.navigate(['./', id_descuento], { relativeTo: this.activatedRoute });
  }

  private setDefaultValues() {
    this.searchForm.get('id_almacen')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        setTimeout(() => {
          this.obtenerDescuentos();
        }, 0);
      });

   
    

    this.misAlmacenes$.subscribe(almacenes => {
      if (almacenes && almacenes.length > 0) {
        this.searchForm.get('id_almacen')?.setValue(almacenes[0].id_almacen);
      }
    });


  }

  public submitFormSearch() {
    this.obtenerDescuentos();
  }

  public crearNuevoDescuento() {
    const modal = this.nbDialogService.open(FormNuevoDescuentoModalComponent);
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel && res.data) {
          this.obtenerDescuentos()
        }
      }, err => { });
  }

 


  eliminarDescuento(id_venta_descuento: number): void {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar este descuento?');

    if (!confirmar) return;
    this.discountsCoreService.eliminar(id_venta_descuento).subscribe({
      next: (respuesta) => {
        this.obtenerDescuentos();
        console.log('Descuento eliminado:', respuesta);
      },

      error: (error) => {
        console.error('Error al eliminar:', error);

      },

    });
  }




  abrirModalEditar(item: any) {
    const id = item.id_venta_descuento;
    if (!id) return;

    this.discountsCoreService.getByIdDescuento(id).subscribe({
      next: (descuentoCompleto) => {
        console.log(descuentoCompleto);

        this.nbDialogService.open(FormEditarModalComponent, {
          context: { aDescuento: descuentoCompleto }
        }).onClose.subscribe((resultado) => {
          if (resultado && !resultado.cancel) {
            this.obtenerDescuentos(); // refresca la lista desde el backend
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener descuento por ID:', err);
      }
    });
    


    // this.nbDialogService.open(FormEditarModalComponent, {
    //   context: {descuento: item} 

    // }).onClose.subscribe((resultado) => {
    //   if (resultado && !resultado.cancel) {
    //     // Actualiza la lista si el modal devuelve datos
    //     // const index = this.descuentos.findIndex(d => d.id === resultado.data.id);
    //     if (resultado && !resultado.cancel) {
    //       this.obtenerLista();
    //     }
    //   }
    // });
  };



  // const ventaPrecios = this.ventaPrecios || [];

  // const dataVentaPrecios = ventaPrecios.map(item => ({
  //   id_almacen: item.id_almacen,
  //   id_articulo: item.id_articulo,
  //   id_anho: item.id_anho,
  //   precio_inicial_pen: item.precio_inicial_pen,
  //   precio_inicial_usd: item.precio_inicial_usd,
  // }));
  // this.loadingSpinner = true;
  // this.ventaPreciosService.add$({ items: dataVentaPrecios })
  //   .pipe(takeUntil(this.destroy$))
  //   .subscribe(response => {
  //     this.getPrecios();
  //     this.loadingSpinner = false;
  //   }, err => {
  //     this.loadingSpinner = false;
  //   });

}


