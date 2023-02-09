import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { AppDataService } from 'src/app/core/providers/app-data.service';

@Component({
  selector: 'open-sidebar-content',
  templateUrl: './sidebar-content.component.html',
  styleUrls: ['./sidebar-content.component.scss'],
})
export class SidebarContentComponent implements OnInit {
  public isSingleClick = false;
  public items = this.appDataService.getMenu();
  constructor(
    protected element: ElementRef,
    protected sidebarService: NbSidebarService,
    private appDataService: AppDataService,
  ) { }

  ngOnInit() {
  }
  public onClickMenu(event: any): void {
    const menu = this.element.nativeElement.querySelector('lamb-menu');
    if (menu && menu.contains(event.target)) {
      let link = event.target;
      const linkChildren = ['span', 'i'];
      // Si hacemos click en span - Obtenemos el link.
      if (linkChildren.indexOf(link.tagName.toLowerCase()) !== -1 && link.parentNode) {
        link = event.target.parentNode;
      }
      // Nosotros solo expandimos si un item tiene hijos.
      if (link && link.nextElementSibling && link.nextElementSibling.classList.contains('lamb-menu-items')) {
        this.sidebarService.toggle(true, 'lateral-menu-sidebar');
        this.sidebarService.expand('lateral-menu-sidebar');
      }
      if (this.isSingleClick && link && link.href) {
        const lin: string[] = link.href.split('/#');
        if (lin.length < 2) {
          this.sidebarService.toggle(true, 'lateral-menu-sidebar');
        }
      }
    }
  }

}
