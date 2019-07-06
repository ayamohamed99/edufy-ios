import { Injectable } from '@angular/core';
import {Url_domain} from '../../models/url_domain';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// import 'rxjs/add/observable/fromPromise';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/mergeMap';
import {Platform} from '@ionic/angular';
import {HTTP} from '@ionic-native/http/ngx';
import {from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  localStorageToken = 'LOCAL_STORAGE_TOKEN';
  localStorageUserName = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword = 'LOCAL_STORAGE_PASSWORD';
  accessToken: string;
  DomainUrl: Url_domain;
  httpOptions: any;
  val:any;
  headers: any;

  constructor(private http: HttpClient, private httpN:HTTP, private platform: Platform) {
    this.DomainUrl = new Url_domain;
  }

  putHeader(value) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        Authorization: value
      })
    };
    this.val = value;
  }

  postlogout(subscriptionId: any, refreshToken: any, accessToken: any) {

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.post(this.DomainUrl.Domain + '/authentication/authenticator.ent/logout.ent?subscriptionId=' + subscriptionId
    //       + '&refreshToken=' + refreshToken + '&accessToken=' + accessToken, {}, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.post(this.DomainUrl.Domain + '/authentication/authenticator.ent/logout.ent?subscriptionId=' + subscriptionId
          + '&refreshToken=' + refreshToken + '&accessToken=' + accessToken, null, this.httpOptions);
    // }
  }

}
