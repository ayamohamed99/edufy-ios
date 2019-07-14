import {Component, Input, OnInit} from '@angular/core';
import {NgSelectConfig} from '@ng-select/ng-select';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-medical-care-medication-view',
  templateUrl: './medical-care-medication-view.page.html',
  styleUrls: ['./medical-care-medication-view.page.scss'],
})
export class MedicalCareMedicationViewPage implements OnInit {

  // medication;
  dosageWord = "";
  daysOfDosage = [];
  timesWords;

  @Input() medication:any;
  constructor(private config: NgSelectConfig,private modalCtrl: ModalController)
  {
    this.config.notFoundText = 'No match found';


    // this.medication = navParams.get('medication');
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
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

}
