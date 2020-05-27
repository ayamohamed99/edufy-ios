import { Component, OnInit } from '@angular/core';
import {NavParams, Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  wifiUploadKey = 'WIFI_UPLOAD';
  wifiUpload:boolean;

  constructor(public platform:Platform, public storageIon:Storage) {

    if(this.platform.is('desktop')){
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

  ngOnInit() {
  }

  ifCheckedWifi(){
    if(this.platform.is('desktop')){
      localStorage.setItem(this.wifiUploadKey, ""+this.wifiUpload);
    }else{
      this.storageIon.set(this.wifiUploadKey, {wifi:this.wifiUpload});
    }
  }

}
