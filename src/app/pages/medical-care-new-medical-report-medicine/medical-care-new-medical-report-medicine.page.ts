import { Component, OnInit } from '@angular/core';
import {NgSelectConfig} from '@ng-select/ng-select';
import {Medication} from '../../models/medication';
import {MedicalRecord} from '../../models/medical-record';
import {ToastViewService} from '../../services/ToastView/toast-view.service';
import {AlertController, LoadingController, ModalController, NavParams} from '@ionic/angular';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import {MedicalCareService} from '../../services/MedicalCare/medical-care.service';
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-medical-care-new-medical-report-medicine',
  templateUrl: './medical-care-new-medical-report-medicine.page.html',
  styleUrls: ['./medical-care-new-medical-report-medicine.page.scss'],
})
export class MedicalCareNewMedicalReportMedicinePage implements OnInit {


  pageName = "Add Medication";
  EditView = false;
  dosageTypeObject = {'id': null, 'type': "", 'medication':null, 'url': null};
  medicationObject = {'id': null, 'name': "", 'details': "", 'autoComplete': false, 'medication': null};
  allMedicines:any[]=[];
  allDosageTypes:any[]=[];
  allInstructions:any[]=[];
  allTimes:any[]=[];
  allDays= [{"id":1,"Name":"Sunday","selected":false},{ "id":2,"Name":"Monday","selected":false},{ "id":3, "Name":"Tuesday","selected":false},
    {"id":4,"Name":"Wednesday","selected":false},{ "id":5,"Name":"Thursday","selected":false }];
  medication:Medication;
  selectedMedicine:any;
  selectedDosageType:any;
  selectedInstruction:any;
  selectedTimes:any;
  selectedDays:any;
  medicineLoading:boolean;
  dosageLoading:boolean;
  instructionLoading:boolean;
  dosageNumber;
  fromMinDate;
  fromMaxDate;
  fromSelectedDate;
  toMinDate;
  toMaxDate;
  toSelectedDate;
  everyDay = true;
  continues = false;
  fromShowDate;
  toShowDate;
  /////////////////////EDIT VIEW
  tempMedicalRecord:MedicalRecord;


  constructor(private config: NgSelectConfig,public navParams: NavParams, private medicalService:MedicalCareService,private loadCtrl:LoadingViewService,
              private alrtCtrl:AlertController,private transDate:TransFormDateService,private modalCtrl:ModalController,private toastCtrl:ToastViewService) {
    this.config.notFoundText = 'No match found';

    this.medication = new Medication();
    this.medicineLoading = true;
    this.dosageLoading = true;
    this.instructionLoading = true;
    this.allTimes = [{'id': '','time': '00:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '00:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '01:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '', 'time': '01:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false }, { 'id': '','time': '02:00' ,'saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false },{'id': '','time': '02:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false }, {'id': '','time': '03:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false }, {'id': '','time': '03:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false },
      {'id': '','time': '04:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false }, {'id': '','time': '04:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '05:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '05:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '06:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '06:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '07:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '07:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '', 'time': '08:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false},
      {'id':'','time': '08:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false }, {'id': '','time': '09:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '09:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, { 'id': '','time': '10:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '10:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '11:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false }, {'id': '','time': '11:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, { 'id': '', 'time': '12:00' ,'saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {  'id': '','time': '12:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false},
      {'id': '', 'time': '13:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false }, {'id': '','time': '13:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false }, {'id': '', 'time': '14:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false},{ 'id': '','time': '14:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false },{'id': '','time': '15:00' ,'saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false},{'id': '','time': '15:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '16:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false }, {'id': '','time': '16:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '', 'time': '17:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false},
      {'id': '','time': '17:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '18:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '18:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '19:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false }, { 'id': '', 'time': '19:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '20:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false }, {'id': '', 'time': '20:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '21:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '21:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {  'id': '','time': '22:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false},
      {'id': '','time': '22:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '','time': '23:00','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}, {'id': '', 'time': '23:30','saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false}];
    this.getMedicineList();
    this.getDosageTypesList();
    this.getInstructionsList();

    let todayDate;
    if(navParams.get('Date')) {
      todayDate = navParams.get('Date');
    }
    this.fromMinDate = new Date();
    this.toMinDate = new Date();
    this.fromShowDate = new FormControl(new Date()).value;
    this.toShowDate = new FormControl(new Date()).value;
    if(navParams.get('Date')) {
      let getYear = parseInt(todayDate.split("-")[2]);
      this.fromMaxDate = new Date(getYear + 10, 11, 31);
      this.toMaxDate = new Date(getYear + 10, 11, 31);
    }
    this.fromSelectedDate = this.transDate.transformTheDate(new Date(), "dd-MM-yyyy")+" "+ this.transDate.transformTheDate(new Date(),"HH:mm");
    this.toSelectedDate = this.transDate.transformTheDate(new Date(), "dd-MM-yyyy")+" "+ this.transDate.transformTheDate(new Date(),"HH:mm");

    if(this.navParams.get('operation') == 'edit'){
      this.pageName = this.navParams.get('pageName');
      this.EditView = true;
      let nullEndDateState = this.transDate.transformTheDate(new Date(), "dd-MM-yyyy")+" "+ this.transDate.transformTheDate(new Date(),"HH:mm");
      this.tempMedicalRecord = this.navParams.get('medicalRecord');
      this.selectedMedicine = this.tempMedicalRecord.oneMedication.medicine;
      this.dosageNumber = this.tempMedicalRecord.oneMedication.dosageNumber;
      this.selectedDosageType = this.tempMedicalRecord.oneMedication.dosageType;
      this.fromSelectedDate = this.tempMedicalRecord.oneMedication.startDate;
      this.toSelectedDate = this.tempMedicalRecord.oneMedication.endDate;
      let startDate:any[] = this.fromSelectedDate.slice(0,-6).split("-");
      let endDate:any[];
      if(this.toSelectedDate){
        endDate = this.toSelectedDate.slice(0,-6).split("-");
      }else {
        endDate = nullEndDateState.slice(0,-6).split("-");
      }
      this.fromShowDate = new Date(startDate[2],startDate[1]-1,startDate[0]);
      this.toMinDate = new Date(startDate[2],startDate[1]-1,startDate[0]);
      let getYear = parseInt(startDate[2]);
      this.fromMaxDate = new Date(getYear + 10, 11, 31);
      this.toMaxDate = new Date(getYear + 10, 11, 31);

      if(this.tempMedicalRecord.oneMedication.endDate){
        this.toShowDate = new Date(endDate[2],endDate[1]-1,endDate[0]);
      }else{
        this.continues=true;
      }

      let days:any[] = this.tempMedicalRecord.oneMedication.medicationSchedule;
      let oneDayWasTrue = false;
      for(let data of this.allDays){
        if(data.Name.toLowerCase() == 'sunday' && days[0].sunday){data.selected = true;oneDayWasTrue=true;}
        if(data.Name.toLowerCase() == 'monday'&& days[0].monday){data.selected = true;oneDayWasTrue=true;}
        if(data.Name.toLowerCase() == 'tuesday'&& days[0].tuesday){data.selected = true;oneDayWasTrue=true;}
        if(data.Name.toLowerCase() == 'wednesday'&& days[0].wednesday){data.selected = true;oneDayWasTrue=true;}
        if(data.Name.toLowerCase() == 'thursday'&& days[0].thursday){data.selected = true;oneDayWasTrue=true;}
      }
      this.everyDay = !oneDayWasTrue;
      this.selectedTimes = this.tempMedicalRecord.oneMedication.medicationSchedule;
      for (let tempT of this.selectedTimes) {
        if(tempT.time.length > 5){
          tempT.time = tempT.time.slice(0,-3);
        }
      }

      this.selectedInstruction = this.tempMedicalRecord.oneMedication.instructions;
    }

  }

  ngOnInit() {
  }

  close(){
    this.modalCtrl.dismiss({medication:null});
  }

  enableDoneAllButton(){
    let oneDayWasTrue = false;
    for(let data of this.allDays){
      if(data.Name.toLowerCase() == 'sunday' && data.selected == true){oneDayWasTrue=true;}
      if(data.Name.toLowerCase() == 'monday'&& data.selected == true){oneDayWasTrue=true;}
      if(data.Name.toLowerCase() == 'tuesday'&& data.selected == true){oneDayWasTrue=true;}
      if(data.Name.toLowerCase() == 'wednesday'&& data.selected == true){oneDayWasTrue=true;}
      if(data.Name.toLowerCase() == 'thursday'&& data.selected == true){oneDayWasTrue=true;}
    }

    if((this.selectedMedicine != null || this.selectedMedicine != "") && (this.selectedDosageType != null || this.selectedDosageType!= "") &&
        (this.dosageNumber!=null ||this.dosageNumber!="") && this.selectedTimes && (oneDayWasTrue == true ||this.everyDay==true)){
      return false;
    }else {
      return true;
    }
  }

  clickEveryday(ev){
    for(let data of this.allDays){
      if(ev){
        data.selected = false;
      }
    }
  }

  addMedication(){
    this.medication.medicine={'id':this.selectedMedicine.id,'name':this.selectedMedicine.name};
    this.medication.dosageNumber=this.dosageNumber;
    this.medication.dosageType={'id':this.selectedDosageType.id};
    this.medication.creationDate=this.transDate.transformTheDate(new Date(), "dd-MM-yyyy HH:mm");
    this.medication.startDate=this.fromSelectedDate;
    if (!this.continues) {
      this.medication.endDate = this.toSelectedDate;
    }else {
      this.toSelectedDate = null;
      this.medication.endDate = null;
    }
    this.medication.instructions=[];
    if(this.everyDay || !this.sameDay()){
      for(let data of this.allDays){
        data.selected = true;
      }
    }
    if(this.selectedInstruction) {
      for (let instruction of this.selectedInstruction) {
        this.medication.instructions.push({'id': instruction.id, 'name': instruction.name});
      }
    }

    this.medication.medicationSchedule=[];
    let sunday = false;
    let monday = false;
    let tuesday = false;
    let wednesday = false;
    let thursday = false;
    for(let day of this.allDays){
      if(day.Name.toLowerCase() == 'sunday' && day.selected){sunday = true}
      if(day.Name.toLowerCase() == 'monday' && day.selected){monday = true}
      if(day.Name.toLowerCase() == 'tuesday' && day.selected){tuesday = true}
      if(day.Name.toLowerCase() == 'wednesday' && day.selected){wednesday = true}
      if(day.Name.toLowerCase() == 'thursday' && day.selected){thursday = true}
    }
    for(let i=0;i<this.selectedTimes.length;i++){
      this.selectedTimes[i].sunday = sunday;
      this.selectedTimes[i].monday = monday;
      this.selectedTimes[i].tuesday = tuesday;
      this.selectedTimes[i].wednesday = wednesday;
      this.selectedTimes[i].thursday = thursday;
    }
    this.medication.medicationSchedule = this.selectedTimes;
    if(this.navParams.get('operation') == 'edit'){
      this.UpdateMedication(this.medication);
    }else {
      this.modalCtrl.dismiss({medication: this.medication});
    }
    // console.log(this.medication);
  }


  addSelectedDate(picker,event){
    if(picker == "From"){
      let dateArry:any[] = this.transDate.transformTheDate(event.value,"MM/dd/yyyy").split("/");
      this.toMinDate = new Date(parseInt(dateArry[2]),parseInt(dateArry[0])-1,parseInt(dateArry[1]));
      if (!this.continues) {
        this.toSelectedDate = this.transDate.transformTheDate(event.value, "dd-MM-yyyy")+" "+ this.transDate.transformTheDate(new Date(),"HH:mm");
        this.toShowDate = event.value;
      }
      this.fromSelectedDate = this.transDate.transformTheDate(event.value,"dd-MM-yyyy") +" "+ this.transDate.transformTheDate(new Date(),"HH:mm");
      this.fromShowDate = event.value;
    } else if(picker == "To") {
      this.toShowDate = event.value;
      this.toSelectedDate = this.transDate.transformTheDate(event.value, "dd-MM-yyyy") +" "+ this.transDate.transformTheDate(new Date(),"HH:mm");
    }
  }

  sameDay(){
    if(this.fromShowDate) {
      let toshow = this.transDate.transformTheDate(this.toShowDate,"dd-MM-yyyy");
      let fromshow = this.transDate.transformTheDate(this.fromShowDate,"dd-MM-yyyy");
      if (toshow == fromshow) {
        return false;
      } else {
        return true;
      }
    }else{
      return false;
    }
  }

  selectEveryDay(lastEl){
    let found = false;
    for(let data of this.allDays){
      if(!data.selected){
        found = true;
      }
    }

    if(!found){
      for(let data of this.allDays){
        data.selected = false;
      }

      this.everyDay = true;
    }
  }


  getMedicineList(){
    this.medicalService.getMedicines().subscribe(
        val=>{
          this.allMedicines = val;
          this.medicineLoading = false;
        },err=>{
          this.medicineLoading = false;
          this.presentConfirmAlert('Error','','Something went wrong,please check the network');
        });

  }
  getDosageTypesList(){
    this.medicalService.getDosageTypes().subscribe(
        val=>{
          this.allDosageTypes = val;
          this.dosageLoading = false;
        },err=>{
          this.dosageLoading = false;
          this.presentConfirmAlert('Error','','Something went wrong,please check the network');
        });

  }
  getInstructionsList(){
    this.medicalService.getInstructions().subscribe(
        val=>{
          this.allInstructions = val;
          this.instructionLoading = false;
        },err=>{
          this.instructionLoading = false;
          this.presentConfirmAlert('Error','','Something went wrong,please check the network');
        });
  }

  async presentConfirmAlert(head,subhead,msg) {
    const alert = await this.alrtCtrl.create({
      header: head,
      subHeader: subhead,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  UpdateMedication(medication){

    let medicationWithSchedule={
      "id":this.tempMedicalRecord.oneMedication.id,
      "status":this.tempMedicalRecord.oneMedication.status,
      "medicine":this.selectedMedicine,
      "dosageNumber":this.dosageNumber,
      "dosageType":this.selectedDosageType,
      "creationDate":this.tempMedicalRecord.oneMedication.creationDate,
      "startDate":this.fromSelectedDate,
      "endDate":this.toSelectedDate,
      "instructions":medication.instructions,
      "medicationSchedule":this.selectedTimes
    };
    this.loadCtrl.startLoading('',false,'loadingWithoutBackground');
    this.medicalService.updateMedication(this.tempMedicalRecord.id, this.tempMedicalRecord.medicationIndex, medicationWithSchedule).subscribe(
        response=> {
          var result = response;
          this.loadCtrl.stopLoading();
          this.toastCtrl.presentTimerToast("Medication Updated successfully.");
          this.modalCtrl.dismiss({done: 'edit'});
        }, reason=> {
          this.loadCtrl.stopLoading();
          if(reason.error == "MEDICATION_ALREADY_ENDED"){
            this.toastCtrl.presentTimerToast("Failed, Medication already ended.");
          }else {
            this.toastCtrl.presentTimerToast("Failed updated medication.");
          }
        });
  }


}
