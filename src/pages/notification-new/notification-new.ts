import { Component } from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';
import {NotificationService} from "../../services/notification";

/**
 * Generated class for the NotificationNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-new',
  templateUrl: 'notification-new.html',
})
export class NotificationNewPage {
  topics = [];
  name: string;
  talks = [];
  preparedTags = [
    '#Ionic',
    '#Angular',
    '#Javascript',
    '#Mobile',
    '#Hybrid',
    '#CrossPlatform'
  ];

  constructor(public viewCtrl: ViewController,public notiServ:NotificationService) {}

  sendNotification() {
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
      });;
  }

  deleteNotification(){
    this.talks.push({name: this.name, topics: this.topics});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationNewPage');
  }


}

