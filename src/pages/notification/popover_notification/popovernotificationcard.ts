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
import {NotificationService} from "../../../services/notification";
import {Storage} from "@ionic/storage";
import {NotificationNewPage} from "../../notification-new/notification-new";
import {AccountService} from "../../../services/account";
import {Notification} from "../../../models/notification";

@IonicPage()
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
  notification;
  Archiving:string;

  constructor(public navCtrl: NavController,public navParams:NavParams,public viewCtrl: ViewController,
              public platform:Platform,public storage:Storage,public alertCtrl:AlertController,public accountServ:AccountService,
              public notiServ:NotificationService, public load:LoadingController, public alrtCtrl:AlertController,
              public notificationService:NotificationService)
  {

    this.notification = this.navParams.get('notification');
    this.notificationID = this.notification.notificationId;
    this.notificationTitle = this.notification.title;
    this.notificationDetails = this.notification.body;
    if(this.notification.archived){
      this.Archiving = "Restore";
    }else{
      this.Archiving = "Archive";
    }


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
      subTitle: 'Are you sure that you want to delete this notification?',
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

  archiveNotification() {
    let index;
    let approvedNotification = this.notification;
    // get select notification to
    if (approvedNotification.approved == true) {
      // archive it
      if (approvedNotification.archived == true) {

        let confirm = this.alrtCtrl.create({
          message: "Do you want to restore this Notification? ",
          buttons: [
            {
              text: 'No',
              handler: () => {
                console.log('Disagree clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                // select notification to approve it
                let sentNotification = {
                  "id": approvedNotification.notificationId,
                };
                this.loading = this.load.create({
                  content: "Restoring Notification"
                });
                this.loading.present();

                /* messageService.operationMessage(messageService.messageSubject.archivingTitle,messageService.messageSubject.archivingingOperationMessage); */
                this.notificationService.editNotification(sentNotification, 4).subscribe(
                  (response) => {
                    approvedNotification.archived = false;
                    this.viewCtrl.dismiss({done:'restored',archived:false,tostmsg:'Notification restored successfully.'});
                    // this.notificationPage = 1;
                    // this.getNotification(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
                    this.loading.dismiss();
                  },  (reason) => {

                    this.viewCtrl.dismiss({done:'restored',archived:true,tostmsg:'Problem deleting notifications from archive.'});
                    console.error('Error: notification.module>NotificationCtrl>archiveNotification> cannot send notification -  ' + reason);
                    this.loading.dismiss();
                  });
              }
            }
          ]
        });
        confirm.present();
      } else {
        this.loading = this.load.create({
          content: "Archive Notification"
        });
        this.loading.present();
        /* messageService.operationMessage(messageService.messageSubject.archivingTitle,messageService.messageSubject.archivingingOperationMessage); */
        let sentNotification = {
          "id": approvedNotification.notificationId,
        };
        // calling update service.
        this.notificationService.editNotification(sentNotification, 3).subscribe(
          (response) => {
            this.viewCtrl.dismiss({done:'archive',archived:true,tostmsg:'Notification archived successfully.'});
            // this.notificationPage = 1;
            // this.getNotification(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
            this.loading.dismiss();
          },(reason) => {
            this.viewCtrl.dismiss({done:'archive',archived:false,tostmsg:'Problem archiving notifications.'});
            this.loading.dismiss();
            console.error('Error: notification.module>NotificationCtrl>archiveNotification> cannot send notification -  ' + reason);
          });
      }
    } else {
      let confirm = this.alrtCtrl.create({
        message: 'Notification need to be approved first.',
        buttons: ['Ok']
      });
      confirm.present();
    }
  }

}
