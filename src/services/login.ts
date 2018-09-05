import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';
import {Url_domain} from "../models/url_domain";
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Platform} from "ionic-angular";
import {RequestOptions} from "@angular/http";

@Injectable()
export class LoginService {

  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  localStorageAccessToken:string = 'LOCAL_STORAGE_ACCESS_TOKEN';
  localStorageUserName:string = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword:string = 'LOCAL_STORAGE_PASSWORD';
  accessToken:string;
  DomainUrl:Url_domain = new Url_domain;


  constructor(private http: HttpClient, private platform:Platform) {
  }

  postlogin(username: string, password: string) {
      return this.http.post(this.DomainUrl.Domain + '/oauth/token?grant_type=password&client_id=my-trusted-client&password='
        + password + '&username=' + username, null);
  }

  authenticateUserByRefreshToken(refreshToken:string){
      return this.http.get(this.DomainUrl.Domain + '/oauth/token?grant_type=refresh_token&client_id=my-trusted-client&refresh_token='
        + refreshToken);
  }


  authenticateUserManager(accessToken:string,subHeader:string){
    const httpOptions =  {
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin' : 'http://localhost:8100',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Accept':'application/json',
        // 'content-type':'application/json',
        'Authorization' : subHeader
      })};
    return this.http.get(this.DomainUrl.Domain + '/authentication/manage.ent?access-token=' + accessToken,httpOptions);
  }


}
