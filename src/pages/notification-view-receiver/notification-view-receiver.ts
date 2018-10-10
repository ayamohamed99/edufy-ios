import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  IonicPage, LoadingController, NavController, NavParams, Platform, ToastController,
  ViewController
} from 'ionic-angular';
import {AccountService} from "../../services/account";
import {NotificationService} from "../../services/notification";
import { Chart } from 'chart.js';
import {File} from '@ionic-native/file';
import {FileOpener} from "@ionic-native/file-opener";
import * as jsPDF from 'jspdf';

@Component({
  selector: 'page-notification-view-receiver',
  templateUrl: 'notification-view-receiver.html',
})
export class NotificationViewReceiver {
  @ViewChild('doughnutCanvas') doughnutCanvas;
  doughnutChart: any;

  norecievers = "";
  receivers;
  notification;
  receiverListStudents = [];
  originalReceiverListStudents = [];
  branchesNumber = 0;
  classReceverList;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController,
              private accountServ:AccountService,private notificationServ:NotificationService,public load:LoadingController,
              public toastCtrl:ToastController,private platform:Platform,private file:File,private fileOpener: FileOpener) {
    this.notification = this.navParams.get('notification');
    this.receivers = this.navParams.get('notification').receiversList;
    this.branchesNumber = this.accountServ.accountBranchesList.length;
    this.getReceivers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationViewReceiver');
  }

  close(){
    this.viewCtrl.dismiss({name:'dismissed'});
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.receiverListStudents = this.originalReceiverListStudents.map(value => {
      return {... value};
    });
    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {

      for(let i=0;i<this.receiverListStudents.length;i++){
        this.receiverListStudents[i].studentlist = [];
      }

      for(let i=0;i<this.originalReceiverListStudents.length;i++){
        let num = this.originalReceiverListStudents[i]['studentlist'].length;
        for(let j=0;j<num;j++){
          let arry = this.originalReceiverListStudents[i].studentlist;
          this.filterData(val,i,arry[j].student.name,j);
        }
      }
    }
  }

  filterData(val,index,studentName,studentIndex){
      if(studentName.toLowerCase().indexOf(val.toLowerCase()) > -1){
        let student = this.originalReceiverListStudents[index]['studentlist'][studentIndex];
        this.receiverListStudents[index]['studentlist'].push(this.originalReceiverListStudents[index]['studentlist'][studentIndex]);
      }
  }

tempRList =[];
  getReceivers(){
    let loading = this.load.create({
      content: ""
    });
    loading.present();
    this.notificationServ.getRecieverList(this.notification.notificationId).subscribe(
      response =>{
        let Data = response;
        for(let item in Data){
          this.classReceverList = {'class':'',studentlist:[]};
          this.classReceverList.class = item;
          this.classReceverList.studentlist = Data[item];
          this.originalReceiverListStudents.push(this.classReceverList);
          this.receiverListStudents.push(this.classReceverList);
          this.tempRList
            .push({
              branch: response[item][0].classes.branch,
              className: item,
              List: response[item]
            });
        }

        if(this.originalReceiverListStudents.length == 0){
          this.norecievers = "No Receivers";
        }else {
          let intervaldata = setInterval(() => {
            let seenNumb: number = 0;
            let unseenNumb: number = 0;
            ///GET SEEN AND UNSEEN FIRST

            for (let i = 0; i < this.originalReceiverListStudents.length; i++) {
              let num = this.originalReceiverListStudents[i]['studentlist'].length;
              for (let j = 0; j < num; j++) {
                if (this.originalReceiverListStudents[i]['studentlist'][j].seenByParent || this.originalReceiverListStudents[i]['studentlist'][j].seenByStudent) {
                  seenNumb += 1;
                } else {
                  unseenNumb += 1;
                }
              }
            }
            ///Put them in CHART.JS
            this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

              type: 'doughnut',
              data: {
                labels: ["Seen", "UnSeen"],
                datasets: [{
                  label: '# of Votes',
                  data: [seenNumb, unseenNumb],
                  backgroundColor: [
                    'rgba(26,198,31)',
                    'rgba(236,27,35)'
                  ],
                  hoverBackgroundColor: [
                    "#1AC61F",
                    "#EC1B23"
                  ]
                }]
              }

            });
            clearInterval(intervaldata);
          },250);
        }

        loading.dismiss();
      },err =>{
        loading.dismiss();
        if(this.originalReceiverListStudents.length == 0){
          this.norecievers = "No Receivers";
        }
        this.presentToast('can\'t load students');
        console.log(err);
      }
    );
  }


  getTextWidth(doc, text) {
    return doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  }
  createReceiversPdf(){
    var leftPadding = 30;
    var y = 40;
    var x = leftPadding;
    var doc = new jsPDF("portrait", "pt", "a4");
    doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40, 'S');
    doc.setFontSize(16);
    var title = this.notification.title;
    var textWidth = this.getTextWidth(doc, title);
    var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(textOffset, y, title);
    y += 50;
    for (let i = 0; i < this.tempRList.length; i++) {
      var receiverObject = this.tempRList[i];
      var textWidth = this.getTextWidth(doc, receiverObject.className);
      var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
      doc.setFontSize(14);
      doc.setDrawColor(0)
      doc.setFillColor(215, 215, 215)
      doc.roundedRect(21, y - 19, doc.internal.pageSize.width - 42, 34, 3, 3, 'FD')
      doc.text(textOffset, y, receiverObject.className);
      y += 30;
      var classGroups = {
        'className': receiverObject.className,
        'seen': [],
        'unseen': []
      };
      for (var j = 0; j < receiverObject.List.length; j++) {
        if (receiverObject.List[j].seenByParent || receiverObject.List[j].seenByStudent) {
          classGroups.seen.push(receiverObject.List[j].student.name);
        } else {
          classGroups.unseen.push(receiverObject.List[j].student.name);
        }
      }
      if (classGroups.seen.length > 0) {
        var seenList = classGroups.seen;
        seenList.sort();
        doc.setFontSize(12);
        doc.text(leftPadding, y, "Seen By (" + seenList.length + ")");
        var textWidth = this.getTextWidth(doc, "Seen By (" + seenList.length + ")");
        y += 3;
        doc.line(leftPadding, y, leftPadding + textWidth, y);
        y += 20;
        doc.setFontSize(10);
        for (var j = 0; j < seenList.length; j++) {
          if (y > 800) {
            doc.addPage();
            y = 50;
            doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40, 'S');
          }
          doc.text(leftPadding + 70, y, seenList[j]);
          y += 15;
        }
      }
      y += 15;
      if (classGroups.unseen.length > 0) {
        var unseenList = classGroups.unseen;
        unseenList.sort();
        doc.setFontSize(12);
        doc.text(leftPadding, y, "Unseen By (" + unseenList.length + ")");
        var textWidth = this.getTextWidth(doc, "Unseen By (" + unseenList.length + ")");
        y += 3;
        doc.line(leftPadding, y, leftPadding + textWidth, y);
        y += 20;
        doc.setFontSize(10);
        for (var j = 0; j < unseenList.length; j++) {
          if (y > 800) {
            doc.addPage();
            y = 50;
            doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40, 'S');
          }
          doc.text(leftPadding + 70, y, unseenList[j]);
          y += 15;
        }
      }
      y += 20;
    }
    this.downloadPDF(doc);
  }

  downloadPDF(pdf){
    if(this.platform.is('cordova')){
      pdf.getBuffer((buffer) =>{
        let utf8 = new Uint8Array(buffer);
        let binaryArray = utf8.buffer;
        let blob = new Blob([binaryArray],{type:'application/pdf'});
        let fileName = 'Notification Receivers';

        this.file.writeFile(this.file.dataDirectory,fileName,blob,{replace:true}).then(
          fileEntry =>{
            this.fileOpener.open(this.file.dataDirectory+fileName,'application/pdf');
          });
      });
    }else{
      pdf.save('Notification Receivers');
    }
  }


  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
