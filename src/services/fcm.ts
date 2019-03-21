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
import {LoginService} from "./login";

@Injectable()
export class FCMService{

  DomainUrl:Url_domain;
  Token;


  constructor(private http: HttpClient,private accountServ:AccountService,private fcm: FirebaseMessaging,
              private localNotifications: LocalNotifications,private platform:Platform,private loginServ:LoginService) {
    this.DomainUrl=new Url_domain();
  }


  async getToken(){
    if(this.platform.is('ios')){
      await this.fcm.requestPermission().then(
        tokens => {
          this.fcm.getToken().then(token => {
            this.Token = token;
            this.sendTokenToServer();
          });
      });
    }else {
      await this.fcm.getToken().then(token => {
        this.Token = token;
        this.sendTokenToServer();
      });
    }
  }

  async refreshToken(){
    await this.fcm.onTokenRefresh().subscribe(token => {
      this.Token = token;
      this.sendTokenToServer();
    });
  }

  sendTokenToServer(){
    console.log(this.Token + ",***********************," + this.accountServ.userId + "*************" + this.accountServ.userBranchId);
    const httpOptions =  {
      headers: new HttpHeaders({
        'Authorization' : this.loginServ.accessToken
      })};

    const body = {
      "branchId":this.accountServ.userBranchId,
      "userId":this.accountServ.userId,
      "gcmRegKey":this.Token
    };

    this.http.post(this.DomainUrl.Domain+"/authentication/regedufyfcmtoken.ent",body,httpOptions).subscribe(
      (val) =>{
        console.log(val);
      },(err)=>{
        console.log(err);
        this.sendTokenToServer();
      });
  }

  onBackgroundNotification(){
    return this.fcm.onBackgroundMessage();
  }

  onForgroundNotification(){
    debugger;
    return this.fcm.onMessage();
  }

  setLocatNotification(title,body,data){
    console.log("ForGround Notification : \n", data);
    let reportname,reportid,chatMessage;
    if(data.page == "ReportPage") {
      reportname = data.reportName;
      reportid = data.reportId;
      chatMessage="";
    }else if(data.page == "ChatPage"){
      reportname = "";
      reportid = "";
      chatMessage=data.chatMessage;
    } else{
      reportname = "";
      reportid = "";
      chatMessage="";
    }


    this.localNotifications.schedule({
      title: title,
      text: body,
      foreground:true,
      data: {
        page:data.page,
        reportName:reportname,
        reportId:reportid,
        chatMessage:chatMessage,
        medicationName: data.medicationName,
        dosageType: data.dosageType,
        dosageNumber: data.dosageNumber,
        shceduleId:data.shceduleId,
        medicationTime:data.medicationTime,
        medicationNextTime:data.medicationNextTime,
        student:data.student
      }
    });
  }

  onOpenLocalNotification(){
    return this.localNotifications.on("click");
  }
}
