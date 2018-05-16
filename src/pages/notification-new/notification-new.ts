import { Component } from '@angular/core';
import {IonicPage, Platform, ToastController, ViewController} from 'ionic-angular';
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

  constructor(public viewCtrl: ViewController,public notiServ:NotificationService, public network:Network,private toastCtrl: ToastController, private platform:Platform)
  {
    console.log('NetWork '+network.type);

    let disconnectSubscription = this.network.onDisconnect().subscribe(() => console.log('network was disconnected :-('));
    console.log('Network '+disconnectSubscription );

    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
    console.log('Network '+connectSubscription );
  }

  sendNotification() {

    if (this.network.type === 'wifi' && !this.platform.is('core')) {
      this.talks.push({name: this.name, topics: this.topics});
      this.notiServ.postNotification('debug this mohamed', 'debug this mohamed please', null, null, null).subscribe(
        (data) => {
          console.log("Date Is", data);
        },
        err => console.log("POST call in error", err),
        () => console.log("The POST observable is now completed."));
    } else if (this.platform.is('core')){

      this.talks.push({name: this.name, topics: this.topics});
      this.notiServ.postNotification('debug this mohamed', 'debug this mohamed please', null, null, null).subscribe(
        (data) => {
          console.log("Date Is", data);
        },
        err => console.log("POST call in error", err),
        () => console.log("The POST observable is now completed."));
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

