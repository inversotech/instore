import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { NbSidebarService, NbMenuService, NbMediaBreakpointsService, NbDialogService, NbThemeService } from '@nebular/theme';
import { map, filter, takeUntil, debounceTime } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NbAuthResult, NbAuthService } from '@nebular/auth';
import { AuthService } from 'src/app/auth/providers/auth.service';
// import { AppDataService } from 'src/app/core/providers/app-data.service';

@Component({
  selector: 'open-header-page',
  templateUrl: './header-page.component.html',
  styles: [''],
})
export class HeaderPageComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public userPictureOnly = false;
  public user: any;

  @Input() position = 'normal';
  public userMenu: any[] = [
    { title: 'Cerrar sesion', icon: 'power-outline', data: 'logout' },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sidebarService: NbSidebarService,
    @Inject(DOCUMENT) private document: any,
    // private openOAuthStoreService: OpenOAuthStoreService,
    private nbAuthService: NbAuthService,
    private nbMenuService: NbMenuService,
    private themeService: NbThemeService,
    private authService: AuthService,
    // private appDataService: AppDataService,
    private breakpointService: NbMediaBreakpointsService,
  ) { }

  ngOnInit() {
    this.getUser();
    this.subscribeMenuProfile();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeMenuProfile() {
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'context-menu-profile-1'),
        map(({ item: { data } }) => data),
        takeUntil(this.destroy$),
      )
      .subscribe(data => {
        if (data === 'logout') {
          this.onLogout();
        }
      });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);
  }

  private onLogout() {
    this.nbAuthService.logout(environment.authStrategy.name)
    .pipe(takeUntil(this.destroy$))
    .subscribe((authResult: NbAuthResult) => {
      if (authResult.isSuccess()) {
        console.log('sesión cerrada');
        console.log(authResult.getRedirect());
        window.location.href = authResult.getRedirect();
        // this.appDataService.authorize();
      }
    });

    // this.authService.logout$()
    //   .pipe(map(res => res.data,
    //     takeUntil(this.destroy$),
    //   ))
    //   .subscribe(response => {
    //     this.openOAuthStoreService.clearAll();
    //     this.router.navigate(['/oauth'], { relativeTo: this.activatedRoute });
    //   });
  }

  private getUser() {
    this.authService.user$()
      .pipe(map(res => res.data,
        takeUntil(this.destroy$),
      ))
      .subscribe(response => {
        this.user = response;
        // if (response) {
        //   this.user.email = response.email || '';
        //   this.user.full_name = response.name || '';
        //   this.user.picture = response.img_url || '';
        // }
      });
    // this.loadUsersThemes();
  }

  // public loadUsersThemes() {
  // this.themeService.changeTheme('default');
  // const orientationSidebar = this.getOrientationSidebar('left');
  // this.stateService.setSidebarState(orientationSidebar);
  // }

  // private getOrientationSidebar(sidebar: any) {
  //   if (sidebar === 'right') {
  //     return {
  //       name: 'Right Sidebar',
  //       icon: 'nb-layout-sidebar-right',
  //       id: 'right',
  //       selected: true,
  //     };
  //   } else if (sidebar === 'left') {
  //     return {
  //       name: 'Left Sidebar',
  //       icon: 'nb-layout-sidebar-left',
  //       id: 'left',
  //       selected: true,
  //     };
  //   }
  // }

  private loadUpeuMasters(response: any) {
    this.user = response;
    this.user['full_name'] = `${response.first_name} ${response.last_name}`;
  }

  public toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  public goToShellApp() {
    this.document.location.href = environment.shellApp;
  }
}
