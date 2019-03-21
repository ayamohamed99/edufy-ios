import { Component } from '@angular/core';
import {IonicPage} from 'ionic-angular';
import { NavController, NavParams, ToastController, ViewController, Platform } from 'ionic-angular';
import {Storage} from "@ionic/storage";
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

  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  medicationName;
  dosageNumber;
  dosageType;
  student;
  studentName;
  className;
  medicationTime;
  medicationNextTime;
  shceduleId;
  constructor(public navCtrl: NavController, public navParams: NavParams, private medicalService:MedicalCareService
              ,private toastCtrl:ToastController,private  viewCtrl:ViewController,private platform:Platform,private storage:Storage) {

    this.medicationName = navParams.get("medicationName");
    this.dosageNumber = navParams.get("dosageNumber");
    this.dosageType = navParams.get("dosageType");
    this.student = navParams.get("student");
    this.studentName = this.student.name;
    this.className = this.student.classes.grade.name+' - '+this.student.classes.name;
    this.medicationTime = navParams.get("medicationTime");
    this.medicationNextTime = navParams.get("medicationNextTime");
    this.shceduleId = navParams.get("shceduleId");


    if (platform.is('core')) {
      medicalService.putHeader(localStorage.getItem(this.localStorageToken));
    } else {
      storage.get(this.localStorageToken).then(
        val => {
          medicalService.putHeader(val);
        });
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
