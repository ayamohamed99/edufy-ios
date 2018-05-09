import { Component } from '@angular/core';
import {
  AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {NotificationNewPage} from "../notification-new/notification-new";
import {NotificationService} from "../../services/notification";


@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  users:any =[];
  notifications:any=[];
  notificationPage=0;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alrtCtrl:AlertController,
              public modalCtrl: ModalController,public notiServ:NotificationService) {
    this.notificationPage += this.notificationPage + 1;
    this.notificationsReciver();
    this.users = ['ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed','ahmed'];
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  onSelectCard(index:any){
    this.alrtCtrl.create( {
      title: 'Card Number',
      subTitle: index,
      buttons: ['OK']
  }).present();
  }


  onOpenView() {
    let model = this.modalCtrl.create(NotificationNewPage);
    model.present();
  }

  getNotifications(pageNumber:number,userId:number,classId:number,approved:string,archived:string,sent:string,tagId:number){
    this.notiServ.getNotification(pageNumber,userId,classId,approved,archived,sent,tagId).subscribe(
      (data) => {
        console.log("Date Is", data);
      },
      err => {
        console.log("POST call in error", err);
      },
      () => {
        console.log("The POST observable is now completed.");
      });
  }

  // deleteNotification() {
  //   this.notiServ.deleteNotification('6094').subscribe(
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

  // updatesNotification(){
  //   this.notiServ.updateNotification(6094,'test','test').subscribe(
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

  notificationsReciver(){
    this.notiServ.getNotificationReceivers(6094).subscribe(
      (data) => {
        console.log("Date Is", data);
      },
      err => {
        console.log("POST call in error", err);
      },
      () => {
        console.log("The POST observable is now completed.");
      });
  }
}
