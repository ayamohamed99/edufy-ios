import { Component } from '@angular/core';
import {IonicPage, NavParams, Platform, ToastController, ViewController} from 'ionic-angular';
import {NotificationService} from "../../services/notification";
import { Network } from '@ionic-native/network';
import {AccountService} from "../../services/account";
import {Class} from "../../modles/class";
import {Student} from "../../modles/student";
import {AutoCompleteOps} from "angular2-tag-input/dist/lib/shared/tag-input-autocompleteOps";
import {Autocomplete_shown_array} from "../../modles/autocomplete_shown_array";


@IonicPage()
@Component({
  selector: 'page-notification-new',
  templateUrl: 'notification-new.html',
})
export class NotificationNewPage {
  sendTo:any[] = [];
  Title:string;
  Details:string;
  name: string;
  tags = [];
  preparedTags:any = [];
  allStudentList:any[] = [];

  tagsArr = [];

  allClasses = [];
  allStudentNames=[];
  allStudentsDetails=[];
  autocompleteArray:AutoCompleteOps<any>;

  attachmentButtonName:string = "Add New Attachment";
  attachmentArray:any;
  chooseAllClasses:any[] = [];

  constructor(public navParams: NavParams,public viewCtrl: ViewController,public notiServ:NotificationService,
              public network:Network,private toastCtrl: ToastController, private platform:Platform, private accServ:AccountService)
  {

    this.tagsArr = accServ.tagArry;
    this.Title =this.navParams.get('title');
    this.Details=this.navParams.get('details');
    this.allClasses=this.navParams.get('classesList');
    this.allStudentNames=this.navParams.get('studetsNameList');
    this.allStudentsDetails=this.navParams.get('studentsdetailsList');

    //+++++++++All Classes+++++++++
    let autoShownAllClasses = new Autocomplete_shown_array();
    autoShownAllClasses.id = -1;
    autoShownAllClasses.name = "All Class";
    autoShownAllClasses.dataList=this.chooseAllClasses;

    //+++++++++Classes+++++++++

    for (let classes of this.allClasses){
      let autoShownClasses = new Autocomplete_shown_array();
      autoShownClasses.id = classes.classId;
      autoShownClasses.name = classes.grade.gradeName+" "+classes.className;
      autoShownClasses.type = "Class";
      autoShownClasses.header = classes.branch.branchName;

      for (let studentForClass of this.allStudentsDetails){

        let autoShownstudentForClass = new Autocomplete_shown_array();
        autoShownstudentForClass.id = studentForClass.studentId;
        autoShownstudentForClass.name =studentForClass.studentName ;
        autoShownstudentForClass.type = "Student";

        if(studentForClass.studentClass.classId == classes.classId) {
          autoShownClasses.dataList.push(autoShownstudentForClass);
        }
      }

      this.chooseAllClasses.push(autoShownClasses);
      this.preparedTags.push(autoShownClasses);
    }

    this.preparedTags.push( autoShownAllClasses);



    //++++++++++++++Students+++++++++++++++++++++
    for (let student of this.allStudentsDetails){
      let autoShownStudents = new Autocomplete_shown_array();
      autoShownStudents.id = student.studentId;
      autoShownStudents.name = student.studentName;
      autoShownStudents.type = "Student";
      autoShownStudents.header = student.studentClass.grade.gradeName+" "+student.studentClass.className;
      this.preparedTags.push(autoShownStudents);
    }

    this.autocompleteArray = {

      toString: item => item.name,
      // searchIn: (item, inputValue) => {return item.studentName.indexOf(inputValue) > -1}
      searchIn: ["name"],
      groupByHeader: item => {if(item.header == null){return ""}else{return item.header}}

    };

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
    if(this.sendTo.some(x => x.id === -1)){
      this.sendTo.splice(0);
      let autoShownAllClasses = new Autocomplete_shown_array();
      autoShownAllClasses.id = -1;
      autoShownAllClasses.name = "All Class";
      autoShownAllClasses.dataList=this.chooseAllClasses;
      this.sendTo.push(autoShownAllClasses)
    }else if(this.sendTo.some(x => x.type === "Class") && this.sendTo.some(y => y.type === "Student") ){
      let TempClassessArray:any[] = [];
      for(let selectedClasses of this.sendTo){
        if(selectedClasses.type == "Class"){
          TempClassessArray.push(selectedClasses);
        }
      }

      for(let selected of this.sendTo){
        if(selected.type === "Student"){
          for(let temp of TempClassessArray) {
            for(let tempStudent of temp.dataList){
              if(tempStudent.id == selected.id){
                this.sendTo.splice(this.sendTo.indexOf(selected),1);
              }
            }
          }
        }
      }
    }

    console.log(this.sendTo);
  }

  buttonName(){
    if(this.attachmentArray.size === 0){
      this.attachmentButtonName = "Add New Attachment";
    }else{
      this.attachmentButtonName = "Add Another Attachment";
    }
  }








}

