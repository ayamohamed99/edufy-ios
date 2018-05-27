import { Component } from '@angular/core';
import {IonicPage, NavParams, Platform, ToastController, ViewController} from 'ionic-angular';
import {NotificationService} from "../../services/notification";
import { Network } from '@ionic-native/network';
import {AccountService} from "../../services/account";
import {Classes} from "../../modles/classes";
import {Students} from "../../modles/students";


@IonicPage()
@Component({
  selector: 'page-notification-new',
  templateUrl: 'notification-new.html',
})
export class NotificationNewPage {
  sendTo = [];
  Title:string;
  Details:string;
  name: string;
  talks = [];
  tags = [];
  preparedTags = [ 'All Classes'];

  tagsArr = [];

  allClasses = [];
  allStudentNames=[];
  allStudentsDetails=[];

  constructor(public navParams: NavParams,public viewCtrl: ViewController,public notiServ:NotificationService,
              public network:Network,private toastCtrl: ToastController, private platform:Platform, private accServ:AccountService)
  {

    this.tagsArr = accServ.tagArry;
    this.Title =this.navParams.get('title');
    this.Details=this.navParams.get('details');
    this.allClasses=this.navParams.get('classesList');
    this.allStudentNames=this.navParams.get('studetsNameList');
    this.allStudentsDetails=this.navParams.get('studentsdetailsList');

    let classes = new Classes();
    for (classes of this.allClasses){
      this.preparedTags.push(classes.className);
    }

    let student = new Students();
    for(student of this.allStudentsDetails) {
      this.preparedTags.push(student.studentName);
    }

    console.log('NetWork '+network.type);

    let disconnectSubscription = this.network.onDisconnect().subscribe(() => console.log('network was disconnected :-('));
    console.log('Network '+disconnectSubscription );

    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
    console.log('Network '+connectSubscription );
  }

  sendNotification() {

    if (this.network.type === 'wifi' && !this.platform.is('core')) {
      // this.talks.push({name: this.name, topics: this.topics});
      this.notiServ.postNotification(this.Title, this.Details, null, this.sendTo, this.tags).subscribe(
        (data) => {
          console.log("Date Is", data);
        },
        err => console.log("POST call in error", err),
        () => console.log("The POST observable is now completed."));
    } else if (this.platform.is('core')){

      // this.talks.push({name: this.name, topics: this.topics});
      this.notiServ.postNotification(this.Title, this.Details, null, null, null).subscribe(
        (data) => {
          console.log("Date Is", data);
        },
        err => {
          console.log("POST call in error", err)
        },
            () =>{
          console.log("The POST observable is now completed.")
        });
    }else{

      this.toastCtrl.create({
        message: 'NO Internet connection',
        position: 'bottom',
        showCloseButton:true,
        closeButtonText:'OK',

      }).present();

    }

  }

  close(){
    this.viewCtrl.dismiss({name:'dismissed'});
  }

  activeSend(){
    if(this.sendTo.length <= 0){
      return false;
    }else{
      return true;
    }
  }

  checkArray(){
    if(this.sendTo.some(x => x === "All Classes")){
      this.sendTo.splice(0);
      this.sendTo.push('All Classes')
    }
  }








}
