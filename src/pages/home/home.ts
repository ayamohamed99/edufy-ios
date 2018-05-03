import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, Platform} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {LoginService} from "../../services/login_service";
import {NotificationPage} from "../notification/notification";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userName:string;
  password:string;
  token_Type:string;
  token:string;
  values:any =[];
  localStorageKey:string = 'LOCAL_STORAGE_TOKEN';
  storage:Storage;

  constructor(private navCtrl: NavController,private loginServ:LoginService
    ,private platform:Platform, private loading:LoadingController,private alertCtrl: AlertController) {}

  login(form:NgForm){
    this.userName = form.value.username;
    this.password = form.value.password;
    console.log(this.userName +','+ this.password );
    this.startLogIn();
  }

  startLogIn(){
    let load = this.loading.create({
      content: 'Please wait...'
    });
    load.present();

    this.loginServ.postlogin(this.userName,this.password).subscribe(
      (data) => {
        console.log("POST call successful value returned in body", data);
        load.dismiss();
        this.values = data;
        this.token_Type = this.values.tokenType;
        this.token = this.values.value;

        console.log('Full token: '+this.fullToken());

        if ( (this.platform.is("core") )
          && (this.token_Type != null || this.token_Type != '')
          && (this.token != null || this.token != '')
          && (this.fullToken() != localStorage.getItem(this.localStorageKey)))
        {

          localStorage.setItem(this.localStorageKey, this.fullToken());

        } else {
          if ((this.token_Type != null || this.token_Type != '')
            && (this.token != null || this.token != '')
            && (this.storage.getItem(this.localStorageKey) != this.fullToken()))
          {
            this.storage.setItem(this.localStorageKey, this.fullToken());
          }
        }
      },
      err => {
        load.dismiss();
        console.log("POST call in error", err);
        this.alertCtrl.create({
          title: 'Error!',
          subTitle: err.statusText,
          buttons: ['OK']
        }).present();

      },
      () => {
        console.log("LocalStorage: "+localStorage.getItem(this.localStorageKey));
        console.log("The POST observable is now completed.")
        this.navCtrl.push(NotificationPage);
      });
  }
  fullToken(){
    return this.token_Type + ' ' +this.token;
  }


}
