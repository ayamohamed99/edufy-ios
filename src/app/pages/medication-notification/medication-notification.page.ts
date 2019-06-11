import { Component, OnInit } from '@angular/core';
import {ToastViewService} from '../../services/ToastView/toast-view.service';
import {MedicalCareService} from '../../services/MedicalCare/medical-care.service';
import {ModalController, NavParams, Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-medication-notification',
  templateUrl: './medication-notification.page.html',
  styleUrls: ['./medication-notification.page.scss'],
})
export class MedicationNotificationPage implements OnInit {

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

  constructor( private medicalService:MedicalCareService
      ,private toastCtrl:ToastViewService,private  modalCtrl:ModalController,private platform:Platform,private storage:Storage)
  {
    // this.medicationName = navParams.get("medicationName");
    // this.dosageNumber = navParams.get("dosageNumber");
    // this.dosageType = navParams.get("dosageType");
    // this.student = navParams.get("student");
    // this.studentName = this.student.name;
    // this.className = this.student.classes.grade.name+' - '+this.student.classes.name;
    // this.medicationTime = navParams.get("medicationTime");
    // this.medicationNextTime = navParams.get("medicationNextTime");
    // this.shceduleId = navParams.get("shceduleId");

    this.medicationName = "medicationName";
    this.dosageNumber = "dosageNumber";
    this.dosageType = "dosageType";
    this.student = "student";
    this.studentName = "student name";
    this.className = "student classes";
    this.medicationTime = "medicationTime";
    this.medicationNextTime = "medicationNextTime";
    this.shceduleId = "shceduleId";


    if (platform.is('desktop')) {
      medicalService.putHeader(localStorage.getItem(this.localStorageToken));
    } else {
      storage.get(this.localStorageToken).then(
          val => {
            medicalService.putHeader(val);
          });
    }
  }

  ngOnInit() {
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
    this.modalCtrl.dismiss();
  }

  presentToast(message,send) {
    // let toast = this.toastCtrl.create({
    //   message: message,
    //   duration: 3000,
    //   position: 'bottom'
    // });

    this.toastCtrl.presentPositionToast(message,'bottom');

    // toast.onDidDismiss(() => {
    //   console.log('Dismissed toast');
    //   if(send) {
    //     this.modalCtrl.dismiss();
    //   }
    // });

    this.toastCtrl.toastDismiss().then(()=>{
      console.log('Dismissed toast');
      if(send) {
        this.modalCtrl.dismiss();
      }
    });

  }

}
