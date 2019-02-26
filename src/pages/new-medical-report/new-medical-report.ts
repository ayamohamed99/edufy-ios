import { Component } from '@angular/core';
import {
  FabContainer,
  IonicPage,
  NavController,
  NavParams,
  ModalController, AlertController, LoadingController
} from 'ionic-angular';
import {MedicalCareService} from "../../services/medicalcare";
import {Class, Student} from "../../models";
import {ClassesService} from "../../services/classes";
import {StudentsService} from "../../services/students";

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

  pageName;
  allStudents:any;
  allclasses:any;
  classesLoading:boolean;
  studentsLoading:boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl:ModalController,
              private medicalService:MedicalCareService,private alrtCtrl:AlertController,private loadCtrl:LoadingController,
              private classServ:ClassesService,private studentServ:StudentsService) {
    this.pageName = navParams.get("for");
    this.classesLoading= true;
    this.studentsLoading= true;
    this.getAllClasses();
    this.getAllStudents();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewMedicalReportPage');
  }

  fabSelected(index,fab:FabContainer){
    fab.close();
    let modal;
    if(index == 0){
      modal = this.modalCtrl.create('NewMedicalReportMedicinePage');
    }else{
      modal = this.modalCtrl.create('NewMedicalReportPage');
    }
    modal.onDidDismiss();
    modal.present();
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


}
