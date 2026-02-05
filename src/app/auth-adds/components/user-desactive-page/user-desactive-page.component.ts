import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subject, merge } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'open-user-desactive-page',
  templateUrl: './user-desactive-page.component.html',
  styleUrls: ['./user-desactive-page.component.scss']
})
export class UserDesactivePageComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loading: boolean = true;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: any,
  ) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public goToHome() {
    this.document.location.href = environment.shellApp;
    // this.router.navigate(['/']);
  }
  
}
