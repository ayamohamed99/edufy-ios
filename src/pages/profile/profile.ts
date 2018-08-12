import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {AccountService} from "../../services/account";
import {Postattachment} from "../../modles/postattachment";
import {Pendingnotification} from "../../modles/pendingnotification";
import {Storage} from "@ionic/storage";
import {Network} from "@ionic-native/network";
import {NotificationService} from "../../services/notification";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  name:string;
  userName:string;
  userPhone:string;
  userMail:string;
  userAddress:string;
  pendingNotification:any[]=[];
  arrayToPostAttachment:any[]=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,private platform:Platform,accountServ:AccountService
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
  }

  onCore(){
    if(this.platform.is('core')){
      return true;
    }else {
      return false;
    }
  }

  onMobile(){
    if(!this.platform.is('core')){
      return true;
    }else {
      return false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  async getNotificationINStorage(){
    let pendingNotification:any[];
    await this.storage.get('Notifications').then(
      data =>{
        let notis:any = data;
        if(notis) {
          for (let temp of notis) {
            let PN = new Pendingnotification();
            PN.title = temp.title;
            PN.body = temp.body;
            PN.attachmentsList = temp.attachmentsList;
            PN.tagsList = temp.tagsList;
            PN.receiversList = temp.receiversList;
            pendingNotification.push(PN);
          }
        }
        this.network.onConnect().subscribe((e) => {
          console.log('network:',e);
          if (this.network.type == 'wifi') {
            console.log('network:onlineWithWifi');
            for(let temp of this.pendingNotification){
              if (temp.attachmentsList) {
                for (let formData in temp.attachmentsList) {
                  this.uploadAttach(formData);
                }
              }
              this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);

            }
          }
        },error2 => {
          console.log("error onConnent: ",error2);
        });
      }).catch(e=>{
      console.log('error: ',JSON.stringify(JSON.parse(e)));
    });
  }

  async SendNotificationBackground(title, details, postAttachment, RecieverArray, SelectedTags){
    let sentNotify:any[]=[];
    await this.notiServ.postNotification(title, details, postAttachment, RecieverArray, SelectedTags).subscribe(
      (data) => {
        console.log("network POST wait to call Date Is", JSON.stringify(data));
        let PN = new Pendingnotification();
        PN.title = title;
        PN.body = details;
        PN.attachmentsList = postAttachment;
        PN.tagsList = RecieverArray;
        PN.receiversList = SelectedTags;
        sentNotify.push(PN);
      },
      err => {
        console.log("network POST wait to call error", JSON.stringify(err));
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

  async uploadAttach(formData){
    await this.notiServ.postAttachment(formData).subscribe(
      s=> {
        console.log('Success post => ' + JSON.stringify(s));
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
        console.log('error post => '+JSON.stringify(e));
        return true;
      }
    );
  }

}
