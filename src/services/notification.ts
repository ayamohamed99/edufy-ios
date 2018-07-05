import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Platform} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {Url_domain} from "../modles/url_domain";

@Injectable()
export class NotificationService{

  DomainUrl:Url_domain;
  commonUrl= '/authentication/notification.ent';

  localStorageUserName:string = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword:string = 'LOCAL_STORAGE_PASSWORD';
  httpOptions:any;

  RESTORE_NOTIFICATION_OPERATION_ID = 5;
  REMOVEARCHIVE_NOTIFICATION_OPERATION_ID = 4;
  ARCHIVE_NOTIFICATION_OPERATION_ID = 3;
  APPROVE_NOTIFICATION_OPERATION_ID = 2;
  UPDATE_NOTIFICATION_OPERATION_ID = 1;

  constructor(private http: HttpClient,platform:Platform,storage:Storage)
  {
    this.DomainUrl = new Url_domain;
  }

  putHeader(value){
    this.httpOptions = {
            headers: new HttpHeaders({
              'content-type':'application/json',
              'Authorization': value
            })
    };
  }

  postNotification(title:string, body:string, attachment:any, notificationRecieversSet:any, selectedTags:any)
  {
    const newNotification = {
      "title": title,
      "body": body,
      "fbPostId": null,
      "attachmentsList": attachment,
      "receiversList": notificationRecieversSet,
      "tagsList": selectedTags
    };

    return this.http.post(this.DomainUrl.Domain+this.commonUrl,newNotification,this.httpOptions);
  }

  getNotification(pageNumber:number,userId:number,classId:number,approved:string,
                  archived:string,sent:string,tagId:number)
  {
    console.log('Domain',this.DomainUrl.Domain);
    let st:String = '/webApp.ent?page=' + pageNumber + '&userId=' + userId +
      '&classId=' + classId + '&approved=' + approved + '&archived=' + archived + '&sent=' + sent + '&tagId='
      + tagId;
    return this.http.get(this.DomainUrl.Domain+this.commonUrl + st, this.httpOptions);
  }

  updateNotification(id:number,title:string,body:string)
  {
    const newNotification = {
      "title": title,
      "body": body,
      "id": id
    };
    return this.http.put(this.DomainUrl.Domain+this.commonUrl+'?operationId='+this.UPDATE_NOTIFICATION_OPERATION_ID,
            newNotification,this.httpOptions);
  }

  deleteNotification(id:string)
  {
    return this.http.delete(this.DomainUrl.Domain+this.commonUrl+'?id='+id,this.httpOptions);
  }

  getNotificationReceivers(notificationId:number)
  {
    return this.http.get(this.DomainUrl.Domain+this.commonUrl+'/getCloneReceiever.ent?notificationId='
      +notificationId,this.httpOptions);
  }

  getSeencount(notificationId:number){
    return this.http.get(this.DomainUrl.Domain+this.commonUrl+'/webApp.ent/getSeencount.ent?notificationIds='
      +notificationId,this.httpOptions);
  }

  getClassList(){
    return this.http.get(this.DomainUrl.Domain+'/authentication/class.ent?view=NOTIFICATION' +
      '&operationId=' + this.APPROVE_NOTIFICATION_OPERATION_ID,this.httpOptions);
  }

}


