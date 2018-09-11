import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {AccountService} from "../../services/account";
import {StudentsService} from "../../services/students";
import {ClassesService} from "../../services/classes";
import {Class} from "../../models/class";
import {Student} from "../../models/student";
import {Storage} from "@ionic/storage";
import { DatePicker } from '@ionic-native/date-picker';
import {MatExpansionPanel} from "@angular/material";
import {DailyReportService} from "../../services/dailyreport";
import {ReportTemplatePage} from "../report-template/report-template";

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  tokenKey: any;
  localStorageToken: string = 'LOCAL_STORAGE_TOKEN';
  pageName: string;
  reportId: any;
  selectedDate: string;
  pickerStartDate;
  dayOfToDay:number;
  monthOfToday:number;
  yearOfToday:number;
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
  ReportQuestionsList;
  hideShowReport = true;
  loadC;
  dailyReportAnswer = {
    // to show the well of comments to spacific
    // student according to its index
    "dailyReportAnswersObjectsList": []
  };
  dailyReportAnswersNoOfItems = [];
  dailyReportQuestions;
  dailyReportQuestionsRecovery = {};
  dailyReportQuestionsEditParamTemps = {};
  editQuestionAllowed = false;
  dateView;

  constructor(public navCtrl: NavController, public navParams: NavParams,private dailyReportServ:DailyReportService, public accountServ: AccountService,
              public studentsServ: StudentsService, public classesServ: ClassesService, public alrtCtrl: AlertController,
              public loadCtrl: LoadingController, public platform: Platform, public storage: Storage,private datePicker: DatePicker) {
    this.isAll = false;
    this.pageName = this.accountServ.reportPage;
    const date = new Date().toISOString().substring(0, 10);
    var dateData = date.split('-');
    var year = dateData [0];
    var month = dateData [1];
    var day = dateData [2];
    this.selectedDate = day + "-" + month + "-" + year;
    this.dateView =  day + "/" + month + "/" + year;
    this.pickerStartDate = new Date();
    this.dayOfToDay = Number(day);
    this.monthOfToday = Number(month) - 1;
    this.yearOfToday  = Number(year);
    console.log("Selected Date is: " + this.selectedDate);
    if (this.accountServ.reportId == -1) {
      this.viewName = "DAILY_REPORT";
      this.classOpId = 4;
      this.studentOpId = 8;
      this.reportId = null;
    } else {
      this.viewName = "REPORT";
      this.classOpId = 5;
      this.studentOpId = 10;
      this.reportId = this.accountServ.reportId;
    }


    if (platform.is('core')) {

      this.tokenKey = localStorage.getItem(this.localStorageToken);
      this.dailyReportServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.classesServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.studentsServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.getDailyReportTemplet();

    } else {

      storage.get(this.localStorageToken).then(
        val => {
          this.tokenKey = val;
          this.dailyReportServ.putHeader(val);
          this.classesServ.putHeader(val);
          this.studentsServ.putHeader(val);
          this.getDailyReportTemplet();
        });

    }
  }

  getDailyReportTemplet(){
    this.loadC = this.loadCtrl.create({
      content: "loading all classes ..."
    });
    this.loadC.present();
    this.dailyReportServ.getDailyReportTemplate("English",this.selectedDate,null).subscribe(
      (val) => {

        let allData:any;
        allData = val;
        let template = allData[0];

        let reportQuestinsFirst =[];
        reportQuestinsFirst = template.questionsList;
        for (let i = 0; i < reportQuestinsFirst.length; i++) {
          reportQuestinsFirst[i].questionNumber = i;
          this.dailyReportAnswer.dailyReportAnswersObjectsList[i] = {
            answer: null
          };
          this.dailyReportAnswersNoOfItems[i] = {
            noOfItems: null
          };
          reportQuestinsFirst[i].editQuestion = false;
          reportQuestinsFirst[i].isEdited = false;
        }

        this.dailyReportQuestions = reportQuestinsFirst;
        this.dailyReportQuestionsRecovery = this.getNewInstanceOf(this.dailyReportQuestions);

        for (let i = 0; i < this.dailyReportQuestions.length; i++){
          this.mappingDefaultAnswers(this.dailyReportAnswer.dailyReportAnswersObjectsList[i], this.dailyReportQuestions[i]);
          this.dailyReportQuestionsEditParamTemps[i] = {};
          this.dailyReportQuestionsEditParamTemps[i].parameters = [];

          for (let j = 0; j < this.dailyReportQuestions[i].parametersList.length; j++) {
            let param = {
              "id": '',
              "key": '',
              "value": ''
            };
            this.dailyReportQuestionsEditParamTemps[i].parameters[j] = param;
            this.dailyReportQuestionsEditParamTemps[i].parameters[j].key = this.dailyReportQuestions[i].parametersList[j].key;
          }

          // let temp = this.dailyReportQuestions;
        }

        this.editQuestionAllowed = this.accountServ.getUserRole().dailyReportEditQuestionCreate

        // let temp2 = reportQuestinsFirst;

        this.ReportQuestionsList = this.dailyReportQuestions ;
        this.getAllClasses();

      },(err)=>{
        this.loadC.dismiss();
        console.log("GetAllTemplates Error : " + err);
        this.NoClasses = true;
        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Can\'t load your report shape, please refresh the page.',
          buttons: ['OK']
        }).present();

      });
  }

  getAllClasses() {
    this.classesServ.getClassList(this.viewName, this.classOpId, this.selectedDate, null, null,this.reportId).subscribe((value) => {
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
              item.noOfAllStudent = data.noOfAllStudent;
              item.noOfStudentDailyReportApproved = data.noOfStudentDailyReportApproved;
              item.noOfStudentDailyReportFinalized = data.noOfStudentDailyReportFinalized;
              item.noOfStudentReportApproved = data.noOfStudentReportApproved;
              item.noOfStudentReportFinalized = data.noOfStudentReportFinalized;
              item.noOfUnseenComments = data.noOfUnseenComments;
              item.noOfUnseenReportComments = data.noOfUnseenReportComments;
              if(data.noOfAllStudent - data.noOfStudentDailyReportApproved == 0){
                item.allStudentApproved = true;
              }
              if(data.noOfAllStudent - data.noOfStudentDailyReportFinalized == 0){
                if(item.allStudentApproved == false) {
                  item.allStudentFinalized = true;
                }
              }
              this.classesList.push(item);
          }
          this.foundBefore = true;
          this.loadC.dismiss();
          if(this.classesList.length == 1){

            this.waitStudents(allData[0].id,-1,allData[0].grade.name+" "+allData[0].name)
          }
        }else{
          this.NoClasses = true;
        }
      },
      err => {
        console.log("GetAllClasses Error : " + err);
        this.NoClasses = true;
        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Can\'t load your classes, please refresh the page.',
          buttons: ['OK']
        }).present();
        this.loadC.dismiss();
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
    return this.studentsServ.getAllStudentsForReport(this.studentOpId, classId,this.selectedDate,this.reportId).toPromise().then(
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
      for (let i in studentList) {
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

    let foundOneChecked = false;
    for (let i in studentList) {
      if(studentList[i].reportChecked){
        foundOneChecked = true;
        break;
      }
    }

    if(foundOneChecked){
      this.hideShowReport = false;
    }else{
      this.hideShowReport = true;
    }
  }

  whenClosed(studentList,index){
    this.hideShowReport = true;
    let ref = index;
    ref.className = 'fa-arrow-down icon icon-md ion-ios-arrow-down';

    this.isAll = false;
    for (let j in studentList) {
      studentList[j].reportChecked = false;
      this.showAllButton = false;
    }
  }

  whenOpen(index){
    this.hideShowReport = true;
    let ref = index;
    ref.className = 'fa-arrow-down icon icon-md ion-ios-arrow-down open';
  }

  oonClickonMenuCalender(){
    this.datePicker.show({
      date: this.pickerStartDate,
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      minDate:new Date(2014, 0, 1).valueOf(),
      maxDate: new Date(this.yearOfToday, this.monthOfToday, this.dayOfToDay).valueOf(),
      allowFutureDates:false
    }).then(
      date => {
        console.log('Got date: ', date);
        this.pickerStartDate = date;
        let newDate = date.toISOString().substring(0, 10);
        var dateData = newDate.split('-');
        var year = dateData [0];
        var month = dateData [1];
        var day = dateData [2];
        this.selectedDate = day + "-" + month + "-" + year;
        this.dateView =  day + "/" + month + "/" + year;
        this.classesList = [];
        this.getAllClasses();
      },
        err =>{
        console.log('Error occurred while getting date: ', err);
      }
    );
  }

  openReportTemplate(){

    let selectedStudents = [];
    for (let i in this.studentsList) {
      if(this.studentsList[i].reportChecked){
        selectedStudents.push(this.studentsList[i]);
      }
    }

    this.navCtrl.push(ReportTemplatePage,{
      selected:selectedStudents,
      template:this.ReportQuestionsList,
      reportDate:this.dateView
    });
  }

  getNewInstanceOf(obj) {
    var copy;

    // Handle the 3 simple types, and null or
    // undefined
    if (null == obj || "object" != typeof obj)
      return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.getNewInstanceOf(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr))
          copy[attr] = this.getNewInstanceOf(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  mappingDefaultAnswers(defaultDailyReportAnswer, question) {
    return defaultDailyReportAnswer.answer = this.getDefaultValue(question);
  };

  getDefaultValue(drQuestion) {
    if(drQuestion.dailyReportQuestionType.title == 'TEXT_QUESTION')
    {
      return "";
    }
    else if(drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_EN' ||
      drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_AR')
    {
      let val = [];
      let firstTime = true;
      let firstTextField = true;
      let counter = 0;
      let defailtValueArray = [];

      for (let v = 0; v < drQuestion.parametersList.length; v++) {

        if (drQuestion.parametersList[v].key == "OPTION_HELPER_TITLE") {

        } else if (drQuestion.parametersList[v].key == "OPTION_HELPER_TEXT") {

          defailtValueArray[counter] = {};
          defailtValueArray[counter].key = drQuestion.parametersList[v].key;
          defailtValueArray[counter].value = "";
          counter++;

        }

        else if (drQuestion.parametersList[v].key == "OPTION_ANSWER") {

          defailtValueArray[counter] = {};
          defailtValueArray[counter].key = drQuestion.parametersList[v].key;
          defailtValueArray[counter].value = drQuestion.parametersList[v].value;
          counter++;

        } else {

        }

      }

      for (let d = 0; d < defailtValueArray.length; d++) {
        if (defailtValueArray[d].key == "OPTION_HELPER_TEXT") {
          val[d] = defailtValueArray[d].value;
        } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
          val[d] = defailtValueArray[d].value;
        }

      }
      return val;
    }
    else if (drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER' ||
      drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER' ||
      drQuestion.dailyReportQuestionType.title == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER' ||
      drQuestion.dailyReportQuestionType.title == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER' )
    {
      return {};
    }
    else if(drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT')
    {
      return {};
    }
    else if (drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT')
    {
      return [drQuestion.parametersList[0].value];
    }
    else if (drQuestion.dailyReportQuestionType.title == 'MULTI_SHORT_TEXT_MULTISELECT_VIEW_SELECTED')
    {
      return {};
    }
    else if (drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION')
    {
      return [drQuestion.parametersList[0].value];
    }
    else if (drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION')
    {
      return [true];
    }
    else if (drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER' ||
      drQuestion.dailyReportQuestionType.title == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER'
    )
    {
      return drQuestion.parametersList[0].value;
    }
    else if (drQuestion.dailyReportQuestionType.title == 'CONSTANT_SHORT_HELPER_TEXT_QUESTION' ||
      drQuestion.dailyReportQuestionType.title == 'CONSTANT_LONG_HELPER_TEXT_QUESTION' ||
      drQuestion.dailyReportQuestionType.title == 'SHORT_HELPER_TEXT_QUESTION' ||
      drQuestion.dailyReportQuestionType.title == 'LONG_HELPER_TEXT_QUESTION'
    )
    {
      return {};
    }
    else if (drQuestion.dailyReportQuestionType.title == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED')
    {
      let val = [];
      let firstTime = true;
      let counter = 0;
      let defailtValueArray = [];

      for (let v = 0; v < drQuestion.parametersList.length; v++) {

        if (drQuestion.parametersList[v].key == "OPTION_HELPER_TITLE") {

        } else if (drQuestion.parametersList[v].key == "OPTION_HELPER_TEXT") {
          defailtValueArray[counter] = {};
          defailtValueArray[counter].key = drQuestion.parametersList[v].key;
          defailtValueArray[counter].value = "";
          counter++;

          firstTime = true;
        }

        else if (drQuestion.parametersList[v].key == "OPTION_ANSWER") {
          if (firstTime) {
            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = drQuestion.parametersList[v].key;
            defailtValueArray[counter].value = drQuestion.parametersList[v].value;
            counter++;
            firstTime = false;
          } else {

          }
        }

      }

      for (let d = 0; d < defailtValueArray.length; d++) {
        if (defailtValueArray[d].key == "OPTION_HELPER_TEXT") {
          val[d] = defailtValueArray[d].value;
        } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
          val[d] = defailtValueArray[d].value;
        }

      }
      return val;
    }
    else if (drQuestion.dailyReportQuestionType.title == 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED')
    {
      let val = [];
      let firstTime = true;
      let firstTextField = true;
      let counter = 0;
      let defailtValueArray = [];

      for (let v = 0; v < drQuestion.parametersList.length; v++) {

        if (drQuestion.parametersList[v].key == "OPTION_HELPER_TITLE") {

        } else if (drQuestion.parametersList[v].key == "OPTION_HELPER_TEXT") {
          if (firstTextField) {
            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = drQuestion.parametersList[v].key;
            defailtValueArray[counter].value = "";
            counter++;
            firstTextField = false;
          } else {
            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = drQuestion.parametersList[v].key;
            defailtValueArray[counter].value = "00";
            counter++;
            firstTextField = true;

          }

          firstTime = true;
        }

        else if (drQuestion.parametersList[v].key == "OPTION_ANSWER") {
          if (firstTime) {
            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = drQuestion.parametersList[v].key;
            defailtValueArray[counter].value = drQuestion.parametersList[v].value;
            counter++;
            firstTime = false;
          } else {

          }
        }

      }

      for (let d = 0; d < defailtValueArray.length; d++) {
        if (defailtValueArray[d].key == "OPTION_HELPER_TEXT") {
          val[d] = defailtValueArray[d].value;
        } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
          val[d] = defailtValueArray[d].value;
        }

      }
      return val;
    }
    else if (drQuestion.dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR' ||
      drQuestion.dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN')
    {
      let val = [];
      let firstTime = true;
      let counter = 0;
      let defailtValueArray = [];

      for (let v = 0; v < drQuestion.parametersList.length; v++) {

        if (drQuestion.parametersList[v].key == "OPTION_HELPER_TITLE") {

        } else if (drQuestion.parametersList[v].key == "OPTION_DROP_DOWN") {
          defailtValueArray[counter] = {};
          defailtValueArray[counter].key = drQuestion.parametersList[v].key;
          defailtValueArray[counter].value = "";
          counter++;
          firstTime = true;
        }

        else if (drQuestion.parametersList[v].key == "OPTION_ANSWER") {
          if (firstTime) {
            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = drQuestion.parametersList[v].key;
            defailtValueArray[counter].value = drQuestion.parametersList[v].value;
            ;
            counter++;
            firstTime = false;
          } else {

          }
        }

      }

      for (var d = 0; d < defailtValueArray.length; d++) {
        if (defailtValueArray[d].key == "OPTION_DROP_DOWN") {
          val[d] = "";
        } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
          val[d] = defailtValueArray[d].value;
        }

      }
      return val;
    }else{
      return "";
    }
  }

}
