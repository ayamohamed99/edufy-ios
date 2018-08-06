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
import {AutoCompleteOps} from "angular2-tag-input/dist/lib/shared/tag-input-autocompleteOps";
import {FileUploadOptions} from "@ionic-native/transfer";
import {NgForm} from "@angular/forms";
import {AttachmentList} from "../../modles/attachmentlist";
import {Postattachment} from "../../modles/postattachment";


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
  fileTypes=["jpg","jpeg","png","gif","ico","bmp","webp","tiff","pdf","txt","xls","xlsx","doc","docx","ppt","pptx","mp4","flv",
  "avi","mov","wmv","mp3","wma"];
  showSupportFiles:boolean;
  wifiUpload:boolean;
  placeHolder:string;

  @ViewChild('file') inputEl: ElementRef;

  constructor(public navParams: NavParams,public viewCtrl: ViewController,public notiServ:NotificationService,
              public network:Network,private toastCtrl: ToastController, private platform:Platform,
              private accServ:AccountService, private alertCtrl:AlertController, private loadingCtrl:LoadingController,
              public actionSheetCtrl: ActionSheetController, private storage:Storage, private fromGallery: Camera,
              private androidFile: FileChooser, private iosFile: IOSFilePicker, private file:File)
  {
    this.placeHolder = "To :";
    this.showSupportFiles = false;
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
      autoShownStudents.studentClassId = student.studentClass.classId;
      this.preparedTags.push(autoShownStudents);
    }
    console.log("see2", this.preparedTags);

    this.autocompleteArray = {

      toString: item => item.name,
      // searchIn: (item, inputValue) => {return item.studentName.indexOf(inputValue) > -1}
      searchIn: ["name"],
      groupByHeader: item => {if(item.header == null){return ""}else{return item.header}}

    };

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

    this.storage.get(this.wifiUploadKey).then(
      value => {
        if(value == 'true'){
          this.wifiUpload = true;
        }else{
          this.wifiUpload = false;
        }
      },
      (err)=> {
        console.log('ERROR'+err);
        this.wifiUpload = false;
      })
      .catch((err)=>{
        console.log('ERROR'+err);
        this.wifiUpload = false;
      });
  }

  sendNotification() {

    let RecieverArray:any[] = [];

    if(this.sendTo && this.sendTo.some(x => x.id === -1))
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
    if(this.tags) {
      for (let tag of this.tags) {
        for (let tagArr of this.tagsArr)
          if (tagArr.name === tag) {
            SelectedTags.push(tagArr);
          }
      }
    }



    this.network.onDisconnect().subscribe((e) => {
      console.log(JSON.stringify(e));
      let alert = this.alertCtrl.create({
        title: '',
        message: "Your internet is not working please check it and will continue upload after the phone connect to the internet again",
        buttons:["ok"]
      });
      alert.present();
    });


    if (!this.platform.is('core')) {

      this.network.onConnect().subscribe(() => {
        console.log('network connected!');
        setTimeout(() => {

          this.uploadFromMobile(RecieverArray,SelectedTags);

        }, 3000);
      });

    } else if (this.platform.is('core')){
      this.network.onConnect().subscribe(() => {
        console.log('network connected!');
        setTimeout(() => {

          this.uploadFromWeb(RecieverArray,SelectedTags);

        }, 3000);
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
            for (let tempClass of TempClassessArray) {
                if (tempClass.id == selected.studentClassId) {
                  let index = this.sendTo.indexOf(selected);
                  this.sendTo.splice(index, 1);
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

  filesChange() {

    let inputEl: HTMLInputElement = this.inputEl.nativeElement;
    let fileCount: number = inputEl.files.length;
    let faildFilesNamesSize: any[] = [];
    let faildFilesNameseExtantion: any[] = [];
    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount; i++) {
        let num: number = inputEl.files.item(i).size;
        let fileName = inputEl.files.item(i).name;
        let fileExtintion: string = fileName.slice(fileName.length - 4);
        fileExtintion = fileExtintion.replace('.', '');
        if (num <= 26214400 && this.fileTypes.find(x => x == fileExtintion)) {
          let formData = new FormData();
          formData.append('file', inputEl.files.item(i));
          this.uploadAttach(formData);
        } else if (num > 26214400) {
          faildFilesNamesSize.push(inputEl.files.item(i).name);
        } else {
          faildFilesNameseExtantion.push(inputEl.files.item(i).name);
        }
      }
    }
    if (faildFilesNamesSize.length > 0 && faildFilesNameseExtantion.length <= 0) {
      alert('Can\'t upload files name: ' + faildFilesNamesSize.join(',') + ' because it is bigger than 25 Mb');
    } else if (faildFilesNamesSize.length <= 0 && faildFilesNameseExtantion.length > 0) {
      this.showSupportFiles = true;
      alert('Can\'t upload files name: ' + faildFilesNameseExtantion.join(',') + ' because it is not supported');
    } else if (faildFilesNamesSize.length > 0 && faildFilesNameseExtantion.length > 0) {
      this.showSupportFiles = true;
      alert('Can\'t upload files name: ' + faildFilesNamesSize.join(',') + ' because it is bigger than 25 Mb and' +
        ' files name: ' + faildFilesNameseExtantion.join(',') + ' because it is not supported.');
    }
  }

    async uploadAttach(formData){
      let loading = this.loadingCtrl.create({
        content: ""
      });
      loading.present();
      await this.notiServ.postAttachment(formData).subscribe(
        s=> {
          console.log('Success post => ' + JSON.stringify(s));
          let allData:any = s;
          let attach = new Postattachment();
          attach.name = allData.name;
          attach.type = allData.type;
          attach.url = allData.url;
          attach.uploadDate = allData.date;
          this.attachmentArray.push(attach);
          loading.dismiss();
          return true;
        },
        e=> {
          console.log('error post => '+JSON.stringify(e));
          this.alertCtrl.create( {
            title: 'Error',
            subTitle: 'Can\'t upload the attachment, please try later',
            buttons: ['OK']
          }).present();
          loading.dismiss();
          return true;
        }
      );
    }

  deleteAttach(attachIndex:any){
    let alert = this.alertCtrl.create({
      title: 'Alert',
      message: 'Are you sure that you want to delete this attachment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.attachmentArray.splice(attachIndex, 1);
          }
        }
      ]
    });
    alert.present();
  }



  uploadFromMobile(RecieverArray,SelectedTags){
    let loading = this.loadingCtrl.create({
      content: ""
    });

    if(this.wifiUpload && this.network.type != 'wifi'){
      this.presentConfirm('You have been activated upload by \"WiFi only\", so close it or open wifi then try again');
    }else {
      loading.present();
      this.notiServ.postNotification(this.Title, this.Details, this.attachmentArray, RecieverArray, SelectedTags).subscribe(
        (data) => {
          console.log("Date Is", data);
          loading.dismiss();
          this.viewCtrl.dismiss({name: 'dismissed&SENT'});
        },
        err => {
          console.log("POST call in error", err);
          loading.dismiss();
          this.presentConfirm(err);
        },
        () => console.log("The POST observable is now completed."));
    }
  }

  uploadFromWeb(RecieverArray,SelectedTags){
    let loading = this.loadingCtrl.create({
      content: ""
    });

    loading.present();
    // this.talks.push({name: this.name, topics: this.topics});
    this.notiServ.postNotification(this.Title, this.Details, this.attachmentArray, RecieverArray, SelectedTags).subscribe(
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

