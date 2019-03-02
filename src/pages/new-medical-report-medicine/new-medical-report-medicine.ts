import { Component } from '@angular/core';
import {IonicPage} from 'ionic-angular';
import { NavController, NavParams, AlertController,ViewController } from 'ionic-angular';
import {MedicalCareService} from "../../services/medicalcare";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {TransFormDate} from "../../services/transFormDate";
import {Medication} from "../../models/medication";
import {FormControl} from "@angular/forms";

/**
 * Generated class for the NewMedicalReportMedicinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-medical-report-medicine',
  templateUrl: 'new-medical-report-medicine.html',
})
export class NewMedicalReportMedicinePage {

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

  print(data){
    return JSON.stringify(data);
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, private medicalService:MedicalCareService,
              private alrtCtrl:AlertController,private transDate:TransFormDate,private viewCtrl:ViewController) {
    this.medication = new Medication();
    this.medicineLoading = true;
    this.dosageLoading = true;
    this.instructionLoading = true;
    this.allTimes = [{'id': 1,'time': '00:00'}, {'id': 2,'time': '00:30'}, {'id': 3,'time': '01:00'}, {'id': 4, 'time': '01:30' }, { 'id': 5,'time': '02:00'  }, { 'id': 6,'time': '02:30' }, {'id': 7,'time': '03:00' }, {'id': 8,'time': '03:30' },
      {'id': 9,'time': '04:00' }, {'id': 10,'time': '04:30'}, {'id': 11,'time': '05:00'}, {'id': 12,'time': '05:30'}, {'id': 13,'time': '06:00'}, {'id': 14,'time': '06:30'}, {'id': 15,'time': '07:00'}, {'id': 16,'time': '07:30'}, {'id': 17, 'time': '08:00'},
      {'id': 18,'time': '08:30' }, {'id': 19,'time': '09:00'}, {'id': 20,'time': '09:30'}, { 'id': 21,'time': '10:00'}, {'id': 22,'time': '10:30'}, {'id': 23,'time': '11:00' }, {'id': 24,'time': '11:30'}, { 'id': 25, 'time': '12:00' }, {  'id': 26,'time': '12:30'},
      {'id': 27, 'time': '13:00' }, {  'id': 28,'time': '13:30' }, { 'id': 29, 'time': '14:00' }, {  'id': 30,'time': '14:30' }, {  'id': 31,'time': '15:00'  }, {'id': 32,'time': '15:30'}, {'id': 33,'time': '16:00' }, {'id': 34,'time': '16:30'}, {'id': 35, 'time': '17:00'},
      {'id': 36,'time': '17:30'}, {'id': 37,'time': '18:00'}, {'id': 38,'time': '18:30'}, {'id': 39,'time': '19:00' }, { 'id': 40, 'time': '19:30'}, { 'id': 41,'time': '20:00' }, {'id': 42, 'time': '20:30'}, {'id': 43,'time': '21:00'}, {'id': 44,'time': '21:30'}, {  'id': 45,'time': '22:00'},
      {'id': 46,'time': '22:30'}, {'id': 47,'time': '23:00'}, {'id': 48, 'time': '23:30'}];
    this.getMedicineList();
    this.getDosageTypesList();
    this.getInstructionsList();

    let todayDate = navParams.get('Date');
    this.fromMinDate = new Date();
    this.toMinDate = new Date();
    this.fromShowDate = new FormControl(new Date()).value;
    this.toShowDate = new FormControl(new Date()).value;
    let getYear = parseInt(todayDate.split("-")[2]);
    this.fromMaxDate = new Date(getYear+10,11,31);
    this.toMaxDate = new Date(getYear+10,11,31);
    this.fromSelectedDate = this.transDate.transformTheDate(new Date(), "dd-MM-yyyy")+" "+ this.transDate.transformTheDate(new Date(),"HH:mm");
    this.toSelectedDate = this.transDate.transformTheDate(new Date(), "dd-MM-yyyy")+" "+ this.transDate.transformTheDate(new Date(),"HH:mm");

    if(this.navParams.get('operation') == 'edit'){
      this.selectedMedicine = '';
      this.dosageNumber = '';
      this.selectedDosageType = '';
      this.fromShowDate = '';
      if(this.fromShowDate){
        this.toShowDate = '';
      }else{
        this.continues=true;
      }

      if(this.transDate.transformTheDate(this.fromShowDate, "dd-MM-yyyy") == this.transDate.transformTheDate(this.toShowDate, "dd-MM-yyyy")){
        let days:any[] = [];
        let oneDayWasTrue = false;
        for(let data of this.allDays){
          if(data.Name.toLowerCase() == 'sunday' && days[0].sunday){data.selected = true;oneDayWasTrue=true;}
          if(data.Name.toLowerCase() == 'monday'&& days[0].monday){data.selected = true;oneDayWasTrue=true;}
          if(data.Name.toLowerCase() == 'tuesday'&& days[0].tuesday){data.selected = true;oneDayWasTrue=true;}
          if(data.Name.toLowerCase() == 'wednesday'&& days[0].wednesday){data.selected = true;oneDayWasTrue=true;}
          if(data.Name.toLowerCase() == 'thursday'&& days[0].thursday){data.selected = true;oneDayWasTrue=true;}
        }
        if(oneDayWasTrue){
          this.everyDay = false;
        }else{
          this.everyDay = true;
        }
      }


    }

  }

  close(){
    this.viewCtrl.dismiss({medication:null});
  }
  enableDoneAllButton(){
    if((this.selectedMedicine != null || this.selectedMedicine != "") && (this.selectedDosageType != null || this.selectedDosageType!= "") &&
      (this.dosageNumber!=null ||this.dosageNumber!="") && this.selectedTimes){
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

    let schaduleObject = {
      'saturday': false, 'sunday': false, 'monday': false, 'tuesday': false, 'wednesday': false, 'thursday': false, 'friday': false, 'time': ""
    };
    this.medication.medicationSchedule=[];
    for(let day of this.allDays){
      if(day.Name.toLowerCase() == 'sunday' && day.selected){schaduleObject.sunday = true}
      if(day.Name.toLowerCase() == 'monday' && day.selected){schaduleObject.monday = true}
      if(day.Name.toLowerCase() == 'tuesday' && day.selected){schaduleObject.tuesday = true}
      if(day.Name.toLowerCase() == 'wednesday' && day.selected){schaduleObject.wednesday = true}
      if(day.Name.toLowerCase() == 'thursday' && day.selected){schaduleObject.thursday = true}
    }
    for(let addTime of this.selectedTimes){
      schaduleObject.time = addTime.time;
      this.medication.medicationSchedule.push(schaduleObject);
    }
    this.viewCtrl.dismiss({medication:this.medication});
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
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: 'Something went wrong,please check the network',
          buttons: ['OK']
        }).present();
      });

  }
  getDosageTypesList(){
    this.medicalService.getDosageTypes().subscribe(
      val=>{
        this.allDosageTypes = val;
        this.dosageLoading = false;
      },err=>{
        this.dosageLoading = false;
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: 'Something went wrong,please check the network',
          buttons: ['OK']
        }).present();
      });

  }
  getInstructionsList(){
    this.medicalService.getInstructions().subscribe(
      val=>{
        this.allInstructions = val;
        this.instructionLoading = false;
      },err=>{
        this.instructionLoading = false;
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: 'Something went wrong,please check the network',
          buttons: ['OK']
        }).present();
      });
  }

}
