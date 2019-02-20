import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, PopoverController, AlertController, LoadingController, ModalController, Platform, ToastController
} from 'ionic-angular';
import {MedicalCareService} from "../../services/medicalcare";
import {Storage} from "@ionic/storage";
import {MedicalRecord} from "../../models/medical-record";
import {Student} from "../../models";
import {TransFormDate} from "../../services/transFormDate";


/**
 * Generated class for the MedicalCarePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-medical-care',
  templateUrl: 'medical-care.html',
})
export class MedicalCarePage {

  loading:boolean = false;
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  refresher:any;
  refresherIsStart:boolean = false;
  nextPage:any;
  nextPageIsStarted:boolean = false;
  medicalRecords:any[]=[];
  frontHeight;
  filterDate;
  search = {'object': {}};
  oldSearch:any;
  selectedClasses:any;
  selectedStudent:any;
  selectedStatus:any;
  date:any;
  page:any;
  View:any;
  startDate:any;
  endDate:any;
  pageSize:any = null;
  theStatus:any = "All Status";
  allStatusInMedication:any[]=["All Status","Active","inActive"];

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl:PopoverController,public platform:Platform,
              public medicalService:MedicalCareService, private storage:Storage,public transformDate:TransFormDate,private toastCtrl:ToastController) {
    console.log(this.search);
    this.selectedClasses = 0;
    this.selectedStudent = 0;
    this.selectedStatus = -1;
    this.date = null;
    this.page = 1;
    this.View = 'medications';
    this.startDate = null;
    this.endDate = null;
    this.startSearchObject();
    //Start Code
    if (platform.is('core')) {
      medicalService.putHeader(localStorage.getItem(this.localStorageToken));
      this.getAllMedicalRecords();
    } else {
      storage.get(this.localStorageToken).then(
        val => {
          medicalService.putHeader(val);
          this.getAllMedicalRecords();
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicalCarePage');
  }

  flipCard(order,index){
    if(order && order=="turn"){
      let element:string = 'card'+index;
      document.getElementById(element).classList.toggle("flipped");
    }
  }

  confirmTime(ev:Event,selectedButton,shceduleId,medTaken){
    ev.stopPropagation();
    if(medTaken){
      this.presentToast("This medicine is already taken");
    }else {
      this.medicalService.sendTakeMedication(shceduleId).subscribe(
        value => {
          console.log(value);
          let data = document.getElementById(selectedButton);
          data.classList.toggle("confirmTime");
        }, err => {
          console.log(err);
        });
    }
  }

  checkIfTaken(medicationSchadule){
    if(medicationSchadule){
      return medicationSchadule.taken;
    }else{
      return false;
    }
  }

  checkMedicationTime(time,medication){

    let medicationDays:any = 0 ;


      if(!medication.medicationSchedule[0])
        return ;

    let schedule = medication.medicationSchedule[0] ;

      if(!schedule.medicationsNotifications || schedule.medicationsNotifications.taken==undefined){
        return true;
      }

      medicationDays = [];

      if(schedule.sunday)
        medicationDays.push("Sunday");
      if(schedule.monday)
        medicationDays.push("Monday");
      if(schedule.tuesday)
        medicationDays.push("Tuesday");
      if(schedule.wednesday)
        medicationDays.push("Wednesday");
      if(schedule.thursday)
        medicationDays.push("Thursday");
      if(schedule.friday)
        medicationDays.push("Friday");
      if(schedule.saturday)
        medicationDays.push("Saturday");

    let day = new Date().getDay();
    let today = '';
      if(day==0)today="Sunday";
      if(day==1)today="Monday";
      if(day==2)today="Tuesday";
      if(day==3)today="Wednesday";
      if(day==4)today="Thursday";
      if(day==5)today="Friday";
      if(day==6)today="Saturday";

    let TodayFound = false;
      if(medicationDays && medicationDays.length >=1){
        for(let i=0 ; i <medicationDays.length ; i++){
          if(medicationDays[i]==today){
            TodayFound = true;
            break;
          }
        }
      }
      if(!TodayFound)
        return true;

      time = time.substr(0 , 5);
    let currentTime = this.transformDate.transformTheDate(new Date(),"HH:mm");
    let hour1  = parseInt(time.substr(0 , 2));
    let min1 = parseInt(time.substr(3 , 5));

    let hour2  = parseInt(currentTime.substr(0 , 2));
    let min2 = parseInt(currentTime.substr(3 , 5));

    let isEqual = currentTime == time;

      if(isEqual || hour1==hour2 || ((hour1 <= hour2) && (hour1+3 >=hour2) )) {
        return false;
      }else {
        return true;
      }
  }

  optimizeData(index,times){
    let lineNumber = times.length %4;
    if(lineNumber > 0){
      // let height = 220 + (((this.times.length-lineNumber)/4)*40);
      let elName = 'cardContainer'+index;
      let cardContainer = document.getElementById(elName);
      let buttonDiv = document.getElementById('buttonDiv');
      if(cardContainer) {
        let getheight = buttonDiv.clientHeight;
        this.frontHeight = 250 + (getheight - 40);
        cardContainer.style.height = this.frontHeight + "px";
      }
    }
  }


  optimizeBackData(index,instruction){
    let lineNumber = instruction.length;
    if(lineNumber > 0){
      // let height = 220 + (((this.times.length-lineNumber)/4)*40);
      let elName = 'cardContainer'+index;
      let cardContainer = document.getElementById(elName);
      let buttonDiv = document.getElementById('instDiv');
      if(cardContainer) {
        let getheight = buttonDiv.clientHeight;
        let height = this.frontHeight + (getheight - 40);
        if(height > this.frontHeight) {
          cardContainer.style.height = height + "px";
        }
      }
    }
  }

  setDaysOfMedication(days){
    let daysOfMedication = [];
    if(days.friday == true){daysOfMedication.push("Friday")}
    if(days.monday == true){daysOfMedication.push("monday")}
    if(days.saturday == true){daysOfMedication.push("saturday")}
    if(days.sunday == true){daysOfMedication.push("sunday")}
    if(days.thursday == true){daysOfMedication.push("thursday")}
    if(days.tuesday == true){daysOfMedication.push("tuesday")}
    if(days.wednesday == true){daysOfMedication.push("wednesday")}

    return daysOfMedication.toString();
  }

  openMenu(ev:Event){
    ev.stopPropagation();
    let popover = this.popoverCtrl.create('PopoverMedicalCareCardPage', {data:"Wait"});

    popover.onDidDismiss(data => {
      if(data == null) {
      }else{
        if(data == "edit"){

        }
        if(data == "delete"){

        }
      }
    });

    popover.present({ev: event});
  }

  getAllMedicalRecords(){
    this.loading = true;
    this.medicalService.getMedicalRecords(this.selectedClasses,this.selectedStudent, this.selectedStatus, this.date,this.page,this.View,
      this.startDate,this.endDate,this.pageSize).subscribe(
        value =>{
          this.oldSearch =  JSON.parse(JSON.stringify(this.search));
          if(this.refresherIsStart) {
            this.medicalRecords = [];
          }
          let Data:any = value;
          for(let val of Data){
            for(let medicine of val.medicalRecord.prescription.medications){
              let medicalRec = new MedicalRecord();
              medicalRec.accountId=val.medicalRecord.accountId;
              medicalRec.approved=val.medicalRecord.approved;
              medicalRec.branchId=val.medicalRecord.branchId;
              medicalRec.checkup=val.medicalRecord.checkup;
              medicalRec.createdFrom=val.medicalRecord.createdFrom;
              medicalRec.id=val.medicalRecord.id;
              medicalRec.incident=val.medicalRecord.incident;
              medicalRec.prescription=val.medicalRecord.prescription;
              medicalRec.oneMedication=medicine;
              medicalRec.student=val.medicalRecord.student;
              this.medicalRecords.push(medicalRec);
            }
          }
          console.log(this.medicalRecords);
          if(this.refresherIsStart) {
            this.refresher.complete();
            this.refresherIsStart = false;
          }
          if(this.nextPageIsStarted) {
            this.nextPage();
            this.nextPageIsStarted = false;
          }
          this.loading = false;
        },error=>{
        if(this.refresherIsStart) {
          this.refresher.complete();
        }
        if(this.nextPageIsStarted) {
          this.nextPage();
        }
        console.log("Data failed");
        console.log(error);
        this.loading = false;
      });
  }

  doRefresh(refresher){
    this.refresher = refresher;
    this.refresherIsStart = true;
    this.page = 1;
    this.getAllMedicalRecords();
  }

  doInfinite(){
    return new Promise((resolve) => {
      this.nextPage = resolve;
      this.nextPageIsStarted = true;
      this.page += 1;
      this.getAllMedicalRecords();
    });
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  startSearchObject(){

    this.search.object = {"classes": {},"date": {},"status": {},"student": {}, "to":""};
    this.filterDate = this.transformDate.transformTheDate(new Date(),"dd-MM-yyyy");

    // @ts-ignore
    this.search.object.classes = {'id': 0, 'name': "All Classes"};
    // @ts-ignore
    this.search.object.date = {'to':this.filterDate, 'from':this.filterDate};
    // @ts-ignore
    this.search.object.status = {'id': -1, 'name': "All Status"};
    // @ts-ignore
    this.search.object.student = {'id': 0, 'name': "All Students"};
    // @ts-ignore
    this.search.object.to = this.filterDate;
  }

  statusModelChange(fromModule){
    this.page = 1;
    if(fromModule){
      if(this.theStatus == "All Status"){
        // @ts-ignore
        this.search.object.status = {'id': -1, 'name': "All Status"};
      }
      if(this.theStatus == "Active"){
        // @ts-ignore
        this.search.object.status = {'id': 0, 'name': "Active"};
      }
      if(this.theStatus == "inActive"){
        // @ts-ignore
        this.search.object.status = {'id': 1, 'name': "inActive"};
      }
    }
    let newVal:any = JSON.parse(JSON.stringify(this.search.object));
    let oldVal:any = JSON.parse(JSON.stringify(this.oldSearch.object));
    this.theStatus = newVal.status.name;
    this.selectedClasses = 0;
    this.selectedStudent = 0;
    this.selectedStatus = -1 ;

    let tempclassId = newVal.classes.id ;
    let tempstudentId = newVal.student.id ;
    let tempstatusId = newVal.status.id ;
    let date  = newVal.date ;
    let dateRange  = newVal.date ;

    if(this.selectedStudent !== newVal.student.id)
      this.selectedStudent = tempstudentId;

    if(this.selectedClasses !== newVal.classes.id) {
      this.selectedClasses = tempclassId;
    }

    if(newVal.status){
      if(newVal.status.name=='Active') {
        this.selectedStatus = 1;
      }else if(newVal.status.name=='inActive') {
        this.selectedStatus = 0;
      }else {this.selectedStatus = -1;}
    }

    let filterdate = this.filterDate;


    if( this.filterDate !== date  && date!='No Date Selected' && newVal.date != oldVal.date) {
      this.filterDate = date;
      if(this.filterDate){
        this.filterDate = this.transformDate.transformTheDate(new Date(),"dd-MM-yyyy HH:mm:ss");
      }
    }

    this.filterDate = null;
    this.medicalRecords = [];
    this.loading = true;
    this.getAllMedicalRecords();
  }


}
