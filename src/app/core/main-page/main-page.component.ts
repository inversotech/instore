import { Component, OnInit, OnDestroy } from '@angular/core';
import { StateService } from '../providers/state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'inverso-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  public sidebar: any = {};
  protected sidebarState$: Subscription;

  constructor(
    protected stateService: StateService,
  ) {
    this.sidebarState$ = this.stateService.onSidebarState()
      .subscribe((sidebar: string) => {
        this.sidebar = sidebar || { icon: 'nb-layout-sidebar-left', id: 'left', name: 'Left Sidebar', selected: true };
      });
  }

  ngOnInit() {
  }

  public ngOnDestroy(): void {
    this.sidebarState$.unsubscribe();
  }

}
