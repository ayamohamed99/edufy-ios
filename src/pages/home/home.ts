import {Component, ElementRef, Renderer, Renderer2, ViewChild} from '@angular/core';
import {AlertController, IonicFormInput, LoadingController, NavController, Platform} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {LoginService} from "../../services/login";
import {Storage} from "@ionic/storage";
import {AccountService} from "../../services/account";
import {ProfilePage} from "../profile/profile";
import {Network} from "@ionic-native/network";
import {NotificationService} from "../../services/notification";
import {MyApp} from "../../app/app.component";
import {FCMService} from "../../services/fcm";

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
  @ViewChild('passwordInput') inp  : any ;

  constructor(private navCtrl: NavController,private loginServ:LoginService, private storage:Storage, private platform:Platform
    , private loading:LoadingController,private alertCtrl: AlertController, private accountServ:AccountService,
              private network:Network, private notiServ:NotificationService,private fire:FCMService
              ,private el:ElementRef,private rend:Renderer , private  rend2 : Renderer2) {}

  login(form:NgForm){
    this.userName = form.value.username;
    this.password = form.value.password;
    this.startLogIn();
  }

  startLogIn(){
    this.load = this.loading.create({
      content: 'Logging in...'
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
        this.navCtrl.setRoot('ProfilePage');
        this.setupNotification();
      },
      err => {
        if(err.error == "FORBIDDEN"){
          this.load.dismiss();
          console.log('Has No Custom report(s)');
          this.accountServ.getTags(this.fullToken());
          this.navCtrl.setRoot('ProfilePage');
          this.setupNotification();
        }else{
          this.load.dismiss();
          this.alertCtrl.create({
            title: 'Error!',
            subTitle: "Wrong Username or Password",
            buttons: ['OK']
          }).present();
        }
      },
      () => {
      });
  }

  passOn = false;
  inputTextType = "text";
  showPassword(){
    if (!this.passOn) {
      this.passOn = true;
    } else {
      this.passOn = false;
    }
  }

  setupNotification(){
    this.fire.getToken();

    this.fire.onBackgroundNotification().subscribe(
      data => {

        console.log('Background');
        if(data.page === "ReportPage"){
          this.onLoadReport("ReportPage", data.reportName,data.reportId);
        }else{
          this.navCtrl.setRoot(data.page);
        }

      });

    this.fire.onForgroundNotification().subscribe(
      data => {
        this.fire.setLocatNotification(data.gcm.title,data.gcm.body,JSON.parse(JSON.stringify(data)));
        this.fire.onOpenLocalNotification().subscribe(
          data => {
            console.log(data);
            console.log('Foreground');
            if(data.data.page === "ReportPage"){
              this.onLoadReport("ReportPage", data.data.reportName,data.data.reportId);
            }else{
              this.navCtrl.setRoot(data.data.page);
            }

          });
      });
  }

  onLoadReport(page:any, pageName:any, reportId:any){
    this.navCtrl.setRoot(page);
    this.accountServ.reportPage = pageName;
    this.accountServ.reportId = reportId;
  }

}
