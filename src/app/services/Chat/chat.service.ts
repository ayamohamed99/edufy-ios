import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// import 'rxjs/add/operator/map';
import {Url_domain} from '../../models/url_domain';
// import 'rxjs/add/observable/fromPromise';
// import 'rxjs/add/operator/mergeMap';
import {Platform} from '@ionic/angular';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {HTTP} from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  DomainUrl: Url_domain;
  commonUrl = '/authentication/chat.ent';

  httpOptions: any;
  headers: any;
  val: any;

  NewChats: any[] = [];
  newMessageSubject$: BehaviorSubject<object> = new BehaviorSubject(null);

  constructor(private http: HttpClient, private httpN: HTTP,private platform: Platform) {
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

  sendChat(studentId, theMessage, teacherId, teacherName) {

    const student = {student: {id: studentId}};
    const sender = {
      id: teacherId,
      name: teacherName
    };

    const message = {
      chatThread: student,
      message: theMessage,
      user: sender
    };

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.post(this.DomainUrl.Domain + this.commonUrl + '?operationId=1',
    //       message, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.post(this.DomainUrl.Domain + this.commonUrl + '?operationId=1', message, this.httpOptions);
    // }

  }

  getNewMessages() {
    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + 'authentication/chat.ent?operationId=1',{},{'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + 'authentication/chat.ent?operationId=1', this.httpOptions);
    // }
  }

  getChatMessagesHistory(studentId, branchId) {
    let requestURL = this.commonUrl + '?operationId=3';

    if (studentId != null) {
      requestURL += '&studentId=' + studentId;
    }

    if (branchId != null) {
      requestURL += '&branchId=' + branchId;
    }

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + requestURL, {} ,{'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + requestURL, this.httpOptions);
    // }
  }
}
