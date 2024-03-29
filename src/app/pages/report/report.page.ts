import { Component, OnInit, NgZone } from '@angular/core';
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';
import {ReportCommentService} from '../../services/ReportComment/report-comment.service';
import {AlertController, ModalController, NavController, Platform} from '@ionic/angular';
import {ToastViewService} from '../../services/ToastView/toast-view.service';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';
import {ClassesService} from '../../services/Classes/classes.service';
import {StudentsService} from '../../services/Students/students.service';
import {AccountService} from '../../services/Account/account.service';
import {DailyReportService} from '../../services/DailyReport/daily-report.service';
import {DatePicker} from '@ionic-native/date-picker/ngx';
import {Class, Student} from '../../models';
import {Storage} from '@ionic/storage';
import {ReportTemplatePage} from '../report-template/report-template.page';
import {PassDataService} from '../../services/pass-data.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

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
  // load:any;
  NoClasses:boolean = false;
  showAllButton:boolean = false;
  panelOpenState = 0;
  isAll;
  ReportQuestionsList;
  hideShowReport = true;
  // loadC;
  questionListForRecovary;
  reportAnswer ;
  reportAnswersNoOfItems = [];
  reportQuestions;
  reportQuestionsRecovery = {};
  reportQuestionsEditParamTemps = {};
  editQuestionAllowed = false;
  dateView;
  selectedClassId;
  //////////////////////////////////
  selectedStudentListId = [];
  listOfFinalized = [];
  selectedClass;
  studnetsAnswersList = [];
  conflictListByQuestions = [];
  reportAnswerForSelectedStudent = [];
  //////////////////////////////////
  selectedMultiStudent = [];
  isChecked = [];
  studentsSelected = false;
  isNotValid = true;
  selectedMultiStudentId = [];
  // name;
  classChecked = [];
  isSave = true;
  overrideAnswer = false;
  firstStudentId;
  questionsToBeReset;
  Sellected;


  ionViewDidEnter(){
    if(this.questionListForRecovary){
      this.reportQuestions = this.questionListForRecovary;
      this.ReportQuestionsList = this.questionListForRecovary;
    }
  }

  async approveClass(ev,index,classId, className, classGradeName, noOfAllStudents){

    let noOfFinalized = 0;
    if(this.reportId){
      if(this.classesList[index].noOfStudentReportFinalized){
        noOfFinalized = this.classesList[index].noOfStudentReportFinalized;
      }else{noOfFinalized = 0}
    }else{
      if(this.classesList[index].noOfStudentDailyReportFinalized){
        noOfFinalized = this.classesList[index].noOfStudentDailyReportFinalized;
      }else{noOfFinalized = 0}
    }

    ev.stopPropagation();
    let elButton = document.getElementById("buttonReportApprove"+index);


    // setInterval(() => {
    //   elButton.classList.remove("onclic");
    //   elButton.classList.add("validate");
    // },3000);



    var noOfUnFinalized = noOfAllStudents - noOfFinalized;

    const alrt = await this.alrtCtrl.create({
      header: 'Approve Daily Report',
      message: 'Do you want to approve '+classGradeName+' '+className+' while '+noOfUnFinalized+' student report(s) pending ?',
      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
        {
          text: 'Yes',
          handler: () => {
            elButton.classList.add("onclic");

            var searchDate = this.selectedDate;
            /*
             * console .info("approveDailyReport classId: " + classId);
             */

            this.dailyReportServ.approveReport(searchDate, classId, this.reportId).subscribe(
                // @ts-ignore
                (response) => {

                  this.classesServ.getClassList('DAILY_REPORT', 4, searchDate, null, null,this.reportId).subscribe(
                      (response) => {

                        var approvedClasses = response;
                        // if(this.platform.is('cordova')){
                          // approvedClasses = JSON.parse(response.data);
                        // }

                        for (var i = 0; i < this.classesList.length; i++) {
                          for (var j = 0; j < approvedClasses.length; j++) {
                            if (approvedClasses[j].id == this.classesList[i].id) {
                              this.classesList[i].noOfStudentDailyReportApproved = approvedClasses[j].noOfStudentDailyReportApproved;
                            }

                          }

                        }

                      }, (reason) => {

                      });

                  // @ts-ignore
                  this.studentsServ.getAllStudentsForReport(8, classId, searchDate, this.reportId).subscribe(
                      (data) => {

                        let response = data;
                        // if(this.platform.is('cordova')){
                        //   response = JSON.parse(data.data);
                        // }
                        this.classesList[index].studentsList = response;
                        // this.classStudents = this.classesList[this.selectedClassIndex].studentsList;


                        for (var k = 0; k < this.classesList.length; k++)
                          if (this.classesList[k].id == classId) {
                            this.classesList[k].studentsList = response;
                          }

                      });
                  elButton.classList.remove("onclic");
                  elButton.classList.add("validate");
                  this.toastCtrl.presentTimerToast('Report Approved Successfully');

                }, (reason) => {
                  elButton.classList.remove("onclic");
                  elButton.classList.remove("validate");
                  this.toastCtrl.presentTimerToast('Failed to approve the report');
                });


          }
        }]
    });

    await alrt.present();

  }


  showApproveButton(){
    let roleApprove;
    if(this.accountServ.reportId == -1 || this.accountServ.reportId == null) {
      roleApprove = this.accountServ.getUserRole().dailyReportApprove;
    }else{
      roleApprove = this.accountServ.getUserRole().reportApprove;
    }
    return roleApprove;
  }




  constructor(public navCtrl: NavController,private dailyReportServ:DailyReportService, public accountServ: AccountService,
              public studentsServ: StudentsService, public classesServ: ClassesService, public alrtCtrl: AlertController,private passData:PassDataService,
              public loadCtrl: LoadingViewService, public platform: Platform, public storage: Storage,private datePicker: DatePicker,private zone: NgZone,
              private toastCtrl:ToastViewService, private modalCtrl:ModalController,private reportComment:ReportCommentService,public transformDate:TransFormDateService)
  {

    if(this.accountServ.reportId == -1){
      this.reportAnswer = {
        // to show the well of comments to spacific
        // student according to its index
        "dailyReportAnswersObjectsList": []
      };
    }else{
      this.reportAnswer = {
        // to show the well of comments to spacific
        // student according to its index
        "reportAnswersObjectsList": []
      };
    }

    this.isAll = false;
    this.pageName = this.accountServ.reportPage;
    this.pickerStartDate = new Date();
    const date = this.transformDate.transformTheDate(this.pickerStartDate,'dd-MM-yyyy');
    var dateData = date.split('-');
    var year = dateData [2];
    var month = dateData [1];
    var day = dateData [0];
    this.selectedDate = day + "-" + month + "-" + year;
    this.dateView =  day + "/" + month + "/" + year;
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


    if (platform.is('desktop')) {

      this.tokenKey = localStorage.getItem(this.localStorageToken);
      this.dailyReportServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.classesServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.studentsServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.getAllClasses();
    } else {
      storage.get(this.localStorageToken).then(
          val => {
            this.tokenKey = val;
            this.reportComment.putHeader(val);
            this.dailyReportServ.putHeader(val);
            this.classesServ.putHeader(val);
            this.studentsServ.putHeader(val);
            this.zone.run(() => {
              this.getAllClasses();
            });
            
          });

    }

  }

  ngOnInit() {
  }


  getDailyReportForClass(classId){
    this.dailyReportServ.getDailyReportTemplate("English",this.selectedDate,classId,this.reportId).subscribe(
        // @ts-ignore
        (val) => {

          let allData:any;
          allData = val;
          // if(this.platform.is('cordova')){
          //   // @ts-ignore
          //   allData = JSON.parse(val.data);
          // }
          let template = allData[0];
          let reportQuestinsFirst =[];
          reportQuestinsFirst = template.questionsList;
          for (let i = 0; i < reportQuestinsFirst.length; i++) {
            reportQuestinsFirst[i].questionNumber = i;
            if(this.accountServ.reportId == -1) {
              this.reportAnswer.dailyReportAnswersObjectsList[i] = {
                answer: null
              };
            }else{
              this.reportAnswer.reportAnswersObjectsList[i] = {
                answer: null
              };
            }
            this.reportAnswersNoOfItems[i] = {
              noOfItems: null
            };
            reportQuestinsFirst[i].editQuestion = false;
            reportQuestinsFirst[i].isEdited = false;
          }

          this.reportQuestions = reportQuestinsFirst;
          this.reportQuestionsRecovery = this.getNewInstanceOf(this.reportQuestions);

          for (let i = 0; i < this.reportQuestions.length; i++){
            if(this.accountServ.reportId == -1) {
              this.mappingDefaultAnswers(this.reportAnswer.dailyReportAnswersObjectsList[i], this.reportQuestions[i]);
            }else{
              this.mappingDefaultAnswers(this.reportAnswer.reportAnswersObjectsList[i], this.reportQuestions[i]);
            }
            this.reportQuestionsEditParamTemps[i] = {};
            this.reportQuestionsEditParamTemps[i].parameters = [];

            for (let j = 0; j < this.reportQuestions[i].parametersList.length; j++) {
              let param = {
                "id": '',
                "key": '',
                "value": ''
              };
              this.reportQuestionsEditParamTemps[i].parameters[j] = param;
              this.reportQuestionsEditParamTemps[i].parameters[j].key = this.reportQuestions[i].parametersList[j].key;
            }

            // let temp = this.reportQuestions;
          }

          if(this.accountServ.reportId == -1) {
            this.editQuestionAllowed = this.accountServ.getUserRole().dailyReportEditQuestionCreate;
          }else{
            this.editQuestionAllowed = this.accountServ.getUserRole().reportEditQuestionCreate;
          }
          // let temp2 = reportQuestinsFirst;

          this.questionListForRecovary = this.reportQuestions;
          this.ReportQuestionsList = this.reportQuestions ;

          for(let oneClass of this.classesList){
            if(oneClass.id == classId){
              oneClass.reportTemplate = this.reportQuestions;
            }
          }
          this.loadCtrl.stopLoading();
        },(err)=>{
          this.loadCtrl.stopLoading();
          console.log("GetAllTemplates Error : " + err);
          this.NoClasses = true;
          this.presentErrorAlert('Error','','Can\'t load your report shape, please refresh the page.');
          this.loadCtrl.stopLoading();
        });
  }


  getAllClasses() {
    this.loadCtrl.startNormalLoading('Loading classes ...');
    let that =this;
    this.classesServ.getClassList(this.viewName, this.classOpId, this.selectedDate, null, null,this.reportId).subscribe((value) => {
          let allData: any = value;

          // if(this.platform.is('cordova')){
          //   allData = JSON.parse(value.data);
          // }

          console.log(allData);
          that.classesList = [] ;
          if(allData) {
            for (let data of allData) {
              let item = new Class();
              console.log(value);
              item.id = data.id;
              item.name = data.name;
              item.grade.id = data.grade.id;
              item.grade.name = data.grade.name;
              item.branch.id = data.branch.id;
              item.branch.name = data.branch.name;
              item.branch.managerId = data.branch.managerId;
              item.studentsList = data.studentsList;
              item.noOfAllStudent = data.noOfAllStudent;
              item.noOfStudentDailyReportApproved = data.noOfStudentDailyReportApproved;
              item.noOfStudentDailyReportFinalized = data.noOfStudentDailyReportFinalized;
              if(this.accountServ.reportId != -1) {
                item.noOfStudentReportApproved = data.noOfStudentReportApproved[this.accountServ.reportId];
                item.noOfStudentReportFinalized = data.noOfStudentReportFinalized[this.accountServ.reportId];
              }
              if(this.accountServ.reportId == -1) {
                item.noOfUnseenComments = data.noOfUnseenComments;
              }else{
                item.noOfUnseenComments = data.noOfUnseenReportComments[this.accountServ.reportId];
              }

              if(!data.totalNumberOfComments){
                item.totalNumberOfComments = 0;
              }else{
                item.totalNumberOfComments = data.totalNumberOfComments;
              }
              if(this.accountServ.reportId == -1) {
                if (data.noOfAllStudent - data.noOfStudentDailyReportApproved == 0) {
                  item.allStudentApproved = true;
                }
                if (data.noOfAllStudent - data.noOfStudentDailyReportFinalized == 0) {
                  if (item.allStudentApproved == false) {
                    item.allStudentFinalized = true;
                  }
                }
              }else {
                if (data.noOfAllStudent - data.noOfStudentReportApproved[this.accountServ.reportId] == 0) {
                  item.allStudentApproved = true;
                }
                if (data.noOfAllStudent - data.noOfStudentReportFinalized[this.accountServ.reportId] == 0) {
                  if (item.allStudentApproved == false) {
                    item.allStudentFinalized = true;
                  }
                }
              }

              that.classesList.push(item);
              console.log(that.classesList);
              console.log("this.classes: ");
              console.log(this.classesList);

            }
            this.foundBefore = true;
            this.loadCtrl.stopLoading();
            // if(this.classesList.length == 1){
            //
            //   let classDataId = allData[0].id;
            //
            //   let classNameData = allData[0].grade.name+" "+allData[0].name;
            //   this.whenOpen(null,classDataId,0,name);
            //   // this.waitStudents(classDataId,-1,classNameData);
            // }
          }else{
            this.NoClasses = true;
          }
        },
        err => {
          console.log("GetAllClasses Error : " + err);
          this.NoClasses = true;
          this.presentErrorAlert('Error','','Can\'t load your classes, please refresh the page.');
          this.loadCtrl.stopLoading();
        },
        () => {
          // this.waitStudents();
        });
  }


  getAllStudent(classId,name) {
    this.studentsList = [];
    // this.load.setContent("Just a few more...");
    this.loadCtrl.updateContent("Just a few more...");
    // @ts-ignore
    return this.studentsServ.getAllStudentsForReport(this.studentOpId, classId,this.selectedDate,this.reportId).toPromise().then(
        (dataVal) => {
          let val = dataVal;
          // if(this.platform.is('cordova')){
          //   val = JSON.parse(dataVal.data);
          // }
          for(let oneClass of this.classesList){
            if(oneClass.id == classId){
              if(oneClass.reportTemplate == null){
                this.getDailyReportForClass(classId);
              }
            }
          }
          let data: any = val;
          console.log(data);
          if(data) {
            for (let i=0; i<data.length;i++) {
              let students = new Student();
              students.classes.id = data[i].classes.id;
              students.classes.name = data[i].classes.name;
              students.classes.grade.id = data[i].classes.grade.id;
              students.classes.grade.name = data[i].classes.grade.name;
              students.classes.branch.id = data[i].classes.branch.id;
              students.classes.branch.name = data[i].classes.branch.name;
              students.classes.branch.managerId = data[i].classes.branch.managerId;
              if(this.accountServ.reportId == -1) {
                students.numberOfUnseenComments = data[i].numberOfUnseenComments;
              }else{
                students.numberOfUnseenComments = data[i].numberOfUnseenReportComments[this.accountServ.reportId];
              }

              if(!data[i].totalNumberOfComments){
                students.totalNumberOfComments = 0;
              }else{
                students.totalNumberOfComments = data[i].totalNumberOfComments;
              }
              students.id = data[i].id;
              students.name = data[i].name;
              students.address = data[i].address;
              students.numberInList = i;
              students.profileImg = data[i].profileImg;
              if(this.accountServ.reportId == -1) {
                students.reportApproved = data[i].dailyReportApproved;
                students.reportFinalized = data[i].dailyReportFinalized;
                students.reportSeenByParent = data[i].dailyReportSeenByParent;
                students.reportSeenByStudent = data[i].dailyReportSeenByStudent;
              }else{
                students.reportApproved = data[i].reportApproved[this.accountServ.reportId];
                students.reportFinalized = data[i].reportFinalized[this.accountServ.reportId];
                students.reportSeenByParent = data[i].reportSeenByParent[this.accountServ.reportId];
                students.reportSeenByStudent = data[i].reportSeenByStudent[this.accountServ.reportId];
              }
              this.studentsList.push(students);
            }
          }
          this.showAllButton = true;
          if(this.classesList.length != 0) {
            this.addToClasses(classId);
          }
        },
        err => {
          console.log('GetAllStudent Error: ' + err);
          this.presentErrorAlert('Error','','Can\'t load your students, please refresh the page.');
          this.loadCtrl.stopLoading();
        });
  }


  addToClasses(classId){
    for (var i in this.classesList) {
      if (this.classesList[i].id == classId) {
        this.classesList[i].studentsList = this.studentsList;
        break; //Stop this loop, we found it!
      }
    }
  }

  waitStudents(classId,index,name){
    let promisesArray:any = [];
    for(let j=0;j<1;j++) {
      for (var i in this.classesList) {
        if ( (this.classesList[i].id == classId) && (this.classesList[i].studentsList == null) ) {
          promisesArray.push(this.getAllStudent(classId,name));
          break; //Stop this loop, we found it!
        }else if ((this.classesList[i].id == classId) && (this.classesList[i].studentsList != null)){
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
    // studentList[findStudent]
    // studentList[index].reportChecked = !checked;
    if(studentid == -1 && classId == -1){
      for (let i in studentList) {
        studentList[i].reportChecked = this.isAll;
      }
    }else{

      // for (let j in studentList) {
      //   if(studentList[j].id == studentid){
      //     studentList[j].reportChecked = !checked;
      //   }
      // }

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
    this.selectedClassIndex = index;
    this.hideShowReport = true;
    this.isAll = false;
    this.selectedClassId = classId;
    this.hideShowReport = true;
    let ref = itmRef;
    this.studentsList = [];
    this.isChecked = [];
    ref.className = 'fa-arrow-down icon icon-md ion-ios-arrow-down open';
    this.getStudentsAnswer(classId,index,name);
  }

  massageChange;
  getStudentsAnswer(classId,index,name){
    this.massageChange = "Getting reports ...";
    this.loadCtrl.startNormalLoading(this.massageChange);

    this.dailyReportServ.getStudentReportAnswers(this.selectedClassId,this.selectedDate,this.reportId).subscribe(
        // @ts-ignore
        resp=>{
          // this.load.dismiss();
          this.waitStudents(classId,index,name);
          if(this.classesList[index].studentsList) {
            if (this.classesList[index].studentsList.length != 0) {
              this.loadCtrl.stopLoading();
            }
          }
        },err =>{
          this.toastCtrl.presentTimerToast("Can't get students reports answer");
          this.loadCtrl.stopLoading();
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
          console.log('Got date: ', this.transformDate.transformTheDate(date,'dd-MM-yyyy'));
          this.pickerStartDate = date;
          let newDate = this.transformDate.transformTheDate(date,'dd-MM-yyyy');
          var dateData = newDate.split('-');
          var year = dateData [2];
          var month = dateData [1];
          var day = dateData [0];
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

  async openReportTemplate(){

    let selectedStudents = [];
    let selectStudentIndex;
    let TempIndex;
    for (let i in this.studentsList) {
      if(this.studentsList[i].reportChecked){
        selectedStudents.push(this.studentsList[i]);
        TempIndex = i;
      }
    }
    if(selectedStudents.length == 1){
      selectStudentIndex = TempIndex;
    }

    let SelectedClass;

    for(let oneClass of this.classesList){
      if(oneClass.id == this.selectedClassId){
        this.ReportQuestionsList = oneClass.reportTemplate;
        SelectedClass = oneClass;
      }
    }

    if(this.ReportQuestionsList) {


      let data = {
        selected: selectedStudents,
        template: this.ReportQuestionsList,
        reportDate: this.dateView,
        selectedDate:this.selectedDate,
        reportAnswer: this.reportAnswer,
        reportAnswersNoOfItems: this.reportAnswersNoOfItems,//nouse
        reportQuestionsRecovery: this.reportQuestionsRecovery, //nouse
        reportQuestionsEditParamTemps: this.reportQuestionsEditParamTemps,//nouse
        editQuestionAllowed: this.editQuestionAllowed,//nouse
        class:SelectedClass,
        classIndex:this.selectedClassIndex,
        selectedStudentIndex:selectStudentIndex,
        theClassIsSelected:this.isAll,
        reportConflict:this.questionsToBeReset
      };

      this.passData.dataToPass = data;

      const modal = await this.modalCtrl.create({
       component: ReportTemplatePage,
       componentProps: data
      });


      modal.onDidDismiss().then(data => {
        this.pickerStartDate = new Date();
        const date = this.transformDate.transformTheDate(this.pickerStartDate,'dd-MM-yyyy');
        var dateData = date.split('-');
        var year = dateData [2];
        var month = dateData [1];
        var day = dateData [0];
        this.selectedDate = day + "-" + month + "-" + year;
        this.studentsList = [];
        this.isChecked = [];
        this.classesList = [];
        this.selectedMultiStudent = [];
        this.questionsToBeReset = [];
        this.hideShowReport = true;
        this.getAllClasses();
      });




      await modal.present();
    }

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

  mappingDefaultAnswers(defaultReportAnswer, question) {
    return defaultReportAnswer.answer = this.getDefaultValue(question);
  }

  getDefaultValue(drQuestion) {
    let questionTitle;
    if(this.accountServ.reportId == -1){
      questionTitle = drQuestion.dailyReportQuestionType.title;
    }else{
      questionTitle = drQuestion.reportQuestionType.title;
    }
    if(questionTitle == 'TEXT_QUESTION')
    {
      return "";
    }
    else if(questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_EN' ||
        questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_AR')
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
    else if (questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER' ||
        questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER' ||
        questionTitle == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER' ||
        questionTitle == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER' )
    {
      return {};
    }
    else if(questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT')
    {
      return {};
    }
    else if (questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT')
    {
      return [drQuestion.parametersList[0].value];
    }
    else if (questionTitle == 'MULTI_SHORT_TEXT_MULTISELECT_VIEW_SELECTED')
    {
      return {};
    }
    else if (questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION')
    {
      return [drQuestion.parametersList[0].value];
    }
    else if (questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION')
    {
      return [false];
    }
    else if (questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER' ||
        questionTitle == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER'
    )
    {
      return drQuestion.parametersList[0].value;
    }
    else if (questionTitle == 'CONSTANT_SHORT_HELPER_TEXT_QUESTION' ||
        questionTitle == 'CONSTANT_LONG_HELPER_TEXT_QUESTION' ||
        questionTitle == 'SHORT_HELPER_TEXT_QUESTION' ||
        questionTitle == 'LONG_HELPER_TEXT_QUESTION'
    )
    {
      return {};
    }
    else if (questionTitle == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED')
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
          textTemp = d;
          val[d] = defailtValueArray[d].value;
        } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
          val[textTemp+1] = defailtValueArray[d].value;
        }

      }
      return val;
    }
    else if (questionTitle == 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED')
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
    else if (questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR' ||
        questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN')
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
          val[d] = "";
        } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
          val[tempDrop+1] = defailtValueArray[d].value;
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
    // this.name = name + '\'s daily report';
    let studentID = studentId;
    if (caller == 'checkBox' && checkedSudent == true) {
      this.classChecked[selectedClassIndex] = {};
      this.classChecked[selectedClassIndex].selected = false;
      if (this.selectedMultiStudent.length == 1) {
        this.reportAnswerForSelectedStudent = [];
        console.log(this.dailyReportServ.reportClassQuestionsGroups);
        for (let qId of Object.keys(this.dailyReportServ.reportClassQuestionsGroups)) {
          console.log(qId);
          for (let answer of Object.keys(this.dailyReportServ.reportClassQuestionsGroups[qId])) {
            console.log(answer);
            for(let answerTemp of this.dailyReportServ.reportClassQuestionsGroups[qId][answer]) {
              console.log(answerTemp);
              console.log(studentID);
              if (answerTemp == studentID) {
                this.reportAnswerForSelectedStudent.push({"questionId": qId, "answer": answer});
                console.log(this.reportAnswerForSelectedStudent);
              }
            }
          }
        }
        console.log(this.reportAnswerForSelectedStudent.length);
        if (this.reportAnswerForSelectedStudent.length == 0) {
          this.isSave = true;
          this.isNotValid = false;
          this.resetReportTemplate(null,null);
        } else {
          this.studnetsAnswersList[studentId] = this.reportAnswerForSelectedStudent;
          this.isNotValid = false;
          this.isSave = false;
          this.reverseAnswerToViewAnswer(this.reportAnswerForSelectedStudent);
        }
      }
      else if (this.selectedMultiStudent.length > 1) {
        if (this.isChecked[index].checked) {
          this.reportAnswerForSelectedStudent = [];
          console.log(this.dailyReportServ.reportClassQuestionsGroups);
          for (let qId of Object.keys(this.dailyReportServ.reportClassQuestionsGroups)) {
            console.log(qId);
            for (let answer of Object.keys(this.dailyReportServ.reportClassQuestionsGroups[qId])) {
              console.log(answer);
              for(let answerTemp of this.dailyReportServ.reportClassQuestionsGroups[qId][answer]) {
                console.log(answerTemp);
                console.log(studentID);
                if (answerTemp == studentID) {
                  this.reportAnswerForSelectedStudent.push({"questionId": qId, "answer": answer});
                  console.log(this.reportAnswerForSelectedStudent);
                }
              }
            }
          }
          if (this.reportAnswerForSelectedStudent.length == 0) {
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
            this.studnetsAnswersList[studentId] = this.reportAnswerForSelectedStudent;
            for (var i = 0; i < this.reportAnswerForSelectedStudent.length; i++) {
              var questionIdGroup = this.dailyReportServ.reportClassQuestionsGroups[this.reportAnswerForSelectedStudent[i].questionId];
              var sameAnswerStudentsIds = questionIdGroup[this.reportAnswerForSelectedStudent[i].answer];
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
            this.resetReportTemplate(this.questionsToBeReset, this.reportAnswerForSelectedStudent);
            this.isNotValid = false;
            this.isSave = false;
          }
        }
      }
    } else if (caller == 'checkBox' && checkedSudent == false) {
      this.studnetsAnswersList.splice(studentId, 1);
      if (this.studnetsAnswersList.length < 1) {
        this.resetReportTemplate(null,null);
      } else {
        this.reportAnswerForSelectedStudent = [];
        let oneStudentCheckedId = parseInt(Object.keys(this.studnetsAnswersList)[0], 10);
        console.log(this.dailyReportServ.reportClassQuestionsGroups);
        for (let qId of Object.keys(this.dailyReportServ.reportClassQuestionsGroups)) {
          console.log(qId);
          for (let answer of Object.keys(this.dailyReportServ.reportClassQuestionsGroups[qId])) {
            console.log(answer);
            for(let answerTemp of this.dailyReportServ.reportClassQuestionsGroups[qId][answer]) {
              console.log(answerTemp);
              console.log(studentID);
              if (answerTemp == oneStudentCheckedId) {
                this.reportAnswerForSelectedStudent.push({"questionId": qId, "answer": answer});
                console.log(this.reportAnswerForSelectedStudent);
              }
            }
          }
        }

        if (this.reportAnswerForSelectedStudent.length == 0) {
          this.isSave = true;
          this.isNotValid = false;
          this.resetReportTemplate(null,null);
        } else {
          this.isNotValid = false;
          this.isSave = false;
        }
        for (let i = 0; i < this.reportAnswerForSelectedStudent.length; i++) {
          let questionIdGroup = this.dailyReportServ.reportClassQuestionsGroups[this.reportAnswerForSelectedStudent[i].questionId];
          let sameAnswerStudentsIds = questionIdGroup[this.reportAnswerForSelectedStudent[i].answer];
          let sameAnswers = true;
          for (let key of this.studnetsAnswersList) {
            var intKey = parseInt(key, 10);
            if (!sameAnswerStudentsIds.includes(intKey)) {
              sameAnswers = false;
              break;
            }
          }
          this.questionsToBeReset[i] = sameAnswers;
        }
        this.resetReportTemplate(this.questionsToBeReset, this.reportAnswerForSelectedStudent);
      }
      if (this.selectedMultiStudent.length == 1) {
        for (var j = 0; j < this.classesList[selectedClassIndex].studentsList.length; j++) {
          if (this.classesList[selectedClassIndex].studentsList[j].id == this.selectedMultiStudentId[0].id) {
            // this.name = this.classesList[selectedClassIndex].studentsList[j].name + '\'s daily report';
            break;
          }
        }
      }
    }

    console.log(this.reportAnswerForSelectedStudent);
    console.log(this.selectedMultiStudentId);
    console.log(this.reportAnswer);
    console.log(this.isChecked);
  }



  resetReportTemplate(questionsToBeReset, answers) {
    if (!questionsToBeReset) {
      for (let i = 0; i < this.reportQuestions.length; i++) {
        if(this.accountServ.reportId == -1) {
          this.mappingDefaultAnswers(this.reportAnswer.dailyReportAnswersObjectsList[i], this.reportQuestions[i]);
        }else{
          this.mappingDefaultAnswers(this.reportAnswer.reportAnswersObjectsList[i], this.reportQuestions[i]);
        }
        // $('#' + $scope.reportQuestions[i].id).addClass("ng-hide");
        // this.name = "";

      }
    } else {
      for (let i = 0; i < this.reportQuestions.length; i++) {
        if (!questionsToBeReset[i]) {
          // not same answer>>> display empty answer.
          // $('#' + $scope.reportQuestions[i].id).removeClass("ng-hide");

          // mappingDefaultAnswers(
          // $scope.reportAnswer.dailyReportAnswersObjectsList[i],
          // $scope.reportQuestions[i]);
          let questionTitle;
          if(this.accountServ.reportId == -1){
            questionTitle = this.reportQuestions[i].dailyReportQuestionType.title;
          }else{
            questionTitle = this.reportQuestions[i].reportQuestionType.title;
          }

          switch (questionTitle) {

            case "TEXT_QUESTION":
            case "SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER":
              if(this.accountServ.reportId == -1) {
                this.reportAnswer.dailyReportAnswersObjectsList[i] = {
                  "answer": ""
                };
              }else{
                this.reportAnswer.reportAnswersObjectsList[i] = {
                  "answer": ""
                };
              }
              break;
            case "SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION":
              if(this.accountServ.reportId == -1) {
                this.reportAnswer.dailyReportAnswersObjectsList[i] = {
                  "answer": ["", ""]
                };
              }else{
                this.reportAnswer.reportAnswersObjectsList[i] = {
                  "answer": ["", ""]
                };
              }
              break;
            default:
              let questionTitle;
              if(this.accountServ.reportId == -1){
                questionTitle = this.reportQuestions[i].dailyReportQuestionType.title;
              }else{
                questionTitle = this.reportQuestions[i].reportQuestionType.title;
              }

              if (questionTitle == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED' || questionTitle == 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED') {
                this.overrideAnswer = false;
              }

              if (this.reportQuestions[i].parametersList) {
                var emptyAnswer = [];
                for (var j = 0; j < this.reportQuestions[i].parametersList.length; j++) {
                  emptyAnswer.push("");
                }
                if(this.accountServ.reportId == -1){
                  this.reportAnswer.dailyReportAnswersObjectsList[i] = {
                    "answer": emptyAnswer
                  }
                }else{
                  this.reportAnswer.reportAnswersObjectsList[i] = {
                    "answer": emptyAnswer
                  }
                }
              }
              break;

          }

        } else {
          let question = this.reportQuestions[i];
          if(this.accountServ.reportId == -1) {
            this.reportAnswer.dailyReportAnswersObjectsList[i].answer = this.getViewQuestionAnswer(this.reportQuestions[i], answers.find(dbAnswer => dbAnswer.questionId == question.id).answer);
          }else{
            this.reportAnswer.reportAnswersObjectsList[i].answer = this.getViewQuestionAnswer(this.reportQuestions[i], answers.find(dbAnswer => dbAnswer.questionId == question.id).answer);
          }
          // $('#' + $scope.reportQuestions[i].id).addClass("ng-hide");
        }

      }
    }

  }



  getViewQuestionAnswer(question, dbAnswer) {
    let questionTitle;
    if(this.accountServ.reportId == -1){
      questionTitle = question.dailyReportQuestionType.title;
    }else{
      questionTitle = question.reportQuestionType.title;
    }

    switch (questionTitle) {
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

  reverseAnswerToViewAnswer(reportAnswerDb) {
    let reportAnswerView;
    if(this.accountServ.reportId == -1) {
      reportAnswerView = {
        "dailyReportAnswersObjectsList": []
      };
    }else{
      reportAnswerView = {
        "reportAnswersObjectsList": []
      };
    }

    for (let i = 0; i < this.reportQuestions.length; i++) {
      let question = this.reportQuestions[i];
      if(this.accountServ.reportId == -1) {
        reportAnswerView.dailyReportAnswersObjectsList[i] = {
          "answer": this.getViewQuestionAnswer(question, reportAnswerDb.find(dbAnswer => dbAnswer.questionId == question.id).answer)
        };
      }else{
        reportAnswerView.reportAnswersObjectsList[i] = {
          "answer": this.getViewQuestionAnswer(question, reportAnswerDb.find(dbAnswer => dbAnswer.questionId == question.id).answer)
        };
      }
    }

    this.reportAnswer = reportAnswerView;

  }


  AnswersBeforeEdit;
  selectedClassIndex;
  selectClass (classId, checked, index, studentid, studentList) {
    this.selectedClassIndex = index;
    if(studentid == -1){
      for (let i in studentList) {
        studentList[i].reportChecked = !this.isAll;
      }
    }else {

      let oneisNot = 0;
      for (let j in studentList) {
        if (studentList[j].reportChecked == true) {
          oneisNot++;
        }
      }
    }
    this.selectedClass = classId;

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

    // // *******
    //
    // this.getClassGroups();
    //
    // var seconds = Math.floor(200000 / 1000);
    // var days = Math.floor(seconds / 86400);
    // var hours = Math.floor((seconds % 86400) / 3600);
    // var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
    //
    // // 200000 -->> is  3 minutes
    //
    // $interval(getClassGroups , 200000);
    //
    // // *******


    this.firstStudentId = null;
    this.listOfFinalized = [];

    let noOfStudentFinalized;
    if(this.accountServ.reportId == -1){
      noOfStudentFinalized = this.classesList[index].noOfStudentDailyReportFinalized;
    }else{
      noOfStudentFinalized = this.classesList[index].noOfStudentReportFinalized;
    }

    if (noOfStudentFinalized == 0) {

      this.isNotValid = false;
      this.isSave = true;
      if (checked == true) {

        // this.isAbsent = false;
        // this.isPresent = true;

        // $rootScope.isdisabled = false;

        // var studentsList = this.getStudents();
        var studentsList = this.studentsList;

        for (var i = 0; i < studentsList.length; i++) {
          var studentId = studentsList[i].id ;

          this.isChecked[i] = {};
          this.isChecked[i].checked = true;
          this.selectedMultiStudentId[i] = {};
          this.selectedMultiStudentId[i].id = studentId;
          this.selectedMultiStudent[i] = studentId;

          // if(!this.attendanceStudents[id]) {
          //   this.attendanceStudents[id] = {isAbsent: false};
          // }
        }

      } else {

        // this.isAbsent = false;
        // this.isPresent = false;

        // this.isdisabled = true;
        this.Sellected = 1000;

        // var studentsList = $scope.getStudents();
        studentsList = this.studentsList;

        for (let i = 0; i < studentsList.length; i++) {
          this.isChecked[i] = {};
          this.isChecked[i].checked = false;
          this.selectedMultiStudentId = [];
          this.selectedMultiStudent = [];
          this.isNotValid = true;
          // $rootScope.isdisabled = true;
          this.isSave = true;

          // $scope.attendanceStudents=[];
        }

      }

    } else {

      // showEmptyDailyReportTemplate();

      var firstStudentAnswers = [];

      if (checked == true) {

        // $scope.isAbsent = false;
        // $scope.isPresent = true;


        this.isSave = false;
        this.isNotValid = false;
        // this.isdisabled = false;
        this.selectedMultiStudentId = [];
        this.selectedMultiStudent = [];

        //$scope.attendanceStudents=[];

        this.isChecked = [];
        var done = false;
        this.studnetsAnswersList = [];
        var reportAnswerForSelectedStudent = [];
        this.questionsToBeReset = {};

        // var studentsList = $scope.getStudents();
        studentsList = this.studentsList;

        for (let i = 0; i < studentsList.length; i++) {

          let studentId = studentsList[i].id;

          this.isChecked[i] = {};
          this.isChecked[i].checked = true;
          this.selectedMultiStudentId[i] = {};
          this.selectedMultiStudentId[i].id = studentId;
          this.selectedMultiStudent[i] = studentId;

          // if(!this.attendanceStudents[id] || $scope.attendanceStudents[id].isAbsent ==null || $scope.attendanceStudents[id].isAbsent==undefined){
          //   $scope.attendanceStudents[id] = {isAbsent:false};
          // }

          if (studentsList[i].reportFinalized && !done) {
            done = true;
            for (let qId of Object.keys(this.dailyReportServ.reportClassQuestionsGroups)) {
              for (let answer of Object.keys(this.dailyReportServ.reportClassQuestionsGroups[qId])) {
                for(let id of Object.keys(this.dailyReportServ.reportClassQuestionsGroups[qId][answer])) {
                  if (this.studnetsAnswersList[this.dailyReportServ.reportClassQuestionsGroups[qId][answer][id]]) {
                    this.studnetsAnswersList[this.dailyReportServ.reportClassQuestionsGroups[qId][answer][id]].push({
                      "questionId": qId,
                      "answer": answer
                    });
                  } else {
                    var answersList = [];
                    answersList.push({
                      "questionId": qId,
                      "answer": answer
                    });
                    this.studnetsAnswersList[this.dailyReportServ.reportClassQuestionsGroups[qId][answer][id]] = answersList;
                  }

                }
              }
            }
          }

          //

        }

        if (Object.keys(this.studnetsAnswersList).length > 0) {
          var counter = 0;
          for (let key of Object.keys(this.dailyReportServ.reportClassQuestionsGroups)) {
            var intKey = parseInt(key, 10);

            var countAnswers = 0 ;
            // we need to check if answer is for selected student after adding attendance view

            for (let a of Object.keys(this.dailyReportServ.reportClassQuestionsGroups[intKey])) {
              let id = this.dailyReportServ.reportClassQuestionsGroups[intKey][a];
              let studentFound = false;
              for(let s of Object.keys(studentsList)){
                if(studentsList[s].id == id){
                  studentFound = true;
                  break;
                }
              }
              if(studentFound){
                countAnswers++;
              }
            }

            if (countAnswers > 1) {
              this.questionsToBeReset[counter++] = false;
            } else {
              this.questionsToBeReset[counter++] = true;
            }
          }

          this.resetReportTemplate(this.questionsToBeReset, this.studnetsAnswersList[Object.keys(this.studnetsAnswersList)[0]]);

        }

        // saving Answers  in the first Time when open Class.

        firstStudentAnswers = this.studnetsAnswersList;
        this.AnswersBeforeEdit = {};
        if (firstStudentAnswers) {
          for (let i in this.selectedMultiStudent) {
            var selectedStudent = this.selectedMultiStudent[i];
            for (let studentID in firstStudentAnswers) {
              if (studentID == selectedStudent) {
                this.AnswersBeforeEdit = firstStudentAnswers[studentID];
              }
            }
          }
        }



        // keeping track of  StudentAnswers before editting

      } else {

        // $scope.isAbsent = false;
        // $scope.isPresent = false;
        //
        //
        // $rootScope.isdisabled = true;
        this.Sellected = 1000;

        // var studentsList = $scope.getStudents();
        studentsList = this.studentsList;

        for (let i = 0; i < studentsList.length; i++) {
          this.isChecked[i] = {};
          this.isChecked[i].checked = false;
          this.selectedMultiStudentId = [];
          this.selectedMultiStudent = [];

          // $scope.attendanceStudents=[];

          this.isNotValid = true;
          this.isSave = true;
          // $rootScope.isdisabled = true;

        }

        this.resetReportTemplate(null,null);

      }

    }

  }

  // presentToast(message) {
  //   let toast = this.toastCtrl.create({
  //     message: message,
  //     duration: 3000,
  //     position: 'bottom'
  //   });
  //
  //   toast.onDidDismiss(() => {
  //     console.log('Dismissed toast');
  //   });
  //
  //   toast.present();
  // }

  shouldHighlightComment(stud) {

    if(stud instanceof Class){
      return this.reportId ? stud.noOfUnseenComments > 0 : stud.noOfUnseenComments > 0;
    }else {
      return this.reportId ? stud.noOfUnseenComments > 0 : stud.numberOfUnseenComments > 0;
    }
  }

  async presentErrorAlert(head,subhead,msg) {
    const alert = await this.alrtCtrl.create({
      header: head,
      subHeader: subhead,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}
