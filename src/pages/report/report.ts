import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
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
import {DomSanitizer} from "@angular/platform-browser";

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
  questionListForRecovary;
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
  selectedClassId;
  //////////////////////////////////
  selectedStudentListId = [];
  listOfFinalized = [];
  selectedClass;
  studnetsAnswersList = [];
  conflictListByQuestions = [];
  dailyReportAnswerForSelectedStudent = [];
  //////////////////////////////////
  selectedMultiStudent = [];
  isChecked = [];
  studentsSelected = false;
  isNotValid = true;
  selectedMultiStudentId = [];
  // studentName;
  classChecked = [];
  isSave = true;
  overrideAnswer = false;
  firstStudentId;
  questionsToBeReset;
  Sellected;


  ionViewDidEnter(){
    if(this.questionListForRecovary){
      this.dailyReportQuestions = this.questionListForRecovary;
      this.ReportQuestionsList = this.questionListForRecovary;
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,private dailyReportServ:DailyReportService, public accountServ: AccountService,
              public studentsServ: StudentsService, public classesServ: ClassesService, public alrtCtrl: AlertController,
              public loadCtrl: LoadingController, public platform: Platform, public storage: Storage,private datePicker: DatePicker,
              private toastCtrl:ToastController, private modalCtrl:ModalController) {
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
      this.getAllClasses();
    } else {
      storage.get(this.localStorageToken).then(
        val => {
          this.tokenKey = val;
          this.dailyReportServ.putHeader(val);
          this.classesServ.putHeader(val);
          this.studentsServ.putHeader(val);
          this.getAllClasses();
        });

    }
  }

  getDailyReportForClass(classId,loadS ){
    this.dailyReportServ.getDailyReportTemplate("English",this.selectedDate,classId).subscribe(
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

        this.editQuestionAllowed = this.accountServ.getUserRole().dailyReportEditQuestionCreate;

        // let temp2 = reportQuestinsFirst;

        this.questionListForRecovary = this.dailyReportQuestions;
        this.ReportQuestionsList = this.dailyReportQuestions ;

        for(let oneClass of this.classesList){
          if(oneClass.classId == classId){
            oneClass.reportTemplate = this.dailyReportQuestions;
          }
        }
        loadS.dismiss();
      },(err)=>{
        this.loadC.dismiss();
        console.log("GetAllTemplates Error : " + err);
        this.NoClasses = true;
        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Can\'t load your report shape, please refresh the page.',
          buttons: ['OK']
        }).present();
        loadS.dismiss();
      });
  }

  getAllClasses() {
    this.loadC = this.loadCtrl.create({
      content: "loading all classes ..."
    });
    this.loadC.present();
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

            let classDataId = allData[0].id;

            let classNameData = allData[0].grade.name+" "+allData[0].name;

            this.waitStudents(classDataId,-1,classNameData);
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
        for(let oneClass of this.classesList){
          if(oneClass.classId == classId){
            if(oneClass.reportTemplate == null){
              this.getDailyReportForClass(classId,loadS);
            }
          }
        }
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

  checkedStudent(studentid,classId,studentList,index,studentFinalized,checked,studentName,classIndex){
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

    if(studentid == -1){
      console.log("ALl");
    }else if(studentid != -1){
      this.getMultiSelectedStudents(studentid, index, checked, studentFinalized,studentName,classIndex);
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
    this.studentsList = [];
    this.isChecked = [];
  }

  whenOpen(itmRef,classId,index,name){
    this.selectedClassId = classId;
    this.hideShowReport = true;
    let ref = itmRef;
    this.studentsList = [];
    this.isChecked = [];
    ref.className = 'fa-arrow-down icon icon-md ion-ios-arrow-down open';
    this.getStudentsAnswer(classId,index,name);
  }


  getStudentsAnswer(classId,index,name){
    this.load = this.loadCtrl.create({
      content: "loading Students Answers ..."
    });
    this.load.present();

    this.dailyReportServ.getStudentReportAnswers(this.selectedClassId,this.selectedDate).subscribe(
      resp=>{
        this.load.dismiss();
        this.waitStudents(classId,index,name);
      },err =>{
        this.presentToast("Can't get students reports answer");
        this.load.dismiss();
      }
    );
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

    for(let oneClass of this.classesList){
      if(oneClass.classId == this.selectedClassId){
        this.ReportQuestionsList = oneClass.reportTemplate;
      }
    }
    let model;
    if(this.ReportQuestionsList) {
      model = this.modalCtrl.create(ReportTemplatePage, {
        selected: selectedStudents,
        template: this.ReportQuestionsList,
        reportDate: this.dateView,
        dailyReportAnswer: this.dailyReportAnswer,
        dailyReportAnswersNoOfItems: this.dailyReportAnswersNoOfItems,
        dailyReportQuestionsRecovery: this.dailyReportQuestionsRecovery,
        dailyReportQuestionsEditParamTemps: this.dailyReportQuestionsEditParamTemps,
        editQuestionAllowed: this.editQuestionAllowed,
        classId:this.selectedClassId
      });
      model.present();

    }

    model.onDidDismiss(data => {
      this.studentsList = [];
      this.isChecked = [];
      this.classesList = [];
      this.selectedMultiStudent = [];
      this.getAllClasses();
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
  }

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
      return [false];
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
      let val = {};
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
      let textTemp = 0;
      for (let d = 0; d < defailtValueArray.length; d++) {
        if (defailtValueArray[d].key == "OPTION_HELPER_TEXT") {
          textTemp = d+1;
          val['OPTION_HELPER_TEXT'+d] = defailtValueArray[d].value;
        } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
          val['OPTION_ANSWER'+textTemp] = defailtValueArray[d].value;
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
      let val = {};
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
      let tempDrop = 0;
      for (var d = 0; d < defailtValueArray.length; d++) {
        if (defailtValueArray[d].key == "OPTION_DROP_DOWN") {
          tempDrop = d;
          val["OPTION_DROP_DOWN"+d] = "";
        } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
          val["OPTION_ANSWER"+(tempDrop+1)] = defailtValueArray[d].value;
        }

      }
      return val;
    }else{
      return "";
    }
  }

  checkStudent(j){
    if(this.isChecked[j].checked){
      return this.isChecked[j].checked;
    }
    return false;
  }

  getMultiSelectedStudents(StudentId, index, isChecked, studentFinalized,studentName,classIndex) {
    this.Sellected = 1000;
    let idx = this.selectedMultiStudent.indexOf(StudentId);
    if (idx > -1) {
      this.selectedMultiStudent.splice(idx, 1);
      this.isChecked[index] = {};
      this.isChecked[index].checked = false;
      this.listOfFinalized.splice(idx, 1);
    }
    else {
      this.listOfFinalized.push(studentFinalized);
      this.selectedMultiStudent.push(StudentId);
      this.isChecked[index] = {};
      this.isChecked[index].checked = true;
      this.studentsSelected = true;
    }

    this.isNotValid = false;
    this.selectedMultiStudentId = [];
    for (var i = 0; i < this.selectedMultiStudent.length; i++) {
      this.selectedMultiStudentId[i] = {};
      this.selectedMultiStudentId[i].id = this.selectedMultiStudent[i];
    }
      this.getDailyReportData(StudentId, index, this.isChecked[index].checked, 'checkBox', studentName, studentFinalized,classIndex);
  }


  getDailyReportData (studentId, index, checkedSudent, caller, studentName, studentFinalized,selectedClassIndex) {
    // this.studentName = studentName + '\'s daily report';
    let studentID = studentId;
    if (caller == 'checkBox' && checkedSudent == true) {
      this.classChecked[selectedClassIndex] = {};
      this.classChecked[selectedClassIndex].selected = false;
      if (this.selectedMultiStudent.length == 1) {
        this.dailyReportAnswerForSelectedStudent = [];
        console.log(this.dailyReportServ.dailyReportClassQuestionsGroups);
        for (let qId of Object.keys(this.dailyReportServ.dailyReportClassQuestionsGroups)) {
          console.log(qId);
          for (let answer of Object.keys(this.dailyReportServ.dailyReportClassQuestionsGroups[qId])) {
            console.log(answer);
            for(let answerTemp of this.dailyReportServ.dailyReportClassQuestionsGroups[qId][answer]) {
              console.log(answerTemp);
              console.log(studentID);
              if (answerTemp == studentID) {
                this.dailyReportAnswerForSelectedStudent.push({"questionId": qId, "answer": answer});
                console.log(this.dailyReportAnswerForSelectedStudent);
              }
            }
          }
        }
        console.log(this.dailyReportAnswerForSelectedStudent.length);
        if (this.dailyReportAnswerForSelectedStudent.length == 0) {
          this.isSave = true;
          this.isNotValid = false;
          this.resetDailyReportTemplate(null,null);
        } else {
          this.studnetsAnswersList[studentId] = this.dailyReportAnswerForSelectedStudent;
          this.isNotValid = false;
          this.isSave = false;
          this.reverseAnswerToViewAnswer(this.dailyReportAnswerForSelectedStudent);
        }
      }
      else if (this.selectedMultiStudent.length > 1) {
        if (this.isChecked[index].checked) {
          this.dailyReportAnswerForSelectedStudent = [];
          console.log(this.dailyReportServ.dailyReportClassQuestionsGroups);
          for (let qId of Object.keys(this.dailyReportServ.dailyReportClassQuestionsGroups)) {
            console.log(qId);
            for (let answer of Object.keys(this.dailyReportServ.dailyReportClassQuestionsGroups[qId])) {
              console.log(answer);
              for(let answerTemp of this.dailyReportServ.dailyReportClassQuestionsGroups[qId][answer]) {
                console.log(answerTemp);
                console.log(studentID);
                if (answerTemp == studentID) {
                  this.dailyReportAnswerForSelectedStudent.push({"questionId": qId, "answer": answer});
                  console.log(this.dailyReportAnswerForSelectedStudent);
                }
              }
            }
          }
          if (this.dailyReportAnswerForSelectedStudent.length == 0) {
            this.isSave = true;
            this.isNotValid = false;
            let idx = this.listOfFinalized.indexOf(true);
            if (idx == -1) {
              this.isNotValid = false;
              this.isSave = true;
              this.firstStudentId = this.selectedMultiStudent[0];
            } else {
              this.isNotValid = false;
              this.isSave = false;
              this.firstStudentId = this.selectedMultiStudent[0];
            }
          } else {
            this.studnetsAnswersList[studentId] = this.dailyReportAnswerForSelectedStudent;
            for (var i = 0; i < this.dailyReportAnswerForSelectedStudent.length; i++) {
              var questionIdGroup = this.dailyReportServ.dailyReportClassQuestionsGroups[this.dailyReportAnswerForSelectedStudent[i].questionId];
              var sameAnswerStudentsIds = questionIdGroup[this.dailyReportAnswerForSelectedStudent[i].answer];
              var sameAnswers = true;
              for (let key of this.studnetsAnswersList) {
                let intKey = parseInt(key, 10);
                if (!sameAnswerStudentsIds.some(e => e === intKey)) {
                  sameAnswers = false;
                  break;
                }
              }
              this.questionsToBeReset[i] = sameAnswers;
            }
            this.resetDailyReportTemplate(this.questionsToBeReset, this.dailyReportAnswerForSelectedStudent);
            this.isNotValid = false;
            this.isSave = false;
          }
        }
      }
    } else if (caller == 'checkBox' && checkedSudent == false) {
      this.studnetsAnswersList.splice(studentId, 1);
      if (this.studnetsAnswersList.length < 1) {
        this.resetDailyReportTemplate(null,null);
      } else {
        this.dailyReportAnswerForSelectedStudent = [];
        let oneStudentCheckedId = parseInt(Object.keys(this.studnetsAnswersList)[0], 10);
        console.log(this.dailyReportServ.dailyReportClassQuestionsGroups);
        for (let qId of Object.keys(this.dailyReportServ.dailyReportClassQuestionsGroups)) {
          console.log(qId);
          for (let answer of Object.keys(this.dailyReportServ.dailyReportClassQuestionsGroups[qId])) {
            console.log(answer);
            for(let answerTemp of this.dailyReportServ.dailyReportClassQuestionsGroups[qId][answer]) {
              console.log(answerTemp);
              console.log(studentID);
              if (answerTemp == oneStudentCheckedId) {
                this.dailyReportAnswerForSelectedStudent.push({"questionId": qId, "answer": answer});
                console.log(this.dailyReportAnswerForSelectedStudent);
              }
            }
          }
        }

        if (this.dailyReportAnswerForSelectedStudent.length == 0) {
          this.isSave = true;
          this.isNotValid = false;
          this.resetDailyReportTemplate(null,null);
        } else {
          this.isNotValid = false;
          this.isSave = false;
        }
        for (var i = 0; i < this.dailyReportAnswerForSelectedStudent.length; i++) {
          var questionIdGroup = this.dailyReportServ.dailyReportClassQuestionsGroups[this.dailyReportAnswerForSelectedStudent[i].questionId];
          var sameAnswerStudentsIds = questionIdGroup[this.dailyReportAnswerForSelectedStudent[i].answer];
          var sameAnswers = true;
          for (let key of this.studnetsAnswersList) {
            var intKey = parseInt(key, 10);
            if (!sameAnswerStudentsIds.includes(intKey)) {
              sameAnswers = false;
              break;
            }
          }
          this.questionsToBeReset[i] = sameAnswers;
        }
        this.resetDailyReportTemplate(this.questionsToBeReset, this.dailyReportAnswerForSelectedStudent);
      }
      if (this.selectedMultiStudent.length == 1) {
        for (var j = 0; j < this.classesList[selectedClassIndex].studentsList.length; j++) {
          if (this.classesList[selectedClassIndex].studentsList[j].id == this.selectedMultiStudentId[0].id) {
            // this.studentName = this.classesList[selectedClassIndex].studentsList[j].name + '\'s daily report';
            break;
          }
        }
      }
    }

    console.log(this.dailyReportAnswerForSelectedStudent);
    console.log(this.selectedMultiStudentId);
    console.log(this.dailyReportAnswer);
    console.log(this.isChecked);
  }



  resetDailyReportTemplate(questionsToBeReset, answers) {
    if (!questionsToBeReset) {
      for (let i = 0; i < this.dailyReportQuestions.length; i++) {
        this.mappingDefaultAnswers(this.dailyReportAnswer.dailyReportAnswersObjectsList[i], this.dailyReportQuestions[i]);

        // $('#' + $scope.dailyReportQuestions[i].id).addClass("ng-hide");
        // this.studentName = "";

      }
    } else {
      for (var i = 0; i < this.dailyReportQuestions.length; i++) {
        if (!questionsToBeReset[i]) {
          // not same answer>>> display empty answer.
          // $('#' + $scope.dailyReportQuestions[i].id).removeClass("ng-hide");

          // mappingDefaultAnswers(
          // $scope.dailyReportAnswer.dailyReportAnswersObjectsList[i],
          // $scope.dailyReportQuestions[i]);

          switch (this.dailyReportQuestions[i].dailyReportQuestionType.title) {

            case "TEXT_QUESTION":
            case "SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER":
              this.dailyReportAnswer.dailyReportAnswersObjectsList[i] = {
                "answer": ""
              }
              break;
            case "SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION":
              this.dailyReportAnswer.dailyReportAnswersObjectsList[i] = {
                "answer": ["", ""]
              }
              break;
            default:

              if (this.dailyReportQuestions[i].dailyReportQuestionType.title == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED' || this.dailyReportQuestions[i].dailyReportQuestionType.title == 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED') {
                this.overrideAnswer = false;
              }

              if (this.dailyReportQuestions[i].parametersList) {
                var emptyAnswer = [];
                for (var j = 0; j < this.dailyReportQuestions[i].parametersList.length; j++) {
                  emptyAnswer.push("");
                }
                this.dailyReportAnswer.dailyReportAnswersObjectsList[i] = {
                  "answer": emptyAnswer
                }
              }
              break;

          }

        } else {
          this.dailyReportAnswer.dailyReportAnswersObjectsList[i].answer = this.getViewQuestionAnswer(this.dailyReportQuestions[i], answers[i].answer);
          // $('#' + $scope.dailyReportQuestions[i].id).addClass("ng-hide");
        }

      }
    }

  }



  getViewQuestionAnswer(question, dbAnswer) {
    switch (question.dailyReportQuestionType.title) {
      case 'TEXT_QUESTION':
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return "";
        }
        return dbAnswer;

      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        let midResult = dbAnswer.split("||");

        let arrayIds = midResult[1].split("$$");
        let value = {};
        for (let i = 0; i < arrayIds.length; i++) {
          value[arrayIds[i]] = true;
        }
        return value;
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        let answersList = dbAnswer.split("$$");
        value = {};
        for (let i = 0; i < question.parametersList.length; i++) {
          if (question.parametersList[i].key == "OPTION_ANSWER") {

            if (answersList.indexOf(question.parametersList[i].value) > -1) {
              value[i] = true
            } else {
              value[i] = false;
            }
          } else if (question.parametersList[i].key == "OPTION_HELPER_TEXT") {
            if (answersList[answersList.length - 1] == null || answersList[answersList.length - 1] == "" || answersList[answersList.length - 1] == " " || answersList[answersList.length - 1] == undefined || answersList[answersList.length - 1] == "undefined") {
              value[i] = "";
            } else {
              value[i] = answersList[answersList.length - 1];
            }

          }
        }
        ;
        return value;
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        answersList = dbAnswer.split("$$");
        value = {};
        value[0] = answersList[0];
        if (answersList[1] == null || answersList[1] == "" || answersList[1] == " ") {

        } else {
          value[1] = answersList[1];
        }
        return value;
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        answersList = dbAnswer.split("$$");
        value = {};
        value[0] = answersList[0];
        value[1] = answersList[1];

        return value;
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        value = {};
        if (dbAnswer == question.parametersList[0].value) {
          value[0] = true;
        } else {
          value[0] = false;
          value[1] = dbAnswer;
        }
        return value;
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_EN':
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_AR':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        midResult = dbAnswer.split("||");

        let arrayValues = midResult[0].split(/[$&]+/);
        arrayIds = midResult[1].split(/[$&]+/);
        value = {};
        for (let i = 0; i < arrayIds.length; i++) {
          if ((i % 2) == 0) {
            if (arrayValues[i] == null || arrayValues[i] == "" || arrayValues[i] == " " || arrayValues[i] == "0") {
              value[arrayIds[i]] = false;
            } else {
              value[arrayIds[i]] = true;
            }

          } else {
            if (arrayValues[i] == "0") {
              value[arrayIds[i]] = "";
            } else {
              value[arrayIds[i]] = arrayValues[i];
            }

          }

        }
        return value;
      case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR':
      case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN':
        let counter = 0;
        let getAnswerValueArray = [];
        let firstTimeFullArray = true;
        let questionCount = 0;

        for (let j = 0; j < question.parametersList.length; j++) {

          if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

          } else if (question.parametersList[j].key == "OPTION_DROP_DOWN") {
            getAnswerValueArray[counter] = {};
            getAnswerValueArray[counter].key = question.parametersList[j].key;
            counter++;
            firstTimeFullArray = true;
          }

          else if (question.parametersList[j].key == "OPTION_ANSWER") {
            if (firstTimeFullArray) {
              getAnswerValueArray[counter] = {};
              getAnswerValueArray[counter].key = question.parametersList[j].key;
              counter++;
              firstTimeFullArray = false;
              questionCount++;
            } else {

            }
          }

        }
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }

        let answersQuestionList = dbAnswer.replace(/&/g, "$").split("$$");

        value = {};

        for (let i = 0; i < getAnswerValueArray.length; i++) {
          if (answersQuestionList[i] == 0) {
            value[i] = "";
          } else {
            value[i] = answersQuestionList[i];
          }

        }
        return value;
      case 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED':
      case 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED':

        counter = 0;
        getAnswerValueArray = [];
        firstTimeFullArray = true;
        questionCount = 0;

        for (let j = 0; j < question.parametersList.length; j++) {

          if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

          } else if (question.parametersList[j].key == "OPTION_HELPER_TEXT") {
            getAnswerValueArray[counter] = {};
            getAnswerValueArray[counter].key = question.parametersList[j].key;
            counter++;
            firstTimeFullArray = true;
          }

          else if (question.parametersList[j].key == "OPTION_ANSWER") {
            if (firstTimeFullArray) {
              getAnswerValueArray[counter] = {};
              getAnswerValueArray[counter].key = question.parametersList[j].key;
              counter++;
              firstTimeFullArray = false;
              questionCount++;
            } else {

            }
          }

        }
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        // var answersQuestionList =
        // dbAnswer.split("||");
        answersQuestionList = dbAnswer.replace(/&/g, "$").split("$$");

        value = {};

        for (let i = 0; i < getAnswerValueArray.length; i++) {

          value[i] = answersQuestionList[i];

        }
        console.log('SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED');
        console.log(value);
        return value;
      case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR':
      case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN':
        counter = 0;
        getAnswerValueArray = [];
        firstTimeFullArray = true;
        questionCount = 0;

        for (let j = 0; j < question.parametersList.length; j++) {

          if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

          } else if (question.parametersList[j].key == "OPTION_DROP_DOWN") {
            getAnswerValueArray[counter] = {};
            getAnswerValueArray[counter].key = question.parametersList[j].key;
            counter++;
            firstTimeFullArray = true;
          }

          else if (question.parametersList[j].key == "OPTION_ANSWER") {
            if (firstTimeFullArray) {
              getAnswerValueArray[counter] = {};
              getAnswerValueArray[counter].key = question.parametersList[j].key;
              counter++;
              firstTimeFullArray = false;
              questionCount++;
            } else {

            }
          }

        }
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }

        answersQuestionList = dbAnswer.replace(/&/g, "$").split("$$");

        value = {};

        for (let i = 0; i < getAnswerValueArray.length; i++) {

          value[i] = answersQuestionList[i];

        }
        return value;

      case 'CONSTANT_SHORT_HELPER_TEXT_QUESTION':
      case 'CONSTANT_LONG_HELPER_TEXT_QUESTION':
      case 'SHORT_HELPER_TEXT_QUESTION':
      case 'LONG_HELPER_TEXT_QUESTION':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        answersList = dbAnswer.split("$$");
        value = {};
        for (let i = 0; i < question.parametersList.length; i++) {
          value[i] = answersList[i];
        }
        return value;
    }
  }

  reverseAnswerToViewAnswer(dailyReportAnswerDb) {
    let dailyReportAnswerView = {
      "dailyReportAnswersObjectsList": []
    };

    for (let i = 0; i < this.dailyReportQuestions.length; i++) {
      let question = this.dailyReportQuestions[i];
      dailyReportAnswerView.dailyReportAnswersObjectsList[i] = {
        "answer": this.getViewQuestionAnswer(question, dailyReportAnswerDb[i].answer)
      };
    }

    this.dailyReportAnswer = dailyReportAnswerView;

  }




  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
