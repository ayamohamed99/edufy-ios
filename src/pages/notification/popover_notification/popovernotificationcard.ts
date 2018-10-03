import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {NotificationService} from "../../../services/notification";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-popovernotificationcard',
  templateUrl: 'popovernotificationcard.html',
})
export class PopoverNotificationCardPage {
  loading:any;
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  notificationID:number;
  notificationTitle:string;
  notificationDetails:string;

  constructor(public navCtrl: NavController,public navParams:NavParams,public viewCtrl: ViewController,
              public platform:Platform,public storage:Storage,public alertCtrl:AlertController,
              public notiServ:NotificationService, public load:LoadingController, public alrtCtrl:AlertController)
  {

    this.notificationID = this.navParams.get('id');
    this.notificationTitle = this.navParams.get('title');
    this.notificationDetails = this.navParams.get('details');


    let plat=this.platform.is('core');

    if(plat){
      let token = localStorage.getItem(this.localStorageToken);
      notiServ.putHeader(token);
    }else{
      storage.get(this.localStorageToken).then(value => this.notiServ.putHeader(value));
    }


  }

  editNotification() {
    this.viewCtrl.dismiss({done:'updateSuccess',id:this.notificationID,title:this.notificationTitle,
      details:this.notificationDetails});

  }


  deleteNotification() {
    this.alrtCtrl.create({
      title: 'Delete',
      subTitle: 'Are you sure that you want to delete this notification ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.loading = this.load.create({
              content: 'Delete this Notification...'
            });
            this.loading.present();
            this.notiServ.deleteNotification(this.notificationID.toString()).subscribe(
              (data) => {
                this.loading.dismiss();
                this.viewCtrl.dismiss({done:'deleteSuccess'});
              },
              err => {
                this.loading.dismiss();
                this.alrtCtrl.create( {
                  title: 'Error',
                  subTitle: err.message,
                  buttons: ['OK']
                }).present();
                this.viewCtrl.dismiss({done:'deleteFailed'});
              },
              () => {
              });
          }
        }
      ]
    }).present();
  }

  newNotification(){
    this.viewCtrl.dismiss({done:'newSuccess'});
  }

}
