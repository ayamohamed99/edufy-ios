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
import {AccountService} from "../../../services/account";

@IonicPage()
@Component({
  selector: 'page-popovermedicalcarecard',
  templateUrl: 'popovermedicalcarecard.html',
})
export class PopoverMedicalCareCardPage {
  loading:any;
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';

  constructor(public navCtrl: NavController,public navParams:NavParams,public viewCtrl: ViewController,
              public platform:Platform,public storage:Storage,public alertCtrl:AlertController,public accountServ:AccountService,
              public notiServ:NotificationService, public load:LoadingController, public alrtCtrl:AlertController)
  {

    let plat=this.platform.is('core');

    if(plat){
      let token = localStorage.getItem(this.localStorageToken);
      notiServ.putHeader(token);
    }else{
      storage.get(this.localStorageToken).then(value => this.notiServ.putHeader(value));
    }


  }

  editNotification() {
    this.viewCtrl.dismiss({done:'edit'});
    console.log('startedit');
  }


  deleteNotification() {
    this.alrtCtrl.create({
      title: 'Delete',
      subTitle: 'Are you sure that you want to delete this Medication?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.viewCtrl.dismiss({done:'delete'});
            console.log('startdelete');
          }
        }
      ]
    }).present();
  }
}
