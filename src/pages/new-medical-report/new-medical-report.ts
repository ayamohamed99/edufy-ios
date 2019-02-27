import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {
  FabContainer,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  LoadingController,
  ViewController
} from 'ionic-angular';
import {MedicalCareService} from "../../services/medicalcare";
import {Class, Student} from "../../models";
import {ClassesService} from "../../services/classes";
import {StudentsService} from "../../services/students";
import {MedicalRecord} from "../../models/medical-record";
import {TransFormDate} from "../../services/transFormDate";
import {FormControl} from "@angular/forms";
import {AccountService} from "../../services/account";

/**
 * Generated class for the NewMedicalReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-medical-report',
  templateUrl: 'new-medical-report.html',
})
export class NewMedicalReportPage {

  todayDate;
  pageName;
  addCheckup:boolean = false;
  newIncident:boolean = false;
  allStudents:any;
  showAllStudents:any;
  allclasses:any;
  classesLoading:boolean;
  studentsLoading:boolean;
  incidentMinDate;
  incidentMaxDate;
  checkupMinDate;
  checkupMaxDate;
  incidentShowDate;
  checkupShowDate;
  medicalRecord:MedicalRecord = new MedicalRecord();
  fullMedicalReport:any;
  checkupObject:any;
  incidentObject:any;
  incidentTemplet:any;
  checkupTemplet:any;
  showAllTimes = [{'id': 1,'time': '00:00'}, {'id': 2,'time': '00:30'}, {'id': 3,'time': '01:00'}, {'id': 4, 'time': '01:30' }, { 'id': 5,'time': '02:00'  }, { 'id': 6,'time': '02:30' }, {'id': 7,'time': '03:00' }, {'id': 8,'time': '03:30' },
    {'id': 9,'time': '04:00' }, {'id': 10,'time': '04:30'}, {'id': 11,'time': '05:00'}, {'id': 12,'time': '05:30'}, {'id': 13,'time': '06:00'}, {'id': 14,'time': '06:30'}, {'id': 15,'time': '07:00'}, {'id': 16,'time': '07:30'}, {'id': 17, 'time': '08:00'},
    {'id': 18,'time': '08:30' }, {'id': 19,'time': '09:00'}, {'id': 20,'time': '09:30'}, { 'id': 21,'time': '10:00'}, {'id': 22,'time': '10:30'}, {'id': 23,'time': '11:00' }, {'id': 24,'time': '11:30'}, { 'id': 25, 'time': '12:00' }, {  'id': 26,'time': '12:30'},
    {'id': 27, 'time': '13:00' }, {  'id': 28,'time': '13:30' }, { 'id': 29, 'time': '14:00' }, {  'id': 30,'time': '14:30' }, {  'id': 31,'time': '15:00'  }, {'id': 32,'time': '15:30'}, {'id': 33,'time': '16:00' }, {'id': 34,'time': '16:30'}, {'id': 35, 'time': '17:00'},
    {'id': 36,'time': '17:30'}, {'id': 37,'time': '18:00'}, {'id': 38,'time': '18:30'}, {'id': 39,'time': '19:00' }, { 'id': 40, 'time': '19:30'}, { 'id': 41,'time': '20:00' }, {'id': 42, 'time': '20:30'}, {'id': 43,'time': '21:00'}, {'id': 44,'time': '21:30'}, {  'id': 45,'time': '22:00'},
    {'id': 46,'time': '22:30'}, {'id': 47,'time': '23:00'}, {'id': 48, 'time': '23:30'}];
  ////data////////
  selectedClass;
  selectedStudent;
  incidentTitle;
  checkupTitle;
  incidentSelectedDate;
  checkupSelectedDate;
  selectedIncidentTime;
  selectedCheckupTime;
  phoneNumber:string = '';


  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl:ModalController,
              private medicalService:MedicalCareService,private alrtCtrl:AlertController,private loadCtrl:LoadingController,
              private classServ:ClassesService,private studentServ:StudentsService, private viewCtrl:ViewController,
              private transDate:TransFormDate, private accountServ:AccountService) {
    this.todayDate = this.transDate.transformTheDate(new Date(), "dd-MM-yyyy");
    if(navParams.get("for")) {
      this.pageName = "New " + navParams.get("for");
      this.addCheckup = false;
      if(this.pageName == "New Incident"){
        this.newIncident = true;
        this.incidentMinDate = new Date(2016,0,1);
        this.incidentMaxDate = new Date();
        this.incidentShowDate = new FormControl(new Date()).value;
        this.selectedIncidentTime = {'id': 1,'time': '00:00'};
        this.getIncidentTemplet();
      }else{
        this.checkupMinDate = new Date(2016,0,1);
        this.checkupMaxDate = new Date();
        this.checkupShowDate = new FormControl(new Date()).value;
        this.selectedCheckupTime = {'id': 1,'time': '00:00'};
        this.getCheckUpTemplet();
      }
    }else{
      this.pageName = "Add " + navParams.get("forAdd");
      this.addCheckup = true;
      this.checkupMinDate = new Date(2016,0,1);
      this.checkupMaxDate = new Date();
      this.checkupShowDate = new FormControl(new Date()).value;
      this.selectedCheckupTime = {'id': 1,'time': '00:00'};
      this.getCheckUpTemplet();
    }
    this.setupMedicalRecord();
    if(!this.addCheckup) {
      this.classesLoading = true;
      this.studentsLoading = true;
      this.getAllClasses();
      this.getAllStudents();
    }
  }

  close(){
    this.viewCtrl.dismiss();
  }
  enableDoneAllButton(){
    if(this.addCheckup){
      if(this.checkupTitle){
        return false;
      }else{
        return true;
      }
    }else {
      if(this.newIncident){
        if(this.incidentTitle && this.selectedStudent && this.selectedClass){
          return false;
        }else{
          return true;
        }
      }else{
        if(this.checkupTitle && this.selectedStudent && this.selectedClass){
          return false;
        }else{
          return true;
        }
      }
    }
  }

  fabSelected(index,fab:FabContainer){
    fab.close();
    let modal;
    if(index == 0){
      modal = this.modalCtrl.create('NewMedicalReportMedicinePage',{Date:this.todayDate});
    }else{
      modal = this.modalCtrl.create('NewMedicalReportPage',{forAdd:"Checkup",Date:this.todayDate});
    }
    modal.onDidDismiss(
      data =>{
        console.log(data);
        if (data) {
          if (data.medication) {
            this.medicalRecord.prescription.medications.push(data.medication);
          }else if(data.checkup){
            this.medicalRecord.checkup = data.checkup;
          }
        }
      });
    modal.present();
  }

  setStudents(){
    this.studentsLoading = true;
    this.showAllStudents = [];
    let tempStudents:any[] = JSON.parse(JSON.stringify(this.allStudents));
    if(this.selectedClass.classWithGrade){
      for(let student of tempStudents){
        if(student.searchByClassGrade == this.selectedClass.classWithGrade){
          this.showAllStudents.push(student);
        }
      }
      this.studentsLoading= false;
    }
  }

  setupMedicalRecord(){
    this.medicalRecord.prescription = {'id': null, 'medicalRecords': null, 'medications': [] };
    this.fullMedicalReport = {'checkupAnswers':[], 'incidentAnswers': [], 'medicalRecord':null};
    this.checkupObject = {'checkupDate': "", 'checkupTemplate': null, 'title': ""};
    this.incidentObject = {'attachmentsList': [], 'followUpPhone': "", 'incidentDate': "", 'incidentTemplate': null, 'title': ""};
  }


  allDataDone(){
    if(this.addCheckup) {
      this.checkupObject.title = this.checkupTitle;
      this.checkupObject.checkupDate = this.checkupSelectedDate;
      this.checkupObject.checkupTemplate = this.checkupTemplet.id;
      this.viewCtrl.dismiss({checkup:this.checkupObject});
    }else{
      if(this.newIncident) {
        this.incidentObject.followUpPhone = this.phoneNumber;
        this.incidentObject.incidentDate = this.incidentSelectedDate;
        this.incidentObject.incidentTemplate = this.incidentTemplet.id;
        this.incidentObject.title = this.incidentTitle;

        this.medicalRecord.incident = this.incidentObject;
      }else{
        this.checkupObject.title = this.checkupTitle;
        this.checkupObject.checkupDate = this.checkupSelectedDate;
        this.checkupObject.checkupTemplate = this.checkupTemplet.id;
        this.medicalRecord.checkup = this.checkupObject;
      }
      this.medicalRecord.student = {'id': this.selectedStudent.studentId};
      this.fullMedicalReport.medicalRecord = this.medicalRecord;
      // this.fullMedicalReport.incidentAnswers = ;
      // this.fullMedicalReport.checkupAnswers = ;
      // this.viewCtrl.dismiss();
    }
  }

  setSelectedDate(from,ev){
    if(this.newIncident){
      this.incidentSelectedDate = this.transDate.transformTheDate(ev.value, "dd-MM-yyyy")+" "+ this.selectedIncidentTime;
    }else{
      this.checkupSelectedDate = this.transDate.transformTheDate(ev.value, "dd-MM-yyyy")+" "+ this.selectedCheckupTime;
    }
  }


  deleteData(from,index){
    if(from == "Medication"){
      this.medicalRecord.prescription.medications.splice(index,1);
    }else if(from == "Checkup"){
      this.medicalRecord.checkup
    }
  }

  getAllClasses(){
    this.classServ.getClassList("Medical Care",2,null,null,null,null).subscribe(
      classVal=>{
        let allData: any = classVal;
        this.allclasses = [];
        for (let data of allData) {
          let item = new Class();
          item.classId = data.id;
          item.className = data.name;
          item.grade.gradeId = data.grade.id;
          item.grade.gradeName = data.grade.name;
          item.branch.branchId = data.branch.id;
          item.branch.branchName = data.branch.name;
          item.branch.managerId = data.branch.managerId;
          item.classWithGrade = data.grade.name + " - " + data.name;
          this.allclasses.push(item);
        }
        this.classesLoading= false;
      },classErr=>{
        this.classesLoading= false;
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: 'Something went wrong, please refresh the page',
          buttons: ['OK']
        }).present();
      });
  }

  getAllStudents(){
    this.studentServ.getAllStudents(7,"Medical Care").subscribe(
      studentVal=>{
        let data:any = studentVal;
        this.allStudents = [];
        for (let value of data){
          let students = new Student();

          students.studentClass.classId = value.classes.id;
          students.studentClass.className = value.classes.name;
          students.studentClass.grade.gradeId = value.classes.grade.id;
          students.studentClass.grade.gradeName = value.classes.grade.name;
          students.studentClass.branch.branchId = value.classes.branch.id;
          students.studentClass.branch.branchName = value.classes.branch.name;
          students.studentClass.branch.managerId = value.classes.branch.managerId;
          students.studentId = value.id;
          students.studentName = value.name;
          students.studentAddress = value.address;
          students.searchByClassGrade = value.classes.grade.name + " - " + value.classes.name;

          this.allStudents.push(students);
        }
        this.studentsLoading= false;
      },studentErr=>{
        this.studentsLoading= false;
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: 'Something went wrong, please refresh the page',
          buttons: ['OK']
        }).present();
      });
  }

  getIncidentTemplet(){
    this.medicalService.getIncidentTemplate().subscribe(
      val=>{
        this.incidentTemplet = val;
        this.getCheckUpTemplet();
      },err=>{
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: 'Something went wrong, can\'t load incident template',
          buttons: ['OK']
        }).present();
      });
  }

  getCheckUpTemplet(){
    this.medicalService.getCheckupTemplate().subscribe(
      val=>{
        this.checkupTemplet = val;
      },err=>{
        this.alrtCtrl.create( {
          title: 'Error',
          subTitle: 'Something went wrong, can\'t load checkup template',
          buttons: ['OK']
        }).present();
      });
  }

}
