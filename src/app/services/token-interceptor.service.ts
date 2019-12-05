import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginService} from './Login/login.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(public auth: LoginService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(this.auth.accessToken);
    if(!request.url.includes("/oauth/")){
      request = request.clone({
        setHeaders: {
          Authorization: `${this.auth.accessToken}`,
        },
        withCredentials: true
      });
    }
    return next.handle(request);
  }
}