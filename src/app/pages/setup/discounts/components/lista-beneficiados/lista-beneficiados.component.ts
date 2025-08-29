import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'open-lista-beneficiados',
  templateUrl: './lista-beneficiados.component.html',
  styleUrls: ['./lista-beneficiados.component.scss']
})
export class ListaBeneficiadosComponent implements OnInit, OnDestroy {

  constructor(private formBuilder: FormBuilder,
      private router: Router,
      private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
