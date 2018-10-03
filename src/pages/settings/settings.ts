import {Component} from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  wifiUploadKey = 'WIFI_UPLOAD';
  wifiUpload:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform:Platform,
              public storageIon:Storage)
  {
    if(this.platform.is('core')){
      if(localStorage.getItem(this.wifiUploadKey) == 'true'){
        this.wifiUpload = true;
      }else{
        this.wifiUpload = false;
      }
    }else{
      this.storageIon.get(this.wifiUploadKey).then( value => {
        if(value) {
          if (value.wifi) {
            this.wifiUpload = true;
          } else {
            this.wifiUpload = false;
          }
        }else{
          this.wifiUpload = false;
        }
      },err=> {
        this.wifiUpload = false;
        }).catch( e => {
        this.wifiUpload = false;
      });
    }
  }

  ionViewDidLoad() {
  }

  ifCheckedWifi(){
    if(this.platform.is('core')){
      localStorage.setItem(this.wifiUploadKey, ""+this.wifiUpload);
    }else{
      this.storageIon.set(this.wifiUploadKey, {wifi:this.wifiUpload});
    }
  }
}
