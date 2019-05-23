import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {HttpClientModule} from '@angular/common/http';

import {Ng2ImgMaxModule} from 'ng2-img-max';

//Angular Materials
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule, MatNativeDateModule,
  MatSelectModule
} from '@angular/material';
import {IonicStorageModule} from '@ionic/storage';

//Plugin
import {Network} from '@ionic-native/network/ngx';
import {FirebaseMessaging} from '@ionic-native/firebase-messaging/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';


let mods = [MatExpansionModule , MatAutocompleteModule , MatFormFieldModule,MatIconModule,MatDatepickerModule,MatSelectModule,MatNativeDateModule,MatInputModule];

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
      BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
    Ng2ImgMaxModule,
    mods
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    FirebaseMessaging,
    LocalNotifications,
    InAppBrowser
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    console.log('still format');
    const stringPrototype = String.prototype as any;
    stringPrototype.format = function() {
      console.log('formated');
      const args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
      });
    };
  }
}
