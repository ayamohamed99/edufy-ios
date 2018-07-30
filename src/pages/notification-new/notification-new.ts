import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, NavParams, Platform, ToastController,
  ViewController,ActionSheetController
} from 'ionic-angular';
import {NotificationService} from "../../services/notification";
import { Network } from '@ionic-native/network';
import {AccountService} from "../../services/account";
import {Class} from "../../modles/class";
import {Student} from "../../modles/student";
import {Autocomplete_shown_array} from "../../modles/autocomplete_shown_array";
import {Send_student_notification} from "../../modles/send_student_notification";
import { Storage } from "@ionic/storage";
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileChooser } from '@ionic-native/file-chooser';
import { Camera } from '@ionic-native/camera';
import {File, FileEntry} from "@ionic-native/file";
import firebase from "firebase";
import {AutoCompleteOps} from "angular2-tag-input/dist/lib/shared/tag-input-autocompleteOps";
import {FileUploadOptions} from "@ionic-native/transfer";
import {NgForm} from "@angular/forms";
import {AttachmentList} from "../../modles/attachmentlist";


@IonicPage()
@Component({
  selector: 'page-notification-new',
  templateUrl: 'notification-new.html',
})
export class NotificationNewPage {
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  wifiUploadKey = 'WIFI_UPLOAD';
  sendTo:any[] = [];
  Title:string;
  Details:string;
  name: string;
  tags:any[] = [];
  preparedTags:any = [];
  allStudentList:any[] = [];
  updateTags:any[]=[];
  tagsArr:any[] = [];

  allClasses:Class[] = [];
  allStudentNames:any[]=[];
  allStudentsDetails:any[]=[];
  autocompleteArray:AutoCompleteOps<any>;

  attachmentButtonName:string = "Add New Attachment";
  attachmentArray:any[] = [];
  chooseAllClasses:any[] = [];

  @ViewChild('file') inputEl: ElementRef;

  constructor(public navParams: NavParams,public viewCtrl: ViewController,public notiServ:NotificationService,
              public network:Network,private toastCtrl: ToastController, private platform:Platform,
              private accServ:AccountService, private alertCtrl:AlertController, private loadingCtrl:LoadingController,
              public actionSheetCtrl: ActionSheetController, private storage:Storage, private fromGallery: Camera,
              private androidFile: FileChooser, private iosFile: IOSFilePicker, private file:File)
  {

    this.tagsArr = accServ.tagArry;
    this.Title =this.navParams.get('title');
    this.Details=this.navParams.get('details');

    this.allStudentNames=this.navParams.get('studetsNameList');
    this.allStudentsDetails=this.navParams.get('studentsdetailsList');
    let reciverArray = this.navParams.get('recieverList');
    this.tags = this.navParams.get('tagList');
    if(reciverArray) {
      for (let temp of reciverArray) {
        let autoShownReciever = new Autocomplete_shown_array();
        autoShownReciever.id = temp.id;
        autoShownReciever.name = temp.name;
        autoShownReciever.type = temp.type;
        this.sendTo.push(autoShownReciever);
      }
    }

    //+++++++++All Classes+++++++++
    let autoShownAllClasses = new Autocomplete_shown_array();
    autoShownAllClasses.id = -1;
    autoShownAllClasses.name = "All Class";
    autoShownAllClasses.dataList=this.chooseAllClasses;

    //+++++++++Classes+++++++++
    this.allClasses=this.navParams.get('classesList');
    for (let classes of this.allClasses){
      let autoShownClasses = new Autocomplete_shown_array();
      autoShownClasses.id = classes.classId;
      autoShownClasses.name = classes.grade.gradeName+" "+classes.className;
      autoShownClasses.type = "Class";
      autoShownClasses.header = classes.branch.branchName;
      this.chooseAllClasses.push(autoShownClasses);
      this.preparedTags.push(autoShownClasses);
    }

    this.preparedTags.push( autoShownAllClasses);

    console.log("see", this.preparedTags);

    //++++++++++++++Students+++++++++++++++++++++
    for (let student of this.allStudentsDetails){
      let autoShownStudents = new Autocomplete_shown_array();
      autoShownStudents.id = student.studentId;
      autoShownStudents.name = student.studentName;
      autoShownStudents.type = "Student";
      autoShownStudents.header = student.studentClass.grade.gradeName+" "+student.studentClass.className;
      this.preparedTags.push(autoShownStudents);
    }
    console.log("see2", this.preparedTags);

    this.autocompleteArray = {

      toString: item => item.name,
      // searchIn: (item, inputValue) => {return item.studentName.indexOf(inputValue) > -1}
      searchIn: ["name"],
      groupByHeader: item => {if(item.header == null){return ""}else{return item.header}}

    };

    console.log('NetWork '+network.type);

    let disconnectSubscription = this.network.onDisconnect().subscribe(() => console.log('network was disconnected :-('));
    console.log('Network '+disconnectSubscription);

    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
    console.log('Network '+connectSubscription);

    let tokenKey;
    if (platform.is('core')) {

      tokenKey = localStorage.getItem(this.localStorageToken);
      this.notiServ.putHeader(localStorage.getItem(this.localStorageToken));
    } else {

      storage.get(this.localStorageToken).then(
        val => {
          tokenKey = val;
          this.notiServ.putHeader(val);
        });
    }
  }

  sendNotification() {

    let wifiUpload;

    this.storage.get(this.wifiUploadKey).then(
      value => {
        if(value == 'true'){
          wifiUpload = true;
        }else{
          wifiUpload = false;
        }
      },
      (err)=> {
        console.log('ERROR'+err)
      })
      .catch((err)=>{
        console.log('ERROR'+err)
  });


    let RecieverArray:any[] = [];

    if(this.sendTo.some(x => x.id === -1))
    {
      for(let temp of this.sendTo){
        for(let sub of temp.dataList){
          let ssn = new Send_student_notification();
          ssn.id = sub.id;
          ssn.type = sub.type;
          ssn.name = sub.name;
          RecieverArray.push(ssn);
        }
      }
    }else{
      for(let temp of this.sendTo){
        let ssn = new Send_student_notification();
        ssn.id = temp.id;
        ssn.type = temp.type;
        ssn.name = temp.name;
        RecieverArray.push(ssn);
      }
    }

    let SelectedTags:any[]=[];
    for(let tag of this.tags){
      for(let tagArr of this.tagsArr)
      if(tagArr.name === tag){
        SelectedTags.push(tagArr);
      }
    }
    let loading = this.loadingCtrl.create({
      content: ""
    });

    if (!this.platform.is('core')) {
      loading.present();
      this.notiServ.postNotification(this.Title, this.Details, null, RecieverArray, SelectedTags).subscribe(
        (data) => {
          console.log("Date Is", data);
          loading.dismiss();
          this.viewCtrl.dismiss({name:'dismissed&SENT'});
        },
        err => {
          console.log("POST call in error", err);
          loading.dismiss();
          this.presentConfirm(err);
          },
        () => console.log("The POST observable is now completed."));
    } else if (this.platform.is('core')){
      loading.present();
      // this.talks.push({name: this.name, topics: this.topics});
      this.notiServ.postNotification(this.Title, this.Details, null, RecieverArray, SelectedTags).subscribe(
        (data) => {
          console.log("Date Is", data);
          loading.dismiss();
          this.viewCtrl.dismiss({name:'dismissed&SENT'});
        },
        err => {
          console.log("POST call in error", err);
            loading.dismiss();
          this.presentConfirm(err);
        },
            () =>{
          console.log("The POST observable is now completed.")
        });
    }

  }

  close(){
    this.viewCtrl.dismiss({name:'dismissed'});
  }

  activeSend(){
    if(this.sendTo && (this.sendTo.length > 0) && this.Title && this.Details){
      return true;
    }else{
      return false;
    }
  }

  checkArray(){
    if(this.sendTo) {
      if (this.sendTo.some(x => x.id === -1)) {
        this.sendTo.splice(0);
        let autoShownAllClasses = new Autocomplete_shown_array();
        autoShownAllClasses.id = -1;
        autoShownAllClasses.name = "All Class";
        autoShownAllClasses.dataList = this.chooseAllClasses;
        this.sendTo.push(autoShownAllClasses)
      }
      else if (this.sendTo.some(x => x.type === "Class") && this.sendTo.some(y => y.type === "Student")) {
        let TempClassessArray: any[] = [];
        for (let selectedClasses of this.sendTo) {
          if (selectedClasses.type == "Class") {
            TempClassessArray.push(selectedClasses);
          }
        }

        for (let selected of this.sendTo) {
          if (selected.type === "Student") {
            for (let temp of TempClassessArray) {
              for (let tempStudent of temp.dataList) {
                if (tempStudent.id == selected.id) {
                  let index = this.sendTo.indexOf(selected);
                  this.sendTo.splice(index, 1);
                }
              }
            }
          }
        }
      }
    }
    console.log(this.sendTo);
  }

  presentConfirm(err:string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      message: err,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Retry',
          handler: () => {
            this.sendNotification();
          }
        }
      ]
    });
    alert.present();
  }




  // async uploadToStorage(readUrl, name, type){
  //   // let blob = new Blob([readUrl], {type:"image/jpg"});
  //
  //   let typeString = "application/"+type;
  //
  //   let blob = new Blob([readUrl], {type:typeString});
  //
  //   this.notiServ.postAttachment(blob).subscribe(
  //     s => console.log("ddd",JSON.stringify(s)),
  //     e => console.log("ddd",JSON.stringify(e))
  //   );


    // let storage = firebase.storage();
    //
    // storage.ref("edufyTeacher/"+name).put(blob)
    //   .then( (d)=> {
    //   alert("send res"+JSON.stringify(d));
    //   console.log("ddd",JSON.stringify(d));
    // }).catch( (e) => {
    //
    //
    //   alert("err"+JSON.stringify(e));
    //   storage.ref("edufyTeacher/"+name).getDownloadURL().then(url =>{
    //     console.log(JSON.stringify(url));
    //   }).catch(
    //     (e) => {
    //       alert("link err : "+JSON.stringify(e));
    //     });
    //
    //   console.log("storage err : ",JSON.stringify(e));
    // });
  // }
  filesChange(){
    let loading = this.loadingCtrl.create({
      content: ""
    });

    let inputEl: HTMLInputElement = this.inputEl.nativeElement;
    let fileCount: number = inputEl.files.length;
    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount; i++) {
        let formData = new FormData();
        formData.append('file', inputEl.files.item(i));
        this.notiServ.postAttachment(formData).subscribe(
          s=> {
            console.log('Success post => ' + JSON.stringify(s));
            let allData:any = s;
            let attach = new AttachmentList();
            attach.name = allData.name;
            attach.type = allData.type;
            attach.url = allData.url;
            this.attachmentArray.push(attach);
            loading.dismiss();
          },
              e=> {
            console.log('error post => '+JSON.stringify(e));
                this.alertCtrl.create( {
                  title: 'Error',
                  subTitle: 'Can\'t upload the attachment, please try later',
                  buttons: ['OK']
                }).present();
                loading.dismiss();

          }
        );
      }

      // do whatever you do...
      // subscribe to observable to listen for response
    }
    }
}

