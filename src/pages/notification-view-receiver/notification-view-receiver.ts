import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {AccountService} from "../../services/account";
import {NotificationService} from "../../services/notification";
import { Chart } from 'chart.js';

/**
 * Generated class for the NotificationViewPage page.

 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
              public toastCtrl:ToastController) {
    this.notification = this.navParams.get('notification');
    this.receivers = this.navParams.get('notification').receiversList;
    this.branchesNumber = this.accountServ.accountBranchesList.length;
    this.getReceivers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationViewReceiver');
    // this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
    //
    //   type: 'doughnut',
    //   data: {
    //     labels: ["Seen", "UnSeen"],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [0, 0],
    //       backgroundColor: [
    //         'rgba(26,198,31)',
    //         'rgba(236,27,35)'
    //       ],
    //       hoverBackgroundColor: [
    //         "#1AC61F",
    //         "#EC1B23"
    //       ]
    //     }]
    //   }
    //
    // });
  }

  close(){
    this.viewCtrl.dismiss({name:'dismissed'});
  }

  downloadReceiversPdf(){

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
