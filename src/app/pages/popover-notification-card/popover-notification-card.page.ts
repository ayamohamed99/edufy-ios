import { Component, OnInit } from '@angular/core';
import {AlertController, NavParams, Platform, PopoverController} from '@ionic/angular';
import {AccountService} from '../../services/Account/account.service';
import {NotificationService} from '../../services/Notification/notification.service';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import {Storage} from "@ionic/storage";

@Component({
  selector: 'app-popover-notification-card',
  templateUrl: './popover-notification-card.page.html',
  styleUrls: ['./popover-notification-card.page.scss'],
})
export class PopoverNotificationCardPage implements OnInit {

  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  notificationID:number;
  notificationTitle:string;
  notificationDetails:string;
  notification;
  Archiving:string;

  constructor(public navParams:NavParams,public popOver:PopoverController,
              public platform:Platform,public storage:Storage,public alertCtrl:AlertController,public accountServ:AccountService,
              public notiServ:NotificationService, public load:LoadingViewService,
              public notificationService:NotificationService) {
    let plat=this.platform.is('desktop');

    if(plat){
      let token = localStorage.getItem(this.localStorageToken);
      notiServ.putHeader(token);
    }else{
      storage.get(this.localStorageToken).then(value => this.notiServ.putHeader(value));
    }
  }

  ngOnInit() {

    this.notification = this.navParams.get('notification');
    this.notificationID = this.notification.notificationId;
    this.notificationTitle = this.notification.title;
    this.notificationDetails = this.notification.body;
    if(this.notification.archived){
      this.Archiving = "Restore";
    }else{
      this.Archiving = "Archive";
    }

  }


  editNotification() {
    this.DismissClick({done:'updateSuccess',id:this.notificationID,title:this.notificationTitle,
      details:this.notificationDetails});
  }


  async deleteNotification() {
    const confirmDelete = await this.alertCtrl.create({
      header: 'Delete',
      subHeader: 'Are you sure that you want to delete this notification?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.load.startNormalLoading('Delete this Notification...');
            this.notiServ.deleteNotification(this.notificationID.toString()).subscribe(
                // @ts-ignore
                (data) => {
                  this.load.stopLoading();
                  this.DismissClick({done:'deleteSuccess'});
                },
                err => {
                  this.load.stopLoading();
                  this.errorInDelete(err)
                  this.DismissClick({done:'deleteFailed'});
                },
                () => {
                });
          }
        }
      ]
    });
    await confirmDelete.present();
  }

  async errorInDelete(err){
    const errorDelete = await this.alertCtrl.create( {
      header: 'Error',
      subHeader: err.message,
      buttons: ['OK']
    });

    await errorDelete.present();
  }

  newNotification(){
    this.DismissClick({done:'newSuccess'});
  }

  async archiveNotification() {
    let index;
    let approvedNotification = this.notification;
    // get select notification to
    if (approvedNotification.approved == true) {
      // archive it
      if (approvedNotification.archived == true) {

        const confirmation = await this.alertCtrl.create({
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
                this.load.startNormalLoading('Restoring Notification');

                /* messageService.operationMessage(messageService.messageSubject.archivingTitle,messageService.messageSubject.archivingingOperationMessage); */
                this.notificationService.editNotification(sentNotification, 4).subscribe(
                    // @ts-ignore
                    (response) => {
                      approvedNotification.archived = false;
                      this.DismissClick({done:'restored',archived:false,tostmsg:'Notification restored successfully.'});
                      // this.notificationPage = 1;
                      // this.getNotification(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
                      this.load.stopLoading();
                    },  (reason) => {

                      this.DismissClick({done:'restored',archived:true,tostmsg:'Problem deleting notifications from archive.'});
                      console.error('Error: notification.module>NotificationCtrl>archiveNotification> cannot send notification -  ' + reason);
                      this.load.stopLoading();
                    });
              }
            }
          ]
        });
        await  confirmation.present();
      } else {
        this.load.startNormalLoading('Archive Notification');
        /* messageService.operationMessage(messageService.messageSubject.archivingTitle,messageService.messageSubject.archivingingOperationMessage); */
        let sentNotification = {
          "id": approvedNotification.notificationId,
        };
        // calling update service.
        this.notificationService.editNotification(sentNotification, 3).subscribe(
            // @ts-ignore
            (response) => {
              this.DismissClick({done:'archive',archived:true,tostmsg:'Notification archived successfully.'});
              // this.notificationPage = 1;
              // this.getNotification(this.notificationPage, 0, 0, this.approved, this.archived, this.sent, 0);
              this.load.stopLoading();
            },(reason) => {
              this.DismissClick({done:'archive',archived:false,tostmsg:'Problem archiving notifications.'});
              this.load.stopLoading();
              console.error('Error: notification.module>NotificationCtrl>archiveNotification> cannot send notification -  ' + reason);
            });
      }
    } else {
      const alert = await this.alertCtrl.create({
        message: 'Notification need to be approved first.',
        buttons: ['Ok']
      });
      await alert.present();
    }
  }


  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async DismissClick(data) {
    await this.popOver.dismiss(data);
  }

}
