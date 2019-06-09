import {Component, OnInit, ViewChild} from '@angular/core';
import _ from "lodash";
import {AlertController, ModalController, Platform, PopoverController} from '@ionic/angular';
import {MedicalCareService} from '../../services/MedicalCare/medical-care.service';
import {Storage} from '@ionic/storage';
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';
import {ToastViewService} from '../../services/ToastView/toast-view.service';
import {ClassesService} from '../../services/Classes/classes.service';
import {StudentsService} from '../../services/Students/students.service';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import {TemplateFunctionsService} from '../../services/TemplateFunctions/template-functions.service';
import {AccountService} from '../../services/Account/account.service';
import {ExcelService} from '../../services/Excel/excel.service';
@Component({
  selector: 'app-medical-care',
  templateUrl: './medical-care.page.html',
  styleUrls: ['./medical-care.page.scss'],
})
export class MedicalCarePage implements OnInit {

  // @ViewChild(Slides) slides: Slides;
  MEDICATIONS_NAME = "medications";
  INCIDENTS_NAME = "incidents";
  CHECKUPS_NAME = "checkups";
  WAITING_APPROVAL_NAME = "waitingApproval";
  MEDICATIONS_INDEX = 99999;
  INCIDENTS_INDEX = 99999;
  CHECKUPS_INDEX = 99999;
  WAITING_APPROVAL_INDEX = 99999;
  MEDICATIONS_OPEND = false;
  INCIDENTS_OPEND = false;
  CHECKUPS_OPEND = false;
  WAITING_APPROVAL_OPEND = false;
  justEnter:boolean;
  loadingMedication:boolean = false;
  loadingIncident:boolean = false;
  loadingCheckup:boolean = false;
  loadingApprove:boolean = false;
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  refresher:any;
  refresherIsStart:boolean = false;
  nextPage:any;
  nextPageIsStarted:boolean = false;
  medicalRecords:any[]=[];
  incidentRecords:any[]=[];
  checkupRecords:any[]=[];
  approvalRecords:any[]=[];
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
  medicalReportNumber;
  allStatusInMedication:any[]=["All Status","Active","inActive"];
  MEDICATION_TAB = "Medications";
  INCIDENT_TAB = "Incidents";
  CHECKUP_TAB = "Checkups";
  APPROVING_TAB = "Approval";
  pageMedication:any;
  pageIncident:any;
  pageCheckup:any;
  pageApproval:any;
  allclasses:any[]=[];
  allStudents:any[]=[];
  justRefresher = false;
  load;

  ///////////////////////////////////////////
  incidentTemplate:any[] = [];
  incidentQuestions:any[] = [];
  incidentQuestionsFirst:any[] = [];
  medicalRecordObject;

  medicalRecordsForIncident = [];

  result;

  incidentAnswers:any[]=[];
  incidentAnswer:any[]=[];
  incidentAnswersNoOfItems:any[]=[];
  incidentQuestionsEditParamTemps:any[]=[];

  exAllIncidents:any[]=[];
  selectedRecord;

  oldIncidentQuestionsList:any[]=[];
  elementDone=0;
  recordsNumber;
  loading;

  constructor(public popoverCtrl:PopoverController,public platform:Platform,
              public medicalService:MedicalCareService, private storage:Storage,public transformDate:TransFormDateService,private toastCtrl:ToastViewService,
              private modalCtrl:ModalController,private classServ:ClassesService,private studentServ:StudentsService, private  alrtCtrl:AlertController,
              private  loadCtrl:LoadingViewService,private accountServ:AccountService,private templetService:TemplateFunctionsService,private excal:ExcelService)
  {

    console.log(this.search);
    this.justEnter = true;
    this.getTabsIndex();
    this.selectedClasses = 0;
    this.selectedStudent = 0;
    this.selectedStatus = -1;
    this.date = null;
    this.pageMedication = 1;
    this.pageIncident = 1;
    this.pageCheckup = 1;
    this.pageApproval = 1;
    this.setFristView();
    this.startDate = null;
    this.endDate = null;
    this.startSearchObject();
    //Start Code
    if (platform.is('desktop')) {
      medicalService.putHeader(localStorage.getItem(this.localStorageToken));
      this.getMedicalCareSettings();
      classServ.putHeader(localStorage.getItem(this.localStorageToken));
      studentServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.getAllMedicalRecords(this.View);
      this.getAllClasses();
      this.getAllStudents();
    } else {
      storage.get(this.localStorageToken).then(
          val => {
            medicalService.putHeader(val);
            this.getMedicalCareSettings();
            classServ.putHeader(val);
            studentServ.putHeader(val);
            this.getAllMedicalRecords(this.View);
            this.getAllClasses();
            this.getAllStudents();
          });
    }

  }

  ngOnInit() {
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
      this.toastCtrl.presentTimerToast("This medicine is already taken");
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

  setStartAndEndDate(date,from){
    if(date){
      return date.slice(0,-6);
    }else{
      if(from =='end'){
        return 'No End Date';
      }else {
        return '';
      }
    }
  }


  checkIfTaken(medicationSchadule){
    if(medicationSchadule){
      return medicationSchadule.taken;
    }else{
      return false;
    }
  }

  writeOnTimeButton(medication){
    let writeThis;
    if(medication.activeMedication && medication.activeMedicationTaken) {
      let arrayOfTimes = [];
      arrayOfTimes  = medication.otherTimeOfTakenMedication;
      if(arrayOfTimes.length > 0) {
        writeThis = "Took " + medication.oneMedication.dosageNumber + " " + medication.oneMedication.dosageType.type + " at " + medication.timeOfActiveMedication.time.slice(0,-3)+", "+ arrayOfTimes;
      }else{
        writeThis = "Took " + medication.oneMedication.dosageNumber + " " + medication.oneMedication.dosageType.type + " at " + medication.timeOfActiveMedication.time.slice(0,-3);
      }
    }else if(medication.activeMedication && !medication.activeMedicationTaken){
      writeThis = "Give "+medication.oneMedication.dosageNumber+" "+medication.oneMedication.dosageType.type +" at "+ medication.timeOfActiveMedication.time.slice(0,-3);
    }

    return writeThis;
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


  optimizeTimesData(schadule){
    let times:any[] = [];
    for(let time of schadule){
      if(time.time.toString().length > 5) {
        times.push(" " + time.time.slice(0, -3));
      }else{
        times.push(" " + time.time);
      }
    }
    return times;
  }


  optimizeInstructionData(instructions){
    let allInstructions:any[] = [];
    for(let instruction of instructions){
      allInstructions.push(" "+instruction.name);
    }
    if(allInstructions.length > 0) {
      return allInstructions;
    }else{
      return "No Instructions"
    }
  }

  setDaysOfMedication(days){
    let daysOfMedication = [];
    if(days.friday == true){daysOfMedication.push(" Friday")}
    if(days.monday == true){daysOfMedication.push(" Monday")}
    if(days.saturday == true){daysOfMedication.push(" Saturday")}
    if(days.sunday == true){daysOfMedication.push(" Sunday")}
    if(days.thursday == true){daysOfMedication.push(" Thursday")}
    if(days.tuesday == true){daysOfMedication.push(" Tuesday")}
    if(days.wednesday == true){daysOfMedication.push(" Wednesday")}
    if(daysOfMedication.length == 5){
      return "EveryDay";
    }else {
      return daysOfMedication.toString();
    }
  }

  



}
