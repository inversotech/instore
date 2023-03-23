import {
  HttpErrorResponse,
  HttpEvent, HttpHandler, HttpInterceptor,
  HttpRequest, HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';

export const statusCodes = [400, 500, 403, 404, 202, 422];

@Injectable()
export class CatchInterceptorService implements HttpInterceptor {
  private started: any;

  constructor(private toastrService: NbToastrService,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.started = Date.now();

    return next.handle(req).pipe(
      tap(
        {
          next: (res: HttpEvent<any>) => this.interceptResponse(res, req.method),
          error: (err: any) => this.catchError(err, req),
        }
      ),
      // catchError((err: HttpErrorResponse) => {
      //     switch (err.status) {
      //         case 422:
      //             if (req.method === 'GET') {
      //                 this.showErrors(err);
      //             } else {
      //                 this.showErros(err);
      //             }
      //             break;
      //         default:
      //             this.showErros(err);
      //             break;
      //     }
      //     return throwError(err);
      // }),
    );
  }

  private interceptResponse(event: HttpEvent<any>, method: any) {
    if (event instanceof HttpResponse) {
      const elapsed_ms = Date.now() - this.started;
      // console.warn(`La solicitud de ${event.url} tomó ${elapsed_ms} ms.`);
      if (elapsed_ms >= 10 * 1000) {
        console.warn(`La solicitud de ${event.url} tomó ${elapsed_ms} ms.`);
      }
      if (method !== 'GET') {
        this.showSuccess(event.status);
      }
    }
  }

  private showSuccess(status: number) {
    switch (status) {
      case 201:
        this.toastrService.show('La operación se ha cumplido y resultó en la creación de un nuevo recurso',
          'Creado!', { status: 'success', });
        break;
      default:
        this.toastrService.show('La operación ha tenido éxito',
          'Éxito!', { status: 'success', });
        break;
    }
  }

  private catchError(err: any, req: any) {
    if (err instanceof HttpErrorResponse) {
      this.catchHttpError(err);
    } else {
      console.error(err.message);
    }
    setTimeout(() => {
      this.showErros(err);
    }, 0);


    // switch (err.status) {
    //   case 422:
    //     if (req.method === 'GET') {
    //       this.showErrors(err);
    //     } else {
    //       this.showErros(err);
    //     }
    //     break;
    //   default:
    //     this.showErros(err);
    //     break;
    // }
    // return throwError(err);
  }

  private catchHttpError(err: HttpErrorResponse) {
    switch (err.status) {
      // case 422:
      //     // if (req.method === 'GET') {
      //     //     this.showErrors(err);
      //     // } else {
      //     this.showErros(err);
      //     // }
      //     break;
      case 401:
        this.catchUnauthorized();
        break;
      case 403:
        this.manageError403(err);
        break;
      default:
        console.warn(err.statusText);
        break;
    }
  }

  private manageError403(err: HttpErrorResponse) {
    if (err.error && err.error.error && err.error.error.email_notverified) {
      console.log('send-email-verify-page');
      this.router.navigate(['/pages/extra/send-email-verify-page'])
    }
    if (err.error.error && err.error.error.user_notactived) {
      console.log('send-email-desactive-page');
      this.router.navigate(['/pages/extra/user-desactive-page'])
    }
    if (err.error.error && err.error.error.email_notcompany) {
      console.log('send-email-uncompany-page');
      this.router.navigate(['/pages/extra/user-uncompany-page'])
    }
  }

  private catchUnauthorized() {
    this.cleanAuthData();
    this.setRedirectUrl();
    this.navigateToLogin();
  }

  private cleanAuthData() {
    // this.openOAuthStoreService.clearAll();
  }

  private setRedirectUrl() {
    // Esto es temporal en la realidad debe de pedir un accesToken no un Code Authorization
    // this.oauthLambService.getAccessToken();
  }

  private navigateToLogin() {
    this.router.navigateByUrl('/oauth');
  }


  private capitalize(text: string) {
    return text && text.length
      ? (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase())
      : text;
  }

  private showErros(err: any) {
    if (statusCodes.includes(err.status)) {
      if (err.error && err.error.errors !== undefined) { // Es un error de validación
        const errors = Object.keys(err.error.errors).map(key => ({ key, errs: err.error.errors[key] }));
        for (let index = 0; index < errors.length; index++) {
          const element = errors[index];
          for (let i = 0; i < element.errs.length; i++) {
            const el = this.capitalize(element.errs[i]);
            const title = this.capitalize(element.key);
            this.toast(`${el}`, `${title}`, 'warning');
          }
        }
      } else { // Otro error programado
        if (err.error && err.error.error && err.error.error.message) {
          const errorMsg = err.error.error.message || err.statusText;
          // this.toast(`${err.status} ${errorMsg}`, err.statusText);
          this.toast(`${errorMsg}`, `${err.status} ${err.statusText}`);
        } else {
          const errorMsg = err.error.message || err.statusText;
          // this.toast(`${err.status} ${errorMsg}`, err.statusText);
          this.toast(`${errorMsg}`, `${err.status} ${err.statusText}`, 'warning');
        }
      }
    }
  }

  // private showErrors(e: any) {
  //   const errors = e.error.data;
  //   for (const iterator in errors) {
  //     for (const err of errors[iterator]) {
  //       this.toast(`${e.status} ${e.statusText}`, err);
  //     }
  //   }
  // }

  private toast(msg: any, title: any, status = "danger") {
    return this.toastrService.show(msg, title, { icon: 'alert-circle-outline', status: status });
    // return this.toastrService.danger(msg, title, { duration: 4000, icon: 'alert-circle-outline' });
  }

}
