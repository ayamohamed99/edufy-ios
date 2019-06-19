import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import {AlertController} from "ionic-angular";
import {Platform} from "ionic-angular";
import {NotificationService} from "./notification";
import {Pendingnotification} from "../models/pendingnotification";
import {BackgroundMode} from "@ionic-native/background-mode";
import {Storage} from "@ionic/storage";
import {Postattachment} from "../models/postattachment";
import {Send_student_notification} from "../models/send_student_notification";
import {Network} from "@ionic-native/network";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {ImageCompressorService} from "./image-compress";
import {tap} from "rxjs/operators";
import {combineLatest} from "rxjs/observable/combineLatest";

@Injectable()
export class BackgroundNotificationService{

  wifiUpload:boolean;
  subscribtion;
  pendingNotification:any[]=[];
  arrayToPostAttachment:any[]=[];
  ifOpenWIFIANDNOTGOTOBACKGROUND;
  arrayFormData:any[]=[];
  loadingCtrl;
  Title;
  Details;
  viewCtrl;
  sendTo:any[] = [];
  tags:any[] = [];
  tagsArr:any[] = [];
  number:number = 1;
  loading;
  constructor(private platform:Platform, private notiServ:NotificationService,private backgroundMode:BackgroundMode,
              private storage:Storage,private alertCtrl:AlertController,public network:Network,
              private localNotifications: LocalNotifications,private compress:ImageCompressorService)
  {

    if(!this.platform.is('core')) {
      this.backgroundMode.enable();

      if (this.backgroundMode.isEnabled()) {
        console.log('backgroundMode isEnabled');
      }

      this.backgroundMode.on("activate").subscribe((s) => {
        console.log('background activate:', s);
      });
      this.network.onConnect().subscribe((e) => {console.log('network:',e);});
    }
  }


  compressTheImage(file){

    // let formData = new FormData();
    // let fileType = this.getFileType(file.name);
    // let pos = file.name.lastIndexOf('.');
    // let extension = file.name.substring(pos + 1);
    // if(fileType == "IMAGE" && extension != "gif") {
      return this.compress.compressImage(file).pipe(tap(
        result => {
          debugger;
          let data;
          let formData = new FormData();
          // if(result instanceof Blob){
          //   // data = new File([result], file.name, {type: result.type, lastModified: Date.now()});
          //   data = this.blobToFile(result,file.name);
          // }else{
            data = result;
          // }

          formData.append('file', data, data.name);
          console.log(JSON.stringify(formData));
          this.arrayFormData.push(data);

          // let reader = new FileReader();
          // reader.onloadend = function(e){
          //   // you can perform an action with readed data here
          //   console.log(reader.result);
          //   these.loading.dismiss();
          //   let attach = new Postattachment();
          //   attach.name = file.name;
          //   attach.type = "IMAGE";
          //   attach.url = reader.result;
          //   attach.file = file;
          //   these.attachmentArray.push(attach);
          //   resolve(resolve);
          // };
          // reader.readAsDataURL(file);

          // that.organizeData(inputEl, i, formData, result, fileType, fileName,result,result);
          // return result;
        }, error => {
          console.log('😢 Oh no!', error);
          // return error;
        }));
    // }else{
    //   // formData.append('file', file);
    //   return this.arrayFormData.push(file);
    // }
  }

  public blobToFile = (theBlob: Blob, fileName:string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }

  base64ToFile(base64Data, tempfilename, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    var file = new File(byteArrays, tempfilename, { type: contentType });
    return file;
  }

  toSendNotification(viewCtrl,Title, Details,arrayFiles,loadingCtrl){
    debugger;

    this.viewCtrl= viewCtrl;
    this.Title=Title;
    this.Details=Details;
    // this.arrayFormData=arrayFiles;
    let files:any[] = arrayFiles;
    this.loadingCtrl=loadingCtrl;
    this.startLocalNotification();
    let RecieverArray:any[] = [];
    this.loading = loadingCtrl.create({
      content: ""
    });
    this.loading.present();
    let promisesArray = [];
    for (let index = 0; index <files.length; index++) {
      // let form: FormData = this.arrayFormData[index];
      // let form = new FormData();
      let formData = new FormData();
      let file = files[index];
      let fileType = this.getFileType(file.name);
      let pos = file.name.lastIndexOf('.');
      let extension = file.name.substring(pos + 1);
      if(fileType == "IMAGE" && extension != "gif") {
        promisesArray.push(this.compressTheImage(files[index]));
      }else{
        // formData.append('file', file);
        this.arrayFormData.push(file);
      }
    }



    // Promise.all(promisesArray).then( data=> {

    combineLatest(promisesArray).subscribe(

      data=> {

      if(this.sendTo && this.sendTo.some(x => x.id === -1))
      {
        for(let temp of this.sendTo){
          for(let sub of temp.dataList){
            let ssn = new Send_student_notification();
            ssn.id = sub.id;
            if(sub.type == "STUDENT") {
              ssn.type = "Student";
            }else if(sub.type == "CLASS") {
              ssn.type = "Class";
            }else{
              ssn.type = sub.type;
            }
            ssn.name = sub.name;
            RecieverArray.push(ssn);
          }
        }
      }else{
        for(let temp of this.sendTo){
          let ssn = new Send_student_notification();
          ssn.id = temp.id;
          if(temp.type == "STUDENT") {
            ssn.type = "Student";
          }else if(temp.type == "CLASS") {
            ssn.type = "Class";
          }else{
            ssn.type = temp.type;
          }
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

      if (this.platform.is('core')){

        this.uploadFromWeb(RecieverArray,SelectedTags);

      }else{

        this.uploadFromMobile(RecieverArray,SelectedTags,this.viewCtrl,this.Title,
          this.Details,this.arrayFormData,this.loadingCtrl);

      }

    },
        e=>{
      console.log("Promises Error: "+e);
    });
  }


  uploadFromMobile(RecieverArray,SelectedTags,viewCtrl,title,details,arrayFromData,loadingCtrl){
    debugger;

    if((this.wifiUpload && !(this.network.type == 'wifi') )|| (this.wifiUpload && this.network.type ==  "none")){
      this.errNotification();
      alert('You have been activated upload by \"WiFi only\"');
      viewCtrl.dismiss({name: 'dismissed&SENT'});
      this.saveTheNewNotificationFrist(RecieverArray,SelectedTags,title,details,arrayFromData);
      this.backgroundMode.on("activate").subscribe((s)=>{
        console.log('network:',this.network.type);
        this.getNotificationINStorage();
      });
      this.ifOpenWIFIANDNOTGOTOBACKGROUND = this.network.onConnect().subscribe(s=>{
        this.getNotificationINStorageNOTINBACKGROUND();
      });

    }else {

      // let loading = loadingCtrl.create({
      //   content: ""
      // });
      // loading.present();
      if(this.arrayFormData) {
        let promisesArray = [];
        for (let index = 0; index <this.arrayFormData.length; index++) {
          // let form: FormData = this.arrayFormData[index];
          let form = new FormData();
          let fileType = this.getFileType(this.arrayFormData[index].name);
          if(fileType == "IMAGE") {
            form.append('file', this.arrayFormData[index], this.arrayFormData[index].name);
          }else{
            form.append('file', this.arrayFormData[index]);
          }
          promisesArray.push(this.uploadAttach(form));
        }
        Promise.all(promisesArray).then( data=> {
          let sentNotify:any[]=[];
          this.notiServ.postNotification(title, details, this.arrayToPostAttachment, RecieverArray, SelectedTags).subscribe(
            (data) => {
              console.log("POST without wait Date Is", JSON.stringify(data));
              let PN = new Pendingnotification();
              PN.title = title;
              PN.body = details;
              PN.attachmentsList = this.arrayToPostAttachment;
              PN.tagsList = SelectedTags;
              PN.receiversList = RecieverArray;
              sentNotify.push(PN);
              this.doneNotification();
              this.loading.dismiss();
              viewCtrl.dismiss({name: 'dismissed&SENT'});
            },
            err => {
              console.log("POST without wait error", JSON.parse(JSON.stringify(err.error)));
              this.loading.dismiss();
              this.errNotification();
              this.presentConfirm("Please check the internet and try again");
            },()=>{
              this.deleteFromStorage(sentNotify);
            });
        }).catch( e=>{
          console.log("Promises Error: "+e);
        });
      }else {
        let sentNotify: any[] = [];
        this.notiServ.postNotification(title, details, this.arrayToPostAttachment, RecieverArray, SelectedTags).subscribe(
          (data) => {
            debugger;
            console.log("POST without wait Date Is", JSON.stringify(data));
            let PN = new Pendingnotification();
            PN.title = title;
            PN.body = details;
            PN.attachmentsList = this.arrayToPostAttachment;
            PN.tagsList = SelectedTags;
            PN.receiversList = RecieverArray;
            sentNotify.push(PN);
            this.loading.dismiss();
            viewCtrl.dismiss({name: 'dismissed&SENT'});
          },
          err => {
            debugger;
            console.log("POST without wait error", JSON.parse(JSON.stringify(err.error)));
            this.loading.dismiss();
            this.presentConfirm("Please, check the internet then try again");
          }, () => {
            this.deleteFromStorage(sentNotify);
          });
      }
    }
  }









  async saveTheNewNotificationFrist(RecieverArray,SelectedTags,title,details,arrayFromData){
    this.storage.get('Notifications').then(
      data => {
        let pendingNotification: any[] = [];
        let notis: any = data;
        if (notis) {
          for (let temp of notis) {
            let PN = new Pendingnotification();
            PN.title = temp.title;
            PN.body = temp.body;

            PN.attachmentsList = temp.attachmentsList;
            PN.tagsList = temp.tagsList;
            PN.receiversList = temp.receiversList;
            pendingNotification.push(PN);
          }
          this.storage.remove('Notifications');
        }

        let PN = new Pendingnotification();
        PN.title = title;
        PN.body = details;
        PN.attachmentsList = arrayFromData;
        PN.tagsList = SelectedTags;
        PN.receiversList = RecieverArray;
        pendingNotification.push(PN);

        this.storage.set('Notifications',pendingNotification).catch(err=>{
          console.log("DATA Error: "+err);
        });

      });
  }






  async getNotificationINStorage(){
    await this.storage.get('Notifications').then(
      data =>{
        this.subscribtion = this.network.onConnect().subscribe((e) => {
          console.log('network:',e);
          if (this.network.type == 'wifi') {
            let notis:any = data;
            if(notis) {
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

            console.log('network:onlineWithWifi');
            if(this.pendingNotification.length > 0) {
              for (let temp of this.pendingNotification) {
                if (temp.attachmentsList) {
                  let promisesArray = [];
                  for (let index = 0; index < temp.attachmentsList.length; index++) {
                    // let form: FormData = temp.attachmentsList[index];
                    debugger;
                    let form = new FormData();
                    let fileType = this.getFileType(this.arrayFormData[index].name);
                    if(fileType == "IMAGE") {
                      form.append('file', this.arrayFormData[index], this.arrayFormData[index].name);
                    }else{
                      form.append('file', this.arrayFormData[index]);
                    }
                    promisesArray.push(this.uploadAttach(form));
                  }
                  Promise.all(promisesArray).then(data => {
                    this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);
                  }).catch(e => {
                    console.log("error" + e);
                  });
                }else{
                  this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);
                }
              }
            }
            this.subscribtion.unsubscribe();
          }
        },error2 => {
          console.log("error onConnent: ",error2);
        });
      }).catch(e=>{
      console.log('error: ',JSON.stringify(e));
    });
  }







  uploadAttach(formData){
    let errorAppear:boolean;
    debugger;
    return this.notiServ.postAttachment(formData).toPromise().then(
      s=> {
        console.log('Success post => ' + JSON.stringify(s));
        let allData:any = s;

        let attach = new Postattachment();
        attach.name = allData.name;
        attach.type = allData.type;
        attach.url = allData.url;
        attach.uploadDate = allData.date;
        this.arrayToPostAttachment.push(attach);
        this.updateNotification();

      },
      e=> {
        console.log('error post => '+JSON.stringify(e));
        if(errorAppear) {
          errorAppear = false;
          this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Can\'t upload the attachment, please try later',
            buttons: ['OK']
          }).present();
        }
      }
    );
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


  async getNotificationINStorageNOTINBACKGROUND(){
    await this.storage.get('Notifications').then(
      data =>{
        if (this.network.type == 'wifi') {
          let notis:any = data;
          if(notis) {
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

          console.log('network:onlineWithWifi');
          if(this.pendingNotification.length > 0) {
            for (let temp of this.pendingNotification) {
              if (temp.attachmentsList) {
                let promisesArray = [];
                for (let index = 0; index < temp.attachmentsList.length; index++) {
                  // let form: FormData = temp.attachmentsList[index];
                  let form = new FormData();
                  let fileType = this.getFileType(this.arrayFormData[index].name);
                  if(fileType == "IMAGE") {
                    form.append('file', this.arrayFormData[index], this.arrayFormData[index].name);
                  }else{
                    form.append('file', this.arrayFormData[index]);
                  }
                  promisesArray.push(this.uploadAttach(form));
                }
                Promise.all(promisesArray).then(data => {
                  this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);
                }).catch(e => {
                  console.log("error" + e);
                });
              }else{
                this.SendNotificationBackground(temp.title, temp.body, this.arrayToPostAttachment, temp.receiversList, temp.tagsList);
              }
            }
          }
          this.ifOpenWIFIANDNOTGOTOBACKGROUND.unsubscribe();
        }
      }).catch(e=>{
      console.log('error: ',JSON.stringify(e));
    });
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
            this.toSendNotification(this.viewCtrl,this.Title,this.Details,this.arrayFormData,this.loadingCtrl);
          }
        }
      ]
    });
    alert.present();
  }





  uploadFromWeb(RecieverArray,SelectedTags) {
    let loading = this.loadingCtrl.create({
      content: ""
    });

    loading.present();
    if(this.arrayFormData) {
      let promisesArray = [];
      for (let index = 0; index < this.arrayFormData.length; index++) {
        // let form: FormData = this.arrayFormData[index];
        let form = new FormData();
        form.append('file', this.arrayFormData[index]);
        promisesArray.push(this.uploadAttach(form));
      }
      Promise.all(promisesArray).then(data => {
        // this.talks.push({name: this.name, topics: this.topics});
        this.notiServ.postNotification(this.Title, this.Details, this.arrayToPostAttachment, RecieverArray, SelectedTags).subscribe(
          data => {
            console.log("Date Is", data);
            loading.dismiss();
            this.viewCtrl.dismiss({name: 'dismissed&SENT'});
          },
          err => {
            console.log("POST call in error", err);
            loading.dismiss();
            this.presentConfirm(err);
          });
      });
    }else{
      this.notiServ.postNotification(this.Title, this.Details, this.arrayToPostAttachment, RecieverArray, SelectedTags).subscribe(
        data => {
          console.log("Date Is", data);
          loading.dismiss();
          this.viewCtrl.dismiss({name: 'dismissed&SENT'});
        },
        err => {
          console.log("POST call in error", err);
          loading.dismiss();
          this.presentConfirm("Please, check the internet then try again");
        });
    }
  }


  startLocalNotification(){
    this.localNotifications.schedule({
      id: 2481993,
      title: 'Sending Notification',
      text: 'Start Sending Notification now',
      priority:2,
      sticky:true,
      foreground:true
    });
  }

  updateNotification(){

    let Text:string = ""+(this.number) +' of '+this.arrayFormData.length+' Attachments successfully uploaded';
    this.localNotifications.update({
      id: 2481993,
      title: 'Sending Notification',
      text: Text,
      priority:2,
      sticky:true,
      foreground:true
    });
    this.number = this.number+1;
  }

  doneNotification(){
    this.localNotifications.clear(2481993);
    this.localNotifications.schedule({
      id: 1361993,
      title: 'Sending Notification',
      text:'Notification has been successfully sent',
      priority:2,
      sticky:false,
      foreground:true
    });
    this.number = 1;
    this.pendingNotification=[];
    this.arrayToPostAttachment =[];
    this.arrayFormData = [];
    this.sendTo = [];
  }

  errNotification(){
    this.localNotifications.clear(2481993);
    this.localNotifications.schedule({
      id: 1361993,
      title: 'Sending Notification',
      text:'Failed to sent the notification',
      priority:2,
      sticky:false,
      foreground:true
    });
    this.number = 1;
    this.pendingNotification=[];
    this.arrayToPostAttachment =[];
    this.arrayFormData = [];
    this.sendTo = [];
  }



  getFileType(fileName) {
    let pos = fileName.lastIndexOf('.');
    let extension = fileName.substring(pos + 1);

    switch (extension.toLowerCase()) {
      case "jpg":
        return "IMAGE";
      case "jpeg":
        return "IMAGE";
      case "png":
        return "IMAGE";
      case "gif":
        return "IMAGE";
      case "ico":
        return "IMAGE";
      case "bmp":
        return "IMAGE";
      case "webp":
        return "IMAGE";
      case "tiff":
        return "IMAGE";

      case "pdf":
        return "PDF";

      case "txt":
        return "TXT";

      case "xls":
        return "EXCEL";
      case "xlsx":
        return "EXCEL";
      case "doc":
      case "docx":
        return "WORD";
      case "ppt":
      case "pptx":
        return "POWERPOINT";
      case "mp4":
        return "VIDEO";
      case "flv":
        return "VIDEO";
      case "avi":
        return "VIDEO";
      case "mov":
        return "VIDEO";
      case "wmv":
        return "VIDEO";
      case "mp3":
        return "AUDIO";
      case "wma":
        return "AUDIO";
      default:
        return "OTHER";
    }
  }
}
