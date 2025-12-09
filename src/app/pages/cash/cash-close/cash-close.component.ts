import { Component } from '@angular/core';

@Component({
  selector: 'lamb-cash-close',
  templateUrl: 'cash-close.component.html',
  styles: ['']
})
export class CashCloseComponent {
  public tabs = [
    {
      title: 'Pendientes de cierre',
      route: './closing-earrings',
      icon: 'list-outline',
      responsive: true, // hide title before `$tabset-tab-text-hide-breakpoint` value
    },
    {
      title: 'Cierres generados',
      route: './closings-generated',
      icon: 'attach-outline',
      responsive: true,
    }
  ];

}
