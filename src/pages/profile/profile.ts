import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {AccountService} from "../../services/account";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  name:string;
  userName:string;
  userPhone:string;
  userMail:string;
  userAddress:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,private platform:Platform,accountServ:AccountService) {
    this.name = accountServ.getUserName();
      this.userName = accountServ.getUserUserName();
      this.userPhone = accountServ.getUserTelephone();
      this.userMail = accountServ.getUserEmail();
      this.userAddress = accountServ.getUserAddress();
  }

  onCore(){
    if(this.platform.is('core')){
      return true;
    }else {
      return false;
    }
  }

  onMobile(){
    if(!this.platform.is('core')){
      return true;
    }else {
      return false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
