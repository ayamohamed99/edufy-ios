import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AccountService} from "../../services/account";
import {NotificationService} from "../../services/notification";

/**
 * Generated class for the NotificationViewPage page.

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
  originalReceiverListStudents = [];
  branchesNumber = 0;
  searchItems = [];
  classesList = {"className":'',"studentsList":[]};

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController,
              private accountServ:AccountService,private notificationServ:NotificationService) {
    this.notification = this.navParams.get('notification');
    this.receivers = this.navParams.get('notification').receiversList;
    this.branchesNumber = this.accountServ.accountBranchesList.length;
    this.getReceivers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationViewReceiver');
  }

  close(){
    this.viewCtrl.dismiss({name:'dismissed'});
  }

  downloadReceiversPdf(){

  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.originalReceiverListStudents = [];

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.searchItems = this.searchItems.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }


  getReceivers(){
    this.notificationServ.getRecieverList(this.notification.notificationId).subscribe(
      response =>{
        let Data = response;

      },err =>{

      }
    );
  }
}
