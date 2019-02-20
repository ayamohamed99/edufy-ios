import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {MedicalCareService} from "../../services/medicalcare";

/**
 * Generated class for the MedicationNotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-medication-notification',
  templateUrl: 'medication-notification.html',
})
export class MedicationNotificationPage {

  notificationMedication:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private medicalService:MedicalCareService
              ,private toastCtrl:ToastController,private  viewCtrl:ViewController) {

    this.notificationMedication = {
      "medicationName": "Panadol",
      "dosageType": "gr",
      "dosageNumber": 3,
      "shceduleId":2536,
      "medicationTime":"02:30",
      "medicationNextTime":"sunday 05:30",
      "student": {
        "id":2563,
        "name":"Mohammad",
        "classes":{
          "id":253,
          "name":"A",
          "grades":{
            "id":3215,
            "name":"Baby Class"
          }
        }
      }
    }




  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicationNotificationPage');
  }

  setImageOfNotification(type){
    if(type == "pill"){
      return "assets/medication-type/pill.png";
    }else if(type == "tablespoon" || type == "teaspoon"){
      return "assets/medication-type/tablespoon.png";
    }else if(type == "gr" || type == "gm"){
      return "assets/medication-type/gr-mg.png";
    }else if(type == "ml"){
      return "assets/medication-type/ml.png";
    }else if(type == "drop"){
      return "assets/medication-type/drop.png";
    }else if(type == "puff"){
      return "assets/medication-type/puff.png";
    }else if(type == "spray"){
      return "assets/medication-type/spray.png";
    }else if(type == "patch"){
      return "assets/medication-type/patch.png";
    } else {
      return "assets/medication-type/any.png";
    }
  }

  confimTime(shceduleId){
    this.medicalService.sendTakeMedication(shceduleId).subscribe(
      value => {
        console.log(value);
        this.presentToast("This medicine is taken",true);
      }, err => {
        console.log(err);
        this.presentToast("Error in Service",false);
      });
  }

  cancelTime(){
    this.viewCtrl.dismiss();
  }

  presentToast(message,send) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      if(send) {
        this.viewCtrl.dismiss();
      }
    });

    toast.present();
  }

}
