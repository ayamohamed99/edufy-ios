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

  view:any = [];
  rootPage:any;
  homePage = HomePage;
  notificationPage = NotificationPage;
  reportPage:any;

  constructor(private platform: Platform, statusBar: StatusBar,splashScreen: SplashScreen, private menu: MenuController,storage:Storage, private logServ:LoginService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      let userName:string;
      let password:string;
      if(platform.is('core')){
        userName = localStorage.getItem(this.logServ.localStorageUserName);
        password = localStorage.getItem(this.logServ.localStoragePassword);
      }else{
        storage.get(this.logServ.localStorageUserName).then(value => userName = value);
        storage.get(this.logServ.localStoragePassword).then(value => password = value);
      }

      if((userName == null || userName == '')&&(password == null || password == '')) {
        this.rootPage = this.homePage;
      }else{
        this.rootPage = this.notificationPage;
      }
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  public whichPage(){
    this.view=this.nav.getActive();

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

}

