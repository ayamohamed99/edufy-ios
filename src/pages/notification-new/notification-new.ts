import { Component } from '@angular/core';
import {IonicPage, ToastController, ViewController} from 'ionic-angular';
import {NotificationService} from "../../services/notification";
import { Network } from '@ionic-native/network';


@IonicPage()
@Component({
  selector: 'page-notification-new',
  templateUrl: 'notification-new.html',
})
export class NotificationNewPage {
  topics = [];
  name: string;
  talks = [];
  tags = [];
  preparedTags = [
    '#Ionic',
    '#Angular',
    '#Javascript',
    '#Java',
    '#Swift',
    '#Android',
    '#IOS',
    '#Objective C',
    '#Mobile',
    '#Hybrid',
    '#CrossPlatform'
  ];

  constructor(public viewCtrl: ViewController,public notiServ:NotificationService, public network:Network,
              private toastCtrl: ToastController)
  {
    this.isConnected();
  }

  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }
  sendNotification() {

    if(this.isConnected()){
      this.talks.push({name: this.name, topics: this.topics});
      this.notiServ.postNotification('debug this mohamed','debug this mohamed please',null,null,null).subscribe(
        (data) => {
          console.log("Date Is", data);
        },
        err => {
          console.log("POST call in error", err);
        },
        () => {
          console.log("The POST observable is now completed.");
        });
    }else{
      this.toastCtrl.create({
        message: 'NO Internet connection',
        position: 'bottom',
        showCloseButton:true,
        closeButtonText:'OK',

      }).present();
    }

  }

  deleteNotification(){
    this.talks.push({name: this.name, topics: this.topics});
  }

  close(){
    this.viewCtrl.dismiss({name:'dismissed'});
  }

  activeSend(){
    return true;
  }
}

