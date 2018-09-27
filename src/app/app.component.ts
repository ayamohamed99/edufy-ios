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
import {ReportPage} from "../pages/report/report";

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
  reportPage = ReportPage;

  userName:string;
  password:string;
  accessToken:string;
  // refreshToken:string;
  token:string;
  values:any =[];
  toKenFull:string;
  load:any;
  names:string;

  appearNotification:boolean = false;
  appearDailyReport:boolean = false;
  appearCustomReport:boolean = false;
  customReportList:any = [];

  elementByClass:any = [];

  constructor(private platform: Platform, statusBar: StatusBar,splashScreen: SplashScreen, private menu: MenuController,private storage:Storage,
              private loginServ:LoginService, private loading:LoadingController, private accountServ:AccountService,
              private logout:LogoutService, private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(platform.is('core')){
        this.userName = localStorage.getItem(this.loginServ.localStorageUserName);
        this.password = localStorage.getItem(this.loginServ.localStoragePassword);
      }else{
          storage.get(this.loginServ.localStorageUserName).then(value => this.userName = value, (err)=> {}).catch((err)=> {});;
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


    var coll = document.getElementsByClassName("collopsible");
    var i;

    let foundBefore;

    for (i = 0; i < coll.length; i++) {
     this.elementByClass.find(x =>{
       if(x === coll[i]){
         foundBefore=true;
       }else{
         foundBefore=false;
       }
     });

      if(!foundBefore) {
        coll[i].addEventListener("click", function () {
          this.classList.toggle("active");
          var content = this.nextElementSibling;
          if (content.style.maxHeight) {
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
        this.elementByClass.push(coll[i]);
      }
    }



    this.view=this.nav.getActive();
    this.setNameInMenu(this.accountServ.getUserName());
    this.knowFeatures(this.accountServ.getAccountFeature());
    this.knowCustomReport(this.accountServ.getCustomReportsList());
    if(this.view && this.platform.is('core') && this.platform.width() > 992){
      if(this.view.name == 'HomePage' && this.platform.is('core')){
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

  onLoadReport(page:any, pageName:any, reportId:any){
    this.nav.setRoot(page);
    this.accountServ.reportPage = pageName;
    this.accountServ.reportId = reportId;
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
      if(this.platform.is('core')) {
        localStorage.clear();
      }else {
        this.storage.clear();
      }
      this.load.dismiss();
      this.menu.close();
      this.nav.setRoot(this.homePage);
    }else{
      this.storage.get(this.loginServ.localStorageToken).then(
        value => {
          this.logout.putHeader(value);
          // this.logoutMethod();
          if(this.platform.is('core')) {
            localStorage.clear();
          }else {
            this.storage.clear();
          }
          this.load.dismiss();
          this.menu.close();
          this.nav.setRoot(this.homePage);
        })

    }


  }


  logoutMethod(){
    this.logout.postlogout(null,null,null).subscribe(
      (data) => {
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
        if(this.platform.is('core')) {
          localStorage.clear();
        }else {
          this.storage.clear();
        }
        this.menu.close();
        this.nav.setRoot(this.homePage);
      },
      () => {
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
        this.values = data;
        this.accessToken = this.values.refreshToken.value;
        this.refreshToken();
      },
      err => {
        this.load.dismiss();
        this.nav.setRoot(this.homePage);
      },
      () => {
      });
  }

  fullToken(){
    return 'Bearer ' +this.token;
  }

  refreshToken(){
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

        this.manageAccount();
      },
      err => {
        this.load.dismiss();
        this.nav.setRoot(this.homePage);
      });
  }


  manageAccount(){
    this.loginServ.authenticateUserManager(this.token,this.toKenFull).subscribe(
      (data) => {
        this.accountInfo();
      },
      err => {
        this.load.dismiss();
        this.nav.setRoot(this.homePage);
      },
      () => {
      });
  }

  accountInfo(){
    this.accountServ.getAccountRoles(this.toKenFull).subscribe(
      (data) => {
        this.accountServ.setDate(data);
        // this.accountServ.getTags(this.fullToken());
        this.CustomReport();
        // this.setNameInMenu(this.accountServ.getUserName());
        // this.knowFeatures(this.accountServ.getAccountFeature());
        // this.load.dismiss();
        // this.nav.setRoot(this.profilePage);
      },
      err => {
        this.load.dismiss();
        this.nav.setRoot(this.homePage);
      },
      () => {
      });
  }

  setNameInMenu(name:string){
    this.names = name;
  }

  knowFeatures(data:any){
    if(this.accountServ.getUserRole().notificationView && data.notificationActivated){
      this.appearNotification = true;
    }else{
      this.appearNotification = false;
    }

    if(this.accountServ.getUserRole().dailyReportView && data.dailyReportActivated){
      this.appearDailyReport = true;
    }else{
      this.appearDailyReport = false;
    }

  }

  knowCustomReport(data){
    let customReports:any = [];
    customReports = data;
    if(customReports.length > 0){
      this.appearCustomReport = true;
      this.customReportList = data;
    }
  }

  CustomReport(){
    this.accountServ.getCustomReports(this.toKenFull).subscribe(
      (data) => {
        this.accountServ.setCustomReport(data);
        this.accountServ.getTags(this.fullToken());
        this.setNameInMenu(this.accountServ.getUserName());
        this.knowFeatures(this.accountServ.getAccountFeature());
        this.knowCustomReport(this.accountServ.getCustomReportsList());
        this.load.dismiss();
        this.nav.setRoot(this.profilePage);
      },
      err => {
        this.load.dismiss();
        this.nav.setRoot(this.homePage);
      },
      () => {
      });
  }


}

