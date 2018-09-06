import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {AccountService} from "../../services/account";
import {StudentsService} from "../../services/students";
import {ClassesService} from "../../services/classes";
import {Class} from "../../models/class";
import {Student} from "../../models/student";
import {Storage} from "@ionic/storage";
import {MatExpansionPanel} from "@angular/material";

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  @ViewChild('epansionPanel') epansionPanel: ElementRef;
  tokenKey: any;
  localStorageToken: string = 'LOCAL_STORAGE_TOKEN';
  pageName: string;
  reportId: any;
  todayDate: string;
  viewName: string;
  classOpId: any;
  studentOpId: any;
  classesList: any = [];
  studentsList: any = [];
  clickedAdded: any = [];
  foundBefore:boolean = true;
  openCloseNumber:any = 0;
  content;
  load:any;
  NoClasses:boolean = false;
  showAllButton:boolean = false;
  panelOpenState = 0;
  isAll;

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountServ: AccountService,
              public studentsServ: StudentsService, public classesServ: ClassesService, public alrtCtrl: AlertController,
              public loadCtrl: LoadingController, public platform: Platform, public storage: Storage) {
    this.isAll = false;
    this.pageName = this.accountServ.reportPage;
    const date = new Date().toISOString().substring(0, 10);
    var dateData = date.split('-');
    var year = dateData [0];
    var month = dateData [1];
    var day = dateData [2];
    this.todayDate = day + "-" + month + "-" + year;

    console.log("Today is: " + this.todayDate);
    if (this.accountServ.reportId == -1) {
      this.viewName = "DAILY_REPORT";
      this.classOpId = 4;
      this.studentOpId = 8;
    } else {
      this.viewName = "REPORT";
      this.classOpId = 5;
      this.studentOpId = 10;
      this.reportId = this.accountServ.reportId;
    }


    if (platform.is('core')) {
      this.tokenKey = localStorage.getItem(this.localStorageToken);
      this.studentsServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.classesServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.getAllClasses();
    } else {
      storage.get(this.localStorageToken).then(
        val => {
          this.tokenKey = val;
          this.studentsServ.putHeader(val);
          this.classesServ.putHeader(val);
          this.getAllClasses();
        });
    }
  }

  isPanelOpen(index){
    this.panelOpenState = index;
  }

  getAllClasses() {
    let loadC = this.loadCtrl.create({
      content: "loading all classes ..."
    });
    loadC.present();
    this.classesServ.getClassList(this.viewName, this.classOpId, this.todayDate, this.reportId, null).subscribe((value) => {
        let allData: any = value;
        console.log(allData);
        if(allData) {
          for (let data of allData) {
              let item = new Class();
              console.log(value);
              item.classId = data.id;
              item.className = data.name;
              item.grade.gradeId = data.grade.id;
              item.grade.gradeName = data.grade.name;
              item.branch.branchId = data.branch.id;
              item.branch.branchName = data.branch.name;
              item.branch.managerId = data.branch.managerId;
              item.studentsList = data.studentsList;
              this.classesList.push(item);
          }
          this.foundBefore = true;
          loadC.dismiss();
          if(this.classesList.length == 1){

            this.waitStudents(allData[0].id,-1,allData[0].grade.name+" "+allData[0].name)
          }
        }else{
          this.NoClasses = true;
        }
      },
      err => {
        console.log(err);
        this.NoClasses = true;
        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Can\'t load your classes, please refresh the page.',
          buttons: ['OK']
        }).present();
        loadC.dismiss();
      },
      () => {
        // this.waitStudents();
      });
  }


  getAllStudent(classId,name) {
    this.studentsList = [];
    let loadS = this.loadCtrl.create({
      content: "loading all students of "+name
    });
    loadS.present();
    return this.studentsServ.getAllStudentsForReport(this.studentOpId, classId, this.todayDate).toPromise().then(
      (val) => {
        let data: any = val;
        console.log(data);
        if(data) {
          for (let value of data) {
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
            students.reportApproved = value.dailyReportApproved;
            students.reportFinalized = value.dailyReportFinalized;
            this.studentsList.push(students);
          }
        }
        this.showAllButton = true;
        if(this.classesList.length != 1) {
          this.addToClasses(classId,loadS);
        }else{
          loadS.dismiss();
        }
      },
      err => {
        console.log('GetAllStudent Error: ' + err);
        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Can\'t load your students, please refresh the page.',
          buttons: ['OK']
        }).present();
        loadS.dismiss();
      });
  }

  addToClasses(classId,load){
    for (var i in this.classesList) {
      if (this.classesList[i].classId == classId) {
        this.classesList[i].studentsList = this.studentsList;
        break; //Stop this loop, we found it!
      }
    }
    load.dismiss();
  }

  waitStudents(classId,index,name){
    let promisesArray:any = [];
    for(let j=0;j<1;j++) {
      for (var i in this.classesList) {
        if ( (this.classesList[i].classId == classId) && (this.classesList[i].studentsList == null) ) {
          promisesArray.push(this.getAllStudent(classId,name));
          break; //Stop this loop, we found it!
        }else if ((this.classesList[i].classId == classId) && (this.classesList[i].studentsList != null)){
          this.showAllButton = true;
          this.studentsList = [];
          this.studentsList = this.classesList[i].studentsList;
          break; //Stop this loop, we found it!
        }
      }
    }
    Promise.all(promisesArray).then(
      data=> {
        // this.load.dismiss();
      },
      err=>{
        console.log(err);
      });
  }

  checkedStudent(studentid,classId,studentList){
    if(studentid == -1 && classId == -1){
      for (var i in studentList) {
          studentList[i].reportChecked = this.isAll;
      }
    }else{

      let oneisNot = 0;
      for (let j in studentList) {
        if(studentList[j].reportChecked == true){
          oneisNot++;
        }
      }
      if(studentList.length == oneisNot){this.isAll = true;}else{this.isAll = false;}

    }
  }

  whenClosed(studentList){
    this.isAll = false;
    for (let j in studentList) {
      studentList[j].reportChecked = false;
      this.showAllButton = false;
    }
  }

}
