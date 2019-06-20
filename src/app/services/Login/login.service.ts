import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// import 'rxjs/add/operator/map';
import {Url_domain} from '../../models/url_domain';
// import 'rxjs/add/observable/fromPromise';
// import 'rxjs/add/operator/mergeMap';
import {Platform} from '@ionic/angular';
import {HTTP} from '@ionic-native/http/ngx';
import {from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  localStorageToken = 'LOCAL_STORAGE_TOKEN';
  localStorageAccessToken = 'LOCAL_STORAGE_ACCESS_TOKEN';
  localStorageUserName = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword = 'LOCAL_STORAGE_PASSWORD';
  accessToken: string;
  DomainUrl: Url_domain = new Url_domain;


  constructor(private http: HttpClient,private httpN: HTTP, private platform: Platform) {
  }

  postlogin(username: string, password: string) {
      if(this.platform.is('cordova')){
          return from(this.httpN.post(this.DomainUrl.Domain + '/oauth/token?grant_type=password&client_id=my-trusted-client&password='
              + password + '&username=' + username, {},{}));
      }else {
          return this.http.post(this.DomainUrl.Domain + '/oauth/token?grant_type=password&client_id=my-trusted-client&password='
              + password + '&username=' + username, null);
      }
  }

  authenticateUserByRefreshToken(refreshToken: string) {
      if(this.platform.is('cordova')) {
          return from(this.httpN.get(this.DomainUrl.Domain + '/oauth/token?grant_type=refresh_token&client_id=my-trusted-client&refresh_token='
              + refreshToken,{},{}));
      }else{
          return this.http.get(this.DomainUrl.Domain + '/oauth/token?grant_type=refresh_token&client_id=my-trusted-client&refresh_token='
              + refreshToken);
      }
  }


  authenticateUserManager(accessToken: string, subHeader: string) {
    this.accessToken = subHeader;
    const httpOptions =  {
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin' : 'http://localhost:8100',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Accept':'application/json',
        // 'content-type':'application/json',
        Authorization : subHeader
      })};

      if(this.platform.is('cordova')) {
          return from(this.httpN.get(this.DomainUrl.Domain + '/authentication/manage.ent?access-token=' + accessToken,{}, httpOptions));
      }else {
          return this.http.get(this.DomainUrl.Domain + '/authentication/manage.ent?access-token=' + accessToken, httpOptions);
      }
  }

}
