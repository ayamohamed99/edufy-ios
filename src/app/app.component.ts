import { Component, ViewChild } from '@angular/core';
import { AlertController, LoadingController, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { Storage } from "@ionic/storage";
import { LoginService } from "../services/login";
import { NotificationPage } from "../pages/notification/notification";
import { AccountService } from "../services/account";
import { ProfilePage } from "../pages/profile/profile";
import { SettingsPage } from "../pages/settings/settings";
import { LogoutService } from "../services/logout";

declare var window:any;

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  view:any = [];
  rootPage:any;
  profilePage = ProfilePage;
  homePage = HomePage;
  notificationPage = NotificationPage;
  settingsPage = SettingsPage;
  reportPage:any;

  userName:string;
  password:string;
  accessToken:string;
  refreshToken:string;
  token:string;
  values:any =[];
  toKenFull:string;
  load:any;
  names:string;

  appearNotification:boolean;
  appearDailyReport:boolean;

  constructor(private platform: Platform, statusBar: StatusBar,splashScreen: SplashScreen, private menu: MenuController,private storage:Storage,
              private loginServ:LoginService, private loading:LoadingController, private accountServ:AccountService,
              private logout:LogoutService, private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log(window);
      if(platform.is('core')){
        this.userName = localStorage.getItem(this.loginServ.localStorageUserName);
        this.password = localStorage.getItem(this.loginServ.localStoragePassword);
      }else{
          storage.get(this.loginServ.localStorageUserName).then(value => this.userName = value, (err)=> console.log('ERROR'+err)).catch((err)=> console.log('ERROR'+err));;
          storage.get(this.loginServ.localStoragePassword).then(
            value =>{
              this.password = value;
              if((this.userName && this.userName != '') && (this.password && this.password != '')){
                this.startLogIn();
              }else {
                this.rootPage = this.homePage;
              }

            });
      }

      if((this.userName && this.userName != '') && (this.password && this.password != '') &&
        platform.is('core')){
        this.startLogIn();
      }else {
        this.rootPage = this.homePage;
      }
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  public whichPage(){
    this.view=this.nav.getActive();
    this.setNameInMenu(this.accountServ.getUserName());
    this.knowFeatures(this.accountServ.getAccountFeature());
    if(this.view && this.platform.is('core') && this.platform.width() > 992){
      if(this.view.name == 'HomePage' && this.platform.is('core')){
        console.log(this.view.name);
        return false;
      }else{
        return true;
      }
    }
    else
    {
      return false;
    }
  }

  onLoad(page:any){
    this.nav.setRoot(page);
    this.menu.close();
  }


  onSignOut(){
    this.load = this.loading.create({
      content: 'Wait please ...'
    });
    this.load.present();

    let plat=this.platform.is('core');

    if(plat){
      let token = localStorage.getItem(this.loginServ.localStorageToken);
      this.logout.putHeader(token);
    }else{
      this.storage.get(this.loginServ.localStorageToken).then(
        value => {
          this.logout.putHeader(value);
          this.logoutMethod();
        })

    }


  }


  logoutMethod(){
    this.logout.postlogout(null,null,null).subscribe(
      (data) => {
        console.log("LogOut", data);
        this.load.dismiss();
        if(this.platform.is('core')) {
          localStorage.clear();
        }else {
          this.storage.clear();
        }
        this.menu.close();
        this.nav.setRoot(this.homePage);
      },
      err => {
        this.load.dismiss();
        console.log("error logout", err.message);
        if(this.platform.is('core')) {
          localStorage.clear();
        }else {
          this.storage.clear();
        }
        this.menu.close();
        this.nav.setRoot(this.homePage);
      },
      () => {
        console.log("The Logout observable is now completed.");
      });
  }












//All services For Auto login

  startLogIn(){
    this.load = this.loading.create({
      content: 'Login now...'
    });
    this.load.present();

    let getToken:string;
    this.storage.get(this.loginServ.localStorageToken).then(value => getToken = value);
    this.loginServ.postlogin(this.userName,this.password).subscribe(
      (data) => {
        console.log("POST call successful value returned in body", data);
        this.values = data;
        this.accessToken = this.values.refreshToken.value;
        console.log("this.accessToken", this.accessToken);
        this.refreToken();
      },
      err => {
        this.load.dismiss();
        console.log("POST call in error", err);
        this.nav.setRoot(this.homePage);
      },
      () => {
        console.log("LocalStorage: "+localStorage.getItem(this.loginServ.localStorageToken));
        console.log("LocalStorageMobile: "+getToken);
        console.log("The POST observable is now completed.");
      });
  }

  fullToken(){
    return 'Bearer ' +this.token;
  }

  refreToken(){
    this.loginServ.authenticateUserByRefreshToken(this.accessToken).subscribe(
      (data) => {
        console.log("Refresh :  ", data);
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
          localStorage.setItem(this.loginServ.localStorageAccessToken, this.token);
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
        console.log("POST call in error", err);
        this.nav.setRoot(this.homePage);
      });
  }


  managAccount(){
    this.loginServ.authenticateUserManager(this.token,this.toKenFull).subscribe(
      (data) => {
        console.log("full token ", data);
        this.accountInfo();
      },
      err => {
        this.load.dismiss();
        console.log("POST call in error", err);
        this.nav.setRoot(this.homePage);
      },
      () => {
        console.log("The POST observable is now completed.");
      });
  }

  accountInfo(){
    this.accountServ.getAccountRoles(this.toKenFull).subscribe(
      (data) => {
        console.log("full token Date Is", this.toKenFull);
        console.log("Date Is R", data);
        this.accountServ.setDate(data);
        this.accountServ.getTags(this.fullToken());
        this.setNameInMenu(this.accountServ.getUserName());
        this.knowFeatures(this.accountServ.getAccountFeature());
        this.load.dismiss();
        this.nav.setRoot(this.profilePage);
      },
      err => {
        this.load.dismiss();
        console.log("POST call in error", err);
        this.nav.setRoot(this.homePage);
      },
      () => {
        console.log("The POST observable is now completed.");
      });
  }

  setNameInMenu(name:string){
    this.names = name;
  }

  knowFeatures(data:any){
    this.appearNotification = data.notificationActivated;
    this.appearDailyReport = false;
    // this.appearDailyReport = data.dailyReportActivated;
  }
}

