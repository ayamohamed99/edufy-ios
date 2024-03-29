import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Url_domain} from '../../models/url_domain';
// import 'rxjs/add/observable/fromPromise';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/mergeMap';
import {AccountService} from '../Account/account.service';
import {Platform} from '@ionic/angular';
import {LoginService} from '../Login/login.service';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {FirebaseMessaging} from '@ionic-native/firebase-messaging/ngx';
import {HTTP} from '@ionic-native/http/ngx';
import {from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FCMService {

  DomainUrl: Url_domain;
  Token;


  constructor(private http: HttpClient, private httpN: HTTP, private accountServ: AccountService, private fcm: FirebaseMessaging,
              private localNotifications: LocalNotifications, private platform: Platform, private loginServ: LoginService) {
    this.DomainUrl = new Url_domain();
  }


  async getToken() {
    if (this.platform.is('ios')) {
      await this.fcm.requestPermission().then(
          tokens => {
            this.fcm.getToken('apns-string').then(token => {
              this.Token = token;
              this.sendTokenToServer();
            });
          });
    } else {
      await this.fcm.getToken().then(token => {
        this.Token = token;
        this.sendTokenToServer();
      });
    }
  }

  async refreshToken() {
    await this.fcm.onTokenRefresh().subscribe(token => {
      this.Token = token;
      this.sendTokenToServer();
    });
  }

  sendTokenToServer() {
    console.log(this.Token + ',***********************,' + this.accountServ.userId + '*************' + this.accountServ.userBranchId);
    const httpOptions =  {
      headers: new HttpHeaders({
        Authorization : this.loginServ.accessToken
      })};

    const body = {
      branchId: this.accountServ.userBranchId,
      userId: this.accountServ.userId,
      gcmRegKey: this.Token
    };



    // if(this.platform.is('cordova')){
    //   from(this.httpN.post(this.DomainUrl.Domain + '/authentication/regedufyfcmtoken.ent', body, {'Authorization' : this.loginServ.accessToken})).subscribe(
    //       (val) => {
    //         console.log(val);
    //       }, (err) => {
    //         console.log(err);
    //         this.sendTokenToServer();
    //       });
    // }else{
    if(this.platform.is('ios')){
      const body = {
        branchId: this.accountServ.userBranchId,
        userId: this.accountServ.userId,
        deviceToken: this.Token
      };
      this.http.post(this.DomainUrl.Domain + '/authentication/regedufyApnstoken.ent', body, httpOptions).subscribe(
        (val) => {
          console.log(val);
        }, (err) => {
          console.log(err);
          this.sendTokenToServer();
        });
    }else{
      this.http.post(this.DomainUrl.Domain + '/authentication/regedufyfcmtoken.ent', body, httpOptions).subscribe(
        (val) => {
          console.log(val);
        }, (err) => {
          console.log(err);
          this.sendTokenToServer();
        });
    }
      
    // }



  }

  onBackgroundNotification() {
    return this.fcm.onBackgroundMessage();
  }

  onForgroundNotification() {
    debugger;
    return this.fcm.onMessage();
  }

  setLocatNotification(title, body, data) {
    console.log('ForGround Notification : \n', data);
    let reportname, reportid, chatMessage;
    if (data.page == 'ReportPage') {
      reportname = data.reportName;
      reportid = data.reportId;
      chatMessage = '';
    } else if (data.page == 'ChatPage') {
      reportname = '';
      reportid = '';
      chatMessage = data.chatMessage;
    } else {
      reportname = '';
      reportid = '';
      chatMessage = '';
    }


    this.localNotifications.schedule({
      title,
      text: body,
      foreground: true,
      data: {
        page: data.page,
        reportName: reportname,
        reportId: reportid,
        reportDate: data.reportDate,
        classId: data.classId,
        chatMessage,
        medicationName: data.medicationName,
        dosageType: data.dosageType,
        dosageNumber: data.dosageNumber,
        shceduleId: data.shceduleId,
        medicationTime: data.medicationTime,
        medicationNextTime: data.medicationNextTime,
        student: {
          id: data.studentId,
          name: data.studentName
        },
        class:{
          id: data.classId
        }
      }
    });
  }

  onOpenLocalNotification() {
    return this.localNotifications.on('click');
  }


}
