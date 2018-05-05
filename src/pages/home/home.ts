import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, Platform} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {LoginService} from "../../services/login_service";
import {NotificationPage} from "../notification/notification";
import {Storage} from "@ionic/storage";
import {root} from "rxjs/util/root";


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

  constructor(private navCtrl: NavController,private loginServ:LoginService, private storage:Storage
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

    let getToken:string;
    this.storage.get(this.loginServ.localStorageToken).then(value => getToken = value);
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
          && (this.fullToken() != localStorage.getItem(this.loginServ.localStorageToken)))
        {

          localStorage.setItem(this.loginServ.localStorageToken, this.fullToken());
          localStorage.setItem(this.loginServ.localStorageUserName, this.userName);
          localStorage.setItem(this.loginServ.localStoragePassword, this.password);

        } else {
          if ((this.token_Type != null || this.token_Type != '')
            && (this.token != null || this.token != '')
            && (getToken != this.fullToken()))
          {
            this.storage.set(this.loginServ.localStorageToken, this.fullToken());
            this.storage.set(this.loginServ.localStorageUserName, this.userName);
            this.storage.set(this.loginServ.localStoragePassword, this.password);
          }
        }
        this.navCtrl.setRoot(NotificationPage);
        root.whichPage();
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
        console.log("LocalStorage: "+localStorage.getItem(this.loginServ.localStorageToken));
        console.log("LocalStorageMobile: "+getToken);
        console.log("The POST observable is now completed.");
      });
  }

  fullToken(){
    return this.token_Type + ' ' +this.token;
  }


}
