import {Component, ElementRef, Renderer, Renderer2, ViewChild} from '@angular/core';
import {
  AlertController,
  IonicFormInput,
  LoadingController,
  ModalController,
  NavController,
  Platform
} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {LoginService} from "../../services/login";
import {Storage} from "@ionic/storage";
import {AccountService} from "../../services/account";
import {ProfilePage} from "../profile/profile";
import {Network} from "@ionic-native/network";
import {NotificationService} from "../../services/notification";
import {FCMService} from "../../services/fcm";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Url_domain} from "../../models/url_domain";
import {Student} from "../../models";
import {ChatService} from "../../services/chat";
import {MedicalCareService} from "../../services/medicalcare";

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
  chatPage = 'ChatPage';
  hereONPage;
  DomainUrl;

  constructor(private navCtrl: NavController,private loginServ:LoginService, private storage:Storage, private platform:Platform
    , private loading:LoadingController,private alertCtrl: AlertController, private accountServ:AccountService,
              private network:Network, private notiServ:NotificationService,private fire:FCMService,public chatServ:ChatService
              ,private el:ElementRef,private rend:Renderer , private  rend2 : Renderer2,public iab:InAppBrowser,
              public modalCtrl:ModalController,public medicalService:MedicalCareService) {}

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
        this.startSocket(this.accountServ.userId);
        this.setupNotification();
      },
      err => {
        if(err.error == "FORBIDDEN" ||err.error ==  "NO_REPORTS_FOUNDED_FOR_YOUR_ACCOUNT"){
          this.load.dismiss();
          console.log('Has No Custom report(s)');
          this.accountServ.getTags(this.fullToken());
          this.navCtrl.setRoot('ProfilePage');
          this.startSocket(this.accountServ.userId);
          this.setupNotification();
          if(this.accountServ.getUserRole().viewMedicalRecord) {
            this.medicalService.getAccountMedicalCareSettings(this.accountServ.userAccount.accountId).subscribe();
          }
        }else if(!err.error){
          this.load.dismiss();
          console.log('Has No Custom report(s)');
          this.accountServ.getTags(this.fullToken());
          this.navCtrl.setRoot('ProfilePage');
          this.startSocket(this.accountServ.userId);
          this.setupNotification();
          if(this.accountServ.getUserRole().viewMedicalRecord) {
            this.medicalService.getAccountMedicalCareSettings(this.accountServ.userAccount.accountId).subscribe();
          }
        } else{
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

        console.log("Background Notification : \n", JSON.stringify(data));
        if(data.page === "ReportPage"){
          this.onLoadReport("ReportPage", data.reportName,data.reportId);
        }else{
          this.navCtrl.setRoot(data.page).then(
            value => {
              console.log(value);
            }).catch(
            err=>{
              if(err.includes("invalid")){
                this.openWeb();
              }
            });
        }

      });

    this.fire.onForgroundNotification().subscribe(
      data => {
        debugger;
        let title;
        let body;
        if(this.platform.is('ios')){
          title = data.aps.alert.title;
          body = data.aps.alert.body;
        }else{
          title = data.gcm.title;
          body = data.gcm.body;
        }
        this.fire.setLocatNotification(title,body,JSON.parse(JSON.stringify(data)));
        this.fire.onOpenLocalNotification().subscribe(
          data => {
            debugger;
            console.log(data);
            console.log('Foreground');
            if (data.data.isCommentNotification) {
              this.onLoadReportTemplateWithComments(data.data)
            } else if(data.data.page === "ReportPage"){
              this.onLoadReport("ReportPage", data.data.reportName,data.data.reportId);
            }else{
              this.navCtrl.setRoot(data.data.page).then(
                value => {
                  console.log(value);
                }).catch(
                err=>{
                  if(err.includes("invalid")){
                    this.openWeb();
                  }
                });
            }

          });
      });
  }

  openWeb(){
    this.iab.create("http://104.198.175.198/", "_self");
  }

  onLoadReport(page:any, pageName:any, reportId:any){
    this.accountServ.reportPage = pageName;
    this.accountServ.reportId = reportId;
    this.navCtrl.setRoot(page);
  }
  onLoadReportTemplateWithComments(params) {
    this.accountServ.reportId = params.reportId;

    const model = this.modalCtrl.create('ReportTemplatePage',
      {student:{id:params.studentId,name:params.studentName},
        classId:params.classId,reportDate:params.reportDate,comment:true});
    model.present();
  }

  startSocket(userId){
    let that = this;
    this.navCtrl.viewDidEnter.subscribe(
      page=>{
        console.log(page);
        if(page.name) {
          this.hereONPage = page.name;
        }else{
          this.hereONPage = page.id;
        }
      },err=>{
        console.log(err);
      });
    this.DomainUrl = new Url_domain;

    let hostName= this.DomainUrl.Domain;

    if (hostName == null || hostName == "") {
      hostName = "wss://" + "education.entrepreware.com";
    } else if(hostName.includes("192.168.1")){
      hostName = "ws://" + hostName.substring(6);
    }else{
      hostName = "wss://" + "education.entrepreware.com";
    }
    let websocket = new WebSocket(hostName + "/socket");
    websocket.onopen = function(message) {
      console.log("OPEN_WEB_SOCKET");
      websocket.send("id" + userId);
    };
    websocket.onmessage = function(message) {
      console.log("onmessage");
      console.log(JSON.parse(message.data));
      let data = JSON.parse(message.data);
      if(that.hereONPage == that.chatPage){
        that.chatServ.newMessageSubject$.next(JSON.parse(message.data));
      }else {
        if(!data.user){
          that.chatServ.NewChats.push(JSON.parse(message.data));
          that.alertCtrl.create({
            title: 'Chat',
            message: "New chat from your student " + data.chatThread.student.name,
            buttons: [
              {
                text: 'Later',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'See now',
                handler: () => {
                  // that.nav.setRoot(that.chatPage);
                  let student = data.chatThread.student;
                  let Stud = new Student();
                  Stud.id = student.id;
                  Stud.name = student.name;
                  Stud.address = student.address;
                  Stud.classes = student.classes;
                  Stud.profileImg = student.profileImg;
                  Stud.searchByClassGrade = student.classes.grade.name+" "+student.classes.name;
                  let modal = that.modalCtrl.create('ChatDialoguePage',
                    {studentData:Stud});
                  modal.present();
                }
              }
            ]
          }).present();
        }
      }
    };
    websocket.onclose = function(message) {
      console.log("onclose");
      console.log(message);
    };
    websocket.onerror = function(message) {
      console.log("onerror");
      console.log(message);
      try {
        websocket.onopen = function(message) {
          console.log("OPEN_WEB_SOCKET");
          websocket.send("id" + userId);
        };
      }catch (e) {
        console.log(e);
      }
    };
  }
}
