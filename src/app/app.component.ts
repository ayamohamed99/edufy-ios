import {Component, ViewChild} from '@angular/core';
import {MenuController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {Storage} from "@ionic/storage";
import {LoginService} from "../services/login_service";
import {NotificationPage} from "../pages/notification/notification";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,menu: MenuController, private storage:Storage, private logServ:LoginService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      let userName:string;
      let password:string;
      if(platform.is('core')){
        userName = localStorage.getItem(this.logServ.localStorageUserName);
        password = localStorage.getItem(this.logServ.localStoragePassword);
      }else{
        this.storage.get(this.logServ.localStorageUserName).then(value => userName = value);
        this.storage.get(this.logServ.localStoragePassword).then(value => password = value);
      }

      if((userName == null || userName == '')&&(password == null || password == '')) {
        this.rootPage = HomePage;
      }else{
        this.rootPage = NotificationPage;
      }
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  whichPage(){
    if(this.rootPage == HomePage){
      return false;
    }
    else
    {
      return true;
    }
  }

  openPage(){
    console.log("menu");
  }
}

