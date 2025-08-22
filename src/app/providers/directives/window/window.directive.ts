import { Directive, OnDestroy, OnInit, Input, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NbThemeService } from '@nebular/theme';
import { map } from 'rxjs/operators';

@Directive({
  selector: '[lambWindow]'
})
export class WindowDirective implements OnInit,  OnDestroy{

  @Input() widthSize?: string;

  private subscribe: Subscription | undefined;

  private SIZES_MODAL: any = {
    TN: 420,
    SM: 576,
    MD: 768,
    LG: 992,
    XL: 1200,
    XXL: 1400
  };

  constructor(
    private themeService: NbThemeService,
    private el: ElementRef) {
    this.el.nativeElement.style.maxHeight = 'initial';
  }

  ngOnInit(): void {
    this.subscribe = this.themeService.onMediaQueryChange().pipe(
      map(([, currentBreakpoint]) => currentBreakpoint.width),
      map((width: number) => {
        if (this.widthSize) {
          const newWidth = this.SIZES_MODAL[this.widthSize.toUpperCase()];
          return (newWidth && width >= newWidth) ? newWidth : width;
        } else {
          return width;
        }
      }),
    ).subscribe(value => {
      this.el.nativeElement.style.width = `calc(${value}px - 1.5rem)`;
      // this.el.nativeElement.style.height = `100%`;
    });
  }

  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
}
