import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the MedicationViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-medication-view',
  templateUrl: 'medication-view.html',
})
export class MedicationViewPage {
  medication;
  dosageWord = "";
  daysOfDosage = [];
  timesWords;
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl: ViewController) {
    this.medication = navParams.get('medication');
    if(this.medication.dosageNumber > 1){
      this.dosageWord = "Dosages"
    }else{
      this.dosageWord = "Dosage"
    }
    if(this.medication.medicationSchedule[0].sunday){
      this.daysOfDosage.push('Sunday');
    }
    if(this.medication.medicationSchedule[0].monday){
      this.daysOfDosage.push('Monday');
    }
    if(this.medication.medicationSchedule[0].tuesday){
      this.daysOfDosage.push('Tuesday');
    }
    if(this.medication.medicationSchedule[0].wednesday){
      this.daysOfDosage.push('Wednesday');
    }
    if(this.medication.medicationSchedule[0].thursday){
      this.daysOfDosage.push('Thursday');
    }

    if(this.daysOfDosage.length == 5){
      this.daysOfDosage = [];
      this.daysOfDosage.push("Everyday");
    }

    if(this.medication.medicationSchedule.length > 1){
      this.timesWords = 'Should take at these times';
    }else{
      this.timesWords = 'Should take at this time';
    }


  }

  close() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicationViewPage');
  }

}
