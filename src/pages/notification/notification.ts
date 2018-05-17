import { Component } from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, ModalController, Platform, PopoverController
} from 'ionic-angular';
import {NotificationNewPage} from "../notification-new/notification-new";
import {NotificationService} from "../../services/notification";
import {PopoverNotificationCardPage} from "./popover_notification/popovernotificationcard";
import {Notifications} from "../../modles/notifications";
import {Storage} from "@ionic/storage";


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

  constructor(private alrtCtrl:AlertController,private platform:Platform,private storage:Storage,
              private modalCtrl: ModalController,private notificationService:NotificationService,
              private popoverCtrl: PopoverController, private load:LoadingController) {
    if(platform.is('core')) {
      notificationService.putHeader(localStorage.getItem(this.localStorageToken));
      this.getNotifications(this.notificationPage,0,0,null,null,null,0);
    }else {
      storage.get(this.localStorageToken).then(
        val=>{
          notificationService.putHeader(val);
          this.getNotifications(this.notificationPage,0,0,null,null,null,0);
        });
    }

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }


  onSelectCard(event:Event, id:number, title:string, details:string, i:any){
    let popover = this.popoverCtrl.create(PopoverNotificationCardPage, {id:id, title:title, details:details});
    popover.present({ev: event});
    popover.onDidDismiss(data => {
      console.log(data);
      if(data.done == 'deleteSuccess') {

        console.log(i);
        this.notifications.splice(i, 1);

      }else if (data.done == 'updateSuccess'){

        console.log(data.done);

      }else if(data.done == 'newSuccess'){

        console.log(data.done);

      }
    });
  }

  callAgain(){
    if(this.platform.is('core')) {
      this.notificationService.putHeader(localStorage.getItem(this.localStorageToken));
      this.getNotifications(this.notificationPage,0,0,null,null,null,0);
    }else {
      this.storage.get(this.localStorageToken).then(
        val=>{
          this.notificationService.putHeader(val);
          this.getNotifications(this.notificationPage,0,0,null,null,null,0);
        });
    }
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
