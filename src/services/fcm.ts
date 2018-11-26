import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Url_domain} from "../models/url_domain";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging';
import {AccountService} from "./account";
import {Platform} from "ionic-angular";
import { LocalNotifications } from '@ionic-native/local-notifications';

@Injectable()
export class FCMService{

  DomainUrl:Url_domain;

  constructor(private http: HttpClient,private accountServ:AccountService,private fcm: FirebaseMessaging,private localNotifications: LocalNotifications,private platform:Platform) {
    this.DomainUrl=new Url_domain();
  }


  async getToken(){
    if(this.platform.is('ios')){
      await this.fcm.requestPermission().then(
        token => {
          this.regster(token);
      });
    }else {
      await this.fcm.getToken().then(token => {
        this.regster(token);
      });
    }
  }

  async refreshToken(){
    await this.fcm.onTokenRefresh().subscribe(token => {
      this.regster(token);
    });
  }

  regster(token){
    console.log(token+",***********************,"+this.accountServ.userId);
  }

  onBackgroundNotification(){
    return this.fcm.onBackgroundMessage();
  }

  onForgroundNotification(){
    return this.fcm.onMessage();
  }

  setLocatNotification(title,body,data){
    let reportname,reportid ;
    if(data.page == "ReportPage") {
      reportname = data.reportName;
      reportid = data.reportId;
    }else{
      reportname = "";
      reportid = "";
    }

    this.localNotifications.schedule({
      title: title,
      text: body,
      foreground:true,
      data: {
        page:data.page,
        reportName:reportname,
        reportId:reportid
      }
    });
  }

  onOpenLocalNotification(){
    return this.localNotifications.on("click");
  }
}
