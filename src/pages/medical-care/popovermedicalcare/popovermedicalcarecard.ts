import {Component} from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {
  AlertController,
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
  enableEdit = false;
  enableDelete = false;

  constructor(public navCtrl: NavController,public navParams:NavParams,public viewCtrl: ViewController,
              public platform:Platform,public storage:Storage,public alertCtrl:AlertController,public accountServ:AccountService,
              public notiServ:NotificationService, public load:LoadingController, public alrtCtrl:AlertController)
  {

    this.enableEdit = navParams.get('Edit');
    this.enableDelete = navParams.get('Delete');
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
    this.viewCtrl.dismiss({done:'delete'});
  }
}
