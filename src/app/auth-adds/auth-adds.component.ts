import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
// import { StateService } from '../core/providers/state.service';

@Component({
  selector: 'open-auth-adds',
  templateUrl: './auth-adds.component.html',
  styles: ['']
})
export class AuthAddsComponent implements OnInit, OnDestroy {
  // public sidebar: any = {};
  // protected sidebarState$: Subscription;
  constructor(
    // protected stateService: StateService,

  ) {
    // this.sidebarState$ = this.stateService.onSidebarState()
    //   .subscribe((sidebar: string) => {
    //     // this.sidebar = sidebar;
    //     this.sidebar = sidebar || { icon: 'nb-layout-sidebar-left', id: 'left', name: 'Left Sidebar', selected: true };
    //   });
  }

  ngOnInit() {
  }

  get year() {
    return new Date().getFullYear();
  }


  ngOnDestroy(): void {
    // this.sidebarState$.unsubscribe();
  }

}
