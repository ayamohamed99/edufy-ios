import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {LoginService} from "../services/login";
import {HttpClientModule} from "@angular/common/http";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {IonicStorageModule} from "@ionic/storage";
import {NotificationPage} from "../pages/notification/notification";
import {AccountService} from "../services/account";
import {ProfilePage} from "../pages/profile/profile";
import {NotificationNewPage} from "../pages/notification-new/notification-new";
import {RlTagInputModule} from "angular2-tag-input/dist";
import {NotificationService} from "../services/notification";
import {PopoverNotificationCardPage} from "../pages/notification/popover_notification/popovernotificationcard";
import {SettingsPage} from "../pages/settings/settings";



@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    HomePage,
    NotificationPage,
    NotificationNewPage,
    PopoverNotificationCardPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    RlTagInputModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    HomePage,
    NotificationPage,
    NotificationNewPage,
    PopoverNotificationCardPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginService,
    NotificationService,
    AccountService
  ]
})
export class AppModule {}
