import {Component, Input, OnInit} from '@angular/core';
import {NgSelectConfig} from '@ng-select/ng-select';
import {ModalController, NavParams} from '@ionic/angular';
import {PassDataService} from '../../services/pass-data.service';

@Component({
  selector: 'app-medical-care-medication-view',
  templateUrl: './medical-care-medication-view.page.html',
  styleUrls: ['./medical-care-medication-view.page.scss'],
})
export class MedicalCareMedicationViewPage implements OnInit {

  medication;
  dosageWord = "";
  daysOfDosage = [];
  timesWords;

  // @Input() medication:any;
  constructor(private config: NgSelectConfig,private modalCtrl: ModalController,public passData:PassDataService)
  {
    this.config.notFoundText = 'No match found';

    this.medication = this.passData.dataToPass.medication;
    // this.medication = navParams.get('medication');
    if(this.passData.dataToPass.medication.dosageNumber > 1){
      this.dosageWord = "Dosages"
    }else{
      this.dosageWord = "Dosage"
    }
    if(this.passData.dataToPass.medication.medicationSchedule[0].sunday){
      this.daysOfDosage.push('Sunday');
    }
    if(this.passData.dataToPass.medication.medicationSchedule[0].monday){
      this.daysOfDosage.push('Monday');
    }
    if(this.passData.dataToPass.medication.medicationSchedule[0].tuesday){
      this.daysOfDosage.push('Tuesday');
    }
    if(this.passData.dataToPass.medication.medicationSchedule[0].wednesday){
      this.daysOfDosage.push('Wednesday');
    }
    if(this.passData.dataToPass.medication.medicationSchedule[0].thursday){
      this.daysOfDosage.push('Thursday');
    }

    if(this.daysOfDosage.length == 5){
      this.daysOfDosage = [];
      this.daysOfDosage.push("Everyday");
    }

    if(this.passData.dataToPass.medication.medicationSchedule.length > 1){
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
