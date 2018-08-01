import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {NotificationService} from "../../../../services/notification";
import {FormControl} from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-notification-edit',
  templateUrl: 'notification-edit.html',
})
export class NotificationEditPage {

  notificationID:number;
  notificationTitle:string;
  notificationDetails:string;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,
              public load:LoadingController, public alrtCtrl:AlertController, public notiServ:NotificationService) {
    this.notificationID=this.navParams.get('id');
    this.notificationTitle =this.navParams.get('title');
    this.notificationDetails=this.navParams.get('details');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationEditPage');
  }

  close(){
    this.viewCtrl.dismiss({name:'dismissed'});
  }

  updateNotify(form:NgForm){
    let loading = this.load.create({
      content: 'Update this Notification...'
    });
    loading.present();
    this.notiServ.updateNotification(this.notificationID,form.value.notifyTitle,form.value.notifyDetails).subscribe(
      (data) => {
        console.log("Date Is", data);
        this.viewCtrl.dismiss({done:'updateSuccess'});
        loading.dismiss();
      },
      err => {
        console.log("POST call in error", err);
        this.viewCtrl.dismiss({done:'updateFailed'});
        loading.dismiss();
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
}
