import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, Platform} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {LoginService} from "../../services/login";
import {Storage} from "@ionic/storage";
import {AccountService} from "../../services/account";
import {ProfilePage} from "../profile/profile";
import {Pendingnotification} from "../../models/pendingnotification";
import {Network} from "@ionic-native/network";
import {NotificationService} from "../../services/notification";
import {Postattachment} from "../../models/postattachment";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userName:string;
  password:string;
  accessToken:string;
  refreshToken:string;
  token:string;
  values:any =[];
  toKenFull:string;
  load:any;
  elementByClass:any = [];

  constructor(private navCtrl: NavController,private loginServ:LoginService, private storage:Storage, private platform:Platform
    , private loading:LoadingController,private alertCtrl: AlertController, private accountServ:AccountService,
              private network:Network, private notiServ:NotificationService) {}

  login(form:NgForm){
    this.userName = form.value.username;
    this.password = form.value.password;
    this.startLogIn();
  }

  startLogIn(){
    this.load = this.loading.create({
      content: 'Login now...'
    });
    this.load.present();

    let getToken:string;
    this.storage.get(this.loginServ.localStorageToken).then(value => getToken = value);
    this.loginServ.postlogin(this.userName,this.password).subscribe(
      (data) => {
        this.values = data;
        this.accessToken = this.values.refreshToken.value;
        this.refreToken();
      },
      err => {
        this.load.dismiss();
        this.alertCtrl.create({
          title: 'Error!',
          subTitle: "Wrong Username or Password",
          buttons: ['OK']
        }).present();

      },
      () => {
      });
  }

  fullToken(){
    return 'Bearer ' +this.token;
  }

  refreToken(){
    this.loginServ.authenticateUserByRefreshToken(this.accessToken).subscribe(
      (data) => {
        this.values = data;
        this.token = this.values.value;
        this.toKenFull = this.fullToken();

        let getToken:string;
        this.storage.get(this.loginServ.localStorageToken).then(value => getToken = value);

        if ( (this.platform.is("core") )
          && (this.token != null || this.token != '')
          && (this.fullToken() != localStorage.getItem(this.loginServ.localStorageToken)))
        {

          localStorage.setItem(this.loginServ.localStorageToken, this.fullToken());
          localStorage.setItem(this.loginServ.localStorageUserName, this.userName);
          localStorage.setItem(this.loginServ.localStoragePassword, this.password);

        } else {
          if ((this.token != null || this.token != '')
            && (getToken != this.fullToken()))
          {
            this.storage.set(this.loginServ.localStorageToken, this.fullToken());
            this.storage.set(this.loginServ.localStorageUserName, this.userName);
            this.storage.set(this.loginServ.localStoragePassword, this.password);
          }
        }

        this.managAccount();
      },
      err => {
        this.load.dismiss();
        this.alertCtrl.create({
          title: 'Error!',
          subTitle: "Wrong Username or Password",
          buttons: ['OK']
        }).present();

      });
  }


  managAccount(){
    this.loginServ.authenticateUserManager(this.token,this.toKenFull).subscribe(
      (data) => {
        this.accountInfo();
      },
      err => {
        this.load.dismiss();
        this.alertCtrl.create({
          title: 'Error!',
          subTitle: "Wrong Username or Password",
          buttons: ['OK']
        }).present();
      },
      () => {
      });
  }

  accountInfo(){
    this.accountServ.getAccountRoles(this.toKenFull).subscribe(
      (data) => {
        // this.load.dismiss();
        this.accountServ.setDate(data);
        // this.accountServ.getTags(this.fullToken());
        // this.navCtrl.setRoot(ProfilePage);
        this.CustomReport();
      },
      err => {
        this.load.dismiss();
        this.alertCtrl.create({
          title: 'Error!',
          subTitle: "Wrong Username or Password",
          buttons: ['OK']
        }).present();
      },
      () => {
      });
  }


  CustomReport(){
    this.accountServ.getCustomReports(this.toKenFull).subscribe(
      (data) => {
        this.load.dismiss();
        this.accountServ.setCustomReport(data);
        this.accountServ.getTags(this.fullToken());
        this.navCtrl.setRoot(ProfilePage);
      },
      err => {
        this.load.dismiss();
        this.alertCtrl.create({
          title: 'Error!',
          subTitle: "Wrong Username or Password",
          buttons: ['OK']
        }).present();
      },
      () => {
      });
  }

}
