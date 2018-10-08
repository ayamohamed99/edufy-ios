import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AccountService} from "../../services/account";

/**
 * Generated class for the NotificationViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notification-view-receiver',
  templateUrl: 'notification-view-receiver.html',
})
export class NotificationViewReceiver {

  receivers;
  notification;
  receiverListStudents = [];
  branchesNumber = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController,private accountServ:AccountService) {
    this.notification = this.navParams.get('notification');
    this.receivers = this.navParams.get('notification').receiversList;
    this.branchesNumber = this.accountServ.accountBranchesList.length;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationViewPage');
  }

  close(){
    this.viewCtrl.dismiss({name:'dismissed'});
  }
}
