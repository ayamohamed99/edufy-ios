import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Url_domain} from "../models/url_domain";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
// import { FCM } from '@ionic-native/fcm';
import {AccountService} from "./account";

@Injectable()
export class FCMService{

  DomainUrl:Url_domain;
  fcm;

  constructor(private http: HttpClient,private accountServ:AccountService) {
    this.DomainUrl=new Url_domain();
  }


  async getToken(){
   await this.fcm.getToken().then(token => {
      this.regster(token);
    });
  }

  async refreshToken(){
    await this.fcm.onTokenRefresh().subscribe(token => {
      this.regster(token);
    });
  }

  regster(token){
    console.log(token+",***********************,"+this.accountServ.userId);
  }

  onOpenNotification(){
    return this.fcm.onNotification();
  }

}
