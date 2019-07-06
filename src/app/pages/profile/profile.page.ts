import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Platform} from '@ionic/angular';
import {AccountService} from "../../services/Account/account.service";
import {Postattachment} from "../../models/postattachment";
import {Pendingnotification} from "../../models/pendingnotification";
import {Storage} from "@ionic/storage";
import {Network} from "@ionic-native/network/ngx";
import {NotificationService} from "../../services/Notification/notification.service";
import {Ng2ImgMaxService} from "ng2-img-max";
import {DomSanitizer} from "@angular/platform-browser";

declare var wifiinformation: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
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


  uploadedImage: File;
  imagePreview:any[]=[];

  attendanceButton = 'Check Attendance';



  // async onImageChange(event) {
  //   let images = event.target.files;
  //
  //   for(let image of images) {
  //     await this.optimizeImages(image);
  //   }
  // }
  //
  // async optimizeImages(image){
  //   await this.ng2ImgMax.resizeImage(image, 1024, 1024).subscribe(
  //     async result => {
  //       this.uploadedImage = new File([result], result.name);
  //       console.log(result.name);
  //       await this.getImagePreview(this.uploadedImage);
  //     },
  //     error => {
  //       console.log('😢 Oh no!', error);
  //     }
  //   );
  // }
  //
  // async getImagePreview(file: File) {
  //   const reader: FileReader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = async () => {
  //      this.imagePreview.push(reader.result);
  //   };
  // }




  constructor(private platform:Platform,private accountServ:AccountService
      ,private storage:Storage, private network:Network, private notiServ:NotificationService) {
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
  }

  ngOnInit() {
  }

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

    checkInOut(){
        this.getWifiIPAddress()
    }

    getWifiIPAddress() {
        wifiinformation.getWifiInfo(success => {
            alert('Success: ' + JSON.stringify(success));

        }, (err) => console.error(err));
    }

    async getActiveDevices() {
        // get all active devices
        wifiinformation.getActiveDevices(success => {
            alert('Success: ' + JSON.stringify(success));

        }, (err) => {
            console.error(err);
        });
    }

    getDHCPInfo() {
        wifiinformation.getDHCPInfo(success => {
            alert('Success: ' + JSON.stringify(success));

        }, (err) => console.error(err));
    }

    getSampleInfo() {
        wifiinformation.getSampleInfo(wifi => {
            alert(
                'SSID: ' + wifi.ssid +
                '\nMAC: ' + wifi.mac +
                '\nIP: ' + wifi.ip +
                '\nGateway: ' + wifi.gateway
            );

        }, (err) => console.error(err));
    }


}
