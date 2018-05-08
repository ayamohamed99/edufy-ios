import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {LoginService} from "../services/login_service";
import {HttpClientModule} from "@angular/common/http";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {IonicStorageModule} from "@ionic/storage";
import {NotificationPage} from "../pages/notification/notification";
import {AccountService} from "../services/account";
import {ProfilePage} from "../pages/profile/profile";
import {NotificationNewPage} from "../pages/notification-new/notification-new";



@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    HomePage,
    NotificationPage,
    NotificationNewPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    HomePage,
    NotificationPage,
    NotificationNewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginService,
    AccountService
  ]
})
export class AppModule {}
