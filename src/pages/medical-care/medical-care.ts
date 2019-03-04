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
  loading:boolean = false;
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
  allStatusInMedication:any[]=["All Status","Active","inActive"];
  MEDICATION_TAB = "Medications";
  INCIDENT_TAB = "Incidents";
  CHECKUP_TAB = "Checkups";
  APPROVING_TAB = "Approval";
  pageMedication:any;
  pageIncident:any;
  pageCheckup:any;
  pageApproval:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl:PopoverController,public platform:Platform,
              public medicalService:MedicalCareService, private storage:Storage,public transformDate:TransFormDate,private toastCtrl:ToastController,
              private modalCtrl:ModalController,private classServ:ClassesService,private studentServ:StudentsService, private  alrtCtrl:AlertController,
              private  loadCtrl:LoadingController,private accountServ:AccountService) {
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
      this.getAllMedicalRecords();
    } else {
      storage.get(this.localStorageToken).then(
        val => {
          medicalService.putHeader(val);
          this.getMedicalCareSettings();
          classServ.putHeader(val);
          studentServ.putHeader(val);
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
      times.push(" "+time.time.slice(0, -3));
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

  openMenu(ev:Event){
    // ev.stopPropagation();
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

    if(this.View == this.MEDICATIONS_NAME){
      this.page = this.pageMedication;
      this.MEDICATIONS_OPEND = true;
    }else if(this.View == this.INCIDENTS_NAME){
      this.page = this.pageIncident;
      this.INCIDENTS_OPEND = true;
    }else if(this.View == this.CHECKUPS_NAME){
      this.page = this.pageCheckup;
      this.CHECKUPS_OPEND = true;
    }else if(this.View == this.WAITING_APPROVAL_NAME){
      this.page = this.pageApproval;
      this.WAITING_APPROVAL_OPEND = true;
    }

    this.medicalService.getMedicalRecords(this.selectedClasses,this.selectedStudent, this.selectedStatus, this.date,this.page,this.View,
      this.startDate,this.endDate,this.pageSize).subscribe(
        value =>{
          this.oldSearch =  JSON.parse(JSON.stringify(this.search));
          if(this.refresherIsStart) {
            this.medicalRecords = [];
          }
          let Data:any = value;
          if(this.View == this.MEDICATIONS_NAME){
            this.getAllMedications(Data);
          }else{
            this.getAllOtheData(Data);
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
          this.loading = false;

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
        this.loading = false;
      });
  }

  getAllMedications(Data){
    for(let val of Data){
      for(let medicine of val.medicalRecord.prescription.medications){
        let medicalRec = new MedicalRecord();

        let statusData = this.checkIfTimeToTakeMedication(medicine,'there_is_active_medication');

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
        medicalRec.activeMedication = statusData.status;
        medicalRec.activeMedicationTaken = statusData.taken;
        medicalRec.timeOfActiveMedication = statusData.data;
        medicalRec.otherTimeOfTakenMedication = statusData.otherTaken;

        this.medicalRecords.push(medicalRec);
      }
    }
  }

  getAllOtheData(Data){
    for(let val of Data){
      let medicalRec = new MedicalRecord();
      medicalRec.accountId=val.medicalRecord.accountId;
      medicalRec.approved=val.medicalRecord.approved;
      medicalRec.branchId=val.medicalRecord.branchId;
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

      if(this.View == this.INCIDENTS_NAME){
        this.incidentRecords.push(fullReport);
      }else if(this.View == this.CHECKUPS_NAME){
        this.checkupRecords.push(fullReport);
      }else if(this.View == this.WAITING_APPROVAL_NAME){
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
    this.getAllMedicalRecords();
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
    this.loading = true;
    this.getAllMedicalRecords();
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
        operation:"new"
      });
    }else{
      modal = this.modalCtrl.create('NewMedicalReportPage',{
        for:'Checkup',
        operation:"new"
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
          this.getAllMedicalRecords();
        }
        break;
      case this.INCIDENTS_INDEX:
        this.View = this.INCIDENTS_NAME;
        if(!this.INCIDENTS_OPEND){
          this.getAllMedicalRecords();
        }
        break;

      case this.CHECKUPS_INDEX:
        this.View = this.CHECKUPS_NAME;
        if(!this.CHECKUPS_OPEND){
          this.getAllMedicalRecords();
        }
        break;

      case this.WAITING_APPROVAL_INDEX:
        this.View = this.WAITING_APPROVAL_NAME;
        if(!this.WAITING_APPROVAL_OPEND){
          this.getAllMedicalRecords();
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



}
