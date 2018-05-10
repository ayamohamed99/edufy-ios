import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Platform} from "ionic-angular";
import {Storage} from "@ionic/storage";

@Injectable()
export class NotificationService{

  commonUrl= '/authentication/notification.ent';
  httpOptions:any;
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  localStorageUserName:string = 'LOCAL_STORAGE_USERNAME';
  localStoragePassword:string = 'LOCAL_STORAGE_PASSWORD';

  RESTORE_NOTIFICATION_OPERATION_ID = 5;
  REMOVEARCHIVE_NOTIFICATION_OPERATION_ID = 4;
  ARCHIVE_NOTIFICATION_OPERATION_ID = 3;
  APPROVE_NOTIFICATION_OPERATION_ID = 2;
  UPDATE_NOTIFICATION_OPERATION_ID = 1;

  constructor(private http: HttpClient,platform:Platform,storage:Storage) {

    let subHeader:string;
    if(platform.is('core')){
      subHeader = localStorage.getItem(this.localStorageToken);
    }else {
      storage.get(this.localStorageToken).then(value => subHeader = value);
    }

    this.httpOptions =  {headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin' : 'http://localhost:8100',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Accept':'application/json',
        'content-type':'application/json',
        'Authorization' : subHeader
      })};
  }

  postNotification(title:string,body:string,attachment:any,notificationRecieversSet:any,selectedTags:any){
    const newNotification = {
      "title": title,
      "body": body,
      "fbPostId": null,
      "attachmentsList": attachment,
      "receiversList": notificationRecieversSet,
      "tagsList": selectedTags
    };
    return this.http.post(this.commonUrl,newNotification,this.httpOptions);
  }

  getNotification(pageNumber:number,userId:number,classId:number,approved:string,archived:string,sent:string,tagId:number){
    return this.http.get(this.commonUrl+'/webApp.ent?page=' + pageNumber + '&userId=' + userId +
      '&classId=' + classId + '&approved=' + approved + '&archived=' + archived + '&sent=' + sent + '&tagId='
      + tagId,this.httpOptions);
  }

  updateNotification(id:number,title:string,body:string){
    const newNotification = {
      "title": title,
      "body": body,
      "id": id
    };

    return this.http.put(this.commonUrl+'?operationId='+this.UPDATE_NOTIFICATION_OPERATION_ID,
      newNotification,this.httpOptions);
  }

  deleteNotification(id:string){
    return this.http.delete(this.commonUrl+'?id='
      +id,this.httpOptions);
  }

  getNotificationReceivers(notificationId:number){
    return this.http.get(this.commonUrl+'/webApp.ent/getSeencount.ent?notificationIds='
      +notificationId,this.httpOptions);
  }

}


