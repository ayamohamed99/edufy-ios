import { Component } from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';

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

  constructor(public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationNewPage');
  }


}
