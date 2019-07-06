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
export class NotificationService {

  DomainUrl: Url_domain;
  commonUrl = '/authentication/notification.ent';

  localStorageUserName = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword = 'LOCAL_STORAGE_PASSWORD';
  httpOptions: any;
  headers: any;

  RESTORE_NOTIFICATION_OPERATION_ID = 5;
  REMOVEARCHIVE_NOTIFICATION_OPERATION_ID = 4;
  ARCHIVE_NOTIFICATION_OPERATION_ID = 3;
  APPROVE_NOTIFICATION_OPERATION_ID = 2;
  UPDATE_NOTIFICATION_OPERATION_ID = 1;
  val: any;

  constructor(private http: HttpClient, private httpN: HTTP, private platform: Platform) {
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

  postNotification(title: string, body: string, attachment, notificationRecieversSet: any, selectedTags: any) {
    debugger;
    const newNotification = {
      title: title,
      body: body,
      fbPostId: null,
      attachmentsList: attachment,
      receiversList: notificationRecieversSet,
      tagsList: selectedTags
    };

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.post(this.DomainUrl.Domain + this.commonUrl, newNotification, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.post(this.DomainUrl.Domain + this.commonUrl, newNotification, this.httpOptions);
    // }
  }

  getNotification(pageNumber: number, userId: number, classId: number, approved, archived, sent, tagId: number) {
    const st: String = '/webApp.ent?page=' + pageNumber + '&userId=' + userId +
        '&classId=' + classId + '&approved=' + approved + '&archived=' + archived + '&sent=' + sent + '&tagId='
        + tagId;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + this.commonUrl + st, {}, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + this.commonUrl + st, this.httpOptions);
    // }

  }

  updateNotification(id: number, title: string, body: string) {
    const newNotification = {
      title: title,
      body: body,
      id: id
    };

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.put(this.DomainUrl.Domain + this.commonUrl + '?operationId=' + this.UPDATE_NOTIFICATION_OPERATION_ID, newNotification, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.put(this.DomainUrl.Domain + this.commonUrl + '?operationId=' + this.UPDATE_NOTIFICATION_OPERATION_ID,
          newNotification, this.httpOptions);
    // }

  }

  deleteNotification(id: string) {

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.delete(this.DomainUrl.Domain + this.commonUrl + '?id=' + id,{}, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.delete(this.DomainUrl.Domain + this.commonUrl + '?id=' + id, this.httpOptions);
    // }

    //   return Observable.fromPromise(this.httpM.delete(this.DomainUrl.Domain+this.commonUrl+'?id='+id,{},this.headers));
  }

  getNotificationReceivers(notificationId: number) {

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + this.commonUrl + '/getCloneReceiever.ent?notificationId='
    //       + notificationId,{}, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + this.commonUrl + '/getCloneReceiever.ent?notificationId='
          + notificationId, this.httpOptions);
    // }

  }

  getSeencount(notificationId: number) {

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + this.commonUrl + '/webApp.ent/getSeencount.ent?notificationIds='
    //       + notificationId,{}, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + this.commonUrl + '/webApp.ent/getSeencount.ent?notificationIds='
          + notificationId, this.httpOptions);
    // }

  }

  getClassList() {

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + this.commonUrl + '/authentication/class.ent?view=NOTIFICATION' +
    //       '&operationId=' + this.APPROVE_NOTIFICATION_OPERATION_ID,{}, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + '/authentication/class.ent?view=NOTIFICATION' +
          '&operationId=' + this.APPROVE_NOTIFICATION_OPERATION_ID, this.httpOptions);
    // }

  }


  postAttachment(data) {
    // debugger;
    const option = {
      headers: new HttpHeaders({
        'optional-header': 'header-value',
        Authorization: this.val
      })
    };

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.post( this.DomainUrl.Domain + '/authentication/uploadDownload.ent?view=NOTIFICATION'
    //       ,data, {'optional-header': 'header-value', 'Authorization': this.val}));
    // }else{
      return this.http.post(this.DomainUrl.Domain + '/authentication/uploadDownload.ent?view=NOTIFICATION',
          data,
          option);
    // }

  }




  editNotification(updateObject, operationId) {
    const requestURL = '/authentication/notification.ent?operationId=' + operationId;

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.put( this.DomainUrl.Domain + requestURL
    //       ,updateObject,
    //       {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.put(this.DomainUrl.Domain + requestURL, updateObject, this.httpOptions);
    // }

  }




  getRecieverList(notificationID) {


    // if(this.platform.is('cordova')){
    //   return from(this.httpN.get(this.DomainUrl.Domain + this.commonUrl + '/getReceiever.ent?notificationId=' + notificationID,
    //       {}, {'content-type': 'application/json', 'Authorization': this.val}));
    // }else{
      return this.http.get(this.DomainUrl.Domain + this.commonUrl + '/getReceiever.ent?notificationId=' + notificationID,
          this.httpOptions);
    // }

  }


}
