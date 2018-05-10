import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, ViewController} from 'ionic-angular';
import {NotificationService} from "../../../services/notification";

@IonicPage()
@Component({
  selector: 'page-popovernotificationcard',
  template: '<ion-list>\n' +
  '      <button ion-item (click)="editNotification()">Edit</button>\n' +
  '      <button ion-item (click)="deleteNotification()">Delete</button>\n' +
  '      <button ion-item (click)="newNotification()">Edit as new</button>\n' +
  '    </ion-list>'
})
export class PopoverNotificationCardPage {
  loading:any;
  constructor(public viewCtrl: ViewController, public notiServ:NotificationService,
              public load:LoadingController, public alrtCtrl:AlertController) {}

  editNotification() {
    this.viewCtrl.dismiss();
  }



  deleteNotification() {
    this.viewCtrl.dismiss();
    this.loading = this.load.create({
      content: 'Please wait...'
    });
    this.loading.present();

    this.notiServ.deleteNotification('6094').subscribe(
      (data) => {
        console.log("Date Is", data);
        this.loading.dismiss();
      },
      err => {
        console.log("POST call in error", err);
        this.loading.dismiss();
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



  newNotification(){
    this.viewCtrl.dismiss();
  }

}
