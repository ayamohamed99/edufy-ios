import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import {NotificationService} from '../../services/Notification/notification.service';
import {AlertController, ModalController, Platform} from '@ionic/angular';
import {PassDataService} from '../../services/pass-data.service';

@Component({
  selector: 'app-notification-edit',
  templateUrl: './notification-edit.page.html',
  styleUrls: ['./notification-edit.page.scss'],
})
export class NotificationEditPage implements OnInit {

  notificationID:number;
  notificationTitle:string;
  notificationDetails:string;
  notificationAttach:any[] = [];
  notificationUser:string;
  TheNotification;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  // @Input() notification:any;
  constructor(public modalCtrl:ModalController,
              public load:LoadingViewService, public alrtCtrl:AlertController, public notiServ:NotificationService,
              private platform:Platform, private passData:PassDataService) {
    this.load.stopLoading();
  }

  ngOnInit() {
    this.TheNotification=this.passData.dataToPass.notification;
    this.notificationID=this.TheNotification.notificationId;
    this.notificationTitle =this.TheNotification.title;
    this.notificationDetails=this.TheNotification.body;
    this.notificationAttach = this.TheNotification.attachmentsList;
    this.notificationUser = this.TheNotification.senderName;
    console.log("Attacment");
    console.log(this.TheNotification);
  }


  close(){
    this.DismissClick({name:'dismissed'});
  }

  updateNotify(form:NgForm){
    this.load.startNormalLoading('Update this Notification...');
    this.notiServ.updateNotification(this.notificationID,form.value.notifyTitle,form.value.notifyDetails).subscribe(
        // @ts-ignore
        (data) => {
          this.DismissClick({done:'updateSuccess'});
          this.load.stopLoading();
        },
        err => {
          this.DismissClick({done:'updateFailed'});
          this.load.stopLoading();
          this.presentAlert(err);
        },
        () => {
        });
  }

  async presentAlert(err) {
    const alert = await this.alrtCtrl.create({
      header: 'Error',
      subHeader: err.message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async DismissClick(data) {
    await this.modalCtrl.dismiss(data);
  }


}
