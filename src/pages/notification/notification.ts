import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {root} from "rxjs/util/root";


/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    root.whichPage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

}
