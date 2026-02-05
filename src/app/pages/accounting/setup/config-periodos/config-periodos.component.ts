import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'lamb-config-periodos',
    template: '<router-outlet></router-outlet>',
})

export class ConfigPeriodosComponent implements OnInit {
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() { }

    onRegresar() {
        // this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }

}
