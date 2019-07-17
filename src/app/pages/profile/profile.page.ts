import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {AlertController, LoadingController, Platform} from '@ionic/angular';
import {AccountService} from "../../services/Account/account.service";
import {Postattachment} from "../../models/postattachment";
import {Pendingnotification} from "../../models/pendingnotification";
import {Storage} from "@ionic/storage";
import {Network} from "@ionic-native/network/ngx";
import {NotificationService} from "../../services/Notification/notification.service";
import {Ng2ImgMaxService} from "ng2-img-max";
import {DomSanitizer} from "@angular/platform-browser";
import {AttendanceTeachersService} from '../../services/AttendanceTeachers/attendance-teachers.service';
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';
import {DatePipe} from '@angular/common';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';

declare var wifiinformation: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
    providers:[DatePipe],
})
export class ProfilePage implements OnInit {

  @ViewChild('commentDiv') commentAppear: ElementRef;

  name:string;
  userName:string;
  userPhone:string;
  userMail:string;
  userAddress:string;
  pendingNotification:any[]=[];
  arrayToPostAttachment:any[]=[];
  wifiUploadKey = 'WIFI_UPLOAD';
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  localStorageAttendanceShift:string = 'LOCAL_STORAGE_USER_SHIFT';
  WIFI_CODE = 1;
  QRCODE_CODE = 2;

  uploadedImage: File;
  imagePreview:any[]=[];

  wifi:any;
  attendData:[any];
  userShiftData;
  connectedToSameWiFi = false;
  checkIn = true;

  constructor(public platform:Platform,public accountServ:AccountService, public alertController:AlertController, public load:LoadingViewService
      ,public storage:Storage, public network:Network, public notiServ:NotificationService, public attend:AttendanceTeachersService, public transDate:TransFormDateService,
    public datepipe: DatePipe) {
    this.name = accountServ.getUserName();
    this.userName = accountServ.getUserUserName();
    this.userPhone = accountServ.getUserTelephone();
    this.userMail = accountServ.getUserEmail();
    this.userAddress = accountServ.getUserAddress();
    if(!this.name || this.name == ""){
      this.name = "No Name";
    }
    if(!this.userName || this.userName == ""){
      this.userName = "No User Name";
    }
    if(!this.userPhone || this.userPhone == ""){
      this.userPhone = "No Phone";
    }
    if(!this.userMail || this.userMail == ""){
      this.userMail = "No Mail";
    }
    if(!this.userAddress || this.userAddress == ""){
      this.userAddress = "No Address";
    }

      this.storage.get(this.localStorageAttendanceShift).then(
          value => {
              let date = JSON.parse(value);
              if(this.checktheDateIn(date.checkInDate)) {
                  this.userShiftData = JSON.parse(value);
              }
              if(this.userShiftData != null && this.checktheDateIn(date.checkInDate)){
                  this.checkIn = false;
              }
          },
          (err) => {})
          .catch((err) => {});

    network.onchange().subscribe(
        value => {
            let val = value;

        }
    );
      if(network.type == 'wifi'){
          wifiinformation.getSampleInfo(wifi => {
              // alert(
              //     'SSID: ' + wifi.ssid +
              //     '\nMAC: ' + wifi.mac +
              //     '\nIP: ' + wifi.ip +
              //     '\nGateway: ' + wifi.gateway
              // );

              this.wifi = wifi;

          }, (err) => console.error(err));
      }
    if (platform.is('desktop')) {

      notiServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.getNotificationINStorage();
    } else {
      storage.get(this.localStorageToken).then(
          val => {
            notiServ.putHeader(val);
            this.getNotificationINStorage();
          });
    }

      if (platform.is('desktop')) {
          attend.putHeader(localStorage.getItem(this.localStorageToken));
          this.getAttendData();
      } else {
          storage.get(this.localStorageToken).then(
              val => {
                  attend.putHeader(val);
                  this.getAttendData();
              });
      }



  }

  ngOnInit() {
  }


  getAttendData(){
      this.load.startLoading('',false,'loadingWithoutBackground').then(value => {
      this.attend.getBranchAttendMeathodsData(this.accountServ.userBranchId,1).subscribe(
          next => {
              this.load.stopLoading();
              let data = next;
              // @ts-ignore
              this.attendData = data;

              this.attendData.forEach(val => {
                  let data = JSON.parse(val.methodData);
                  if(val.methods.id == this.WIFI_CODE && (data.mac == this.wifi.mac)){
                      this.connectedToSameWiFi = true;
                  }
              });

              // if(this.attendData.length > 0 && this.userShiftData == null){
              //     this.checkIn = true;
              // }else if(this.attendData.length < 1 && this.accountServ.getUserRole().controlWifiPoint){
              //     this.attendanceButton = "";
              // }else if(this.attendData.length > 0 && this.userShiftData != null){
              //     this.checkIn = false;
              // }
          },err => {
              this.load.stopLoading();
          }
      )
      });
  }

  checkInOut(from){
      if(this.accountServ.getUserRole().controlWifiPoint && from == 'Add') {
          this.getWifiIPAddress();
      }else if((this.accountServ.getUserRole().checkInAttendance || this.accountServ.getUserRole().checkOutAttendance) && from != "Add"){
          this.attendData.forEach(val => {
              let data = JSON.parse(val.methodData);
              if(val.methods.id == this.WIFI_CODE && (data.mac == this.wifi.mac)){
                  this.connectedToSameWiFi = true;
              }
          });
          if(this.network.type != 'wifi'){
              this.presentAlert('Alert','You need to connect to wifi');
          }else if(!this.connectedToSameWiFi){
              this.presentAlert('Alert','You need to connect to one of saved wifi');
          } else {
              let date = this.transDate.transformTheDate(new Date(), "yyyy-MM-dd HH:mm");
              this.load.startLoading('', false, 'loadingWithoutBackground');
              if(from == 'In'){
                  this.CallCheckIn(date);
              }else{
                  this.CallCheckOut(date);
              }
          }
      }
  }

  CallCheckIn(date){
      this.attend.checkInAttendance(date, this.accountServ.userId).subscribe(
          value => {
              let val = value;
              this.load.stopLoading();
              this.storage.set(this.localStorageAttendanceShift, JSON.stringify(val));
          }, error1 => {
              this.load.stopLoading().then(value => {
                  this.presentAlert('Alert', error1.error);
              });
          }
      );
  }

  CallCheckOut(date){
      this.attend.checkOutAttendance(date, this.userShiftData).subscribe(
          value => {
              let val = value;
              this.load.stopLoading();
              this.storage.set(this.localStorageAttendanceShift, JSON.stringify(val));
          }, error1 => {
              this.load.stopLoading().then(value => {
                  this.presentAlert('Alert', error1.error);
              });
          }
      );
  }

    checktheDateIn(date){
      let savedShiftDate = this.transDate.transformTheDate(new Date(date),"yyyy/MM/dd");
        let nowDate = this.transDate.transformTheDate(new Date(),"yyyy/MM/dd");

        if(savedShiftDate == nowDate){
            return true;
        }else{
            return false;
        }
    }

    checktheDateOut(){
        let savedShiftDate = this.transDate.transformTheDate(new Date(this.userShiftData.checkOutDate),"yyyy/MM/dd");
        let nowDate = this.transDate.transformTheDate(new Date(),"yyyy/MM/dd");

        if(savedShiftDate == nowDate){
            return true;
        }else{
            return false;
        }
    }

  getWifiIPAddress() {
      wifiinformation.getSampleInfo(wifi => {
          // alert(
          //     'SSID: ' + wifi.ssid +
          //     '\nMAC: ' + wifi.mac +
          //     '\nIP: ' + wifi.ip +
          //     '\nGateway: ' + wifi.gateway
          // );

          this.wifi = wifi;

          this.attend.addMethodData(this.accountServ.userBranchId, 1,JSON.stringify(wifi)).subscribe(
              value => {
                  alert(wifi.ssid+' saved as login wifi');
              },error1 => {
                  alert('Couldn\'t save '+wifi.ssid+'as login WiFi');
              }
          )

          }, (err) => console.error(err));
  }


    async presentAlert(head,msg) {
        const alert = await this.alertController.create({
            header: head,
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    // async getActiveDevices() {
    //     // get all active devices
    //     wifiinformation.getActiveDevices(success => {
    //         alert('Success: ' + JSON.stringify(success));
    //
    //     }, (err) => {
    //         console.error(err);
    //     });
    // }
    //
    // getDHCPInfo() {
    //     wifiinformation.getDHCPInfo(success => {
    //         alert('Success: ' + JSON.stringify(success));
    //
    //     }, (err) => console.error(err));
    // }
    //
    // getSampleInfo() {
    //     wifiinformation.getSampleInfo(wifi => {
    //         alert(
    //             'SSID: ' + wifi.ssid +
    //             '\nMAC: ' + wifi.mac +
    //             '\nIP: ' + wifi.ip +
    //             '\nGateway: ' + wifi.gateway
    //         );
    //
    //     }, (err) => console.error(err));
    // }

  onCore(){
    if(this.platform.is('desktop')){
      return true;
    }else {
      return false;
    }
  }

  onMobile(){
    if(!this.platform.is('desktop')){
      return true;
    }else {
      return false;
    }
  }

  // opend = true;
  // openComment(){
  //   if(this.opend) {
  //     this.commentAppear.nativeElement.name = "slideUp";
  //     this.opend = false;
  //   }else{
  //     this.commentAppear.nativeElement.name = "slideDown";
  //     this.opend = true;
  //   }
  // }

  ionViewDidLoad() {
  }

  async getNotificationINStorage(){
    await this.storage.get('Notifications').then(
        data =>{
          let notis:any = data;
          if(notis.length >0) {
            for (let temp of notis) {
              let PN = new Pendingnotification();
              PN.title = temp.title;
              PN.body = temp.body;
              PN.attachmentsList = temp.attachmentsList;
              PN.tagsList = temp.tagsList;
              PN.receiversList = temp.receiversList;
              this.pendingNotification.push(PN);
            }
          }
          this.storage.get(this.wifiUploadKey).then(
              wi=> {
                let wifiUpload:any = wi.wifi;
                let WIFIOn:boolean = false;
                if(wifiUpload){
                  WIFIOn = true;
                }
                if (WIFIOn && this.network.type == 'wifi') {
                  if(this.pendingNotification.length > 0) {
                    for (let temp of this.pendingNotification) {
                      if (temp.attachmentsList) {
                        let promisesArray = [];
                        for (let index = 0; index < temp.attachmentsList.length; index++) {
                          // let form: FormData = temp.attachmentsList[index];
                          let form = new FormData();
                          form.append('file', temp.attachmentsList[index]);
                          promisesArray.push(this.uploadAttach(form));
                        }
                        Promise.all(promisesArray).then(data => {
                          this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);
                        }).catch(e => {
                        });
                      }else {
                        this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);
                      }
                    }
                  }
                }else if(!WIFIOn){
                  for (let temp of this.pendingNotification) {
                    if (temp.attachmentsList) {
                      let promisesArray = [];
                      for (let index = 0; index < temp.attachmentsList.length; index++) {
                        // let form: FormData = temp.attachmentsList[index];
                        let form = new FormData();
                        form.append('file', temp.attachmentsList[index]);
                        promisesArray.push(this.uploadAttach(form));
                      }
                      Promise.all(promisesArray).then(data => {
                        this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);
                      }).catch(e => {
                      });
                    }else {
                      this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);
                    }
                  }
                }
              }).catch(e=>{
          });
        }).catch(e=>{
    });
  }

  SendNotificationBackground(title, details, postAttachment, RecieverArray, SelectedTags){
    let sentNotify:any[]=[];
    this.notiServ.postNotification(title, details, postAttachment, RecieverArray, SelectedTags).subscribe(
        // @ts-ignore
        (data) => {
          let PN = new Pendingnotification();
          PN.title = title;
          PN.body = details;
          PN.attachmentsList = postAttachment;
          PN.tagsList = RecieverArray;
          PN.receiversList = SelectedTags;
          sentNotify.push(PN);
        },
        err => {
        },
        () => {
          this.deleteFromStorage(sentNotify);
        });
  }


  async deleteFromStorage(sentNotify){
    let pendingNotification:any[] = [];
    await this.storage.get('Notifications').then(
        data =>{
          let notis = data;
          if(notis) {
            for (let temp of notis) {
              let PN = new Pendingnotification();
              let found = false;
              sentNotify.some( x => { found = true;});
              if(!found){
                PN.title = temp.title;
                PN.body = temp.body;
                PN.attachmentsList = temp.attachmentsList;
                PN.tagsList = temp.tagsList;
                PN.receiversList = temp.receiversList;
                pendingNotification.push(PN);
              }
            }
          }
          this.storage.remove("Notifications");
          this.storage.set("Notifications", pendingNotification);


        });
  }

  uploadAttach(formData){
    this.notiServ.postAttachment(formData).toPromise().then(
        s=> {
          let allData:any = s;
          if(allData.data != null){
            allData = JSON.parse(allData.data);
          }

          let attach = new Postattachment();
          attach.name = allData.name;
          attach.type = allData.type;
          attach.url = allData.url;
          attach.uploadDate = allData.date;
          this.arrayToPostAttachment.push(attach);
          return true;
        },
        e=> {
          return true;
        }
    ).catch(e=>{});
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("myAllnav").style.width = "100%";

  }
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("myAllnav").style.width = "0";
  }

  // editMenuView(){
  //   let intervaldata = setInterval(() => {
  //     if (document.getElementById('profilePage')) {
  //       if (!document.getElementById('profilePage').classList.contains("selected")) {
  //         document.getElementById('profilePage').classList.toggle("selected");
  //       }
  //       if (document.getElementById('logOutPage').classList.contains("selected")) {
  //         document.getElementById('logOutPage').classList.toggle("selected");
  //       }
  //     }
  //     clearInterval(intervaldata);
  //   },50);
  // }


}
