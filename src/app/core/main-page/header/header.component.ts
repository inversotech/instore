import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { NbSidebarService, NbMenuService, NbMediaBreakpointsService, NbDialogService } from '@nebular/theme';
import { map, filter, takeUntil, debounceTime } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { NbJSThemeOptions } from '@nebular/theme/services/js-themes/theme.options';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { OpenOAuthStoreService } from 'src/app/oauth/providers';
import { AppDataService } from '../../providers/app-data.service';
import { NbAuthResult, NbAuthService } from '@nebular/auth';
import { ChangeEnterpriseModalComponent } from './change-enterprise-modal/change-enterprise-modal.component';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'inverso-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public userPictureOnly = false;
  public user: any = this.appDataService.getUser();
  public userMenu = this.appDataService.getUserMenu();
  public empresaConfig = this.appDataService.getEmpresaConfig();
  public theme?: NbJSThemeOptions;

  @Input() position = 'normal';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sidebarService: NbSidebarService,
    @Inject(DOCUMENT) private document: any,
    private nbMenuService: NbMenuService,
    private themeService: NbThemeService,
    private appDataService: AppDataService,
    private breakpointService: NbMediaBreakpointsService,
    private nbAuthService: NbAuthService,
    private authService: AuthService,
    private nbDialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.validate();
    this.subscribeMenuProfile();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private validate() {
    this.authService.validate$()
      .pipe(map(res => res.data), takeUntil(this.destroy$))
      .subscribe((response: any) => { });
  }

  private subscribeMenuProfile() {
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'context-menu-profile'),
        map(({ item: { data } }) => data),
        takeUntil(this.destroy$),
      )
      .subscribe(data => {
        if (data === 'logout') {
          this.logout();
        } else if (data === 'changeenterprise') {
          const modal = this.nbDialogService.open(ChangeEnterpriseModalComponent);
          modal.onClose.subscribe(res => {
            if (!res.cancel) {
              window.location.reload();
            }
          }, err => { });
        } else if (data === 'profile') {
          this.router.navigate(['/pages/setup-profile/my-profile'], { relativeTo: this.activatedRoute })
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

  // public onLogout(): boolean {
  //   this.logout();
  //   return false;
  // }

  private logout() {
    this.nbAuthService.logout(environment.authStrategy.name)
      .pipe(takeUntil(this.destroy$))
      .subscribe((authResult: NbAuthResult) => {
        if (authResult.isSuccess()) {
          console.log('sesi´nn cerrada');
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

  // private getUser() {
  //   this.authService.user$()
  //     .pipe(map(res => res.data,
  //       takeUntil(this.destroy$),
  //     ))
  //     .subscribe(response => {
  //       if (response) {
  //         this.user.email = response.email || '';
  //         this.user.full_name = response.name || '';
  //         this.user.picture = response.img_url || '';
  //       }
  //     });
  // }

  public toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  public goToShellApp() {
    this.document.location.href = environment.shellApp;
  }
}
