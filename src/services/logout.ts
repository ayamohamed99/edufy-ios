import {Injectable} from "@angular/core";
import {Url_domain} from "../modles/url_domain";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class LogoutService {
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  localStorageUserName:string = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword:string = 'LOCAL_STORAGE_PASSWORD';
  accessToken:string;
  DomainUrl:Url_domain;
  httpOptions:any;

  constructor(private http: HttpClient) {this.DomainUrl = new Url_domain;}

  putHeader(value){
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-type':'application/json',
        'Authorization': value
      })
    };
  }

  postlogout(subscriptionId:any, refreshToken:any, accessToken:any) {
    return this.http.post(this.DomainUrl.Domain+'/authentication/authenticator.ent/logout.ent?subscriptionId='+subscriptionId
      +'&refreshToken='+refreshToken+'&accessToken='+accessToken, null,this.httpOptions);
  }

}
