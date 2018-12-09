import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Platform,
  ViewController
} from 'ionic-angular';
import {FormControl, NgForm} from "@angular/forms";
import {NotificationService} from "../../../../services/notification";

@IonicPage()
@Component({
  selector: 'page-notification-edit',
  templateUrl: 'notification-edit.html',
})
export class NotificationEditPage {

  notificationID:number;
  notificationTitle:string;
  notificationDetails:string;
  notificationAttach:any[] = [];
  notificationUser:string;
  TheNotification;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,
              public load:LoadingController, public alrtCtrl:AlertController, public notiServ:NotificationService,
              private platform:Platform) {
    this.TheNotification=this.navParams.get('notification');
    this.notificationID=this.TheNotification.notificationId;
    this.notificationTitle =this.TheNotification.title;
    this.notificationDetails=this.TheNotification.body;
    this.notificationAttach = this.TheNotification.attachmentsList;
    this.notificationUser = this.TheNotification.senderName;
    console.log("Attacment");
    console.log(this.TheNotification);
  }

  ionViewDidLoad() {
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
        this.viewCtrl.dismiss({done:'updateSuccess'});
        loading.dismiss();
      },
      err => {
        this.viewCtrl.dismiss({done:'updateFailed'});
        loading.dismiss();
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      },
      () => {
      });
  }

}
