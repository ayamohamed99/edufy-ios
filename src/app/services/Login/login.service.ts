import { Injectable } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpHeaders} from '@angular/common/http';
// import 'rxjs/add/operator/map';
import {Url_domain} from '../../models/url_domain';
// import 'rxjs/add/observable/fromPromise';
// import 'rxjs/add/operator/mergeMap';
import {Platform} from '@ionic/angular';
import {HTTP} from '@ionic-native/http/ngx';
import {from} from 'rxjs';
import {TokenInterceptorService} from '../token-interceptor.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  localStorageToken = 'LOCAL_STORAGE_TOKEN';
  localStorageAccessToken = 'LOCAL_STORAGE_ACCESS_TOKEN';
  localStorageUserName = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword = 'LOCAL_STORAGE_PASSWORD';
  accessToken: string;
    // tslint:disable-next-line:new-parens
  DomainUrl: Url_domain = new Url_domain;


  constructor(private http: HttpClient, private httpN: HTTP, private platform: Platform) {
  }

  postlogin(username: string, password: string) {
      // if (this.platform.is('cordova')) {
      //     return from(this.httpN.post(this.DomainUrl.Domain + '/oauth/token?grant_type=password&client_id=my-trusted-client&password='
      //         + password + '&username=' + username, {}, {}));
      // } else {
          return this.http.post(this.DomainUrl.Domain + '/oauth/token?grant_type=password&client_id=my-trusted-client&password='
              + password + '&username=' + username, null);
      // }
  }

  authenticateUserByRefreshToken(refreshToken: string) {
      // if (this.platform.is('cordova')) {
      //     // tslint:disable-next-line:max-line-length
      //     return from(this.httpN.get(this.DomainUrl.Domain + '/oauth/token?grant_type=refresh_token&client_id=my-trusted-client&refresh_token='
      //         + refreshToken, {}, {}));
      // } else {
          return this.http.get(this.DomainUrl.Domain + '/oauth/token?grant_type=refresh_token&client_id=my-trusted-client&refresh_token='
              + refreshToken);
      // }
  }


  authenticateUserManager(accessToken: string, subHeader: string) {
    this.accessToken = subHeader;
    // const httpOptions =  {
    //   headers: new HttpHeaders({
    //     'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description'
    //     Authorization: subHeader
    //   })};

    // if (this.platform.is('cordova')) {
    //     return from(this.httpN.get(this.DomainUrl.Domain + '/authentication/manage.ent?access-token=' + accessToken, {}, {'Authorization' : subHeader}));
    //   } else {
          return this.http.get(this.DomainUrl.Domain + '/authentication/manage.ent?access-token=' + accessToken);
      // }
  }

}
