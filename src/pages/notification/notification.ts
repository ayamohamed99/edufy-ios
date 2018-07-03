import { Component } from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, ModalController, Platform, PopoverController
} from 'ionic-angular';
import {NotificationNewPage} from "../notification-new/notification-new";
import {NotificationService} from "../../services/notification";
import {PopoverNotificationCardPage} from "./popover_notification/popovernotificationcard";
import {Notification} from "../../modles/notification";
import {Storage} from "@ionic/storage";
import {NotificationEditPage} from "./popover_notification/notification-edit/notification-edit";
import {AccountService} from "../../services/account";
import {Class} from "../../modles/class";
import {StudentsService} from "../../services/students";
import {Student} from "../../modles/student";


@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  notifications:Notification[] = [];
  notificationPage=1;
  loading:any;
  fristOpen:boolean = true;
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  tokenKey:string;
  tagsArr:any = [];

  classes = [];
  studentsName:any = [];
  studentwithClass:any = [];

  constructor(private alrtCtrl:AlertController,private platform:Platform,private storage:Storage,
              private modalCtrl: ModalController,private notificationService:NotificationService,
              private popoverCtrl: PopoverController, private load:LoadingController, private accService:AccountService,
              private studentService:StudentsService) {

    if(platform.is('core')) {

      this.tokenKey = localStorage.getItem(this.localStorageToken);
      notificationService.putHeader(localStorage.getItem(this.localStorageToken));
      this.getNotifications(this.notificationPage,0,0,null,null,null,0);
    }else {

      storage.get(this.localStorageToken).then(
        val=>{
          this.tokenKey = val;
          notificationService.putHeader(val);
          this.getNotifications(this.notificationPage,0,0,null,null,null,0);
        });
    }

    this.tagsArr = accService.accountBranchesList;
    this.notificationService.getClassList().subscribe((value)=>{
      let allData:any = value;
      for(let data of allData){
        let item = new Class();
        console.log(value);
        item.classId = data.id;
        item.className = data.name;
        item.grade.gradeId = data.grade.id;
        item.grade.gradeName = data.grade.name;
        item.branch.branchId = data.branch.id;
        item.branch.branchName = data.branch.name;
        item.branch.managerId = data.branch.managerId;

        this.classes.push(item);
      }
    },
      err=> console.log(err));

  }

  fullString(fristPart:string, secoundPart:string){
    return fristPart+' '+secoundPart;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  onSelectCard(event:Event, id:number, title:string, details:string,reciversList:any,tagsList:any, i:any){
    let popover = this.popoverCtrl.create(PopoverNotificationCardPage, {id:id, title:title, details:details});

    popover.onDidDismiss(data => {
      console.log(data);
      if(data == null) {
        console.log('dissmiss');
      }else{
      if(data.done === 'deleteSuccess') {
        this.fristOpen = true;
        this.notifications.splice(0);
        this.notificationPage = 1;

        this.notificationService.putHeader(this.tokenKey);
        this.getNotifications(this.notificationPage,0,0,null,null,null,0);

      }else if (data.done === 'updateSuccess'){
        console.log(data.done);
        this.fristOpen = true;

        let model = this.modalCtrl.create(NotificationEditPage,{id:data.id,title:data.title,
          details:data.details});
        model.onDidDismiss(()=>{
          this.notifications.splice(0);
          this.notificationPage = 1;

          this.notificationService.putHeader(this.tokenKey);
          this.getNotifications(this.notificationPage,0,0,null,null,null,0);
        });
        model.present();

      }else if(data.done === 'newSuccess'){
        this.fristOpen = true;
        console.log(data.done);
        let model = this.modalCtrl.create(NotificationNewPage,{id:id,title:title, details:details, classesList:this.classes,
          studetsNameList:this.studentsName, studentsdetailsList:this.studentwithClass,recieverList:reciversList,tagList:tagsList});
        model.onDidDismiss(()=>{
          this.notifications.splice(0);
          this.notificationPage = 1;

          this.notificationService.putHeader(this.tokenKey);
          this.getNotifications(this.notificationPage,0,0,null,null,null,0);
        });
        model.present();

      }
      }
    });

    popover.present({ev: event});
  }

  onOpenView() {
    let model = this.modalCtrl.create(NotificationNewPage,{classesList:this.classes,
      studetsNameList:this.studentsName, studentsdetailsList:this.studentwithClass});
    model.present();

    model.onDidDismiss(data => {
      if(data.name =="dismissed&SENT"){
        this.fristOpen = true;
        this.notifications.splice(0);
        this.notificationPage = 1;

        this.notificationService.putHeader(this.tokenKey);
        this.getNotifications(this.notificationPage,0,0,null,null,null,0);
      }
    });
  }

  getNotifications(pageNumber:number,userId:number,classId:number,approved:string,archived:string,sent:string,tagId:number){
    if(this.fristOpen) {
      this.loading = this.load.create({
        content: 'Loading Notification...'
      });
      this.loading.present();
      this.fristOpen = false;
    }

    this.notificationService.getNotification(pageNumber,userId,classId,approved,archived,sent,tagId).subscribe(
      (data) => {
        console.log("Date Is", data);
        let allData:any = data;
        for (let value of allData){
          let notify = new Notification;
          notify.attachmentsList = value.attachmentslist;
          notify.body = value.body;
          notify.dateTime =  value.dateTime;
          notify.notificationId = value.id;
          notify.title = value.title;
          notify.receiversList = value.receiversList;
          notify.senderName = value.senderName;
          notify.tagsList = value.tagsList;
          if(value.tagsList != null) {
            notify.tagsListName = value.tagsList.name;
          }

          this.notifications.push(notify);
        }

        if(this.platform.is('core')) {

          this.tokenKey = localStorage.getItem(this.localStorageToken);
          this.studentService.putHeader(localStorage.getItem(this.localStorageToken));
          this.getAllStudent();
        }else {

          this.storage.get(this.localStorageToken).then(
            val=>{
              this.tokenKey = val;
              this.studentService.putHeader(val);
              this.getAllStudent();
            });
        }
      },
      err => {
        console.log("POST call in error", err);
        this.loading.dismiss();
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      },
      () => {
        console.log("The POST observable is now completed.");
      });
  }

  doInfinite(){
    console.log('Begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {

        this.notificationPage += this.notificationPage + 1;
        this.getNotifications(this.notificationPage,0,0,null,null,null,0);

        console.log('Async operation has ended');
        resolve();
      }, 500);
    })
  }


  getAllStudent(){
    this.studentService.getAllStudents('Notification').subscribe(
      (val)=>{
       console.log(val);
       let data:any = val;
       for (let value of data){
         let students = new Student();

         students.studentClass.classId = value.classes.id;
         students.studentClass.className = value.classes.name;
         students.studentClass.grade.gradeId = value.classes.grade.id;
         students.studentClass.grade.gradeName = value.classes.grade.name;
         students.studentClass.branch.branchId = value.classes.branch.id;
         students.studentClass.branch.branchName = value.classes.branch.name;
         students.studentClass.branch.managerId = value.classes.branch.managerId;
         students.studentId = value.id;
         students.studentName = value.name;
         students.studentAddress = value.address;

         this.studentsName.push(value.name);
         this.studentwithClass.push(students);
         console.log(students);
       }

       console.log(this.studentwithClass.count);

       console.log(this.studentsName);

        console.log(this.studentwithClass);
       this.loading.dismiss();
      },
      err=>{
        console.log('GetAllStudent Error: '+err);
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: 'Something went wrong, please refresh the page',
          buttons: ['OK']
        }).present();
        this.loading.dismiss();
      });
  }

  // notificationsReciver(){
  //   this.notificationService.getNotificationReceivers(6094).subscribe(
  //     (data) => {
  //       console.log("Date Is", data);
  //     },
  //     err => {
  //       console.log("POST call in error", err);
  //     },
  //     () => {
  //       console.log("The POST observable is now completed.");
  //     });
  // }

}
