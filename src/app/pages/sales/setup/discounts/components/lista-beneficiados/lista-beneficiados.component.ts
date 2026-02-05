import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { FormNuevoListaModalComponent } from './form-nuevo-lista-modal/form-nuevo-lista-modal.component';
@Component({
  selector: 'inverso-lista-beneficiados',
  templateUrl: './lista-beneficiados.component.html',
  styleUrls: ['./lista-beneficiados.component.scss']
})
export class ListaBeneficiadosComponent implements OnInit, OnDestroy {
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: NbDialogService,
  ) { }
  

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
  verBeneficiados(id: number): void {
    console.log('Ver beneficiados para ID:', id);
  }
 
abrirModal2() {
    this.dialogService.open(FormNuevoListaModalComponent);
  }
}

