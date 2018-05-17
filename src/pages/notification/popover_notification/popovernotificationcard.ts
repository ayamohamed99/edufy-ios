import { Component } from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, NavController, NavParams, Platform,
  ViewController
} from 'ionic-angular';
import {NotificationService} from "../../../services/notification";
import {Storage} from "@ionic/storage";

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

    console.log("data is :"+this.notificationID+this.notificationTitle+this.notificationDetails);

    let plat=this.platform.is('core');

    if(plat){
      let token = localStorage.getItem(this.localStorageToken);
      notiServ.putHeader(token);
    }else{
      storage.get(this.localStorageToken).then(value => this.notiServ.putHeader(value));
    }


  }

  editNotification() {
    this.loading = this.load.create({
      content: 'Update this Notification...'
    });
    this.loading.present();
    this.viewCtrl.dismiss({done:'updateSuccess'});
    // this.notiServ.updateNotification(6094,'test','test').subscribe(
    //   (data) => {
    //     console.log("Date Is", data);
    //
    //     this.loading.dismiss();
    //   },
    //   err => {
    //     console.log("POST call in error", err);
    //     this.viewCtrl.dismiss({done:'updateFailed'});
    //     this.loading.dismiss();
    //     this.alrtCtrl.create( {
    //       title: 'Error',
    //       subTitle: err.message,
    //       buttons: ['OK']
    //     }).present();
    //   },
    //   () => {
    //     console.log("The POST observable is now completed.");
    //   });
    this.loading.dismiss();
    console.log("id: "+this.notificationID+", title: "+this.notificationTitle+", Details: "+this.notificationDetails);
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
            console.log('Buy clicked');
            this.loading = this.load.create({
              content: 'Delete this Notification...'
            });
            this.loading.present();
            this.notiServ.deleteNotification(this.notificationID.toString()).subscribe(
              (data) => {
                console.log("Date Is", data);
                this.loading.dismiss();
                this.viewCtrl.dismiss({done:'deleteSuccess'});
              },
              err => {
                console.log("POST call in error", err);
                this.loading.dismiss();
                this.alrtCtrl.create( {
                  title: 'Error',
                  subTitle: err.message,
                  buttons: ['OK']
                }).present();
                this.viewCtrl.dismiss({done:'deleteFailed'});
              },
              () => {
                console.log("The POST observable is now completed.");
              });
          }
        }
      ]
    }).present();
  }



  newNotification(){
    this.loading = this.load.create({
      content: 'Sending this Notification again...'
    });

    this.loading.present();

    this.viewCtrl.dismiss({done:'newSuccess'});

    // this.notiServ.postNotification('debug this mohamed', 'debug this mohamed please', null, null, null).subscribe(
    //   (data) => {
    //     console.log("Date Is", data);
    //
    //     this.loading.dismiss();

    //   },
    //   err => {
    //     console.log("POST call in error", err);
    //     this.loading.dismiss();
    //     this.viewCtrl.dismiss({done:'newFailed'});
    //     this.alrtCtrl.create( {
    //       title: 'Error',
    //       subTitle: err.message,
    //       buttons: ['OK']
    //     }).present();
    //   },
    //   () => {
    //         console.log("The POST observable is now completed.");
    //   });

    this.loading.dismiss();
    console.log("title: "+this.notificationTitle+", Details: "+this.notificationDetails);
  }


  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
            console.log(data.username, data.password);
          }
        }
      ]
    });
    alert.present();
  }


}
