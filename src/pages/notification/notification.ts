import { Component } from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, ModalController, Platform, PopoverController
} from 'ionic-angular';
import {NotificationNewPage} from "../notification-new/notification-new";
import {NotificationService} from "../../services/notification";
import {PopoverNotificationCardPage} from "./popover_notification/popovernotificationcard";
import {Notifications} from "../../modles/notifications";
import {Storage} from "@ionic/storage";
import {NotificationEditPage} from "./popover_notification/notification-edit/notification-edit";
import {AccountService} from "../../services/account";


@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  notifications:Notifications[] = [];
  notificationPage=1;
  loading:any;
  fristOpen:boolean = true;
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  tokenKey:string;
  tagsArr:any = [];

  constructor(private alrtCtrl:AlertController,private platform:Platform,private storage:Storage,
              private modalCtrl: ModalController,private notificationService:NotificationService,
              private popoverCtrl: PopoverController, private load:LoadingController, private accService:AccountService) {
    if(platform.is('core')) {
      this.tokenKey = localStorage.getItem(this.localStorageToken);
      notificationService.putHeader(localStorage.getItem(this.localStorageToken));
      this.getNotifications(this.notificationPage,0,0,null,null,null,0);
    }else {
      storage.get(this.localStorageToken).then(
        val=>{
          this.tokenKey = val;
          notificationService.putHeader(val);
          this.getNotifications(this.notificationPage,0,0,null,null,null,0);
        });
    }
    this.tagsArr = accService.accountBranchesList;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  onSelectCard(event:Event, id:number, title:string, details:string, i:any){
    let popover = this.popoverCtrl.create(PopoverNotificationCardPage, {id:id, title:title, details:details});

    popover.onDidDismiss(data => {
      console.log(data);
      if(data.done === 'deleteSuccess') {
        this.fristOpen = true;
        this.notifications.splice(0)
        this.notificationPage = 1;

        this.notificationService.putHeader(this.tokenKey);
        this.getNotifications(this.notificationPage,0,0,null,null,null,0);

      }else if (data.done === 'updateSuccess'){
        console.log(data.done);
        this.fristOpen = true;

        let model = this.modalCtrl.create(NotificationEditPage,{id:data.id,title:data.title,
          details:data.details});
        model.onDidDismiss(()=>{
          this.notifications.splice(0)
          this.notificationPage = 1;

          this.notificationService.putHeader(this.tokenKey);
          this.getNotifications(this.notificationPage,0,0,null,null,null,0);
        });
        model.present();

      }else if(data.done === 'newSuccess'){
        this.fristOpen = true;
        console.log(data.done);
        let model = this.modalCtrl.create(NotificationNewPage,{id:id,title:title, details:details});
        model.onDidDismiss(()=>{
          this.notifications.splice(0)
          this.notificationPage = 1;

          this.notificationService.putHeader(this.tokenKey);
          this.getNotifications(this.notificationPage,0,0,null,null,null,0);
        });
        model.present();

      }
    });

    popover.present({ev: event});
  }

  onOpenView() {
    let model = this.modalCtrl.create(NotificationNewPage);
    model.present();
  }

  getNotifications(pageNumber:number,userId:number,classId:number,approved:string,archived:string,sent:string,tagId:number){
    if(this.fristOpen) {
      this.loading = this.load.create({
        content: 'Loading Notification...'
      });
      this.loading.present();
      this.fristOpen = false;
    }

    this.notificationService.getNotification(pageNumber,userId,classId,approved,archived,sent,tagId).subscribe(
      (data) => {
        console.log("Date Is", data);
        let allData:any = data;
        for (let value of allData){
          let notify = new Notifications;
          notify.attachmentsList = value.attachmentslist;
          notify.body = value.body;
          notify.dateTime =  value.dateTime;
          notify.notificationId = value.id;
          notify.title = value.title;
          notify.receiversList = value.receiversList;
          notify.senderName = value.senderName;

          this.notifications.push(notify);
        }
        this.loading.dismiss();
      },
      err => {
        console.log("POST call in error", err);
        this.loading.dismiss();
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      },
      () => {
        console.log("The POST observable is now completed.");
      });
  }

  doInfinite(){
    console.log('Begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {

        this.notificationPage += this.notificationPage + 1;
        this.getNotifications(this.notificationPage,0,0,null,null,null,0);

        console.log('Async operation has ended');
        resolve();
      }, 500);
    })
  }


  // notificationsReciver(){
  //   this.notificationService.getNotificationReceivers(6094).subscribe(
  //     (data) => {
  //       console.log("Date Is", data);
  //     },
  //     err => {
  //       console.log("POST call in error", err);
  //     },
  //     () => {
  //       console.log("The POST observable is now completed.");
  //     });
  // }

}
