import {Injectable, Injector} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, 
  HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {AuthService} from './auth.service';
import {ToastComponent} from '../shared/toast/toast.component';


@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private toast: ToastComponent
  ) {
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    // handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      const auth = this.injector.get(AuthService);
      // navigate /delete cookies or whatever
      auth.logout();

      this.toast.open('Unauthorized! Please login.', 'danger');
      // if you've caught / handled the error.
      return Observable.of(err.message);
    }
    return Observable.throw(err);
  }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });  
    }


    return next.handle(request).catch(err => this.handleAuthError(err));
  }
}
