import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {AccountService} from "../../services/account";
import {StudentsService} from "../../services/students";
import {ClassesService} from "../../services/classes";
import {Class} from "../../models/class";
import {Student} from "../../models/student";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  tokenKey: any;
  localStorageToken: string = 'LOCAL_STORAGE_TOKEN';
  pageName: string;
  todayDate: string;
  viewName: string;
  classOpId: any;
  studentOpId: any;
  classesList: any = [];
  studentsList: any = [];
  clickedAdded: any = [];
  foundBefore:boolean = true;
  openCloseNumber:any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountServ: AccountService,
              public studentsServ: StudentsService, public classesServ: ClassesService, public alrtCtrl: AlertController,
              public loadCtrl: LoadingController, public platform: Platform, public storage: Storage) {
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ' + this.accountServ.reportPage + "its id : " + this.accountServ.reportId);
  }

  getAllClasses() {
    let loadingC = this.loadCtrl.create({
      content: "wait, load classes"
    });
    loadingC.present();
    this.classesServ.getClassList(this.viewName, this.classOpId, this.todayDate, null, null).subscribe((value) => {
        let allData: any = value;
        console.log(allData);
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
        loadingC.dismiss();
        if (this.classesList.length == 1) {
          this.getAllStudent(allData.id);
        }
      },
      err => {
        console.log(err);
        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Can\'t load your classes, please refresh the page.',
          buttons: ['OK']
        }).present();
        loadingC.dismiss();
      },
      () => {

      });
  }


  getAllStudent(classId,index) {
    this.studentsList = [];
    let loadingS = this.loadCtrl.create({
      content: "wait, load students"
    });
    loadingS.present();
    this.studentsServ.getAllStudentsForReport(this.studentOpId, classId, this.todayDate).subscribe(
      (val) => {
        console.log(val);
        let data: any = val;
        console.log(data);
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
          this.studentsList.push(students);
        }
        this.openNewClass(index);
        loadingS.dismiss();
      },
      err => {
        console.log('GetAllStudent Error: ' + err);
        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Can\'t load your students, please refresh the page.',
          buttons: ['OK']
        }).present();
        loadingS.dismiss();
      },
      ()=>{
      });
  }

    openNewClass(index){
      this.openCloseNumber=0;
      var coll = document.getElementsByClassName("collapsible");
      coll[index].classList.toggle("active");
      var content = coll[index].nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
      this.clickedAdded.push(coll[index]);
    }

    closeOther(index){
      this.openCloseNumber++;
      var coll = document.getElementsByClassName("collapsible");

      let temp;
      for(temp=0; temp<coll.length; temp++){
        if(temp!=index){
          if(coll[temp].classList.length > 1) {
            coll[temp].classList.toggle('active');
            let content = coll[temp].nextElementSibling;
            if (content.style.maxHeight) {
              content.style.maxHeight = null;
            } else {
              content.style.maxHeight = content.scrollHeight + "px";
            }
          }
        }else if(temp == index && this.openCloseNumber != 1){
          this.openCloseNumber--;
          coll[temp].classList.toggle('active');
          let content = coll[temp].nextElementSibling;
          if (content.style.maxHeight) {
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          }
        }
      }
    }


}
