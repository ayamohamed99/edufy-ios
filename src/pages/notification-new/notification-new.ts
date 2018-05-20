import { Component } from '@angular/core';
import {IonicPage, NavParams, Platform, ToastController, ViewController} from 'ionic-angular';
import {NotificationService} from "../../services/notification";
import { Network } from '@ionic-native/network';
import {AccountService} from "../../services/account";


@IonicPage()
@Component({
  selector: 'page-notification-new',
  templateUrl: 'notification-new.html',
})
export class NotificationNewPage {
  topics = [];
  Title:string;
  Details:string;
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

  tagsArr = [];

  constructor(public navParams: NavParams,public viewCtrl: ViewController,public notiServ:NotificationService,
              public network:Network,private toastCtrl: ToastController, private platform:Platform, private accServ:AccountService)
  {

    this.tagsArr = accServ.tagArry;
    this.Title =this.navParams.get('title');
    this.Details=this.navParams.get('details');


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

