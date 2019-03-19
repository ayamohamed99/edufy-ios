import {Component, ViewChild} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {
  NavController,
  NavParams,
  PopoverController,
  AlertController,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
  FabContainer,
  Slides
} from 'ionic-angular';
import {MedicalCareService} from "../../services/medicalcare";
import {Storage} from "@ionic/storage";
import {MedicalRecord} from "../../models/medical-record";
import {Class, Student} from "../../models";
import {TransFormDate} from "../../services/transFormDate";
import {a} from "@angular/core/src/render3";
import {ClassesService} from "../../services/classes";
import {StudentsService} from "../../services/students";
import {AccountService} from "../../services/account";
import {TemplateFunctionsService} from "../../services/templateFunctionsService";
import {Excel} from "../../services/excel";
import _ from "lodash";


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
  @ViewChild(Slides) slides: Slides;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl:PopoverController,public platform:Platform,
              public medicalService:MedicalCareService, private storage:Storage,public transformDate:TransFormDate,private toastCtrl:ToastController,
              private modalCtrl:ModalController,private classServ:ClassesService,private studentServ:StudentsService, private  alrtCtrl:AlertController,
              private  loadCtrl:LoadingController,private accountServ:AccountService,private templetService:TemplateFunctionsService,private excal:Excel) {
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
    if (platform.is('core')) {
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

  openMenu(ev:Event,medRecord,view,index){
    // ev.stopPropagation();
    let editButton = false;
    let deleteButton = false;
    if(view == this.MEDICATIONS_NAME) {

      if(this.accountServ.getUserRole().editMedication){
        editButton = true;
      }
      if(this.accountServ.getUserRole().deleteMedication && !medRecord.oneMedication.status){
        deleteButton = true;
      }

    }else if(view == this.INCIDENTS_NAME){

      if(this.accountServ.getUserRole().editIncident){
        editButton = true;
      }
      if(this.accountServ.getUserRole().deleteIncident){
        deleteButton = true;
      }

    }else if(view == this.CHECKUPS_NAME){

      if(this.accountServ.getUserRole().editCheckup){
        editButton = true;
      }
      if(this.accountServ.getUserRole().deleteCheckup){
        deleteButton = true;
      }

    }else if(view == this.WAITING_APPROVAL_NAME){

      if(medRecord.medicalRecord.incident){
        if(this.accountServ.getUserRole().editIncident){
          editButton = true;
        }
        if(this.accountServ.getUserRole().deleteIncident){
          deleteButton = true;
        }

      }else if(medRecord.medicalRecord.checkup || !medRecord.medicalRecord.incident){

        if(this.accountServ.getUserRole().editCheckup){
          editButton = true;
        }
        if(this.accountServ.getUserRole().deleteCheckup){
          deleteButton = true;
        }

      }

    }


    let popover = this.popoverCtrl.create('PopoverMedicalCareCardPage', {
      Edit:editButton,
      Delete:deleteButton
    });

    popover.onDidDismiss(data => {
      if(data) {
        if(view == this.MEDICATIONS_NAME){
          this.editOrDeleteMedication(data.done,medRecord,index,view);
        }else if(view == this.INCIDENTS_NAME){
          this.editOrDeleteIncident(data.done,medRecord,index,view);
        }else if(view == this.CHECKUPS_NAME){
          this.editOrDeleteCheckup(data.done,medRecord,index,view);
        }else if(view == this.WAITING_APPROVAL_NAME){
          if(medRecord.medicalRecord.incident){
            this.editOrDeleteIncident(data.done,medRecord,index,view);
          }else if(medRecord.medicalRecord.checkup || !medRecord.medicalRecord.incident){
            this.editOrDeleteCheckup(data.done,medRecord,index,view);
          }
        }
      }
    });

    popover.present({ev: event});
  }

  getAllMedicalRecords(view){

    if(view == this.MEDICATIONS_NAME){
      this.loadingMedication = true;
      this.page = this.pageMedication;
      this.MEDICATIONS_OPEND = true;
    }else if(view == this.INCIDENTS_NAME){
      this.loadingIncident = true;
      this.page = this.pageIncident;
      this.INCIDENTS_OPEND = true;
    }else if(view == this.CHECKUPS_NAME){
      this.loadingCheckup = true;
      this.page = this.pageCheckup;
      this.CHECKUPS_OPEND = true;
    }else if(view == this.WAITING_APPROVAL_NAME){
      this.loadingApprove = true;
      this.page = this.pageApproval;
      this.WAITING_APPROVAL_OPEND = true;
    }

    this.medicalService.getMedicalRecords(this.selectedClasses,this.selectedStudent, this.selectedStatus, this.date,this.page,this.View,
      this.startDate,this.endDate,this.pageSize).subscribe(
        value =>{
          this.oldSearch =  JSON.parse(JSON.stringify(this.search));
          if(this.refresherIsStart) {
            if(view == this.MEDICATIONS_NAME){
              this.medicalRecords = [];
              this.MEDICATIONS_OPEND = true;
            }else if(view == this.INCIDENTS_NAME){
              this.incidentRecords = [];
            }else if(view == this.CHECKUPS_NAME){
              this.checkupRecords = [];
            }else if(view == this.WAITING_APPROVAL_NAME){
              this.approvalRecords = [];
            }
          }
          if(this.justRefresher) {
            if(view == this.MEDICATIONS_NAME){
              this.medicalRecords = [];
              this.MEDICATIONS_OPEND = true;
            }else if(view == this.INCIDENTS_NAME){
              this.incidentRecords = [];
            }else if(view == this.CHECKUPS_NAME){
              this.checkupRecords = [];
            }else if(view == this.WAITING_APPROVAL_NAME){
              this.approvalRecords = [];
            }
            this.justRefresher = false;
            try {
              this.load.dismiss();
            }catch (e) {
              
            }
          }
          let Data:any = value;
          if(this.View == this.MEDICATIONS_NAME){
            this.getAllMedications(Data);
          }else{
            this.getAllOtheData(Data,view);
          }
          console.log(this.medicalRecords);
          console.log(this.incidentRecords);
          console.log(this.checkupRecords);
          console.log(this.approvalRecords);
          if(this.refresherIsStart) {
            this.refresher.complete();
            this.refresherIsStart = false;
          }
          if(this.nextPageIsStarted) {
            this.nextPage();
            this.nextPageIsStarted = false;
          }
          if(view == this.MEDICATIONS_NAME){
            this.loadingMedication = false;
          }else if(view == this.INCIDENTS_NAME){
            this.loadingIncident = false;
          }else if(view == this.CHECKUPS_NAME){
            this.loadingCheckup = false;
          }else if(view == this.WAITING_APPROVAL_NAME){
            this.loadingApprove = false;
          }

          if(this.justEnter){
            this.callData();
            this.justEnter = false;
          }

        },error=>{
        if(this.refresherIsStart) {
          this.refresher.complete();
        }
        if(this.nextPageIsStarted) {
          this.nextPage();
        }
        console.log("Data failed");
        console.log(error);
        if(view == this.MEDICATIONS_NAME){
          this.loadingMedication = false;
        }else if(view == this.INCIDENTS_NAME){
          this.loadingIncident = false;
        }else if(view == this.CHECKUPS_NAME){
          this.loadingCheckup = false;
        }else if(view == this.WAITING_APPROVAL_NAME){
          this.loadingApprove = false;
        }
      });
  }

  getAllMedications(Data){
    for(let val of Data){
      // for(let medicine of val.medicalRecord.prescription.medications){
      for(let i=0;i<val.medicalRecord.prescription.medications.length;i++){
        let medicine = val.medicalRecord.prescription.medications[i];
        let medicalRec = new MedicalRecord();

        let statusData = this.checkIfTimeToTakeMedication(medicine,'there_is_active_medication');

        medicalRec.accountId=val.medicalRecord.accountId;
        medicalRec.approved=val.medicalRecord.approved;
        medicalRec.id=val.medicalRecord.branchId;
        medicalRec.checkup=val.medicalRecord.checkup;
        medicalRec.createdFrom=val.medicalRecord.createdFrom;
        medicalRec.id=val.medicalRecord.id;
        medicalRec.incident=val.medicalRecord.incident;
        medicalRec.prescription=val.medicalRecord.prescription;
        medicalRec.oneMedication=medicine;
        medicalRec.student=val.medicalRecord.student;
        medicalRec.activeMedication = statusData.status;
        medicalRec.activeMedicationTaken = statusData.taken;
        medicalRec.timeOfActiveMedication = statusData.data;
        medicalRec.otherTimeOfTakenMedication = statusData.otherTaken;
        medicalRec.medicationIndex = i;

        this.medicalRecords.push(medicalRec);
      }
    }
  }

  getAllOtheData(Data,view){
    for(let val of Data){
      let medicalRec = new MedicalRecord();
      medicalRec.accountId=val.medicalRecord.accountId;
      medicalRec.approved=val.medicalRecord.approved;
      medicalRec.id=val.medicalRecord.branchId;
      medicalRec.checkup=val.medicalRecord.checkup;
      medicalRec.createdFrom=val.medicalRecord.createdFrom;
      medicalRec.id=val.medicalRecord.id;
      medicalRec.incident=val.medicalRecord.incident;
      medicalRec.prescription=val.medicalRecord.prescription;
      medicalRec.student=val.medicalRecord.student;

      let fullReport = {
        'checkupAnswers':val.checkupAnswers,
        'checkupTemplate':val.checkupTemplate,
        'incidentAnswers':val.incidentAnswers,
        'incidentTemplate':val.incidentTemplate,
        'medicalRecord':medicalRec
      };

      if(view == this.INCIDENTS_NAME){
        this.incidentRecords.push(fullReport);
      }else if(view == this.CHECKUPS_NAME){
        this.checkupRecords.push(fullReport);
      }else if(view == this.WAITING_APPROVAL_NAME){
        this.approvalRecords.push(fullReport);
      }
    }
  }

  doRefresh(refresher){
    this.refresher = refresher;
    this.refresherIsStart = true;
    if(this.View == this.MEDICATIONS_NAME){
      this.pageMedication = 1;
    }else if(this.View == this.INCIDENTS_NAME){
      this.pageIncident = 1;
    }else if(this.View == this.CHECKUPS_NAME){
      this.pageCheckup = 1;
    }else if(this.View == this.WAITING_APPROVAL_NAME){
      this.pageApproval = 1;
    }
    this.getAllMedicalRecords(this.View);
  }

  doInfinite(){
    return new Promise((resolve) => {
      this.nextPage = resolve;
      this.nextPageIsStarted = true;
      if(this.View == this.MEDICATIONS_NAME){
        this.pageMedication += 1;
      }else if(this.View == this.INCIDENTS_NAME){
        this.pageIncident += 1;
      }else if(this.View == this.CHECKUPS_NAME){
        this.pageCheckup += 1;
      }else if(this.View == this.WAITING_APPROVAL_NAME){
        this.pageApproval += 1;
      }
      this.getAllMedicalRecords(this.View);
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
    if(this.View == this.MEDICATIONS_NAME){
      this.pageMedication = 1;
    }else if(this.View == this.INCIDENTS_NAME){
      this.pageIncident = 1;
    }else if(this.View == this.CHECKUPS_NAME){
      this.pageCheckup = 1;
    }else if(this.View == this.WAITING_APPROVAL_NAME){
      this.pageApproval = 1;
    }
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
    if(this.View == this.MEDICATIONS_NAME){
      this.loadingMedication = true;
    }else if(this.View == this.INCIDENTS_NAME){
      this.loadingIncident = true;
    }else if(this.View == this.CHECKUPS_NAME){
      this.loadingCheckup = true;
    }else if(this.View == this.WAITING_APPROVAL_NAME){
      this.loadingApprove = true;
    }
    this.getAllMedicalRecords(this.View);
  }


  checkIfTimeToTakeMedication(medication, forWhat){
    let booleanArrayOfMedTime = [];
    let statusData:any ={'status':false,'data':{},'taken':false,'otherTaken':[]};
    let otherTaken = [];

    for(let schadual of medication.medicationSchedule){

      let ifTaken = this.checkIfTaken(schadual.medicationsNotifications);

      if(this.checkMedicationTime(schadual.time,medication) && !ifTaken){
        statusData.status = false;
        booleanArrayOfMedTime.push(statusData);
      }else if(this.checkMedicationTime(schadual.time,medication) && ifTaken){
        otherTaken.push(schadual.time.slice(0,-3));
      } else{
        statusData.status = true;
        statusData.data = schadual;
        statusData.taken = ifTaken;
      }
      statusData.otherTaken = otherTaken;
      booleanArrayOfMedTime.push(statusData);
    }

    // let WhatIFound:any;
    // if(forWhat == 'there_is_active_medication'){
    //   for(let data of booleanArrayOfMedTime){
    //     if(data.status != false){
    //       WhatIFound = data;
    //     }
    //   }
    //   if(WhatIFound == null || WhatIFound == ''){
    //     WhatIFound = false;
    //   }
    // }


    return statusData;
  }


  fabSelected(index,fab:FabContainer){
    fab.close();
    let modal;
    if(index == 0){
      modal = this.modalCtrl.create('NewMedicalReportPage',{
        for:'Incident',
        operation:'new'
      });
    }else{
      modal = this.modalCtrl.create('NewMedicalReportPage',{
        for:'Checkup',
        operation:'new'
      });
    }
    modal.onDidDismiss();
    modal.present();
  }

  tabThatSelectedDo(tabName){
    console.log("TabName "+this.View);
    let speed = 500;
    if(tabName == this.MEDICATIONS_NAME){
      this.slides.slideTo(this.MEDICATIONS_INDEX, speed);
    }else if(tabName == this.INCIDENTS_NAME){
      this.slides.slideTo(this.INCIDENTS_INDEX, speed);
    }else if(tabName == this.CHECKUPS_NAME){
      this.slides.slideTo(this.CHECKUPS_INDEX, speed);
    }else if(tabName == this.WAITING_APPROVAL_NAME){
      this.slides.slideTo(this.WAITING_APPROVAL_INDEX, speed);
    }
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
    switch (currentIndex){
      case this.MEDICATIONS_INDEX:
        this.View = this.MEDICATIONS_NAME;
        if(!this.MEDICATIONS_OPEND){
          this.getAllMedicalRecords(this.MEDICATIONS_INDEX);
        }
        break;
      case this.INCIDENTS_INDEX:
        this.View = this.INCIDENTS_NAME;
        if(!this.INCIDENTS_OPEND){
          this.getAllMedicalRecords(this.INCIDENTS_NAME);
        }
        break;

      case this.CHECKUPS_INDEX:
        this.View = this.CHECKUPS_NAME;
        if(!this.CHECKUPS_OPEND){
          this.getAllMedicalRecords(this.CHECKUPS_NAME);
        }
        break;

      case this.WAITING_APPROVAL_INDEX:
        this.View = this.WAITING_APPROVAL_NAME;
        if(!this.WAITING_APPROVAL_OPEND){
          this.getAllMedicalRecords(this.WAITING_APPROVAL_NAME);
        }
        break;

      default:
        break;
    }
  }



  getMedicalCareSettings(){
    this.medicalService.getAccountMedicalCareSettings(this.accountServ.userAccount.accountId).subscribe(
      val=>{
        // console.log(val);
        let Data = val;
        this.MEDICATION_TAB = Data.medicationsTapName;
        this.INCIDENT_TAB = Data.incidentTapName;
        this.CHECKUP_TAB = Data.checkupTapName;
      },err=>{
        // console.log(err);
        this.presentToast("Can\'t load medical care settings,\n Medical care setting will be default");
      });
  }


  callData(){
    this.classServ.getClassList("Medical Care",2,null,null,null,null).subscribe();
    this.studentServ.getAllStudents(7,"Medical Care").subscribe();
    this.medicalService.getMedicines().subscribe();
    this.medicalService.getDosageTypes().subscribe();
    this.medicalService.getInstructions().subscribe();
    this.medicalService.getIncidentTemplate().subscribe();
    this.medicalService.getCheckupTemplate().subscribe();
  }


  setFristView(){
    if(this.accountServ.getUserRole().viewMedication){
      this.View = "medications";
    }else if(this.accountServ.getUserRole().viewIncident){
      this.View = "";
    }else if(this.accountServ.getUserRole().viewCheckup){
      this.View = "";
    }
  }

  getTabsIndex(){
    let foundMED = false;let foundINC = false;let foundCHE = false;let foundWAP = false;
    let index = 0;
    for(let i=0;i<5;i++){
      if(this.accountServ.getUserRole().viewMedication && !foundMED){
        foundMED = true;
        this.MEDICATIONS_INDEX = index;
        index += 1;
      }else if(this.accountServ.getUserRole().viewIncident && !foundINC){
        foundINC = true;
        this.INCIDENTS_INDEX = index;
        index += 1;
      }else if(this.accountServ.getUserRole().viewCheckup && !foundCHE){
        foundCHE = true;
        this.CHECKUPS_INDEX = index;
        index += 1;
      }else if(this.accountServ.getUserRole().medicalRecordCanApprove && !foundWAP){
        foundWAP = true;
        this.WAITING_APPROVAL_INDEX = index;
        index += 1;
      }
    }
  }


  getDateForApproval(medicalReport){
    if(medicalReport.incident){
      return medicalReport.incident.incidentDate.slice(0,-6);
    }else if(medicalReport.checkup){
      return medicalReport.checkup.checkupDate.slice(0,-6);
    }else{
      return '';
    }

  }


  openExportIncidentsPage(){
    let model;

    model = this.popoverCtrl.create('FilterViewPage', {
      theFilter: JSON.stringify(this.search),
      pageName: 'Export Incidents',
      doneButton: 'Export',
      students:this.allStudents,
      classes:this.allclasses
    }, {cssClass: 'contact-popovers'});

    model.onDidDismiss(
      data => {
        console.log(data);
        if(data) {
          let search = JSON.parse(JSON.stringify(data.search.object));
          let startDateFilter;
          let endDateFilter;
          if (search.date.from) {
            startDateFilter = this.transformDate.transformTheDate(new Date(search.date.from), "dd-MM-yyy HH:mm:ss");
          }
          if (search.date.to) {
            endDateFilter = this.transformDate.transformTheDate(new Date(search.date.to), "dd-MM-yyy HH:mm:ss");
          }
          let selectedPage = 1;

          let selectedClass = 0, selectedStudent = 0;

          if (selectedStudent != search.student.id) {
            selectedStudent = search.student.id;
          }
          if (selectedClass != search.classes.id) {
            selectedClass = search.classes.id;
          }

          this.getMedicalReportCount(selectedClass, selectedStudent, -1, null, 0, "incidents", startDateFilter, endDateFilter, null);
        }
      });

    model.present();
  }


  getAllClasses() {
    this.classServ.getClassList("Medical Care", 2, null, null, null, null).subscribe(
      classVal => {
        let allData: any = classVal;
        this.allclasses = allData;
      }, classErr => {
        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Something went wrong, please refresh the page',
          buttons: ['OK']
        }).present();
      });
  }

  getAllStudents() {
    this.studentServ.getAllStudents(7, "Medical Care").subscribe(
      studentVal => {
        let data: any = studentVal;
        this.allStudents = data;
      }, studentErr => {
        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Something went wrong, please refresh the page',
          buttons: ['OK']
        }).present();
      });
  }

  approveMedicalRecord(medicalRecordId){

    this.alrtCtrl.create({
      title: 'Approve',
      subTitle: 'Are you sure you want approve this report now',
      buttons: [{
        text: 'No',
        role: 'cancel'
      },{
        text: 'Yes',
        handler: () => {

          this.load = this.loadCtrl.create({
            content: "",
            cssClass: "loadingWithoutBackground"
          });
          this.load.present();
          this.medicalService.approveMedicalRecord(medicalRecordId).subscribe(
            response => {
              this.load.dismiss();
              this.presentToast("Success to approve medical record");
              this.getAllMedicalRecords(this.View);
              this.refresherIsStart = true;

            }, reason => {
              if(reason && reason.statusText && reason.statusText == "OK"){
                this.justRefresher = true;
                this.presentToast("Success to approve medical record");
                this.load.dismiss();
                this.getAllMedicalRecords(this.View);
              }else {
                this.presentToast("Failed to approve medical record");
                console.log(reason);
              }

            });
        }
      },]
    }).present();
  }

  editOrDeleteMedication(data,medRecord,index,view){
    if(data == "edit"){
      let modal;
      modal = this.modalCtrl.create('NewMedicalReportMedicinePage',{
        operation:"edit",
        medicalRecord:medRecord,
        pageName:"Edit Medication"
      });
      modal.onDidDismiss(
        data =>{
          if(data){
            if(data.done == 'edit') {
              this.justRefresher = true;
              this.MEDICATIONS_INDEX = 1;
              this.getAllMedicalRecords(view);
            }
          }
        });
      modal.present();
    }
    if(data == "delete"){
      this.alrtCtrl.create({
        subTitle: 'Do you want to delete this Medication ?',
        buttons: [{
          text: 'No',
          role: 'cancel'
        },{
          text: 'Yes',
          handler: () => {

            this.load = this.loadCtrl.create({
              content: "",
              cssClass: "loadingWithoutBackground"
            });
            this.load.present();
            this.medicalService.deleteMedication(medRecord.id,medRecord.oneMedication.id).subscribe(
              response=> {
                this.load.dismiss();
              let result = response;
              this.medicalRecords.splice(index,1);
                this.justRefresher=true;
              this.presentToast('Medication deleted successfully');
                this.MEDICATIONS_INDEX = 1;
              this.getAllMedicalRecords(view);
            }, reason=> {
                this.load.dismiss();
                this.presentToast('Failed to delete medication');
            });
          }
        }]
      }).present();
    }
  }

  editOrDeleteIncident(data,medRecord,index,view){
    if(data == "edit"){
      let modal;
      modal = this.modalCtrl.create('NewMedicalReportPage',{
        for:'Incident',
        operation:"edit",
        medicalRecord:medRecord,
        pageName:"Edit Incident"
      });
      modal.onDidDismiss(
        data =>{
          if(data){
            if(data.done == 'edit') {
              let data = medRecord.medicalRecord;
              let students = new Student();

              students.classes.id = data.classes.id;
              students.classes.name = data.classes.name;
              students.classes.grade.id = data.classes.grade.id;
              students.classes.grade.name = data.classes.grade.name;
              students.classes.branch.id = data.classes.branch.id;
              students.classes.branch.name = data.classes.branch.name;
              students.classes.branch.managerId = data.classes.branch.managerId;
              students.id = data.id;
              students.name = data.name;
              students.address = data.address;
              students.searchByClassGrade = data.classes.grade.name + " - " + data.classes.name;
              medRecord.medicalRecord.student = students;
              this.justRefresher = true;
              if(this.INCIDENTS_NAME == view){
                this.INCIDENTS_INDEX = 1;
              }else if(this.WAITING_APPROVAL_NAME == view){
                this.WAITING_APPROVAL_INDEX = 1;
              }
              this.getAllMedicalRecords(view);
            }
          }
        });
      modal.present();
    }
    if(data == "delete"){
      this.alrtCtrl.create({
        subTitle: 'Do you want to delete this Incident ?',
        buttons: [{
          text: 'No',
          role: 'cancel'
        },{
          text: 'Yes',
          handler: () => {

            this.load = this.loadCtrl.create({
              content: "",
              cssClass: "loadingWithoutBackground"
            });
            this.load.present();
            this.medicalService.deleteIncident(medRecord.medicalRecord.id).subscribe(
              response=> {
              this.load.dismiss();
              let result = response;
                if(view == this.INCIDENTS_NAME){
                  this.incidentRecords.splice(index,1);
                }else if(view == this.WAITING_APPROVAL_NAME){
                  this.approvalRecords.splice(index,1);
                }
                this.justRefresher=true;
              this.presentToast('Incident deleted successfully');
                if(this.INCIDENTS_NAME == view){
                  this.INCIDENTS_INDEX = 1;
                }else if(this.WAITING_APPROVAL_NAME == view){
                  this.WAITING_APPROVAL_INDEX = 1;
                }
              this.getAllMedicalRecords(view);
            }, reason=> {
              this.load.dismiss();
              this.presentToast('Failed to delete incident');
            });
          }
        }]
      }).present();
    }
  }

  editOrDeleteCheckup(data,medRecord,index,view){
    if(data == "edit"){
      let modal;
      modal = this.modalCtrl.create('NewMedicalReportPage',{
        for:'Checkup',
        operation:"edit",
        medicalRecord:medRecord,
        pageName:"Edit Checkup"
      });
      modal.onDidDismiss(
        data =>{
          if(data){
            if(data.done == 'edit') {
              let data = medRecord.medicalRecord;
              let students = new Student();

              students.classes.id = data.classes.id;
              students.classes.name = data.classes.name;
              students.classes.grade.id = data.classes.grade.id;
              students.classes.grade.name = data.classes.grade.name;
              students.classes.branch.id = data.classes.branch.id;
              students.classes.branch.name = data.classes.branch.name;
              students.classes.branch.managerId = data.classes.branch.managerId;
              students.id = data.id;
              students.name = data.name;
              students.address = data.address;
              students.searchByClassGrade = data.classes.grade.name + " - " + data.classes.name;
              medRecord.medicalRecord.student = students;
              this.justRefresher = true;
              if(this.CHECKUPS_NAME == view){
                this.CHECKUPS_INDEX = 1;
              }else if(this.WAITING_APPROVAL_NAME == view){
                this.WAITING_APPROVAL_INDEX = 1;
              }
              this.getAllMedicalRecords(view);
            }
          }
        });
      modal.present();
    }
    if(data == "delete"){
      this.alrtCtrl.create({
        subTitle: 'Do you want to delete this Checkup ?',
        buttons: [{
          text: 'No',
          role: 'cancel'
        },{
          text: 'Yes',
          handler: () => {

            this.load = this.loadCtrl.create({
              content: "",
              cssClass: "loadingWithoutBackground"
            });
            this.load.present();
            this.medicalService.deleteCheckup(medRecord.medicalRecord.id).subscribe(
              response=> {
                this.load.dismiss();
                let result = response;
                if(view == this.CHECKUPS_NAME){
                  this.checkupRecords.splice(index,1);
                }else if(view == this.WAITING_APPROVAL_NAME){
                  this.approvalRecords.splice(index,1);
                }
                this.justRefresher=true;
                this.presentToast('Checkup deleted successfully');
                if(this.CHECKUPS_NAME == view){
                  this.CHECKUPS_INDEX = 1;
                }else if(this.WAITING_APPROVAL_NAME == view){
                  this.WAITING_APPROVAL_INDEX = 1;
                }
                this.getAllMedicalRecords(view);
              }, reason=> {
                this.load.dismiss();
                this.presentToast('Failed to delete incident');
              });
          }
        }]
      }).present();
    }
  }

//////////////////////EXPORT INCIDENTS//////////////////////////////////


  getMedicalReportCount(selectedClass,selectedStudent,selectedStatus,date,page,view,startdate,enddate,pagesize){
    this.loading = this.loadCtrl.create({
      content: "",
      cssClass: "loadingWithoutBackground"
    });
    this.loading.present();
    this.medicalService.countMedicalRecords(selectedClass,selectedStudent,selectedStatus,date,0,view,startdate,enddate,pagesize).subscribe(
      response=> {

        console.log(response);
        let that = this;

        let gettingData = false;
        let medicalRecordsNum = response ;
        this.recordsNumber = response;
        this.medicalService.getMedicalRecords(selectedClass , selectedStudent,-1,null ,1,"incidents",startdate,enddate,this.recordsNumber)
          .subscribe(
            response => {

              this.medicalRecordObject = response;

              this.medicalRecordsForIncident = [];

              this.result = response;

              // @ts-ignore
              for (let i = 0; i < this.medicalRecordObject.length; i++) {
                let medicalRecord = this.medicalRecordObject[i].medicalRecord;
                this.medicalRecordsForIncident.push(medicalRecord);
                if (medicalRecord.incident) {
                  this.incidentAnswers[medicalRecord.incident.id] = (this.medicalRecordObject[i].incidentAnswers);
                  medicalRecord.incident.incidentTemplateObject = this.medicalRecordObject[i].incidentTemplate;
                  medicalRecord.incident.answers = this.medicalRecordObject[i].incidentAnswers;
                  this.incidentAnswer[medicalRecord.incident.id] = {
                    "incidentAnswersObjectsList": []
                  };
                  this.incidentAnswersNoOfItems[medicalRecord.incident.id] = {};
                  this.incidentQuestionsEditParamTemps[medicalRecord.incident.id] = {};

                  if (view == 'incidents')
                    this.getIncidentTemplate(medicalRecord.incident);
                }
                if (i == this.medicalRecordObject.length - 1) {
                  this.prepareExcelSections(function (result) {
                    if (result) {
                      let table = document.getElementById('field1');
                      let interval = setInterval(() => {
                        if(that.elementDone == that.recordsNumber -1) {
                          that.loading.dismiss();
                          that.excal.tableToExcel(table, 'IncidentExport(' + that.recordsNumber + ').xlsx');
                          clearInterval(interval);
                        }
                      },100);

                    }
                  })

                }
              }
          },reason =>{
              this.loading.dismiss();
              this.presentToast('Failed to export incident report(s)');
            });

      }, reason=> {
        this.loading.dismiss();
        this.presentToast('Failed to export incident report(s)');
      });
  }


  prepareExcelSections (callback){

    this.exAllIncidents = [];
    for(let i in this.medicalRecordsForIncident){
      this.selectedRecord = this.medicalRecordsForIncident[i];
      let incident = this.selectedRecord.incident;

      let questions  = this.incidentQuestions[incident.id];
      let answers = this.incidentAnswer[incident.id].incidentAnswersObjectsList;
      let incidentAnswers = [];

      for(let i=0;i<questions.length;i++){
        let question = questions[i].question;
        let answer = answers[i].answer;

        if(answer.toString()){
          let object = {q:question,a:answer};
          incidentAnswers.push(JSON.parse(JSON.stringify(object)));
        } else {
          let result  = this.getQuestionAnswer(questions[i].parametersList,answers[i].answer);
          let object = {q:question,a:result};
          incidentAnswers.push(JSON.parse(JSON.stringify(object)));
        }
      }
      let ArrayOfQuestions:any[]=[];
      for(let item of incidentAnswers){
        ArrayOfQuestions.push(item.q);
      }
      let startNewLine = false;
      if (_.isEqual(ArrayOfQuestions,this.oldIncidentQuestionsList)) {
        startNewLine = false;
      } else {
        this.oldIncidentQuestionsList = JSON.parse(JSON.stringify(ArrayOfQuestions));
        startNewLine = true;
      }

      this.exAllIncidents.push({list:JSON.parse(JSON.stringify(incidentAnswers)),id:incident.id,title:incident.title,date:incident.incidentDate,
        student:this.selectedRecord.student.name,class:this.selectedRecord.student.classes.grade.name+'-'+this.selectedRecord.student.classes.name,newLine:startNewLine});
    }

    if(this.exAllIncidents.length>0){
      callback(true);
    }else{
      callback(false);
    }



  }

  getQuestionAnswer (parameters ,answer) {
    let list = "";
    let comma = "";
    for (let j in parameters) {
      let parameter = parameters[j];
      if (answer[parameter.id]) {
        list += parameter.value + ' , ';
      } else if (answer[j]) {
        list += parameter.value + ":" + answer[j] + ' , ';
      }
    }
    list = list.slice(0, -2);
    return list;
  }

    getIncidentTemplate(incident) {
    let incidentId = incident.id ;
    this.incidentTemplate[incidentId] = incident.incidentTemplateObject;
    this.incidentQuestions[incidentId] = this.incidentTemplate[incidentId].questionsList ;
    this.incidentQuestionsFirst = this.incidentTemplate[incidentId].questionsList;
    for (let i = 0; i < this.incidentQuestionsFirst.length; i++) {
      this.incidentQuestionsFirst[i].questionNumber = i;
      this.incidentAnswer[incidentId].incidentAnswersObjectsList[i] = {
        answer: null
      };
      this.incidentAnswersNoOfItems[i] = {
        noOfItems: null
      };
      this.incidentQuestionsFirst[i].editQuestion = false;
      this.incidentQuestionsFirst[i].isEdited = false;
    }
    this.incidentQuestions[incidentId] = this.incidentQuestionsFirst;
    for (let i = 0; i < this.incidentQuestions[incidentId].length; i++) {
      this.templetService.mappingDefaultAnswers(this.incidentAnswer[incidentId].incidentAnswersObjectsList[i], this.incidentQuestions[incidentId][i]);
      this.templetService.mappQuestionsAnswers(this.incidentAnswer[incidentId].incidentAnswersObjectsList[i] ,this.incidentQuestions[incidentId][i].id , incident );
      if(incident.answers[i]) {
        this.incidentAnswer[incidentId].incidentAnswersObjectsList[i].answer =
          this.templetService.getViewQuestionAnswer(this.incidentQuestions[incidentId][i], incident.answers[i].answer);
      }
      this.incidentQuestionsEditParamTemps[incidentId][i] = {};
      this.incidentQuestionsEditParamTemps[incidentId][i].parameters = [];
      for (let j = 0; j < this.incidentQuestions[incidentId][i].parametersList.length; j++) {
        let param = {
          "id": '',
          "key": '',
          "value": ''
        };
        this.incidentQuestionsEditParamTemps[incidentId][i].parameters[j] = param;
        this.incidentQuestionsEditParamTemps[incidentId][i].parameters[j].key = this.incidentQuestions[incidentId][i].parametersList[j].key;
      }
    }
  }

  compareIncidentList(newList,i){
    this.elementDone = i;
  }

  viewThisMedication(medication){
    let model;

    model = this.popoverCtrl.create('MedicationViewPage', {
      medication: medication,
    }, {cssClass: 'contact-popovers'});

    model.onDidDismiss(
      data => {
        console.log(data);

      });

    model.present();
  }

  viewMedicalReport(report,view){
    let model;

    model = this.popoverCtrl.create('MedicalReportViewPage', {
      viewName: view,
      medicalReport:report
    }, {cssClass: 'contact-popovers'});

    model.onDidDismiss(
      data => {
        console.log(data);

      });

    model.present();
  }

}
